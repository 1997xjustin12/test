import crypto from "crypto";
import { unstable_cache } from "next/cache";
import { runSearchkit, SEARCHKIT_TAG } from "@/app/lib/searchkit-search";
import { withRouteRateLimit } from "@/app/lib/rate-limit";
import { STORE_ID } from "@/app/lib/store";
import { ES_INDEX } from "@/app/lib/helpers";

/**
 * POST /api/es/searchkit — the Searchkit proxy behind every category,
 * collection and search grid, in the browser and in server prefetches.
 *
 * Responses are cached in Next's data cache, not Redis. They used to go to
 * Upstash under searchkit:<hash>, and at 200–280 KB a response, with Upstash
 * billing bandwidth both ways, every grid view moved a full response through
 * Redis whether it hit or missed. That is what used up the plan's monthly
 * bandwidth. The data cache costs no Redis traffic at all.
 *
 * The key is this brand + its index + a hash of the request body. The Redis
 * key had no brand in it, so two brands sending the same request shared one
 * entry despite querying different indexes.
 *
 * Cleared by the "searchkit" tag: the admin Cache screen (Category &
 * collection pages), /api/revalidate-plp and a catalogue-exclusions change.
 */

// Page 0 with no query is every grid's landing state — a category page sends
// its category as `filter`, so that is not checked — and changes only with the
// catalogue: a day. Anything else (later pages, queries, facet refinements) is
// far more varied, so an hour absorbs the repeats — crawlers re-walking
// pagination, shoppers toggling the same filter — without holding one-offs
// long. (In Redis this was 60s: any longer cost bandwidth to store.)
const INITIAL_PAGE_TTL = 86400;
const VARIANT_TTL = 3600;

function isInitialPageRequest(body) {
  if (!Array.isArray(body) || !body[0]) return false;
  const { page = 0, query = "" } = body[0].params || {};
  return page === 0 && query === "";
}

async function searchkit(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const hash = crypto.createHash("sha1").update(JSON.stringify(body)).digest("hex");
  const cached = unstable_cache(() => runSearchkit(body), [SEARCHKIT_TAG, STORE_ID, ES_INDEX, hash], {
    revalidate: isInitialPageRequest(body) ? INITIAL_PAGE_TTL : VARIANT_TTL,
    tags: [SEARCHKIT_TAG],
  });

  try {
    return Response.json(await cached());
  } catch (err) {
    console.error("Searchkit Error:", err);
    return Response.json({ error: "Searchkit failed", details: err.message }, { status: 500 });
  }
}

// Public read endpoint: throttled with 429 + Retry-After so agents can back off
// gracefully. See lib/rate-limit.js.
export const POST = withRouteRateLimit(searchkit, "search");
