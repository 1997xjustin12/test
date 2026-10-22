import { unstable_cache } from "next/cache";
import { redis, keys } from "@/app/lib/redis";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_ID } from "@/app/lib/store";
import { HOURS_SUMMARY, STORE_NAME, fillStoreSlots } from "@/app/lib/store_constants";

/**
 * SEO for the app's *own* routes.
 *
 * Menu-driven pages (/[slug]) already carry their meta on the menu item and are
 * edited in Menu Builder. Everything here is a route that exists in the codebase
 * rather than in the menu tree, so it had nowhere to be configured.
 *
 * Storage: a single Redis hash-like JSON object under `<STORE_REDIS_PREFIX>_page_seo`,
 * keyed by route path. One key per store means a brand can never read or clobber
 * another brand's copy, and one read serves every route.
 *
 *   { "/about": { title, description, keywords: [], og_image, canonical, robots } }
 */

export const PAGE_SEO_GROUPS = ["Main", "Content", "Legal", "Account", "Utility"];

/**
 * The routes offered in the admin UI, and each page's own title and
 * description when nothing is set in Page SEO. Built from STORE_NAME, so every
 * brand starts out naming itself; Page SEO can override any of it per brand.
 *
 * Most of these pages used to have no default and fell through to the
 * homepage's title and description — about twenty pages sharing one snippet.
 * Values from docs/page-meta.md, approved 2026-10-22.
 */
export const PAGE_SEO_ROUTES = [
  { path: "/", label: "Home", group: "Main" },
  {
    path: "/categories",
    label: "Categories",
    group: "Main",
    defaults: {
      title: `Shop All Categories | ${STORE_NAME}`,
      description: `Browse every product category at ${STORE_NAME} — grills, outdoor kitchens, fireplaces, patio heating and more.`,
    },
  },
  { path: "/search", label: "Search", group: "Main", defaults: { title: `Search | ${STORE_NAME}`, robots: "noindex,follow" } },
  // Every combination of products is its own address; none is worth indexing.
  { path: "/compare", label: "Compare", group: "Main", defaults: { title: `Compare Products | ${STORE_NAME}`, robots: "noindex,follow" } },
  { path: "/cart", label: "Cart", group: "Main", defaults: { title: `Your Cart | ${STORE_NAME}`, robots: "noindex,nofollow" } },

  {
    path: "/about",
    label: "About",
    group: "Content",
    defaults: {
      title: `About Us | ${STORE_NAME}`,
      description: `Meet the team behind ${STORE_NAME}: an authorized dealer for the top brands we carry, with expert product advice and a price-match guarantee.`,
    },
  },
  {
    path: "/contact",
    label: "Contact",
    group: "Content",
    defaults: {
      title: `Contact Us | ${STORE_NAME}`,
      description: `Talk to the ${STORE_NAME} team by phone, email or our contact form. ${HOURS_SUMMARY}.`,
    },
  },
  {
    path: "/professional-program",
    label: "Professional Program",
    group: "Content",
    defaults: {
      title: `Contractor & Trade Program | ${STORE_NAME}`,
      description: `Contractors, designers and builders: apply to the ${STORE_NAME} professional program for trade pricing, free shipping on eligible orders and direct access to our specialists.`,
    },
  },

  {
    path: "/privacy-policy",
    label: "Privacy Policy",
    group: "Legal",
    defaults: {
      title: `Privacy Policy | ${STORE_NAME}`,
      description: `How ${STORE_NAME} collects, uses and protects your personal information.`,
    },
  },
  {
    path: "/return-policy",
    label: "Return Policy",
    group: "Legal",
    defaults: {
      title: `Return & Refund Policy | ${STORE_NAME}`,
      description: `Returns at ${STORE_NAME}: how to start one, refund timing (3–5 business days after we receive your return) and who pays return shipping.`,
    },
  },
  {
    path: "/shipping-policy",
    label: "Shipping Policy",
    group: "Legal",
    defaults: {
      title: `Shipping Policy | ${STORE_NAME}`,
      description: `How ${STORE_NAME} ships: free shipping on selected items, orders processed and shipped within 2–3 business days, and what to expect for oversized items.`,
    },
  },

  { path: "/login", label: "Login", group: "Account", defaults: { title: `Log In | ${STORE_NAME}`, robots: "noindex,nofollow" } },
  {
    // Kept out of search like /login: an account form is not a landing page.
    path: "/register",
    label: "Register",
    group: "Account",
    defaults: {
      title: `Create an Account | ${STORE_NAME}`,
      description: `Create your ${STORE_NAME} account to track orders and check out faster.`,
      robots: "noindex,nofollow",
    },
  },
  {
    path: "/forgot-password",
    label: "Forgot Password",
    group: "Account",
    defaults: { title: `Forgot Password | ${STORE_NAME}`, robots: "noindex,nofollow" },
  },
  { path: "/my-account", label: "My Account", group: "Account", defaults: { title: "My Account", robots: "noindex,nofollow" } },
  { path: "/my-account/orders", label: "My Orders", group: "Account", defaults: { title: "My Orders", robots: "noindex,nofollow" } },
  { path: "/my-account/profile", label: "My Profile", group: "Account", defaults: { title: "My Profile", robots: "noindex,nofollow" } },
  {
    path: "/my-account/change-password",
    label: "Change Password",
    group: "Account",
    defaults: { title: "Change Password", robots: "noindex,nofollow" },
  },

  { path: "/subscribe", label: "Subscribe", group: "Utility", defaults: { title: `Subscribe | ${STORE_NAME}`, robots: "noindex,follow" } },
  { path: "/unsubscribe", label: "Unsubscribe", group: "Utility", defaults: { title: `Unsubscribe | ${STORE_NAME}`, robots: "noindex,follow" } },
  { path: "/payment_success", label: "Payment Success", group: "Utility", defaults: { title: `Order Placed | ${STORE_NAME}`, robots: "noindex,nofollow" } },
];

export const ROBOTS_OPTIONS = [
  { value: "index,follow", label: "Index, follow (default)" },
  { value: "noindex,follow", label: "No index, follow" },
  { value: "index,nofollow", label: "Index, no follow" },
  { value: "noindex,nofollow", label: "No index, no follow" },
];

export const emptyPageSeo = () => ({
  title: "",
  description: "",
  keywords: [],
  og_image: "",
  canonical: "",
  robots: "",
});

/**
 * Cached read of the whole map. Tagged `page-seo` so a save can bust it
 * immediately instead of waiting out the TTL.
 */
export const getPageSeoMap = unstable_cache(
  async () => (await redis.get(keys.page_seo.value)) || {},
  // Store-scoped read needs a store-scoped cache key — see store-settings.js.
  ["page-seo", STORE_ID],
  { revalidate: 86400, tags: ["page-seo"] },
);

function parseRobots(robots) {
  if (!robots) return undefined;
  return {
    index: !robots.includes("noindex"),
    follow: !robots.includes("nofollow"),
  };
}

/**
 * Builds a Next.js metadata object for a route.
 * Call from a page's `generateMetadata`; anything unset falls through to the
 * route's defaults and then to the layout-level brand metadata.
 *
 *   export const generateMetadata = () => pageMetadata("/about");
 */
export async function pageMetadata(path) {
  let stored = {};
  try {
    const map = await getPageSeoMap();
    stored = map?.[path] || {};
  } catch (error) {
    // Never let a Redis blip take down a page - fall back to defaults.
    console.error(`pageMetadata(${path}) failed to read page_seo:`, error);
  }

  const defaults =
    PAGE_SEO_ROUTES.find((r) => r.path === path)?.defaults || {};

  // {store} and {year} are filled in, so a title written once reads right on
  // every brand — the same slots the menu builder and footer take.
  const title = fillStoreSlots(stored.title) || defaults.title;
  const description = fillStoreSlots(stored.description) || defaults.description;
  const keywords = stored.keywords?.length ? stored.keywords : defaults.keywords;
  const robots = parseRobots(stored.robots || defaults.robots);
  const canonical =
    stored.canonical || (BASE_URL ? `${BASE_URL}${path === "/" ? "" : path}` : undefined);
  const ogImage = stored.og_image || defaults.og_image;

  const metadata = {};
  if (title) metadata.title = title;
  if (description) metadata.description = description;
  if (keywords?.length) metadata.keywords = keywords;
  if (robots) metadata.robots = robots;
  if (canonical) metadata.alternates = { canonical };

  if (title || description || ogImage) {
    metadata.openGraph = {
      ...(title && { title }),
      ...(description && { description }),
      ...(canonical && { url: canonical }),
      ...(ogImage && { images: [{ url: ogImage }] }),
    };
    metadata.twitter = {
      card: ogImage ? "summary_large_image" : "summary",
      ...(title && { title }),
      ...(description && { description }),
      ...(ogImage && { images: [ogImage] }),
    };
  }

  return metadata;
}
