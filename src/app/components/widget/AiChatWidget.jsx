"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/app/context/cart";

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

/**
 * Product URLs the assistant writes are broken: it emits /product/{handle}
 * while this storefront serves /{brand}/product/{handle}, so every one 404s.
 * They are pulled out of the prose and replaced by real cards resolved from the
 * catalogue — so the text keeps its sentence and loses the dead link.
 */
const PRODUCT_URL = /https?:\/\/[^\s<>()]*\/product\/([^\s<>()/?#]+)/gi;

/** Handles the assistant referenced, in the order it mentioned them. */
function extractHandles(text) {
  const handles = [];
  for (const [, handle] of String(text).matchAll(PRODUCT_URL)) {
    let decoded = handle;
    try {
      decoded = decodeURIComponent(handle);
    } catch {
      // Malformed escape — the raw value is still worth trying.
    }
    if (decoded && !handles.includes(decoded)) handles.push(decoded);
  }
  return handles;
}

/**
 * Drops product URLs from the prose; the cards carry them instead.
 *
 * Removing a URL leaves the punctuation that introduced it and a hole where it
 * sat, so the leftovers are tidied too — an empty "( )", a dangling "here:",
 * and the run of blank lines that a stripped list of links turns into.
 */
const stripProductUrls = (text) =>
  String(text)
    .replace(PRODUCT_URL, "")
    .replace(/[ \t]+/g, " ")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\(\s*\)|\[\s*\]/g, "")
    .replace(/[ \t]*([:\-–—])[ \t]*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

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

const money = (value) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : null;

/**
 * A product the assistant recommended, resolved from the catalogue.
 *
 * Price, title and image come from the catalogue rather than from the reply
 * text, so a card can never show a figure the model invented — and the link is
 * the canonical /{brand}/product/{handle} URL, not the /product/{handle} one
 * the assistant writes, which 404s.
 */
function ProductCard({ product, onAdd, adding, added }) {
  const price = money(product.price);
  const was = money(product.was);

  return (
    <div className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-800">
      <a href={product.url} className="shrink-0" aria-label={product.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || "/images/placeholder.webp"}
          alt=""
          loading="lazy"
          className="h-16 w-16 rounded-lg bg-zinc-100 object-contain dark:bg-zinc-900"
        />
      </a>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
        <a
          href={product.url}
          className="line-clamp-2 text-[13px] font-medium leading-snug text-zinc-900 hover:text-theme-600 dark:text-zinc-100 dark:hover:text-theme-500"
        >
          {product.title}
        </a>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-baseline gap-1.5">
            {price && (
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {price}
              </span>
            )}
            {was && (
              <span className="text-[11px] text-zinc-400 line-through dark:text-zinc-500">
                {was}
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={() => onAdd(product)}
            disabled={adding || added}
            className="shrink-0 rounded-lg bg-theme-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-theme-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {added ? "Added ✓" : adding ? "Adding…" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
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
  // The same cart the rest of the storefront uses, so an item added here shows
  // up in the header count and survives to checkout like any other.
  const { addToCart } = useCart() || {};

  // Rendered only after mount. The storefront is deliberately readable without
  // JavaScript (see docs/agentic-ai-readiness.md) and a chat button that cannot
  // work without it is noise in that HTML — for crawlers and for anyone with
  // scripting off.
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  // Ids live on a ref, not a module-level counter. Fast Refresh reloads the
  // module while component state survives, which reset a module counter to 0
  // and handed a new message the same id as the greeting — products then
  // attached to the greeting and rendered above the question.
  const messageSeq = useRef(0);
  const nextMessageId = useCallback(() => `m${++messageSeq.current}`, []);

  const [messages, setMessages] = useState(() => [
    { id: "m0", role: "assistant", text: GREETING },
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [listening, setListening] = useState(false);
  // Keyed by handle so two cards for different products don't share a spinner.
  const [addingHandle, setAddingHandle] = useState(null);
  const [addedHandles, setAddedHandles] = useState([]);
  // The current recommendation shelf, kept out of the transcript entirely.
  const [suggestions, setSuggestions] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const recognitionRef = useRef(null);
  const typingTimerRef = useRef(null);
  // Which reply the shelf belongs to, so a slow lookup for an older answer
  // cannot land after a newer one.
  const latestReplyRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setSpeechSupported(Boolean(getSpeechRecognition()));
  }, []);

  // Clear any in-flight typing animation when the widget goes away.
  useEffect(() => () => clearInterval(typingTimerRef.current), []);

  const handleAddToCart = useCallback(
    async (product) => {
      if (!addToCart || !product?.cartItem) {
        setError("Couldn't add that to the cart. Open the product page instead.");
        return;
      }
      setAddingHandle(product.handle);
      setError(null);
      try {
        const result = await addToCart({ ...product.cartItem, quantity: 1 });
        if (result?.status === "error") {
          setError("Couldn't add that to the cart. Please try again.");
          return;
        }
        setAddedHandles((prev) => [...prev, product.handle]);
      } catch {
        setError("Couldn't add that to the cart. Please try again.");
      } finally {
        setAddingHandle(null);
      }
    },
    [addToCart],
  );

  /**
   * Resolves the handles the latest reply mentioned into real products.
   *
   * The cards are deliberately NOT part of the transcript. They are a single
   * shelf at the foot of the panel showing what the assistant is currently
   * recommending, so the conversation above stays a plain back-and-forth and
   * the products are always in the same place rather than buried at whatever
   * scroll position their reply happens to sit at.
   *
   * Runs alongside the type-out rather than blocking it, so the text appears
   * immediately and the shelf fills in beneath.
   */
  const attachProducts = useCallback(async (requestId, text) => {
    const handles = extractHandles(text);
    if (!handles.length) return;

    try {
      const res = await fetch(
        `/api/chat/products?handles=${encodeURIComponent(handles.join(","))}`,
      );
      if (!res.ok) return;
      const { products } = await res.json();
      if (!products?.length) return;

      // Ignore a slow lookup whose reply has already been superseded, so an
      // earlier answer cannot overwrite the suggestions for a later one.
      if (latestReplyRef.current !== requestId) return;
      setSuggestions(products);
    } catch {
      // The shelf is an enhancement — the reply text still stands without it.
    }
  }, []);

  /** Reveals a reply a character at a time. Skipped for reduced-motion users. */
  const typeOut = useCallback(
    (raw) => {
      clearInterval(typingTimerRef.current);

      // The prose keeps its sentences; the dead product URLs come out and are
      // replaced by cards.
      const text = stripProductUrls(raw);

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      // Identify the message by id, not by position. Reading prev.length from
      // inside the updater looks like it yields the new index, but React runs
      // updaters during render rather than at call time — so the value escaped
      // as 0 and the cards were attached to messages[0], the greeting, which is
      // why they rendered above the question instead of under the reply.
      const id = nextMessageId();
      latestReplyRef.current = id;

      setMessages((prev) => [
        ...prev,
        reduced
          ? { id, role: "assistant", text }
          : { id, role: "assistant", text: "", typing: true },
      ]);

      attachProducts(id, raw);

      if (reduced) return;

      let i = 0;
      typingTimerRef.current = setInterval(() => {
        // Reveal several characters per tick so long replies don't crawl.
        i = Math.min(text.length, i + 3);
        const slice = text.slice(0, i);
        const done = i >= text.length;

        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, text: slice, typing: !done } : m)),
        );

        if (done) clearInterval(typingTimerRef.current);
      }, TYPING_SPEED_MS);
    },
    [attachProducts],
  );

  const send = useCallback(
    async (raw) => {
      const message = (raw ?? "").trim();
      if (!message || sending) return;

      setError(null);
      setInput("");
      // The shelf describes the answer on screen, so it clears the moment a new
      // question is asked rather than showing the previous reply's products
      // next to a reply that has not arrived yet.
      setSuggestions([]);
      setMessages((prev) => [...prev, { id: nextMessageId(), role: "user", text: message }]);
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
    // `suggestions` is in here too: the shelf lands after the reply has
    // rendered, and without it the panel would stay put and leave the cards
    // below the fold.
  }, [messages, sending, error, suggestions]);

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

  // Adding to the cart as a guest makes the cart ask for an email, and that
  // dialog sits at z-100 while this panel is at z-999999 — so it would open
  // *behind* the chat, greyed out and unreachable. Step aside when it fires.
  // The conversation is component state, not modal state, so reopening the
  // widget brings the whole thread back.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const stepAside = () => setOpen(false);
    window.addEventListener("guestEmailRequired", stepAside);
    return () => window.removeEventListener("guestEmailRequired", stepAside);
  }, []);

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
                  key={m.id ?? i}
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

              {/* Recommendation shelf — deliberately the last thing in the
                  panel and outside the transcript, so products always appear
                  in one predictable place rather than wherever their reply
                  happens to have scrolled to. */}
              {suggestions.length > 0 && (
                <section aria-label="Suggested products" className="space-y-2 pt-1">
                  <h3 className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Suggested products
                  </h3>
                  {suggestions.map((p) => (
                    <ProductCard
                      key={p.handle}
                      product={p}
                      onAdd={handleAddToCart}
                      adding={addingHandle === p.handle}
                      added={addedHandles.includes(p.handle)}
                    />
                  ))}
                </section>
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
