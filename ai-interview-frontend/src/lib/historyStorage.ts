import type { InterviewSession } from "@/data/questions";

const API_BASE = "http://127.0.0.1:8000/api/interview";

// GET INTERVIEW HISTORY
export async function getHistory(userId: string): Promise<InterviewSession[]> {

  const response = await fetch(
    `${API_BASE}/history/${userId}/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return await response.json();
}


// SAVE INTERVIEW SESSION
export async function saveHistory(sessionData: any): Promise<void> {

  const response = await fetch(
    `${API_BASE}/session/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save history");
  }
}


// CLEAR HISTORY
export async function clearHistoryStorage(userId: string): Promise<void> {

  const response = await fetch(
    `${API_BASE}/clear/${userId}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to clear history");
  }
}