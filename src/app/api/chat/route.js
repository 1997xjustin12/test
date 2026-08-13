import { NextResponse } from "next/server";
import { STORE_ID } from "@/app/lib/store";
import { withRouteRateLimit } from "@/app/lib/rate-limit";

/**
 * POST /api/chat — proxy to the Django backend's assistant.
 *
 * Same shape as the other backend proxies in this app (see pages/api/login.js):
 * the browser never talks to the backend directly, so the backend URL stays
 * server-side and every brand is identified by the X-Store-Domain header rather
 * than by anything the client could set.
 *
 *   in    { message, session_id? }
 *   out   { reply, session_id, took_ms, ... }   — the backend's object, as-is
 *
 * The response is passed through unchanged rather than reshaped. The backend
 * owns that contract, and a proxy that renames fields is a second contract to
 * keep in step. `session_id` comes back on the first reply and is echoed on
 * every following message so the backend can thread the conversation.
 *
 * NOTE (12 Aug 2026): the backend route is not deployed yet. Everything here is
 * written against the agreed contract above; until it lands, this returns a
 * clean 502 that the widget renders as a friendly "unavailable" message rather
 * than a broken UI. Set CHAT_MOCK=1 in a non-production environment to exercise
 * the widget without it.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Model calls are slow but not unbounded. Cut it off before the platform does,
 * so a hung backend surfaces as a typed error instead of an opaque timeout.
 */
const BACKEND_TIMEOUT_MS = 45_000;

const MAX_MESSAGE_LENGTH = 2000;

const fail = (message, status) =>
  NextResponse.json({ error: true, message }, { status });

/**
 * Canned reply for local UI work while the backend route is missing.
 * Deliberately refuses to run in production — a mocked assistant that reaches
 * real shoppers is worse than a disabled one.
 */
function mockReply(message) {
  return NextResponse.json({
    reply:
      `(mock) You said: "${message}". The backend assistant is not connected ` +
      `yet, so this is a canned reply for testing the widget.`,
    session_id: "mock-session",
    took_ms: 42,
    mock: true,
  });
}

async function handler(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Body must be JSON.", 400);
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) return fail("message is required.", 400);
  if (message.length > MAX_MESSAGE_LENGTH) {
    return fail(`message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`, 400);
  }

  if (process.env.CHAT_MOCK === "1" && process.env.NODE_ENV !== "production") {
    return mockReply(message);
  }

  const base = process.env.NEXT_SOLANA_BACKEND_URL;
  if (!base) {
    return fail("The assistant is not configured.", 503);
  }

  // X-Store-Domain is how the backend knows which of the three brands is
  // asking. Refuse rather than send it empty: a blank value doesn't fail, it
  // leaves the backend to pick a store on its own, and answering BBQ shoppers
  // from Solana's catalogue is worse than answering nobody.
  const storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN;
  if (!storeDomain) {
    console.error("chat: NEXT_PUBLIC_STORE_DOMAIN is unset — refusing to proxy");
    return fail("The assistant is not configured for this store.", 503);
  }

  const payload = { message };
  // Sent only from the second message onward. The backend issues session_id
  // with the first reply; the client echoes it back and we forward it. Never
  // invented here — a made-up id would either collide or start a phantom
  // conversation.
  if (typeof body?.session_id === "string" && body.session_id.trim()) {
    payload.session_id = body.session_id.trim();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Store-Domain": storeDomain,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal,
    });

    // The backend renders an HTML error page when a route is missing or blows
    // up, so parse defensively rather than assuming JSON comes back.
    const text = await res.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      /* not JSON — handled below */
    }

    if (!res.ok) {
      console.error(`chat: backend responded ${res.status}`);
      return fail(
        res.status === 404
          ? "The assistant is not available yet."
          : "The assistant is temporarily unavailable.",
        502,
      );
    }

    if (!data || typeof data.reply !== "string") {
      console.error("chat: backend returned an unexpected body");
      return fail("The assistant returned an unexpected response.", 502);
    }

    return NextResponse.json(data);
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    console.error("chat: backend request failed:", timedOut ? "timeout" : err);
    return fail(
      timedOut
        ? "The assistant took too long to respond. Try again."
        : "The assistant is temporarily unavailable.",
      502,
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const POST = withRouteRateLimit(handler, "chat");

/** Discovery aid — describes the endpoint instead of 405-ing. */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/chat",
    method: "POST",
    store: STORE_ID,
    request: { message: "string (required)", session_id: "string (optional)" },
    response: { reply: "string", session_id: "string", took_ms: "number" },
  });
}
