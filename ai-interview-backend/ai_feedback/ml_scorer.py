import numpy as np
import torch
import torch.nn as nn
from transformers import DistilBertTokenizer, DistilBertModel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
import os

# ── Download NLTK data if not present ────────────────────────────────────────
try:
    from nltk.corpus import words as nltk_words, stopwords
    ENGLISH_WORDS = set(nltk_words.words())
    STOP_WORDS    = set(stopwords.words('english'))
except LookupError:
    nltk.download('words',     quiet=True)
    nltk.download('stopwords', quiet=True)
    from nltk.corpus import words as nltk_words, stopwords
    ENGLISH_WORDS = set(nltk_words.words())
    STOP_WORDS    = set(stopwords.words('english'))

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR       = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH     = os.path.join(BASE_DIR, "ml_model", "distilbert_interview_model.pth")
TOKENIZER_PATH = os.path.join(BASE_DIR, "ml_model", "tokenizer")
MAX_LENGTH     = 256

TARGET_COLUMNS = [
    "technical_score",
    "communication_score",
    "confidence_score",
    "grammar_score",
    "relevance_score",
]


# ── Model Architecture ────────────────────────────────────────────────────────
class InterviewScorer(nn.Module):
    def __init__(self, output_dim=5):
        super().__init__()
        self.bert = DistilBertModel.from_pretrained("distilbert-base-uncased")

        for param in self.bert.parameters():
            param.requires_grad = False
        for param in self.bert.transformer.layer[-1].parameters():
            param.requires_grad = True
        for param in self.bert.transformer.layer[-2].parameters():
            param.requires_grad = True

        self.dropout1 = nn.Dropout(0.3)
        self.fc1      = nn.Linear(768, 256)
        self.relu1    = nn.ReLU()
        self.dropout2 = nn.Dropout(0.2)
        self.fc2      = nn.Linear(256, 64)
        self.relu2    = nn.ReLU()
        self.output   = nn.Linear(64, output_dim)
        self.sigmoid  = nn.Sigmoid()

    def forward(self, input_ids, attention_mask):
        outputs       = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_embedding = outputs.last_hidden_state[:, 0]
        x = self.dropout1(cls_embedding)
        x = self.relu1(self.fc1(x))
        x = self.dropout2(x)
        x = self.relu2(self.fc2(x))
        x = self.sigmoid(self.output(x))
        return x


# ── Load model once at Django startup ─────────────────────────────────────────
device    = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tokenizer = DistilBertTokenizer.from_pretrained(TOKENIZER_PATH)
model     = InterviewScorer(output_dim=5)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()
print(f"✅ Model loaded on {device}")


# ── Validity checker ──────────────────────────────────────────────────────────
def check_answer_validity(answer, question, expected_topics):

    # Check 1: Minimum words
    all_words = answer.strip().split()
    if len(all_words) < 5:
        return False, "Answer is too short or empty", 1.0

    # Check 2: Meaningful words after stopword removal
    clean_words = [
        w for w in answer.lower().split()
        if w.isalpha() and w not in STOP_WORDS
    ]
    if len(clean_words) < 3:
        return False, "Answer has no meaningful content", 1.0

    # Check 3: Explicit low-effort phrases
    LOW_EFFORT_PHRASES = [
        "i don't know", "i dont know", "i do not know",
        "no idea", "not sure", "don't know", "dont know",
        "i have no idea", "i don't have any idea",
        "i don't understand", "i cant answer",
        "i can't answer", "skip", "pass", "nothing",
        "idk", "no clue", "not applicable", "n/a",
        "i am not sure", "i'm not sure", "no answer",
        "i have no clue", "i really don't know",
    ]
    answer_lower = answer.strip().lower()
    for phrase in LOW_EFFORT_PHRASES:
        if phrase in answer_lower:
            return False, f"Low-effort answer detected: '{phrase}'", 1.0

    # Check 4: Gibberish detection
    real_word_count = sum(
        1 for w in clean_words
        if w in ENGLISH_WORDS or w in STOP_WORDS
    )
    real_word_ratio = real_word_count / max(len(clean_words), 1)
    if real_word_ratio < 0.40:
        return False, "Answer appears to be gibberish or random typing", 1.0

    # Check 5: Relevance via TF-IDF cosine similarity
    topics_str = expected_topics if isinstance(expected_topics, str) else ", ".join(expected_topics)
    reference  = question + " " + topics_str
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf      = vectorizer.fit_transform([reference, answer])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    except Exception:
        similarity = 0.0

    if similarity < 0.05:
        return False, "Answer is not relevant to the question", 1.0

    if similarity < 0.12:
        penalty = 1.0 - (similarity / 0.12)
        return True, f"Low relevance (similarity={similarity:.3f})", round(penalty, 2)

    return True, "OK", 0.0


def apply_penalty(scores_dict, penalty):
    return {k: max(0, round(v * (1.0 - penalty))) for k, v in scores_dict.items()}


# ── Topic coverage ─────────────────────────────────────────────────────────────
def get_topic_coverage(answer, expected_topics):
    if isinstance(expected_topics, str):
        topics_list = [t.strip() for t in expected_topics.split(",")]
    else:
        topics_list = list(expected_topics)
    answer_lower = answer.lower()
    covered = [t for t in topics_list if t.lower() in answer_lower]
    missing = [t for t in topics_list if t.lower() not in answer_lower]
    return covered, missing


# ── Feedback generator ────────────────────────────────────────────────────────
def generate_feedback(scores, covered_topics, missing_topics):
    strengths, improvements, suggestions = [], [], []

    if scores["technical"]     >= 70: strengths.append("Strong technical knowledge demonstrated")
    if scores["communication"] >= 70: strengths.append("Clear and well-structured communication")
    if scores["confidence"]    >= 70: strengths.append("Confident delivery in your response")
    if scores["grammar"]       >= 70: strengths.append("Good grammar and language usage")
    if scores["relevance"]     >= 70: strengths.append("Answer is highly relevant to the question")
    if covered_topics:                strengths.append(f"Covered key topics: {', '.join(covered_topics[:3])}")
    if not strengths:                 strengths.append("Made an attempt to answer the question")

    if scores["technical"]     < 60: improvements.append("Strengthen your technical depth on this topic")
    if scores["communication"] < 60: improvements.append("Work on structuring your answer more clearly")
    if scores["confidence"]    < 60: improvements.append("Try to sound more confident — avoid filler words")
    if scores["grammar"]       < 60: improvements.append("Pay attention to grammar and sentence structure")
    if scores["relevance"]     < 60: improvements.append("Stay more focused on what the question is asking")
    if missing_topics:               improvements.append(f"You missed these key topics: {', '.join(missing_topics[:3])}")
    if not improvements:             improvements.append("Keep practicing to maintain this level")

    overall = sum(scores.values()) / len(scores)
    if overall < 50: suggestions.append("Practice the STAR method (Situation, Task, Action, Result)")
    if overall < 70: suggestions.append("Use concrete examples to support your answers")
    if missing_topics: suggestions.append(f"Study before next interview: {', '.join(missing_topics)}")
    suggestions.append("Record yourself answering and review for clarity")

    return strengths, improvements, suggestions


# ── Main predict function ──────────────────────────────────────────────────────
def predict_scores(question, topics, answer, role="", difficulty="Medium", category=""):
    topics_str = topics if isinstance(topics, str) else ", ".join(topics)

    # Step 1 — Validity check FIRST
    is_valid, reason, penalty = check_answer_validity(answer, question, topics_str)

    # Full zero — skip model entirely
    if penalty == 1.0:
        covered, missing = get_topic_coverage(answer, topics_str)
        return {
            "technical_score":     0,
            "communication_score": 0,
            "confidence_score":    0,
            "grammar_score":       0,
            "relevance_score":     0,
            "overall_score":       0,
            "strengths":           ["No strengths detected"],
            "improvements":        [
                f"Invalid answer: {reason}",
                "Please provide a genuine, relevant answer",
            ],
            "suggestions":         [
                "Read the question carefully before answering",
                "Use technical terms related to the topic",
                "Aim for at least 2-3 sentences",
            ],
            "covered_topics":      covered,
            "missing_topics":      missing,
            "validity":            {"valid": False, "reason": reason, "penalty": penalty},
        }

    # Step 2 — Run model
    text = (
        f"Interview Question: {question} "
        f"| Expected Skills: {topics_str} "
        f"| Candidate Response: {answer} "
        f"| Job Role: {role} "
        f"| Difficulty Level: {difficulty} "
        f"| Domain: {category}"
    )

    encoding = tokenizer(
        text,
        truncation=True,
        padding="max_length",
        max_length=MAX_LENGTH,
        return_tensors="pt"
    )

    with torch.no_grad():
        prediction = model(
            encoding["input_ids"].to(device),
            encoding["attention_mask"].to(device)
        ).cpu().numpy()[0]

    raw = np.clip(np.round(prediction * 100).astype(int), 0, 100)

    scores = {
        "technical":     int(raw[0]),
        "communication": int(raw[1]),
        "confidence":    int(raw[2]),
        "grammar":       int(raw[3]),
        "relevance":     int(raw[4]),
    }
    scores["overall"] = round(sum(scores.values()) / len(scores))

    # Step 3 — Apply partial penalty if low relevance
    if penalty > 0:
        scores = apply_penalty(scores, penalty)

    covered_topics, missing_topics = get_topic_coverage(answer, topics_str)
    strengths, improvements, suggestions = generate_feedback(scores, covered_topics, missing_topics)

    return {
        "technical_score":     scores["technical"],
        "communication_score": scores["communication"],
        "confidence_score":    scores["confidence"],
        "grammar_score":       scores["grammar"],
        "relevance_score":     scores["relevance"],
        "overall_score":       scores["overall"],
        "strengths":           strengths,
        "improvements":        improvements,
        "suggestions":         suggestions,
        "covered_topics":      covered_topics,
        "missing_topics":      missing_topics,
        "validity":            {"valid": is_valid, "reason": reason, "penalty": penalty},
    }