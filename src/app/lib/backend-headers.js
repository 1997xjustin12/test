import { clientKey } from "@/app/lib/rate-limit";

/**
 * Headers for a server-side call to the backend made on a visitor's behalf.
 *
 * The backend counts its rate limits per visitor and locks sign-in after
 * repeated wrong passwords (bqq_backend 7a2a494, 18 Oct 2026). A call from this
 * server that doesn't say who the visitor is makes every shopper look like the
 * storefront: they share one count, and one abusive visitor gets everyone a
 * 429 — sign-in, registration, password reset, checkout. The rule, from
 * docs/reference/storefront-rate-limit-checklist.pdf:
 *
 *   signed in      Authorization: Bearer <token>   counted per customer
 *   not signed in  Authorization: Api-Key <storefront key>
 *                  X-Client-IP: <visitor IP>       counted per visitor
 *
 * One Authorization header can't carry both, so a Bearer token wins and the key
 * is left off. X-Client-IP is sent either way when known (the backend only
 * believes it alongside a valid key) and omitted when not — never empty or
 * "unknown", which would lump the unknowns into one bucket.
 *
 * The storefront key is NEXT_SOLANA_COLLECTIONS_KEY. NEXT_SOLANA_BACKEND_KEY,
 * which register.js used to send, is not one: checked 19 Oct 2026, the backend
 * answers it with "Authentication credentials were not provided", exactly as
 * for no key. Server-only; never expose it through a NEXT_PUBLIC_ variable.
 *
 * @param req  the incoming request (pages/api or App Router — clientKey reads both)
 * @param opts.bearer  "Bearer …" to send, or null to call anonymously. Defaults
 *                     to the visitor's own Bearer header, if they sent one.
 * @param opts.json    include Content-Type: application/json (default true)
 */
export function backendHeaders(req, { bearer = visitorBearer(req), json = true } = {}) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";

  const storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN;
  if (storeDomain) headers["X-Store-Domain"] = storeDomain;

  const key = process.env.NEXT_SOLANA_COLLECTIONS_KEY?.trim();
  if (bearer) headers.Authorization = bearer;
  else if (key) headers.Authorization = `Api-Key ${key}`;

  const ip = clientKey(req);
  if (ip) headers["X-Client-IP"] = ip;

  return headers;
}

/**
 * The visitor's own `Authorization: Bearer …`, or null.
 *
 * Only a Bearer token is forwarded. Passing the header through whatever it
 * holds would let a browser send an Api-Key of its own choosing and have this
 * server relay it.
 */
export function visitorBearer(req) {
  const h = req?.headers;
  const value = typeof h?.get === "function" ? h.get("authorization") : h?.authorization;
  return typeof value === "string" && /^Bearer\s+\S/.test(value) ? value : null;
}

/**
 * Copies the backend's Retry-After onto a pages/api response, so a 429 reaches
 * the browser with how long to wait instead of losing it at the proxy.
 */
export function forwardRetryAfter(backendResponse, res) {
  const retryAfter = backendResponse?.headers?.get?.("retry-after");
  if (retryAfter) res.setHeader("Retry-After", retryAfter);
}
