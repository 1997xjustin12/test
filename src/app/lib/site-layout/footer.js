import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { storeKey } from "@/app/lib/store";
import { readOrDegrade } from "@/app/lib/upstream";
// The colour vocabulary and the link rule are the homepage editor's, reused
// rather than restated: an operator who has configured a homepage section
// already knows what "theme" means in a colour box and that emptying a link
// removes it. Worth the slightly odd import direction.
import { THEME_COLOR, appearanceDefault, isColor } from "@/app/lib/home-page/sections";

/**
 * The configurable footer, one record per brand.
 *
 *   solana_footer, bbq_footer, oko_footer
 *
 * `enabled` is the switch between this and the footer each brand ships today,
 * and it defaults to false — so adding this changes nothing until someone turns
 * it on, and a brand with no record keeps the footer it has.
 *
 * Shaped like the homepage record on purpose (enabled / content / appearance,
 * normalised on write and on read) so the two editors behave the same way.
 */

export const FOOTER_KEY = storeKey("footer");
export const FOOTER_TAG = "site-footer";

/** How much of each list is kept. Caps exist so a bad write cannot grow a page. */
const MAX_GROUPS = 5;
const MAX_LINKS = 12;
const MAX_SOCIALS = 8;

/** Platforms the icon set can draw. Anything else is dropped on write. */
export const SOCIAL_PLATFORMS = [
  "facebook",
  "instagram",
  "youtube",
  "linkedin",
  "twitter",
  "pinterest",
];

const id = () => `f${Math.random().toString(36).slice(2, 9)}`;
const text = (value, max) => String(value ?? "").trim().slice(0, max);

/**
 * The starting footer.
 *
 * Copy, links and socials come from what the brand already publishes — the
 * current Footer component and the NEXT_PUBLIC_STORE_* variables — rather than
 * from the design mock, so switching this on does not quietly change where the
 * footer points. The address is the exception: it appears in the design and
 * nowhere in the code, so it is seeded from the design and is editable.
 */
export function defaultFooter() {
  return {
    logo: "",
    phone: process.env.NEXT_PUBLIC_STORE_CONTACT || "",
    address: "23805 Aspen Dr\nMurrieta, CA 92562",
    copyright: "© {year} {store}. All rights reserved.",
    columns: [
      {
        id: id(),
        heading: "About Solana Fireplaces",
        links: [
          { id: id(), label: "Our Brands", url: "/brands" },
          { id: id(), label: "Open Box", url: "/open-box" },
          { id: id(), label: "Package Deals", url: "/package-deals" },
          { id: id(), label: "Freestanding Grills", url: "/freestanding-grills" },
          { id: id(), label: "Clearance Sale", url: "/clearance-sale" },
          { id: id(), label: "Current Deals", url: "/current-deals" },
        ],
      },
      {
        id: id(),
        heading: "Shop Products",
        links: [
          { id: id(), label: "Fireplaces", url: "/fireplaces" },
          { id: id(), label: "Patio Heaters", url: "/patio-heaters" },
          { id: id(), label: "Built-In Grills", url: "/built-in-grills" },
          { id: id(), label: "Freestanding Grills", url: "/freestanding-grills" },
          { id: id(), label: "Outdoor Refrigeration", url: "/outdoor-refrigeration" },
          { id: id(), label: "Outdoor Storage", url: "/outdoor-storage" },
        ],
      },
      {
        id: id(),
        heading: "Get Expert Support",
        links: [
          { id: id(), label: "Contact Us", url: "/contact" },
          { id: id(), label: "Returns & Refunds", url: "/return-policy" },
          { id: id(), label: "Shipping Policy", url: "/shipping-policy" },
          { id: id(), label: "Privacy Policy", url: "/privacy-policy" },
          { id: id(), label: "Contractor Program", url: "/professional-program" },
          { id: id(), label: "Our Blogs", url: "/blogs" },
        ],
      },
    ],
    // Seeded from the variables this brand actually has. The design shows four
    // icons; only the ones with an address behind them are offered, because a
    // social icon linking nowhere is worse than no icon.
    socials: [
      { id: id(), platform: "facebook", url: process.env.NEXT_PUBLIC_STORE_FACEBOOK || "" },
      { id: id(), platform: "pinterest", url: process.env.NEXT_PUBLIC_STORE_PINTEREST || "" },
    ],
  };
}

/** Colour fields, and what each is when nothing has been chosen. */
export const FOOTER_COLORS = {
  background: { label: "Footer background", defaultLight: "#0c0a09", defaultDark: "#000000" },
  headingColor: { label: "Column headings", default: THEME_COLOR },
  linkColor: { label: "Links", default: "#ffffff" },
  textColor: { label: "Phone and address", default: "#ffffff" },
  socialColor: { label: "Social icons", default: "#ffffff" },
  copyrightColor: { label: "Copyright line", defaultLight: "#d4d4d8", defaultDark: "#a1a1aa" },
};

export const defaultAppearance = (mode) =>
  Object.fromEntries(
    Object.entries(FOOTER_COLORS).map(([key, field]) => [key, appearanceDefault(field, mode)]),
  );

/** What a brand gets when nothing is stored: today's footer, untouched. */
export const EMPTY_FOOTER = Object.freeze({ enabled: false, content: null, appearance: null, updatedAt: null });

function cleanLink(raw) {
  return {
    id: typeof raw?.id === "string" && raw.id ? raw.id.slice(0, 32) : id(),
    label: text(raw?.label, 60),
    // Not validated here beyond trimming. classifyHref decides at render time
    // whether an address is usable, so a half-typed link survives a save and
    // simply does not appear until it is finished.
    url: text(raw?.url, 300),
  };
}

function cleanGroup(raw) {
  return {
    id: typeof raw?.id === "string" && raw.id ? raw.id.slice(0, 32) : id(),
    heading: text(raw?.heading, 60),
    links: (Array.isArray(raw?.links) ? raw.links : []).map(cleanLink).slice(0, MAX_LINKS),
  };
}

function cleanSocial(raw) {
  const platform = String(raw?.platform ?? "").trim().toLowerCase();
  return {
    id: typeof raw?.id === "string" && raw.id ? raw.id.slice(0, 32) : id(),
    platform: SOCIAL_PLATFORMS.includes(platform) ? platform : SOCIAL_PLATFORMS[0],
    url: text(raw?.url, 300),
  };
}

/** Cleans a stored record. Unknown fields go; lists are capped; colours are checked. */
export function normalizeFooter(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_FOOTER };

  const base = defaultFooter();
  const c = raw.content ?? {};

  const content = {
    logo: text(c.logo, 300),
    phone: text(c.phone, 40),
    address: text(c.address, 200),
    copyright: text(c.copyright, 160) || base.copyright,
    columns: (Array.isArray(c.columns) ? c.columns : base.columns)
      .map(cleanGroup)
      .slice(0, MAX_GROUPS),
    socials: (Array.isArray(c.socials) ? c.socials : base.socials)
      .map(cleanSocial)
      .slice(0, MAX_SOCIALS),
  };

  const scheme = (mode) => {
    const out = {};
    for (const [key, field] of Object.entries(FOOTER_COLORS)) {
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
const readFooter = unstable_cache(
  async () => {
    const stored = await redis.get(FOOTER_KEY);
    if (!stored) return { ...EMPTY_FOOTER };
    return normalizeFooter(typeof stored === "string" ? JSON.parse(stored) : stored);
  },
  ["site-footer", FOOTER_KEY],
  { revalidate: 86400, tags: [FOOTER_TAG] },
);

/**
 * This brand's footer configuration.
 *
 * Degrades to "not configured", which renders the footer the brand ships —
 * the safe direction, and the same footer it had before any of this existed.
 */
export const getFooter = () => readOrDegrade("site-footer", readFooter, { ...EMPTY_FOOTER });

/** Writes the record. Callers bust FOOTER_TAG; see the API route. */
export async function saveFooter({ enabled, content, appearance }) {
  const record = normalizeFooter({ enabled, content, appearance });
  record.updatedAt = new Date().toISOString();
  await redis.set(FOOTER_KEY, JSON.stringify(record));
  return record;
}

/** A starting record for a brand that has never configured one. */
export const starterFooter = () => ({
  enabled: false,
  content: defaultFooter(),
  appearance: { light: defaultAppearance("light"), dark: defaultAppearance("dark") },
  updatedAt: null,
});
