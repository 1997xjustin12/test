import { unstable_cache } from "next/cache";
import { ISBBQ } from "@/app/lib/helpers";

/**
 * Shared WordPress blog config.
 *
 * Both storefronts read from the same WordPress install, and until now both
 * also read the same hardcoded `categories=2` — which is the *solana*
 * category. That meant BBQ shoppers were served fireplace articles: the two
 * sites differed only in which component rendered the results, not in the
 * content. Filtering per brand is what actually separates them.
 *
 * WP's /wp/v2/posts endpoint filters by category ID, not slug, so the slug is
 * resolved to an ID once and cached. Resolving by slug rather than hardcoding
 * the ID means the mapping survives someone recreating a category in WP.
 */
export const BLOG_BASE_URL = "https://bbq-blog.onsitestorage.com";

/** Category slug this storefront's blog is filtered to. */
export const BLOG_CATEGORY_SLUG = ISBBQ ? "bbq" : "solana";

/**
 * Fallback IDs, used only if the categories endpoint is unreachable.
 * Verified against the live WP install on 2026-07-23:
 *   solana -> 2 (50 posts) · bbq -> 4 (0 posts) · uncategorized -> 1
 */
const FALLBACK_CATEGORY_IDS = { solana: 2, bbq: 4 };

async function _resolveBlogCategoryId(slug) {
  try {
    const res = await fetch(
      `${BLOG_BASE_URL}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}&_fields=id,slug`,
    );
    if (!res.ok) throw new Error(`WP categories responded ${res.status}`);
    const cats = await res.json();
    const id = cats?.find((c) => c.slug === slug)?.id;
    if (id) return id;
    console.warn(`[blog] No WP category found for slug "${slug}"`);
  } catch (err) {
    console.warn("[blog] Category slug lookup failed:", err?.message);
  }
  return FALLBACK_CATEGORY_IDS[slug] ?? null;
}

/**
 * Resolves this brand's blog category ID. Cached for a day — category IDs
 * effectively never change, and this sits in front of every /blogs render.
 */
export const getBlogCategoryId = unstable_cache(
  () => _resolveBlogCategoryId(BLOG_CATEGORY_SLUG),
  [`blog-category-${BLOG_CATEGORY_SLUG}`],
  { tags: ["blog-category"], revalidate: 86400 },
);
