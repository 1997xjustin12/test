import { unstable_cache } from "next/cache";
import { STORE_ID } from "@/app/lib/store";

/**
 * Blog reads from the Django backend.
 *
 * One function covers every case the API supports — list, filter by category,
 * search, paginate, sort — because they are all the same request with
 * different query parameters. A separate helper per case would be four
 * near-identical fetches that drift apart the first time the contract changes.
 *
 *   getBlogs()                                  latest for this brand
 *   getBlogs({ category: "guides" })            filtered
 *   getBlogs({ search: "container" })           searched
 *   getBlogs({ page: 2, pageSize: 24 })         paginated
 *   getBlogs({ ordering: "title" })             sorted
 *   getBlog("some-slug")                        one post, with content
 *
 * `store` is deliberately NOT a parameter. Each deployment is exactly one
 * brand and already knows which via STORE_ID, so it is filled in here. Taking
 * it from the caller would mean a URL like ?store=solana on the BBQ storefront
 * returns Solana's posts — the same cross-brand leak documented in
 * docs/brand-isolation.md, but reachable by anyone who can edit a query string.
 */

const BASE = () => process.env.NEXT_SOLANA_BACKEND_URL;

/**
 * The blogs endpoint authenticates with the collections key, not the general
 * backend key — the latter returns 401 here. Verified against the live API.
 */
const API_KEY = () => process.env.NEXT_SOLANA_COLLECTIONS_KEY;

/** Backend default is 12, hard maximum 50. */
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

/**
 * Sort fields the backend accepts. An unrecognised value is *silently ignored*
 * server-side — it returns 200 in default order rather than complaining — so a
 * typo would look like it worked while quietly sorting by something else.
 * Validating here turns that into an obvious no-op we control.
 */
export const BLOG_ORDERING = [
  "published_at",
  "updated_at",
  "created_at",
  "title",
];

export const DEFAULT_ORDERING = "-published_at";

/** Cache tag, so the admin cache screen and /api/revalidate-all can bust these. */
export const BLOGS_TAG = "blogs";

/**
 * Stand-in for a post with no image. `featured_image` comes back as an empty
 * string rather than null when unset, which passes a truthiness check and then
 * renders as a broken <img>.
 */
export const DEFAULT_BLOG_IMAGE =
  "https://bbq-spaces.sfo3.cdn.digitaloceanspaces.com/uploads/blog-default.png";

/** The post's image, or the placeholder. */
export const blogImage = (post) =>
  (typeof post?.featured_image === "string" && post.featured_image.trim()) ||
  DEFAULT_BLOG_IMAGE;

const clampPageSize = (value) => {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, n));
};

const clampPage = (value) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
};

/** Accepts "title" or "-title"; anything else falls back to the default. */
function normalizeOrdering(value) {
  if (typeof value !== "string" || !value.trim()) return DEFAULT_ORDERING;
  const raw = value.trim();
  const field = raw.startsWith("-") ? raw.slice(1) : raw;
  return BLOG_ORDERING.includes(field) ? raw : DEFAULT_ORDERING;
}

/** Empty result in the backend's own envelope shape. */
const empty = (page, pageSize) => ({
  count: 0,
  next: null,
  previous: null,
  results: [],
  page,
  pageSize,
  totalPages: 0,
});

async function backendFetch(path) {
  const base = BASE();
  const key = API_KEY();
  if (!base || !key) {
    console.error("blogs: backend URL or collections key is not configured");
    return { ok: false, status: 503, data: null };
  }

  try {
    const res = await fetch(`${base}${path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Api-Key ${key}`,
      },
      // Freshness comes from unstable_cache at the call site, not from here —
      // a no-store fetch inside a route that sets `revalidate` is what silently
      // bailed several routes out of static rendering before (see
      // docs/agentic-ai-readiness.md).
      next: { revalidate: 3600, tags: [BLOGS_TAG] },
    });

    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data: await res.json() };
  } catch (error) {
    console.error("blogs: backend request failed:", error?.message || error);
    return { ok: false, status: 502, data: null };
  }
}

/**
 * A page of posts for this brand.
 *
 * Returns the backend envelope ({count, next, previous, results}) plus the
 * resolved page/pageSize/totalPages, which is what a paginator actually needs
 * and what every caller would otherwise recompute.
 *
 * Never throws. A blog listing that 500s the page because the backend hiccuped
 * is worse than one that renders empty — the rest of the storefront is fine.
 */
export async function getBlogs({
  category,
  search,
  page,
  pageSize,
  ordering,
} = {}) {
  const resolvedPage = clampPage(page);
  const resolvedPageSize = clampPageSize(pageSize);

  const params = new URLSearchParams({
    store: STORE_ID,
    page: String(resolvedPage),
    page_size: String(resolvedPageSize),
    ordering: normalizeOrdering(ordering),
  });
  if (category) params.set("category", String(category).trim());
  if (search) params.set("search", String(search).trim());

  const { ok, status, data } = await backendFetch(`/api/blogs/?${params}`);

  // A page past the end 404s rather than returning an empty list. That is a
  // normal thing for a visitor to hit by editing the URL, so it is an empty
  // page, not an error.
  if (!ok) {
    if (status !== 404) {
      console.error(`blogs: list request failed with ${status}`);
    }
    return empty(resolvedPage, resolvedPageSize);
  }

  const count = Number(data?.count) || 0;
  return {
    count,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    results: Array.isArray(data?.results) ? data.results : [],
    page: resolvedPage,
    pageSize: resolvedPageSize,
    totalPages: Math.ceil(count / resolvedPageSize),
  };
}

/**
 * One post by slug, including `content`, `html` and `seo`, which the list
 * endpoint does not return. Null when the slug does not exist or belongs to
 * another brand, so a caller can hand that straight to notFound().
 *
 * `store` is passed here too, not just on the list. The detail route honours it
 * and 404s a slug belonging to a different brand — without it a Solana article
 * URL would render on the BBQ storefront, which is exactly what the old
 * category filter existed to prevent.
 *
 * Note this has to be the backend's own filter rather than comparing
 * `store_domain` on the result: the post carries "https://solanafireplaces.com"
 * while that brand's env is "https://www.solanafireplaces.com", so a string
 * comparison would reject a legitimate post.
 */
export async function getBlog(slug) {
  if (!slug || typeof slug !== "string") return null;

  const { ok, status, data } = await backendFetch(
    `/api/blogs/${encodeURIComponent(slug.trim())}/?store=${encodeURIComponent(STORE_ID)}`,
  );

  if (!ok) {
    if (status !== 404) console.error(`blogs: detail request failed with ${status}`);
    return null;
  }
  return data ?? null;
}

/**
 * Cached variants for server components.
 *
 * Separate exports rather than a flag on getBlogs: unstable_cache keys on the
 * arguments, so wrapping a function that also takes a search string would cache
 * one entry per search term and quietly fill the cache with single-use records.
 * Search stays uncached for that reason.
 */
export const getCachedBlogs = unstable_cache(
  async (opts) => getBlogs(opts),
  ["blogs-list", STORE_ID],
  { revalidate: 3600, tags: [BLOGS_TAG] },
);

export const getCachedBlog = unstable_cache(
  async (slug) => getBlog(slug),
  ["blogs-detail", STORE_ID],
  { revalidate: 3600, tags: [BLOGS_TAG] },
);
