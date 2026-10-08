/**
 * Admin authorization — one signed cookie, one env allowlist.
 *
 * The storefront's JWTs live in IndexedDB and are only ever sent as an
 * Authorization header by client JavaScript, so the server cannot see who is
 * asking. The only cookie the login flow set was `isLoggedIn`, which is not
 * httpOnly and therefore something any visitor can type into the console. That
 * makes it useless as an authorization signal.
 *
 * So a successful login additionally mints a signed, httpOnly cookie naming the
 * user. The signature is what makes it trustworthy: the browser cannot write it
 * (httpOnly) and a hand-rolled request cannot forge it (HMAC).
 *
 * Deliberately split into two halves:
 *
 *   the cookie   proves *who* you are     — signed at login, tamper-proof
 *   ADMIN_USERNAMES decides *if* you are an admin — read fresh on every request
 *
 * Keeping the allowlist out of the cookie is the point. Removing a username
 * takes effect on the next request rather than whenever their session happens
 * to expire, so revoking access does not mean waiting out a token.
 *
 * Web Crypto only, no Node built-ins: this runs in the edge runtime (proxy.js)
 * and the Node runtime (pages/api) from the same file.
 */

import { envAdminUsernames, isAdminUser } from "@/app/lib/admin-users";

export const ADMIN_COOKIE = "admin_session";

/** Eight hours. Long enough for a working day, short enough to expire nightly. */
const TTL_SECONDS = 8 * 60 * 60;

/**
 * Signing key. ADMIN_SESSION_SECRET only.
 *
 * It used to fall back to REVALIDATE_SECRET, so that this worked on the
 * existing deployments before the new variable was set anywhere. That is no
 * longer true — it is set in all three Vercel projects as of 8 October 2026 —
 * and the fallback tied two secrets together that want to be independent:
 * REVALIDATE_SECRET is handed to the Django backend for server-to-server
 * revalidation, so rotating it signed out every admin, and a leak of it was
 * also the power to mint an admin session for any username.
 *
 * With no secret, signing throws and verification fails. No secret must never
 * mean no checking.
 */
const secret = () => process.env.ADMIN_SESSION_SECRET || "";

const encoder = new TextEncoder();

const b64urlEncode = (bytes) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const b64urlDecode = (value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
};

async function hmac(payload) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return b64urlEncode(new Uint8Array(signature));
}

/** Length-independent comparison, so a wrong signature cannot be timed out. */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * The set of usernames permitted into /admin, read at call time.
 *
 * Two halves now: ADMIN_USERNAMES, and the grants managed at
 * /admin/admin-users. See lib/admin-users.js for why the env list is a floor
 * rather than a seed. Both are read per request, so revoking access still takes
 * effect on the next one.
 *
 * Unset or empty means nobody — an admin surface that opens up when a variable
 * is missing is the wrong way round, and a missing variable is exactly what a
 * fresh deployment looks like.
 */
export { envAdminUsernames as adminUsernames, isAdminUser };

/**
 * Case-insensitive: usernames are typed by hand into a login form.
 *
 * Env-only and synchronous, kept for callers that cannot await. Anything
 * deciding access should use isAdminUser, which also sees the grants.
 */
export function isAdminUsername(username) {
  if (!username) return false;
  return (process.env.ADMIN_USERNAMES || "")
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)
    .includes(String(username).trim().toLowerCase());
}

/** Signs `username` into a cookie value. Throws if no secret is configured. */
export async function signAdminSession(username) {
  if (!secret()) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to issue admin sessions",
    );
  }
  const payload = b64urlEncode(
    encoder.encode(
      JSON.stringify({
        u: String(username),
        exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
      }),
    ),
  );
  return `${payload}.${await hmac(payload)}`;
}

/**
 * Returns the username carried by a cookie value, or null if it is missing,
 * malformed, expired or not signed by us. Never throws — a bad cookie is an
 * ordinary denial, not an error.
 */
export async function verifyAdminSession(value) {
  if (!value || !secret()) return null;

  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;

  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);

  try {
    if (!timingSafeEqual(signature, await hmac(payload))) return null;
    const claims = JSON.parse(b64urlDecode(payload));
    if (!claims?.u || typeof claims.exp !== "number") return null;
    if (claims.exp < Math.floor(Date.now() / 1000)) return null;
    return String(claims.u);
  } catch {
    return null;
  }
}

/**
 * Reads the admin cookie off either request shape this app uses — NextRequest
 * (proxy, App Router handlers) exposes `cookies.get()`, while NextApiRequest
 * (pages/api) only has the raw header.
 */
function readAdminCookie(req) {
  const fromNextRequest = req?.cookies?.get?.(ADMIN_COOKIE);
  if (fromNextRequest) return fromNextRequest.value ?? fromNextRequest;

  // NextApiRequest pre-parses cookies into a plain object.
  if (req?.cookies && typeof req.cookies === "object" && !req.cookies.get) {
    const value = req.cookies[ADMIN_COOKIE];
    if (value) return value;
  }

  const header = req?.headers?.get?.("cookie") ?? req?.headers?.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ADMIN_COOKIE) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/**
 * The single question every admin surface asks: is this request from a current
 * admin? Returns the username, or null.
 *
 * Both halves are checked — a validly signed cookie for someone since removed
 * from ADMIN_USERNAMES is not an admin.
 */
export async function getAdminUser(req) {
  const username = await verifyAdminSession(readAdminCookie(req));
  if (!username) return null;
  return (await isAdminUser(username)) ? username : null;
}

/**
 * Authorization for the admin API routes, which have two legitimate callers:
 * the admin screens in a browser (signed cookie) and the Django backend calling
 * in server-to-server (?secret=). Either is sufficient; neither is optional.
 *
 * Note what is *not* accepted: a same-origin Origin header. Several of these
 * routes used to treat that as authorization, but Origin is set by the client,
 * and a plain navigation or a curl sends none at all — which the old check read
 * as "internal, allow".
 */
export async function isAuthorizedAdminRequest(request) {
  const url = request.nextUrl ?? new URL(request.url);
  if (isDevBypass(requestHost(request))) return true;

  const configured = process.env.REVALIDATE_SECRET;
  const secret = url.searchParams.get("secret");
  if (configured && secret === configured) return true;

  if (!(await getAdminUser(request))) return false;

  // Cookie path only, and only for writes — see sameOrigin.
  if (!isSafeMethod(request?.method) && !sameOrigin(request)) return false;

  return true;
}

/** GET, HEAD and OPTIONS change nothing, so they need no origin check. */
const isSafeMethod = (method) =>
  ["GET", "HEAD", "OPTIONS"].includes(String(method ?? "GET").toUpperCase());

/**
 * True when a write carrying the admin cookie came from this site's own pages.
 *
 * The cookie is SameSite=Strict, so a cross-site request should never carry it
 * in the first place — this is the second lock on the same door, for the day
 * someone relaxes that attribute or a browser disagrees about what same-site
 * means.
 *
 * A missing Origin is refused rather than allowed. Browsers send it on every
 * state-changing request, so absence means the caller is not a browser; and a
 * non-browser holding the cookie is, by definition, replaying a stolen one. The
 * legitimate non-browser caller — the Django backend — authenticates with the
 * secret and has already returned above.
 *
 * Note this is the opposite of the check that used to live in several of these
 * routes, which treated a same-origin Origin as *authorization*. Origin is set
 * by the client, so that let a hand-rolled request in. Here it is only ever a
 * veto on a request that has already proved who it is.
 */
function sameOrigin(request) {
  const origin = request?.headers?.get?.("origin") ?? request?.headers?.origin;
  if (!origin) return false;

  const host = requestHost(request);
  if (!host) return false;

  try {
    return new URL(origin).host.toLowerCase() === String(host).toLowerCase();
  } catch {
    return false;
  }
}

/**
 * The host as the client asked for it.
 *
 * Deliberately the Host header rather than nextUrl.hostname: inside a route
 * handler nextUrl reports the address the server is listening on, which is
 * "localhost" for every request a dev server sees regardless of what was
 * actually requested. Reading the header means the dev bypass keys off the same
 * value everywhere — proxy, layout, App Router handler and pages/api — so the
 * four cannot disagree, and so the deny path is reachable in a local test.
 */
export function requestHost(request) {
  return (
    request?.headers?.get?.("host") ??
    request?.headers?.host ??
    (request?.nextUrl ?? (request?.url ? new URL(request.url) : {})).hostname ??
    null
  );
}

/**
 * Local development bypass, so `npm run oko-dev` still opens /admin and its
 * APIs without a login round-trip. One definition, shared by the proxy, the
 * admin layout and the admin API routes, so they cannot disagree about what
 * counts as local.
 *
 * Two conditions, both required. The host check alone would rest on a header
 * the client sends; requiring a non-production build means that on a deployed
 * brand this cannot be reached at all, whatever Host is claimed.
 *
 * Note this is a *development* bypass, not a localhost one: `next start` over a
 * production build asks for a real login even locally, which is what you want
 * when reproducing a production problem.
 */
export function isDevBypass(host) {
  if (process.env.NODE_ENV === "production") return false;
  if (!host) return false;
  const name = String(host).split(":")[0].toLowerCase();
  return name === "localhost" || name === "127.0.0.1" || name === "[::1]";
}

/**
 * Cookie attributes shared by the set and clear paths, so they cannot drift.
 *
 * sameSite is "strict", not "lax". Lax attaches the cookie to top-level GET
 * navigations from other sites, which is exactly the shape of "click this link"
 * — and the admin surface has no reason to accept one. Admins arrive here from
 * the Store Admin link on /my-account, which is same-site and unaffected, or by
 * typing the address, which browsers treat as same-site because there is no
 * initiating page.
 *
 * The one behaviour this changes: a link to /admin followed from somewhere
 * else entirely — an email, a chat message — now lands on the 404 the first
 * time, and reloading from the address bar works. That is the trade, and it is
 * worth it.
 */
export const adminCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});

export const ADMIN_COOKIE_MAX_AGE = TTL_SECONDS;
