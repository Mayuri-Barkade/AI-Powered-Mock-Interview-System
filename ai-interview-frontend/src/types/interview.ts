export interface InterviewQuestion {
  id: number;
  role: string;
  category: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  expectedTopics: string[];
}

export interface InterviewResponse {
  questionId:   number;
  questionText: string;
  answer:       string;
  score:        number;
  feedback: {
    relevance:            number;
    technicalAccuracy:    number;
    communicationClarity: number;
    // confidence:           number;
    // grammar:              number;
    overallScore:         number;
    strengths:            string[];
    improvements:         string[];
    suggestions:          string[];
    missingTopics?: string[];
    coveredTopics?:       string[];
  };
}
export interface VideoScores {
  eyeContactScore:  number;
  postureScore:     number;
  confidenceScore:  number;
}
export interface InterviewSession {
  id:           string;
  role:         string;
  date:         string;
  responses:    InterviewResponse[];
  averageScore: number;
  status:       "in_progress" | "completed";
  videoScores?: VideoScores;   // ← ADD THIS
  
}


export const ROLES = [
  { id: "software_developer", label: "Software Developer", icon: "💻", color: "from-primary to-primary/70" },
  { id: "data_analyst",       label: "Data Analyst",       icon: "📊", color: "from-info to-info/70" },
  { id: "product_manager",    label: "Product Manager",    icon: "📋", color: "from-accent to-accent/70" },
  { id: "devops_engineer",    label: "DevOps Engineer",    icon: "⚙️", color: "from-warning to-warning/70" },
  { id: "ml_engineer",        label: "ML Engineer",        icon: "🤖", color: "from-success to-success/70" },
  { id: "frontend_developer", label: "Frontend Developer", icon: "🎨", color: "from-destructive to-destructive/70" },
] as const;