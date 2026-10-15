// import { InterviewResponse, InterviewQuestion } from "@/types/interview";

// const API_BASE = "http://127.0.0.1:8000/api";

// export async function evaluateAnswer(
//   question: InterviewQuestion,
//   answer: string
// ): Promise<InterviewResponse["feedback"]> {
//   try {
//     const response = await fetch(`${API_BASE}/ai_feedback/evaluate/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         question: {
//           text: question.question,
//           expectedTopics: question.expectedTopics,
//         },
//         answer,
//       }),
//     });

//     if (!response.ok) throw new Error("Evaluation failed");
//     return await response.json();

//   } catch (error) {
//     console.error("evaluateAnswer failed:", error);
//     return {
//       relevance: 0, technicalAccuracy: 0,
//       communicationClarity: 0, overallScore: 0,
//       strengths: [], improvements: [], suggestions: [],
//     };
//   }
// }

// export async function saveSession(session: any, userId: string): Promise<void> {
//   await fetch(`${API_BASE}/ai_feedback/save-session/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ...session, userId }),
//   });
// }

// export async function fetchSessions(userId: string): Promise<any[]> {
//   const res = await fetch(`${API_BASE}/ai_feedback/sessions/${userId}/`);
//   if (!res.ok) return [];
//   return await res.json();
// }

// export async function fetchSessionDetail(sessionId: string): Promise<any | null> {
//   const res = await fetch(`${API_BASE}/ai_feedback/session/${sessionId}/`);
//   if (!res.ok) return null;
//   return await res.json();
// }
import { InterviewResponse, InterviewQuestion } from "@/types/interview";

const API_BASE = "http://127.0.0.1:8000/api";

export async function evaluateAnswer(
  question: InterviewQuestion,
  answer: string
): Promise<InterviewResponse["feedback"]> {
  try {
    const response = await fetch(`${API_BASE}/ai_feedback/evaluate/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: {
          text: question.question,
          expectedTopics: question.expectedTopics,
        },
        answer,
      }),
    });

    if (!response.ok) throw new Error("Evaluation failed");
    return await response.json();

  } catch (error) {
    console.error("evaluateAnswer failed:", error);
    return {
      relevance: 0, technicalAccuracy: 0,
      communicationClarity: 0, overallScore: 0,
      strengths: [], improvements: [], suggestions: [],
    };
  }
}

export async function saveSession(session: any, userId: string): Promise<void> {
  await fetch(`${API_BASE}/ai_feedback/save-session/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...session, userId }),
  });
}

export async function fetchSessions(userId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/ai_feedback/sessions/${userId}/`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((s: any) => ({
    ...s,
    videoScores: s.videoScores ?? null,
  }));
}

export async function fetchSessionDetail(sessionId: string): Promise<any | null> {
  const res = await fetch(`${API_BASE}/ai_feedback/session/${sessionId}/`);
  if (!res.ok) return null;
  const data = await res.json();

  // Explicitly map videoScores so Results.tsx can read session.videoScores
  return {
    ...data,
    videoScores: data.videoScores ?? null,
  };
}