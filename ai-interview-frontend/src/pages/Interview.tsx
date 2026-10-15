import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { evaluateAnswer, saveSession } from "@/services/aiEvaluator";
import { ROLES, type InterviewResponse } from "@/data/questions";
import { type InterviewQuestion } from "@/types/interview";
import { fetchQuestionsForRole } from "@/services/questionsService";
import { useAuth } from "@/contexts/AuthContext";
import { useCamera } from "@/hooks/useCamera";
import CameraFeed from "@/components/CameraFeed";
import CheatingWarning from "@/components/CheatingWarning";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import { CheatingEvent } from "@/hooks/useCamera";
import {
  Sparkles, Mic, MicOff, ArrowRight,
  Loader2, Send, ChevronLeft,
} from "lucide-react";

export default function Interview() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const count = 10; // Always generate 10 questions
  const role  = ROLES.find((r) => r.id === roleId);

  // Shared camera instance — so we can call getFinalVideoScores() at the end
  const camera = useCamera();

  const [questions,        setQuestions]        = useState<InterviewQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex,     setCurrentIndex]     = useState(0);
  const [answer,           setAnswer]           = useState("");
  const [isRecording,      setIsRecording]      = useState(false);
  const [isEvaluating,     setIsEvaluating]     = useState(false);
  const [responses,        setResponses]        = useState<InterviewResponse[]>([]);
  const [error,            setError]            = useState("");
  const [cheatingWarnings, setCheatingWarnings] = useState<CheatingEvent[]>([]);
  const [activeWarning,    setActiveWarning]    = useState<CheatingEvent | null>(null);
  const [warningCount,     setWarningCount]     = useState(0);

  const recognitionRef = useRef<any>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentIndex];
  const progress        = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  // Fetch 10 questions from Django
  useEffect(() => {
    if (!roleId) return;
    setLoadingQuestions(true);
    fetchQuestionsForRole(roleId, count)
      .then(setQuestions)
      .catch(() => navigate("/dashboard"))
      .finally(() => setLoadingQuestions(false));
  }, [roleId]);

  useEffect(() => {
    if (!loadingQuestions && (!role || questions.length === 0)) navigate("/dashboard");
  }, [role, questions, loadingQuestions, navigate]);

  const handleCheatingDetected = useCallback((event: CheatingEvent) => {
    setCheatingWarnings((prev) => [...prev, event]);
    setWarningCount((prev) => prev + 1);
    setActiveWarning(event);
    setTimeout(() => setActiveWarning(null), 4000);
  }, []);

  const { enterFullscreen, exitFullscreen } = useAntiCheat({
    onCheatingDetected: handleCheatingDetected,
    enabled: true,
  });

  useEffect(() => { enterFullscreen(); }, []);

  const toggleRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported. Please use Chrome or Edge.");
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition          = new SpeechRecognition();
    recognition.continuous     = true;
    recognition.interimResults = true;
    recognition.lang           = "en-US";
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend   = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !currentQuestion) return;
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); }

    setIsEvaluating(true);
    setError("");

    try {
      const feedback = await evaluateAnswer(currentQuestion, answer);
      const response: InterviewResponse = {
        questionId:   currentQuestion.id,
        questionText: currentQuestion.question,
        answer,
        score: feedback.overallScore,
        feedback,
      };
      const newResponses = [...responses, response];
      setResponses(newResponses);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
        setAnswer("");
      } else {
        // Get final averaged video scores
        const videoScores = camera.getFinalVideoScores();

        const session = {
          id:           Date.now().toString(),
          role:         roleId!,
          date:         new Date().toISOString(),
          responses:    newResponses,
          averageScore: Math.round(
            newResponses.reduce((a, r) => a + r.score, 0) / newResponses.length
          ),
          status:       "completed",
          videoScores,
        };

        sessionStorage.setItem(`warnings_${session.id}`,    JSON.stringify(cheatingWarnings));
        sessionStorage.setItem(`videoScores_${session.id}`, JSON.stringify(videoScores));

        await saveSession(session, user!.id);
        exitFullscreen();
        navigate(`/results/${session.id}`);
      }
    } catch (err: any) {
      setError("Something went wrong. Check if Django server is running.");
    } finally {
      setIsEvaluating(false);
    }
  };

  if (loadingQuestions) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground text-sm">Loading questions...</p>
      </div>
    </div>
  );

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-surface">

      <CheatingWarning
        event={activeWarning}
        onDismiss={() => setActiveWarning(null)}
        totalWarnings={warningCount}
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 glass">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Button variant="ghost" onClick={() => { exitFullscreen(); navigate("/dashboard"); }}>
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">{role?.label} Interview</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </nav>

      {/* PROGRESS BAR */}
      <div className="h-1 bg-secondary">
        <motion.div
          className="h-full bg-gradient-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — question + answer */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {currentQuestion.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentQuestion.difficulty === "easy"   ? "bg-success/10 text-success" :
                      currentQuestion.difficulty === "medium" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground ml-auto">
                      Q{currentIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold leading-snug">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here or click the microphone to speak..."
                      className="w-full min-h-[200px] p-5 rounded-2xl bg-card border border-border text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                      disabled={isEvaluating}
                    />
                    {isRecording && (
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
                        </span>
                        <span className="text-xs text-destructive font-medium">Recording</span>
                      </div>
                    )}
                  </div>

                  {error && <p className="text-sm text-destructive text-center">{error}</p>}

                  <div className="flex items-center gap-3">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="lg"
                      onClick={toggleRecording}
                      disabled={isEvaluating}
                      className="gap-2"
                    >
                      {isRecording
                        ? <><MicOff className="w-5 h-5" /> Stop Recording</>
                        : <><Mic    className="w-5 h-5" /> Start Speaking</>
                      }
                    </Button>
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isEvaluating}
                      className="flex-1 gap-2"
                    >
                      {isEvaluating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing ...</>
                      ) : currentIndex < questions.length - 1 ? (
                        <><span>Submit & Next</span><ArrowRight className="w-5 h-5" /></>
                      ) : (
                        <><span>Finish Interview</span><Send className="w-5 h-5" /></>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT — camera */}
          <div className="lg:col-span-1 space-y-3">
            <CameraFeed
              autoStart={true}
              onCheatingDetected={handleCheatingDetected}
              warningCount={warningCount}
              cameraHook={camera}
            />

            {warningCount > 0 && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30">
                <p className="text-xs text-destructive font-semibold">
                  ⚠️ {warningCount} integrity warning{warningCount !== 1 ? "s" : ""} recorded
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Examiner will review these after the interview.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}