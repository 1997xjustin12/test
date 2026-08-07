import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ALL_PATHS, ALL_TAGS } from "@/app/lib/cache-registry";

// General cache-bust endpoint for external callers (Django admin, webhooks).
// Call this whenever any shared data is updated (products, menu, logo, theme,
// categories).
//
// Usage:
//   GET /api/revalidate-all?secret=YOUR_REVALIDATE_SECRET
//
// The tag list used to be hard-coded here and had fallen out of date: it busted
// 6 tags while the app was using 14, so product data, reviews, FAQs, YMAL,
// store settings and the homepage category preloads all survived a "clear all".
// It now reads lib/cache-registry.js, the same source the admin Cache screen
// uses, so the two cannot drift apart again.
//
// This endpoint does not touch the Redis searchkit:* cache — that would clear
// it for every brand sharing the Redis instance, which is fine as a deliberate
// admin action but not as a side effect of a product webhook. Use
// POST /api/cache/clear for the full sweep.
export async function GET(request) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  for (const tag of ALL_TAGS) revalidateTag(tag);
  for (const [path, type] of ALL_PATHS) revalidatePath(path, type);

  // Pre-warm the homepage immediately so the ISR-regenerated HTML is cached
  // at this edge node before the response is returned. Without this, the first
  // PageSpeed / real-user request after revalidation triggers SSR and gets a
  // slow TTFB (external API calls to the Solana backend + Elasticsearch).
  const origin = request.nextUrl.origin;
  await fetch(`${origin}/`, { cache: "no-store" }).catch(() => {});

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
    tags: ALL_TAGS,
    paths: ALL_PATHS.map(([path]) => path),
    message: "All caches cleared and homepage pre-warmed.",
  });
}
