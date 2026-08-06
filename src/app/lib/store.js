/**
 * Store identity — the one thing that CANNOT come from Redis.
 *
 * To read a brand's settings you must already know which brand you are, so a
 * single env var bootstraps everything else. Every other per-brand value lives
 * in Redis under a key derived from this id (see store-settings.js).
 *
 *   STORE_ID=solana | bbq | oko
 *
 * `STORE_REDIS_PREFIX` is honoured as a fallback so existing deployments keep
 * resolving the same keys until their env is updated.
 */

// Set deliberately as the store's identity.
const EXPLICIT_STORE_ID = (
  process.env.STORE_ID ||
  process.env.NEXT_PUBLIC_STORE_ID ||
  ""
)
  .trim()
  .toLowerCase();

// Key namespace falls back to the legacy prefix so deployments that haven't
// added STORE_ID yet keep resolving the same Redis keys. Note this is only a
// *namespace* fallback — brands may legitimately share one namespace, so it
// must never be used to decide which brand we are (see resolveTheme).
export const STORE_ID =
  EXPLICIT_STORE_ID ||
  (process.env.STORE_REDIS_PREFIX || "").trim().toLowerCase();

/** Every brand this codebase can render. */
export const STORE_THEMES = ["solana", "bbq", "oko"];

/**
 * Builds a store-scoped Redis key. All keys go through here so a brand can
 * never read or overwrite another brand's data.
 *
 *   storeKey("store_settings")  ->  "solana_store_settings"
 */
export const storeKey = (name) => `${STORE_ID}_${name}`;

/**
 * Theme is derived from STORE_ID rather than its own env var — one deployment
 * identity instead of two that could disagree. Kept synchronous on purpose:
 * ~69 call sites branch on ISBBQ/ISOKO during render, and making those await a
 * Redis read would put a network call in every render path and break static
 * generation.
 *
 * Legacy NEXT_PUBLIC_STORE_THEME and the bbqgrilloutlet.com domain check remain
 * as fallbacks so nothing flips brand before envs are migrated.
 */
const LEGACY_THEME = process.env.NEXT_PUBLIC_STORE_THEME?.trim().toLowerCase();

const normalizeHost = (value) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[/?#].*$/, "");

export function resolveTheme() {
  // EXPLICIT_STORE_ID only — never the STORE_REDIS_PREFIX fallback. BBQ and OKO
  // can share Solana's Redis namespace, and letting the prefix pick the theme
  // would serve Solana's whole storefront on their domains.
  if (STORE_THEMES.includes(EXPLICIT_STORE_ID)) return EXPLICIT_STORE_ID;
  if (STORE_THEMES.includes(LEGACY_THEME)) return LEGACY_THEME;
  if (
    normalizeHost(process.env.NEXT_PUBLIC_STORE_DOMAIN) ===
    "bbqgrilloutlet.com"
  ) {
    return "bbq";
  }
  return "solana";
}

export const STORE_THEME = resolveTheme();
