import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { STORE_ID, STORE_THEME, storeKey } from "@/app/lib/store";

/**
 * Per-brand settings, stored in Redis instead of env.
 *
 * Env vars are a deployment concern; a store's name, phone number, socials and
 * analytics ids are content, and changing them shouldn't need a redeploy. These
 * live under a store-scoped key so each brand owns its own copy.
 *
 *   solana_store_settings, bbq_store_settings, oko_store_settings
 *
 * Every field keeps an env fallback (`env` below) so nothing breaks before the
 * values are entered in the admin — Redis wins when set, env fills the gap.
 */

export const STORE_SETTINGS_KEY = storeKey("store_settings");

/**
 * Field registry. Drives both the resolver and the admin form, so adding a
 * setting is a one-line change in one place.
 */
export const STORE_SETTINGS_FIELDS = [
  // Identity
  { key: "name", label: "Store name", group: "Identity", env: "NEXT_PUBLIC_STORE_NAME", hint: "Used in titles, metadata and copy throughout the site." },
  { key: "name2", label: "Short name", group: "Identity", env: "NEXT_PUBLIC_STORE_NAME2", hint: "Shorter variant used where the full name doesn't fit." },
  { key: "domain", label: "Store domain", group: "Identity", env: "NEXT_PUBLIC_STORE_DOMAIN", hint: "Public domain, e.g. www.example.com" },
  { key: "theme", label: "Theme", group: "Identity", type: "theme", hint: "Which brand's component tree renders. Derived from STORE_ID." },

  // Contact
  { key: "contact", label: "Phone number", group: "Contact", env: "NEXT_PUBLIC_STORE_CONTACT", hint: "Shown in the header, footer and on product pages." },
  { key: "email", label: "Email address", group: "Contact", env: "NEXT_PUBLIC_STORE_EMAIL" },

  // Social
  { key: "facebook", label: "Facebook URL", group: "Social", env: "NEXT_PUBLIC_STORE_FACEBOOK" },
  { key: "pinterest", label: "Pinterest URL", group: "Social", env: "NEXT_PUBLIC_STORE_PINTEREST" },
  { key: "instagram", label: "Instagram URL", group: "Social" },
  { key: "youtube", label: "YouTube URL", group: "Social" },

  // Analytics
  { key: "ga_id", label: "Google Analytics ID", group: "Analytics", env: "NEXT_PUBLIC_GA_ID", hint: "e.g. G-XXXXXXXXXX" },
  { key: "meta_pixel_id", label: "Meta Pixel ID", group: "Analytics", env: "NEXT_PUBLIC_META_PIXEL_ID" },
  { key: "recaptcha_site_key", label: "reCAPTCHA site key", group: "Analytics", env: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", hint: "Public key only. The secret stays in env." },

  // Catalog
  { key: "es_index", label: "Elasticsearch index", group: "Catalog", env: "NEXT_PUBLIC_ES_INDEX", hint: "Catalog index this brand reads from. Change with care." },
  {
    key: "merchant_feed_domain",
    label: "Merchant feed source",
    group: "Catalog",
    env: "MERCHANT_FEED_SHOPIFY_DOMAIN",
    hint: "Blank = build the feed from this site's Elasticsearch (Solana, BBQ). Set a Shopify storefront URL to describe that store instead (OKO), sourcing price and availability from its products.json so they match the landing page.",
  },
];

export const STORE_SETTINGS_GROUPS = [
  "Identity",
  "Contact",
  "Social",
  "Analytics",
  "Catalog",
];

/** Env-derived defaults — the fallback layer beneath whatever is in Redis. */
export function envDefaults() {
  const out = { theme: STORE_THEME };
  for (const field of STORE_SETTINGS_FIELDS) {
    if (field.env) out[field.key] = process.env[field.env] || "";
  }
  return out;
}

export const emptyStoreSettings = () =>
  Object.fromEntries(STORE_SETTINGS_FIELDS.map((f) => [f.key, ""]));

/**
 * Cached read of this store's settings, merged over the env fallbacks.
 * Tagged `store-settings` so a save busts it immediately.
 */
export const getStoreSettings = unstable_cache(
  async () => {
    const defaults = envDefaults();
    try {
      const stored = await redis.get(STORE_SETTINGS_KEY);
      if (!stored || typeof stored !== "object") return defaults;
      // Only let non-empty stored values win, so a blank field falls back.
      const merged = { ...defaults };
      for (const [k, v] of Object.entries(stored)) {
        if (v !== undefined && v !== null && v !== "") merged[k] = v;
      }
      return merged;
    } catch (error) {
      console.error(`getStoreSettings(${STORE_ID}) failed:`, error);
      return defaults;
    }
  },
  ["store-settings"],
  { revalidate: 86400, tags: ["store-settings"] },
);
