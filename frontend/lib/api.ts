import { ResearchReport } from "@/types";

export async function getResearch(topic: string, maxQueries: number = 3): Promise<ResearchReport> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  
  const res = await fetch(`${backendUrl}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      topic: topic,
      max_queries: maxQueries
    }),
  });

  if (!res.ok) {
    let errorMessage = `Failed to execute research. Server status: ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // JSON parsing failed
    }
    throw new Error(errorMessage);
  }

  return res.json();
}