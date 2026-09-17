import { unstable_cache } from "next/cache";
import he from "he";
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
 * docs/reference/brand-isolation.md, but reachable by anyone who can edit a query string.
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
      // docs/agentic-ai/agentic-ai-readiness.md).
      next: { revalidate: 3600, tags: [BLOGS_TAG] },
    });

    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data: await res.json() };
  } catch (error) {
    console.error("blogs: backend request failed:", error?.message || error);
    return { ok: false, status: 502, data: null };
  }
}

// ─── WordPress fallback ──────────────────────────────────────────────────────

/**
 * Posts still in WordPress, served until they are migrated to the backend.
 *
 * c9de7bb (13 Aug 2026) moved the blog to the backend API, but the posts did
 * not move with it: the backend holds one Solana post (`test-blog`) while
 * WordPress still has all 50 published. Every older article URL — including
 * the two the September SEO audit tied to 49,500 and 33,100 monthly searches —
 * has returned 404 since.
 *
 * The backend stays the source of truth and WordPress fills the gaps: a slug
 * the backend does not have is looked up in WordPress, and the listing merges
 * both, with the backend winning any slug present in both. Migrating a post
 * therefore needs no change here — it simply stops coming from WordPress. Once
 * WordPress holds nothing the backend lacks, this section can be deleted.
 *
 * Posts are mapped to the backend's shape, so no page or component can tell
 * where one came from.
 */
const WORDPRESS_API = "https://bbq-blog.onsitestorage.com/wp-json/wp/v2";

/**
 * The WordPress category each brand's posts live in. OKO never had its own and
 * shared BBQ's, which holds no posts — so in practice only Solana falls back.
 */
const WORDPRESS_CATEGORY_SLUG = { solana: "solana", bbq: "bbq", oko: "bbq" };

/** Used only when the categories endpoint is unreachable. Verified 17 Sep 2026. */
const WORDPRESS_FALLBACK_CATEGORY_IDS = { solana: 2, bbq: 4 };

/** WordPress's per-request maximum; covers all 50 posts in one call. */
const WORDPRESS_PAGE_SIZE = 100;

/** How many backend posts the merged listing reads before combining. */
const BACKEND_MERGE_LIMIT = 200;

async function wordpressFetch(path) {
  try {
    const res = await fetch(`${WORDPRESS_API}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: [BLOGS_TAG] },
    });
    if (!res.ok) {
      console.error(`blogs: WordPress responded ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("blogs: WordPress request failed:", error?.message || error);
    return null;
  }
}

/**
 * This brand's WordPress category id, or null. Null means "no WordPress posts
 * for this brand" — never "all posts", which would show one brand's articles
 * on another brand's storefront.
 */
async function wordpressCategoryId() {
  const slug = WORDPRESS_CATEGORY_SLUG[STORE_ID];
  if (!slug) return null;
  const categories = await wordpressFetch(
    `/categories?slug=${encodeURIComponent(slug)}&_fields=id,slug`,
  );
  const id = Array.isArray(categories)
    ? categories.find((category) => category.slug === slug)?.id
    : null;
  return id ?? WORDPRESS_FALLBACK_CATEGORY_IDS[slug] ?? null;
}

/** WordPress GMT timestamps carry no zone suffix. */
const gmtToIso = (gmt) => (gmt ? `${gmt}Z` : null);

/** Rendered WordPress HTML to plain text, without the trailing "[…]". */
const plainText = (html) =>
  he
    .decode(String(html || "").replace(/<[^>]*>/g, ""))
    .replace(/\s*\[…\]\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();

const decoded = (value) => (value ? he.decode(String(value)) : "");

/**
 * A WordPress post in the backend's shape.
 *
 * Two Yoast fields are deliberately dropped. `robots` is `noindex` on every
 * post — the WordPress install is a content source, not a public site — and
 * copying it would de-index the pages this fallback exists to bring back.
 * `canonical` would point search engines at the WordPress domain.
 */
function fromWordpress(post) {
  const yoast = post?.yoast_head_json || {};
  const title = decoded(post?.title?.rendered);
  const excerpt = plainText(post?.excerpt?.rendered);
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  return {
    id: `wp-${post.id}`,
    title,
    slug: post.slug,
    excerpt,
    featured_image: media?.source_url || "",
    featured_image_alt: media?.alt_text || title,
    categories: [],
    author_name: "",
    store_domain: null,
    published_at: gmtToIso(post.date_gmt),
    updated_at: gmtToIso(post.modified_gmt),
    html: post?.content?.rendered || "",
    seo: {
      title: decoded(yoast.title) || title,
      description: decoded(yoast.description) || excerpt,
      canonical_url: "",
      og_title: decoded(yoast.og_title),
      og_description: decoded(yoast.og_description),
      og_image: yoast.og_image?.[0]?.url || "",
    },
    source: "wordpress",
  };
}

async function getWordpressPosts({ search } = {}) {
  const categoryId = await wordpressCategoryId();
  if (!categoryId) return [];

  const params = new URLSearchParams({
    categories: String(categoryId),
    per_page: String(WORDPRESS_PAGE_SIZE),
    _embed: "wp:featuredmedia",
    // No `content`: the listing never renders bodies, and they are most of the payload.
    _fields: "id,slug,title,excerpt,date_gmt,modified_gmt,yoast_head_json,_links,_embedded",
  });
  if (search) params.set("search", String(search).trim());

  const posts = await wordpressFetch(`/posts?${params}`);
  return Array.isArray(posts) ? posts.map(fromWordpress) : [];
}

async function getWordpressPost(slug) {
  const categoryId = await wordpressCategoryId();
  if (!categoryId) return null;

  const params = new URLSearchParams({
    slug,
    categories: String(categoryId),
    _embed: "wp:featuredmedia",
  });
  const posts = await wordpressFetch(`/posts?${params}`);
  return Array.isArray(posts) && posts[0] ? fromWordpress(posts[0]) : null;
}

// ─── Merged listing ──────────────────────────────────────────────────────────

/** Every backend post for this brand, up to BACKEND_MERGE_LIMIT. */
async function getAllBackendPosts({ search, ordering }) {
  const posts = [];
  for (let page = 1; posts.length < BACKEND_MERGE_LIMIT; page += 1) {
    const params = new URLSearchParams({
      store: STORE_ID,
      page: String(page),
      page_size: String(MAX_PAGE_SIZE),
      ordering: normalizeOrdering(ordering),
    });
    if (search) params.set("search", String(search).trim());

    const { ok, status, data } = await backendFetch(`/api/blogs/?${params}`);
    if (!ok) {
      if (status !== 404) console.error(`blogs: list request failed with ${status}`);
      break;
    }
    const results = Array.isArray(data?.results) ? data.results : [];
    posts.push(...results);
    if (!data?.next || results.length === 0) break;
  }
  return posts;
}

/**
 * The backend's ordering applied to the merged list. The backend does not
 * return `created_at`, so it sorts as `published_at`.
 */
function sortPosts(posts, ordering) {
  const raw = normalizeOrdering(ordering);
  const descending = raw.startsWith("-");
  const field = descending ? raw.slice(1) : raw;

  const key = (post) =>
    field === "title"
      ? String(post.title || "").toLowerCase()
      : Date.parse(post[field === "created_at" ? "published_at" : field] || post.published_at) || 0;

  return [...posts].sort((a, b) => {
    const [x, y] = [key(a), key(b)];
    const order = x < y ? -1 : x > y ? 1 : 0;
    return descending ? -order : order;
  });
}

/**
 * Every post for this brand, from both sources, in `ordering` order. Also what
 * the sitemap lists.
 */
export async function getAllBlogPosts({ search, ordering } = {}) {
  const [backend, wordpress] = await Promise.all([
    getAllBackendPosts({ search, ordering }),
    getWordpressPosts({ search }),
  ]);
  const inBackend = new Set(backend.map((post) => post.slug));
  return sortPosts(
    [...backend, ...wordpress.filter((post) => !inBackend.has(post.slug))],
    ordering,
  );
}

/**
 * A page of posts for this brand.
 *
 * Returns the backend envelope ({count, next, previous, results}) plus the
 * resolved page/pageSize/totalPages, which is what a paginator actually needs
 * and what every caller would otherwise recompute.
 *
 * Unfiltered and searched listings merge the backend with the WordPress
 * fallback, so `next`/`previous` are page numbers rather than backend URLs. A
 * category filter reads the backend alone: WordPress categories are per brand,
 * not per topic, so they have nothing to match.
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

  if (!category) {
    const posts = await getAllBlogPosts({ search, ordering });
    const count = posts.length;
    const totalPages = Math.ceil(count / resolvedPageSize);
    const start = (resolvedPage - 1) * resolvedPageSize;
    return {
      count,
      next: resolvedPage < totalPages ? resolvedPage + 1 : null,
      previous: resolvedPage > 1 && resolvedPage <= totalPages ? resolvedPage - 1 : null,
      results: posts.slice(start, start + resolvedPageSize),
      page: resolvedPage,
      pageSize: resolvedPageSize,
      totalPages,
    };
  }

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

  if (ok && data) return data;
  if (!ok && status !== 404) console.error(`blogs: detail request failed with ${status}`);

  // Not in the backend (yet): serve it from WordPress, scoped to this brand.
  return getWordpressPost(slug.trim());
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
