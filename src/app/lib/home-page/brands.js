import { unstable_cache } from "next/cache";
import { keys, redis } from "@/app/lib/redis";
import { isNavVisible, brandLogoPath } from "@/app/lib/helpers";
import { getCatalogExclusions } from "@/app/lib/catalog-exclusions";
import { readOrDegrade } from "@/app/lib/upstream";

/**
 * The brands the homepage carousel shows.
 *
 * Same source as /brands: the "brands" node of the Redis menu. There is no
 * separate list to keep in step — a brand added to the menu appears here, and
 * one hidden from the menu disappears from both. Its logo is the file
 * public/images/brand-logo/<slug>.webp, matched by brandLogoPath(), so adding a
 * brand to the strip is a matter of dropping a file in and rebuilding.
 *
 * Three filters, each for its own reason:
 *
 *   nav_visibility   an operator hid it from the menu builder
 *   exclude_brands   suppressed catalogue-wide, so its page renders empty —
 *                    the same correction /[slug] applies to the /brands list
 *   no logo file     this section is logos; a brand with none would be a gap.
 *                    Four of the 42 have no file today (Sunstone, Dynaque,
 *                    Premier Design, Solana Outdoor Products).
 *
 * Every item links to a page that exists, because the menu is what defines
 * which listing pages exist in the first place.
 */

/** The node holding the brand list, wherever it sits in the tree. */
function findBrandsNode(items = []) {
  for (const item of items) {
    if (String(item?.url).toLowerCase() === "brands") return item;
    const found = findBrandsNode(item?.children);
    if (found) return found;
  }
  return null;
}

/**
 * Cached for a day under the same "nav-menu" tag as every other menu read, so
 * saving the menu refreshes the strip with it. Throws rather than returning an
 * empty list when Redis is unreachable — a failed read must not be what gets
 * cached for the next 24 hours. See lib/upstream.js.
 */
const readBrandLogos = unstable_cache(
  async () => {
    const stored = await redis.get(keys.dev_shopify_menu.value);
    const menu = typeof stored === "string" ? JSON.parse(stored) : stored;
    if (!Array.isArray(menu)) throw new Error("menu is not a list");

    const node = findBrandsNode(menu);
    return (node?.children ?? [])
      .filter((child) => child?.url && child?.name && isNavVisible(child))
      .map((child) => ({
        name: child.name,
        originName: child.origin_name ?? child.name,
        href: `/${child.url}`,
        logo: brandLogoPath(child.url),
      }))
      .filter((brand) => brand.logo);
  },
  ["home-page-brand-logos"],
  { revalidate: 86400, tags: ["nav-menu"] },
);

/**
 * The strip's brands, or the best answer available.
 *
 * The exclusion list is read outside the cache on purpose: it has its own cache
 * and its own tag, and folding it in here would mean un-excluding a brand left
 * it on the homepage until the menu tag happened to be busted.
 *
 * An empty list is a legitimate answer — a cold instance during a Redis outage
 * has nothing to show — and the section renders nothing rather than an empty
 * band.
 */
export async function getCarouselBrands() {
  const [brands, exclusions] = await Promise.all([
    readOrDegrade("home-page-brand-logos", readBrandLogos, []),
    getCatalogExclusions(),
  ]);

  const excluded = exclusions?.brands ?? [];
  return brands.filter(
    (brand) => !excluded.includes(brand.originName) && !excluded.includes(brand.name),
  );
}
