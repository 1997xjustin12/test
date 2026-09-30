import { getBlogs, blogImage } from "@/app/lib/blogs";

/**
 * The posts the homepage blog section shows.
 *
 * Built on lib/blogs.js rather than beside it, so this section, /blogs and
 * /api/blogs all agree about what exists. That library already does the two
 * things that matter here: it scopes every read to this brand via STORE_ID —
 * so BBQ can never show Solana's articles — and it merges the backend with the
 * WordPress posts that have not been migrated yet. The existing homepage
 * section does neither; it renders a hardcoded array from
 * data/new-homepage.js, which is why its cards link to posts that may not
 * exist.
 *
 * Two modes, and the choice is the operator's:
 *
 *   slugs chosen   exactly those posts, in the order they were chosen
 *   none chosen    the latest, which keeps the homepage current by itself
 *
 * A chosen post that has since been unpublished simply drops out. Failing to
 * reach the backend gives an empty list, and the section then renders nothing
 * rather than an empty grid under a headline about the blog.
 */

/** How many posts to read when resolving a chosen set. */
const LOOKUP_PAGE_SIZE = 50;

/** A category name, whatever shape the backend gives it. */
function categoryName(category) {
  if (typeof category === "string") return category;
  return category?.name || category?.title || category?.slug || "";
}

const toCard = (post, fallbackTag) => ({
  slug: post.slug,
  title: post.title,
  image: blogImage(post),
  imageAlt: post.featured_image_alt || post.title || "",
  tag: categoryName((post.categories ?? [])[0]) || fallbackTag || "",
});

/**
 * @param {string[]} slugs   chosen posts, in order. Empty means "the latest".
 * @param {number}   count   how many to show when nothing is chosen.
 * @param {string}   fallbackTag  label for a post with no category of its own.
 */
export async function getSectionBlogs(slugs, count, fallbackTag) {
  const wanted = (Array.isArray(slugs) ? slugs : []).filter(Boolean);

  // Nothing chosen: the latest, and no more work than that.
  if (wanted.length === 0) {
    const { results } = await getBlogs({ pageSize: count });
    return results.slice(0, count).map((post) => toCard(post, fallbackTag));
  }

  // Chosen: one read, then picked out by slug. Asking the backend for each
  // slug separately would be one request per card for a page that is cached
  // anyway, and would not preserve the chosen order without this step.
  const { results } = await getBlogs({ pageSize: LOOKUP_PAGE_SIZE });
  const bySlug = new Map(results.map((post) => [post.slug, post]));

  return wanted
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .map((post) => toCard(post, fallbackTag));
}

/** The posts an admin can choose from, trimmed to what the picker shows. */
export async function listBlogChoices() {
  const { results } = await getBlogs({ pageSize: LOOKUP_PAGE_SIZE });
  return results.map((post) => ({
    slug: post.slug,
    title: post.title,
    publishedAt: post.published_at ?? null,
  }));
}
