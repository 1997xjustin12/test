"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Storefront AI assistant — floating button plus a centred modal.
 *
 * Talks to /api/chat, which proxies the backend assistant. The backend owns the
 * conversation: it returns a session_id on the first reply and we echo it back
 * on every following message, so no transcript is reassembled client-side.
 *
 * Positioned bottom-LEFT on purpose. Zoho's live-chat button is fixed at
 * bottom-5 right-5 with z-index 999999; two floating buttons in the same corner
 * is the kind of collision nobody notices until it ships.
 *
 * Speech-to-text uses the browser's own SpeechRecognition API — no dependency,
 * no service, no cost. It is feature-detected and the button simply does not
 * render where the API is missing (Firefox, and any non-HTTPS origin).
 */

const TYPING_SPEED_MS = 12; // per character
const GREETING =
  "Hi! Ask me anything about the products here — what fits your space, what's in your budget, or how two models compare.";

/** Browser speech recognition, where it exists. */
function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Renders a reply, turning bare URLs into links.
 *
 * The assistant answers with product URLs inline in its prose ("You can view it
 * here: https://…"), so without this the single most useful part of the reply
 * is un-clickable text the shopper has to select and copy.
 *
 * Built as React elements rather than injected HTML — the reply is model
 * output, and handing that to dangerouslySetInnerHTML would make any future
 * prompt injection a scripting hole. Links open in a new tab so the
 * conversation survives the click.
 */
// Split keeps the capture group, so each URL arrives as its own part. The test
// below is deliberately a separate, non-global regex: calling .test() on a /g
// pattern advances lastIndex between calls and would match every other link.
const URL_SPLIT = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;
const IS_URL = /^https?:\/\//;

function RichText({ text }) {
  const parts = String(text).split(URL_SPLIT);
  return parts.map((part, i) =>
    IS_URL.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-current/40 underline-offset-2 hover:decoration-current break-all"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function ChatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3c4.97 0 9 3.36 9 7.5s-4.03 7.5-9 7.5c-.99 0-1.94-.13-2.83-.38L4 20l1.06-3.18C3.78 15.55 3 13.62 3 11.5 3 6.86 7.03 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AiChatWidget() {
  // Rendered only after mount. The storefront is deliberately readable without
  // JavaScript (see docs/agentic-ai-readiness.md) and a chat button that cannot
  // work without it is noise in that HTML — for crawlers and for anyone with
  // scripting off.
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: GREETING }]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const recognitionRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, []);

  // Clear any in-flight typing animation when the widget goes away.
  useEffect(() => () => clearInterval(typingTimerRef.current), []);

  /** Reveals a reply a character at a time. Skipped for reduced-motion users. */
  const typeOut = useCallback((text) => {
    clearInterval(typingTimerRef.current);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setMessages((prev) => [...prev, { role: "assistant", text }]);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", text: "", typing: true }]);

    let i = 0;
    typingTimerRef.current = setInterval(() => {
      // Reveal several characters per tick so long replies don't crawl.
      i = Math.min(text.length, i + 3);
      const slice = text.slice(0, i);
      const done = i >= text.length;

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          text: slice,
          typing: !done,
        };
        return next;
      });

      if (done) clearInterval(typingTimerRef.current);
    }, TYPING_SPEED_MS);
  }, []);

  const send = useCallback(
    async (raw) => {
      const message = (raw ?? "").trim();
      if (!message || sending) return;

      setError(null);
      setInput("");
      setMessages((prev) => [...prev, { role: "user", text: message }]);
      setSending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            sessionId ? { message, session_id: sessionId } : { message },
          ),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data || typeof data.reply !== "string") {
          setError(
            data?.message ||
              "The assistant is unavailable right now. Please try again.",
          );
          return;
        }

        if (data.session_id) setSessionId(data.session_id);
        typeOut(data.reply);
      } catch {
        setError("Couldn't reach the assistant. Check your connection.");
      } finally {
        setSending(false);
      }
    },
    [sending, sessionId, typeOut],
  );

  // Keep the newest message in view as it types.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending, error]);

  // Escape closes; focus moves into the input on open and back to the button on
  // close, so the modal is usable from the keyboard alone.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) buttonRef.current?.focus?.();
  }, [open]);

  // Lock background scroll while the modal is up.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const toggleListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    // Interim results replace the dictated text rather than appending, so the
    // box shows one evolving sentence instead of the same words repeatedly.
    let final = "";
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += chunk;
        else interim += chunk;
      }
      setInput((final + interim).trimStart());
    };
    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setError("Microphone access was blocked. Allow it to use voice input.");
      }
    };
    recognition.onend = () => {
      setListening(false);
      inputRef.current?.focus();
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }, [listening]);

  // Stop the microphone if the modal closes mid-dictation.
  useEffect(() => {
    if (!open && listening) recognitionRef.current?.stop();
  }, [open, listening]);

  if (!mounted) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Ask the AI assistant"
        className="fixed bottom-5 left-5 z-[999998] flex h-14 w-14 items-center justify-center rounded-full bg-theme-600 text-white shadow-lg shadow-black/20 transition hover:scale-105 hover:bg-theme-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-400 focus-visible:ring-offset-2 dark:shadow-black/50 dark:focus-visible:ring-offset-zinc-900"
      >
        <ChatIcon className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[999999] flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AI shopping assistant"
            className="flex h-[85svh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[min(36rem,85svh)] sm:max-w-lg sm:rounded-2xl dark:bg-zinc-900"
          >
            <header className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-theme-600 text-white">
                <ChatIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Shopping assistant
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  Answers about products and availability
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-theme-600 text-white"
                        : "rounded-bl-sm bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    <RichText text={m.text} />
                    {m.typing && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-current align-middle" />
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-3 dark:bg-zinc-800">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-zinc-200 px-3 py-3 dark:border-zinc-800"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Enter sends, Shift+Enter makes a new line — the
                    // convention every chat interface uses.
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={listening ? "Listening…" : "Ask about a product…"}
                  maxLength={2000}
                  className="max-h-32 flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-theme-500 focus:outline-none focus:ring-1 focus:ring-theme-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />

                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-label={listening ? "Stop dictation" : "Dictate a message"}
                    aria-pressed={listening}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-400 ${
                      listening
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                      <path d="M12 4a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0v-5A2.5 2.5 0 0 1 12 4Z" stroke="currentColor" strokeWidth="1.7" />
                      <path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-600 text-white transition hover:bg-theme-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 px-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                AI can make mistakes — check important details before ordering.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
