import { redis } from "@/app/lib/redis";

/**
 * Fixed-window rate limiting for the public read APIs.
 *
 * There was previously no throttling of any kind on any endpoint — not a
 * CAPTCHA wall, not a 429, nothing. That was survivable while nothing valuable
 * was exposed, but /api/es/searchkit and /api/es/shopify/search each proxy an
 * unauthenticated Elasticsearch query, so a single client could drive
 * unbounded load against the search cluster.
 *
 * The client specification asks specifically for "clear rate-limiting headers
 * (429 with Retry-After) rather than hard CAPTCHA walls on public read APIs,
 * enabling agents to handle throttling gracefully". That is exactly the right
 * shape: a well-behaved agent reads Retry-After and backs off, where a CAPTCHA
 * just makes it give up and recommend a competitor.
 *
 * Redis-backed rather than in-process because each serverless instance has its
 * own memory — a per-instance counter would let the effective limit scale with
 * however many instances happen to be warm. Uses the Upstash client already
 * configured for the app, so no new dependency and no new credentials.
 *
 * Fixed window, not sliding: a client can burst up to 2x the limit across a
 * window boundary. That is an accepted trade for one INCR per request instead
 * of the sorted-set bookkeeping a true sliding window needs. The limits here
 * are set well above real browsing behaviour, so the burst is harmless.
 */

/** Requests permitted per window, per client, per endpoint group. */
export const LIMITS = {
  // Search endpoints proxy Elasticsearch. A human browsing a filtered listing
  // fires a handful per minute; 120 leaves generous headroom for an agent
  // paginating a catalogue while still bounding the damage.
  search: { limit: 120, windowSeconds: 60 },
  // Cheap Redis reads. Cached at the CDN for 5 minutes anyway.
  light: { limit: 300, windowSeconds: 60 },
  // The assistant proxy. Tighter than everything else because each request
  // costs the backend a model call — this is the one bucket that exists to
  // bound spend rather than load. Someone having a real conversation sends a
  // handful of messages a minute; anything past 20 is a script.
  chat: { limit: 20, windowSeconds: 60 },
};

/**
 * Best-effort client identity. On Vercel the left-most x-forwarded-for entry is
 * the real client; everything after it is proxy chain. Falls back to a shared
 * bucket rather than failing open per-request, so a missing header cannot be
 * used to bypass the limit entirely.
 */
/**
 * Reads a header from either request shape.
 *
 * pages/api hands us a Node request whose headers are a plain object; App
 * Router hands us a web Request whose headers are a Headers instance with
 * .get(). The limiter is used from both, so it has to cope with both rather
 * than silently reading undefined and treating every caller as anonymous.
 */
function header(req, name) {
  const h = req?.headers;
  if (!h) return null;
  if (typeof h.get === "function") return h.get(name);
  const v = h[name];
  return Array.isArray(v) ? v[0] : v ?? null;
}

export function clientKey(req) {
  const fwd = header(req, "x-forwarded-for");
  return (
    fwd?.split(",")[0]?.trim() || header(req, "x-real-ip") || null
  );
}

/** Header the app sets on its own server-to-server calls. */
export const INTERNAL_HEADER = "x-internal-request";

/**
 * True for the app's own SSR calls.
 *
 * Listing pages fetch /api/es/searchkit while server-rendering. Those requests
 * must never be throttled: on Vercel they all originate from the deployment's
 * own address, so they share one bucket and the storefront would start 429-ing
 * itself under load — throttling exactly the traffic we want to serve.
 *
 * Absence of x-forwarded-for is NOT a usable signal for this. The Next dev
 * server sets it even for localhost, and in production an internal fetch to the
 * public origin passes through the edge and picks one up as well. So internal
 * callers identify themselves explicitly with a shared secret instead.
 *
 * Falls back to "no exemption" when REVALIDATE_SECRET is unset, so a
 * misconfigured environment fails closed rather than handing every caller a
 * bypass by sending an empty header.
 */
export function isInternalRequest(req) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  return header(req, INTERNAL_HEADER) === secret;
}

/** Headers for the app's own server-side fetches. Spread into fetch init. */
export const internalHeaders = () =>
  process.env.REVALIDATE_SECRET
    ? { [INTERNAL_HEADER]: process.env.REVALIDATE_SECRET }
    : {};

/**
 * Consumes one token. Returns { ok, limit, remaining, resetSeconds }.
 *
 * Fails **open** if Redis is unavailable: a rate limiter that takes the
 * storefront down when its backing store hiccups is worse than the problem it
 * solves.
 */
export async function rateLimit(req, group = "search") {
  const { limit, windowSeconds } = LIMITS[group] || LIMITS.search;

  // The app's own SSR calls are never throttled — see isInternalRequest.
  if (isInternalRequest(req)) {
    return { ok: true, limit, remaining: limit, resetSeconds: windowSeconds, internal: true };
  }

  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `ratelimit:${group}:${clientKey(req)}:${window}`;

  try {
    const count = await redis.incr(key);
    // Only set the TTL on the first hit of a window — re-setting it on every
    // request would extend the window indefinitely under sustained load.
    if (count === 1) await redis.expire(key, windowSeconds);

    const resetSeconds = windowSeconds - (Math.floor(Date.now() / 1000) % windowSeconds);
    return {
      ok: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      resetSeconds,
    };
  } catch {
    return { ok: true, limit, remaining: limit, resetSeconds: windowSeconds, degraded: true };
  }
}

/**
 * Wraps a pages/api handler. Sets the standard RateLimit-* headers on every
 * response so a client can pace itself before being refused, and answers 429
 * with Retry-After once the window is exhausted.
 */
export function withRateLimit(handler, group = "search") {
  return async function rateLimited(req, res) {
    const { ok, limit, remaining, resetSeconds } = await rateLimit(req, group);

    res.setHeader("RateLimit-Limit", String(limit));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(resetSeconds));

    if (!ok) {
      res.setHeader("Retry-After", String(resetSeconds));
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit of ${limit} requests per minute exceeded. Retry after ${resetSeconds}s.`,
        retryAfter: resetSeconds,
      });
    }

    return handler(req, res);
  };
}

/**
 * App Router flavour of withRateLimit.
 *
 * Route handlers return a Response rather than mutating `res`, so this wraps
 * the handler and attaches the RateLimit-* headers to whatever comes back.
 * Same limits, same buckets, same internal exemption as the pages/api version —
 * the public catalogue endpoints and the older search endpoints must not be
 * able to drift apart on throttling policy.
 */
export function withRouteRateLimit(handler, group = "search") {
  return async function rateLimitedRoute(req, ctx) {
    const { ok, limit, remaining, resetSeconds } = await rateLimit(req, group);

    if (!ok) {
      return Response.json(
        {
          error: "Too Many Requests",
          message:
            "Rate limit of " +
            limit +
            " requests per minute exceeded. Retry after " +
            resetSeconds +
            "s.",
          retryAfter: resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(resetSeconds),
            "RateLimit-Limit": String(limit),
            "RateLimit-Remaining": "0",
            "RateLimit-Reset": String(resetSeconds),
          },
        },
      );
    }

    const res = await handler(req, ctx);
    res.headers.set("RateLimit-Limit", String(limit));
    res.headers.set("RateLimit-Remaining", String(remaining));
    res.headers.set("RateLimit-Reset", String(resetSeconds));
    return res;
  };
}
