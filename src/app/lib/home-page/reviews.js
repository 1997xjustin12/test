import { unstable_cache } from "next/cache";
import { readOrDegrade } from "@/app/lib/upstream";

/**
 * Customer reviews for the homepage.
 *
 * The same source the existing homepage uses — the backend's /api/reviews/list,
 * which pages/api/reviews/list.js proxies for the browser. This reads it on the
 * server instead, so the section stays a server component: the existing one is
 * a client component behind a hook, which means the cards are assembled in the
 * browser after a round trip, and everything on the configured homepage is
 * built the other way round. See HeroSection for why that matters here.
 *
 * Only what the cards render survives this mapping. The upstream row carries
 * the reviewer's email address and id, and none of that belongs in the HTML of
 * a public page.
 *
 * Cached for an hour, not the page's full day: a new review should not have to
 * wait until tomorrow, and this is one request per instance per hour rather
 * than one per visitor.
 */

export const REVIEWS_TAG = "home-reviews";

/** Reviews worth showing: something written, and a name to put to it. */
const usable = (row) =>
  typeof row?.comment === "string" && row.comment.trim() && row?.user?.username;

const mapReview = (row) => ({
  id: row.id,
  name: String(row.user.username),
  rating: Math.max(0, Math.min(5, Math.round(Number(row.rating) || 0))),
  comment: row.comment.trim(),
  createdAt: typeof row.created_at === "string" ? row.created_at : null,
});

/** Throws on failure, so a bad moment upstream is never cached. */
const readReviews = unstable_cache(
  async () => {
    const base = process.env.NEXT_SOLANA_BACKEND_URL;
    if (!base) throw new Error("NEXT_SOLANA_BACKEND_URL is not set");

    const res = await fetch(`${base}/api/reviews/list?page=1`, {
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN ?? "",
      },
      // unstable_cache is what caches this; fetch caching on top would be a
      // second, differently-timed copy of the same answer.
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`reviews list responded ${res.status}`);

    const data = await res.json();
    return {
      reviews: (Array.isArray(data?.results) ? data.results : []).filter(usable).map(mapReview),
      averageRating: Number(data?.summary?.average_rating) || null,
      totalReviews: Number(data?.summary?.total_reviews) || null,
    };
  },
  ["home-page-reviews"],
  { revalidate: 3600, tags: [REVIEWS_TAG] },
);

/**
 * The reviews, or nothing.
 *
 * Degrading to an empty list renders no section at all, which is the right
 * failure: a reviews band with no reviews in it is worse than a homepage that
 * goes from one section to the next.
 */
export const getHomeReviews = () =>
  readOrDegrade("home-reviews", readReviews, { reviews: [], averageRating: null, totalReviews: null });
