import { NextResponse } from "next/server";
import { chatRegion } from "@/app/lib/chat-region";
import { withRouteRateLimit } from "@/app/lib/rate-limit";

/**
 * GET /api/chat/availability — may the caller use the assistant?
 *
 *   out   { available: boolean, country: string | null }
 *
 * This exists so the widget can hide its trigger for visitors outside the
 * served region instead of offering a button that only fails when pressed.
 *
 * It is a separate endpoint rather than a value baked into the page because the
 * storefront layout that mounts the widget is statically rendered across ~340
 * pages. Reading the geolocation header during render would opt every one of
 * them into dynamic rendering — trading the whole site's static generation for
 * one button. A tiny per-session request is much the cheaper answer.
 *
 * The answer is advisory. POST /api/chat enforces the same rule independently,
 * so a client that skips this call, caches it forever, or lies about the result
 * gains nothing.
 */
export const dynamic = "force-dynamic";

async function handler(request) {
  const { allowed, country } = chatRegion(request);

  return NextResponse.json(
    { available: allowed, country },
    {
      // Varies per visitor and must never be shared between them: one cached
      // "available: false" served to a US shopper turns a regional restriction
      // into an outage.
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}

export const GET = withRouteRateLimit(handler, "light");
