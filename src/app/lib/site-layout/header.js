import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { storeKey } from "@/app/lib/store";
import { readOrDegrade } from "@/app/lib/upstream";
import { THEME_COLOR, appearanceDefault, isColor } from "@/app/lib/home-page/sections";
import { DEFAULT_ICONS, isHeaderIcon } from "@/app/components/site-layout/header/icons";

/**
 * The configurable header, one record per brand.
 *
 *   solana_header, bbq_header, oko_header
 *
 * Store-scoped like every other per-brand key, so switching this on for one
 * brand leaves the other two alone. `enabled` defaults to false, so adding it
 * changes nothing until someone turns it on.
 *
 * Only colours and the phone are configurable. The menu is not: it already has
 * an editor at /admin/menu-builder, and a second place to change the same links
 * would be two sources of truth for what the site's navigation is. This header
 * renders whatever that menu says, filtered by its "Show in navigation" toggle.
 */

export const HEADER_KEY = storeKey("header");
export const HEADER_TAG = "site-header";

export const EMPTY_HEADER = Object.freeze({ enabled: false, content: null, appearance: null, updatedAt: null });

const text = (value, max) => String(value ?? "").trim().slice(0, max);

export function defaultHeader() {
  return {
    phone: process.env.NEXT_PUBLIC_STORE_CONTACT || "",
    searchPlaceholder: "Search fireplaces, brands, styles…",
    phoneIcon: DEFAULT_ICONS.phone,
    accountIcon: DEFAULT_ICONS.account,
    cartIcon: DEFAULT_ICONS.cart,
  };
}

/** Colour fields, and what each is when nothing has been chosen. */
export const HEADER_COLORS = {
  background: { label: "Header background", defaultLight: "#ffffff", defaultDark: "#0c0a09" },
  borderColor: { label: "Divider", defaultLight: "#e8e8ea", defaultDark: "#27272a" },
  menuColor: { label: "Menu links", default: THEME_COLOR },
  phoneColor: { label: "Phone number", default: THEME_COLOR },
  iconColor: { label: "Account and cart icons", default: THEME_COLOR },
  searchBg: { label: "Search field", defaultLight: "#d9d9d9", defaultDark: "#27272a" },
  searchText: { label: "Search field text", defaultLight: "#17181a", defaultDark: "#fafafa" },
  searchButtonBg: { label: "Search button", default: THEME_COLOR },
  searchButtonText: { label: "Search button text", default: "#ffffff" },
};

export const defaultAppearance = (mode) =>
  Object.fromEntries(
    Object.entries(HEADER_COLORS).map(([key, field]) => [key, appearanceDefault(field, mode)]),
  );

export function normalizeHeader(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_HEADER };

  const base = defaultHeader();
  const c = raw.content ?? {};
  // An icon name that this build cannot draw falls back to the slot's own
  // default, so trimming the list later cannot leave a blank button.
  const icon = (slot, value) => (isHeaderIcon(slot, value) ? value : DEFAULT_ICONS[slot]);
  const content = {
    phone: text(c.phone, 40),
    searchPlaceholder: text(c.searchPlaceholder, 80) || base.searchPlaceholder,
    phoneIcon: icon("phone", c.phoneIcon),
    accountIcon: icon("account", c.accountIcon),
    cartIcon: icon("cart", c.cartIcon),
  };

  const scheme = (mode) => {
    const out = {};
    for (const [key, field] of Object.entries(HEADER_COLORS)) {
      const value = raw.appearance?.[mode]?.[key];
      out[key] = isColor(value) ? value : appearanceDefault(field, mode);
    }
    return out;
  };

  return {
    enabled: raw.enabled === true,
    content,
    appearance: { light: scheme("light"), dark: scheme("dark") },
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  };
}

/** Throws rather than caching a failure; see lib/upstream.js. */
const readHeader = unstable_cache(
  async () => {
    const stored = await redis.get(HEADER_KEY);
    if (!stored) return { ...EMPTY_HEADER };
    return normalizeHeader(typeof stored === "string" ? JSON.parse(stored) : stored);
  },
  ["site-header", HEADER_KEY],
  { revalidate: 86400, tags: [HEADER_TAG] },
);

/** Degrades to "not configured", which renders the header the brand ships. */
export const getHeader = () => readOrDegrade("site-header", readHeader, { ...EMPTY_HEADER });

export async function saveHeader({ enabled, content, appearance }) {
  const record = normalizeHeader({ enabled, content, appearance });
  record.updatedAt = new Date().toISOString();
  await redis.set(HEADER_KEY, JSON.stringify(record));
  return record;
}

export const starterHeader = () => ({
  enabled: false,
  content: defaultHeader(),
  appearance: { light: defaultAppearance("light"), dark: defaultAppearance("dark") },
  updatedAt: null,
});
