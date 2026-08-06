import { unstable_cache } from "next/cache";
import { redis, keys } from "@/app/lib/redis";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_ID } from "@/app/lib/store";
import { STORE_NAME } from "@/app/lib/store_constants";

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
 * The routes offered in the admin UI. `defaults` mirror whatever the page
 * hardcoded before, so an unconfigured route keeps its previous output.
 */
export const PAGE_SEO_ROUTES = [
  { path: "/", label: "Home", group: "Main" },
  { path: "/categories", label: "Categories", group: "Main" },
  { path: "/search", label: "Search", group: "Main", defaults: { robots: "noindex,follow" } },
  { path: "/cart", label: "Cart", group: "Main", defaults: { robots: "noindex,nofollow" } },

  { path: "/about", label: "About", group: "Content", defaults: { title: `About | ${STORE_NAME}` } },
  { path: "/contact", label: "Contact", group: "Content" },
  { path: "/professional-program", label: "Professional Program", group: "Content" },

  { path: "/privacy-policy", label: "Privacy Policy", group: "Legal" },
  { path: "/return-policy", label: "Return Policy", group: "Legal" },
  { path: "/shipping-policy", label: "Shipping Policy", group: "Legal" },

  { path: "/login", label: "Login", group: "Account", defaults: { robots: "noindex,nofollow" } },
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

  { path: "/subscribe", label: "Subscribe", group: "Utility", defaults: { robots: "noindex,follow" } },
  { path: "/unsubscribe", label: "Unsubscribe", group: "Utility", defaults: { robots: "noindex,follow" } },
  { path: "/payment_success", label: "Payment Success", group: "Utility", defaults: { robots: "noindex,nofollow" } },
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

  const title = stored.title || defaults.title;
  const description = stored.description || defaults.description;
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
