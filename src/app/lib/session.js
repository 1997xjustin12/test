export function getOrCreateSessionId() {
  if (typeof window === "undefined") return null; // SSR guard

  let sessionId = localStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }
  return sessionId;
}
