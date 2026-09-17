import { unstable_cache } from "next/cache";
import { keys, redis } from "@/app/lib/redis";
import { isNavVisible } from "@/app/lib/helpers";

/**
 * URLs of every visible menu page — exactly the listing pages /[slug] serves.
 *
 * A brand has a page only if the menu has one for it. The catalogue knows
 * nothing about the menu, so a brand can exist in Elasticsearch with no page
 * (OutdoorKitchenOutlet, Handles, …), and anything that builds /{brand-slug}
 * from product data alone links to a 404. Ask this instead.
 *
 * Cached for a day and tagged with the same "nav-menu" tag as /[slug]'s menu
 * read, so a menu change busts both. Throws if the menu cannot be read, so the
 * failure is never cached — callers decide what "unknown" means for them.
 */
export const getMenuPageUrls = unstable_cache(
  async () => {
    const stored = await redis.get(keys.dev_shopify_menu.value);
    const menu = typeof stored === "string" ? JSON.parse(stored) : stored;
    if (!Array.isArray(menu)) throw new Error("menu is not a list");

    const urls = new Set();
    const walk = (items = []) => {
      for (const item of items) {
        if (typeof item?.url === "string" && item.url && isNavVisible(item)) urls.add(item.url);
        walk(item?.children);
      }
    };
    walk(menu);
    return [...urls];
  },
  ["nav-menu-page-urls"],
  { revalidate: 86400, tags: ["nav-menu"] },
);
