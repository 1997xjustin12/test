import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { redis, keys } from "@/app/lib/redis";
import { getStoreSettings } from "@/app/lib/store-settings";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";

// Regenerates the Google Merchant Center feed on demand, and (optionally) the
// crawl sitemap.
//
// This does not just bust the cache: it re-fetches the route so generation
// happens now and the result can be reported back. In SHOPIFY mode the feed
// walks an external storefront's products.json under rate limiting, which can
// take tens of seconds — firing and forgetting would push that cost onto the
// first real visitor (often Googlebot) and hide failures until Merchant Center
// complains days later.
//
// POST /api/regenerate-feed          -> merchant feed
// POST /api/regenerate-feed?target=sitemap
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const TARGETS = {
  feed: { path: "/products_sitemap.xml", label: "Merchant feed" },
  sitemap: { path: "/sitemap.xml", label: "Sitemap" },
};

/** Cheap item count without parsing the whole document. */
function countItems(xml, target) {
  const tag = target === "sitemap" ? "<url>" : "<item>";
  let count = 0;
  let index = xml.indexOf(tag);
  while (index !== -1) {
    count += 1;
    index = xml.indexOf(tag, index + tag.length);
  }
  return count;
}

export async function POST(request) {
  // Gated before anything else runs. In SHOPIFY mode this walks an external
  // storefront's whole catalogue under rate limiting for up to five minutes,
  // so an open endpoint is an invitation to burn the function budget and the
  // upstream rate limit with a one-line request.
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = request.nextUrl.searchParams.get("target") === "sitemap"
    ? "sitemap"
    : "feed";
  const { path, label } = TARGETS[target];

  const settings = await getStoreSettings();
  const shopifyDomain = settings.merchant_feed_domain?.trim().replace(/\/+$/, "");
  const mode = target === "feed" && shopifyDomain ? "shopify" : "self";
  const source =
    target === "feed"
      ? shopifyDomain || process.env.NEXT_PUBLIC_SITE_BASE_URL
      : process.env.NEXT_PUBLIC_SITE_BASE_URL;

  const startedAt = Date.now();
  let result;

  try {
    revalidatePath(path);

    // Pre-warm: force the route to rebuild now rather than on next visit.
    const origin = request.nextUrl.origin;
    const response = await fetch(`${origin}${path}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`${label} returned ${response.status}`);
    }

    const xml = await response.text();
    const items = countItems(xml, target);

    if (items === 0) {
      throw new Error("Generated document contained no items");
    }

    result = {
      status: "ok",
      target,
      mode,
      source,
      items,
      bytes: xml.length,
      durationMs: Date.now() - startedAt,
      generatedAt: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    result = {
      status: "error",
      target,
      mode,
      source,
      items: null,
      bytes: null,
      durationMs: Date.now() - startedAt,
      generatedAt: new Date().toISOString(),
      error: error?.message || String(error),
    };
  }

  // Record per target so a sitemap run can't overwrite the feed's history.
  try {
    const previous = (await redis.get(keys.feed_status.value)) || {};
    await redis.set(keys.feed_status.value, { ...previous, [target]: result });
  } catch (error) {
    console.error("regenerate-feed: failed to record status:", error);
  }

  return NextResponse.json(result, { status: result.status === "ok" ? 200 : 502 });
}

export async function GET(request) {
  // Reports the feed source, which on some brands is another storefront's
  // domain. Admin-only, like the screen that reads it.
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stored = (await redis.get(keys.feed_status.value)) || {};
  const settings = await getStoreSettings();
  const shopifyDomain = settings.merchant_feed_domain?.trim().replace(/\/+$/, "");
  return NextResponse.json({
    mode: shopifyDomain ? "shopify" : "self",
    source: shopifyDomain || process.env.NEXT_PUBLIC_SITE_BASE_URL,
    last: stored,
  });
}
