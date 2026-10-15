import { InterviewQuestion } from "@/types/interview";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function fetchQuestionsForRole(
  role: string,
  count: number
): Promise<InterviewQuestion[]> {
  const res = await fetch(
    `${API_BASE}/ai_feedback/questions/?role=${encodeURIComponent(role)}&count=${count}`
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Failed to fetch questions (${res.status})`);
  }

  const data = await res.json();

  return data.questions.map((q: any) => ({
    id:             q.id,
    role:           q.role,
    category:       q.category,
    question:       q.question,
    difficulty:     q.difficulty as "easy" | "medium" | "hard",
    expectedTopics: q.expectedTopics,
  }));
}