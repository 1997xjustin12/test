import {getItem, setItem} from "@/app/lib/localForage"

export const getOrCreateSessionId = async() => {
  if (typeof window === "undefined") return null; // SSR guard

  let sessionId = await getItem("session_id");
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    await setItem("session_id", sessionId);
  }

  return sessionId;
}
