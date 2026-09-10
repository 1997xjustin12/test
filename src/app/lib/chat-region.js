import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";

/**
 * Where the AI assistant is allowed to be used.
 *
 * The assistant costs money per message and is only useful to people who can
 * actually buy — the catalogue ships to the US and Canada — so production is
 * restricted to the served markets, with the Philippines addable for demos and
 * testing from the team there.
 *
 * The list used to come from two environment variables, CHAT_ALLOWED_COUNTRIES
 * and CHAT_REGION_LOCK. Both are gone: changing either meant editing three
 * Vercel projects, and lifting the restriction for a demo in August was done
 * with a hardcoded `return false` that then sat in production for three weeks
 * because a code edit has to be remembered. It is now one switch in the admin,
 * and turning it back on takes a click.
 *
 * DELIBERATELY GLOBAL, not store-scoped. One switch serves Solana, BBQ and OKO,
 * so enabling the Philippines for a demo is one flip rather than three — and,
 * more to the point, one thing to remember to turn off. The admin screen says
 * that it affects all three.
 *
 * This is IP geolocation. A VPN defeats it in both directions: someone in the
 * US on a UK exit node is refused, and someone in the UK on a US exit node is
 * served. That is fine for what this is — a usage control, to keep spend
 * pointed at the markets we sell to. It is NOT a security boundary and nothing
 * downstream should treat it as one.
 */

/** Shared by all brands — no storeKey(). See the note above. */
export const CHAT_REGION_KEY = "chat_region_settings";

/** Cache tag, so a save from the admin takes effect immediately. */
export const CHAT_REGION_TAG = "chat-region";

/** The markets the catalogue actually ships to. Always served. */
export const CORE_COUNTRIES = ["US", "CA"];

/** Added when the switch is off, for demos and testing from the team there. */
export const EXTRA_COUNTRY = "PH";

/**
 * Vercel's geolocation header. Present on every request into a function on the
 * platform; absent locally, because there is no edge in front of `next dev`.
 */
const GEO_HEADER = "x-vercel-ip-country";

/** Country override for testing. Ignored in production — see countryOf(). */
const DEBUG_HEADER = "x-debug-country";

function header(request, name) {
  const h = request?.headers;
  if (!h) return null;
  if (typeof h.get === "function") return h.get(name);
  const v = h[name];
  return Array.isArray(v) ? v[0] : v ?? null;
}

const clean = (value) => {
  const code = String(value ?? "").trim().toUpperCase();
  // ISO 3166-1 alpha-2. Vercel sends XX when it cannot place an address, which
  // is a non-answer and must not be mistaken for a country.
  return /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : null;
};

/**
 * Is the assistant limited to the US and Canada?
 *
 * Defaults to true when nothing is stored or Redis is unreachable, because the
 * safe direction for a spend control is the tighter list. A hiccup should never
 * silently widen who can run up a bill.
 */
export const isUsCaOnly = unstable_cache(
  async () => {
    try {
      const stored = await redis.get(CHAT_REGION_KEY);
      if (!stored || typeof stored !== "object") return true;
      // Only an explicit false widens the list; anything unusable reads as true.
      return stored.usCaOnly !== false;
    } catch (error) {
      console.error("chat-region: settings read failed:", error?.message || error);
      return true;
    }
  },
  // No STORE_ID in the key: one switch serves every brand, so one cache entry
  // should too.
  ["chat-region-settings"],
  { revalidate: 86400, tags: [CHAT_REGION_TAG] },
);

/** The served countries, as uppercase ISO codes. */
export async function allowedCountries() {
  return (await isUsCaOnly()) ? [...CORE_COUNTRIES] : [...CORE_COUNTRIES, EXTRA_COUNTRY];
}

/** Writes the switch. Callers are responsible for busting the cache tag. */
export async function saveRegionSettings(usCaOnly) {
  const record = { usCaOnly: Boolean(usCaOnly), updatedAt: new Date().toISOString() };
  await redis.set(CHAT_REGION_KEY, record);
  return record;
}

/**
 * Whether the restriction applies to this deployment.
 *
 * Keyed on VERCEL_ENV rather than NODE_ENV, and the difference is the whole
 * point: Vercel builds preview deployments with NODE_ENV=production, so a
 * NODE_ENV check would enforce on preview URLs too and lock us out of the
 * environment we test in. VERCEL_ENV distinguishes production / preview /
 * development, so only the real thing is gated.
 *
 * Local and preview stay open on purpose. The switch decides *which* list
 * production serves, not whether a developer can use the assistant on their own
 * machine — otherwise turning it on would lock the team in the Philippines out
 * of their own dev servers. Use X-Debug-Country to exercise the refusal path
 * locally.
 */
export function isRegionLocked() {
  return process.env.VERCEL_ENV === "production";
}

/**
 * The country this request came from, or null if it cannot be determined.
 *
 * Outside production an x-debug-country header stands in, because there is no
 * real geolocation to read locally and the refusal path needs to be testable.
 * Production reads Vercel's header and nothing else — a client-supplied country
 * would make the restriction a suggestion.
 */
export function countryOf(request) {
  if (process.env.VERCEL_ENV !== "production") {
    const debug = clean(header(request, DEBUG_HEADER));
    if (debug) return debug;
  }
  return clean(header(request, GEO_HEADER));
}

/**
 * Whether this request may use the assistant.
 *
 * Returns { allowed, country, locked, countries } — the country comes back so
 * callers can log or report *why* something was refused, rather than leaving a
 * support question that can only be answered by guessing.
 *
 * An unknown country is refused when the lock is on. "US and Canada only" means
 * denying what cannot be placed; admitting unknowns would make the restriction
 * trivially avoidable by anything that strips the header. The cost of being
 * wrong is bounded and visible: if the platform ever stopped sending the
 * header, the assistant would be off for everyone rather than quietly open to
 * everyone, which is the failure you find out about immediately.
 *
 * Async now that the list comes from Redis. All three callers are route
 * handlers, and the read behind it is cached and tagged, so this costs a map
 * lookup rather than a round trip on all but the first call after a change.
 */
export async function chatRegion(request) {
  const country = countryOf(request);
  const locked = isRegionLocked();
  const countries = await allowedCountries();

  if (!locked) return { allowed: true, country, locked, countries };
  return {
    allowed: Boolean(country) && countries.includes(country),
    country,
    locked,
    countries,
  };
}

/**
 * Message shown to a refused visitor.
 *
 * Built from the live list rather than hardcoded, so it cannot tell someone the
 * assistant is "US and Canada only" while the switch is actually serving the
 * Philippines too.
 */
export async function regionMessage() {
  const countries = await allowedCountries();
  const names = { US: "the US", CA: "Canada", PH: "the Philippines" };
  const parts = countries.map((c) => names[c] || c);
  const list =
    parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0];
  return `The AI assistant is only available in ${list}.`;
}
