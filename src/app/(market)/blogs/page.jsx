import "@/app/search.css";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";
import { DEFAULT_BLOG_IMAGE, getBlogs } from "@/app/lib/blogs";

import NewBlogsPage from "@/app/components/new-design/page/Blogs";
import BBQBlogsPage from "@/app/components/bbq-design/page/Blogs";
import OKOBlogsPage from "@/app/components/oko-design/page/Blogs";

/**
 * Blog index.
 *
 * Reads from the backend blogs API via lib/blogs.js. This previously talked to
 * WordPress directly — resolving a category id, fetching /wp/v2/posts, then
 * issuing a further request per post to turn featured_media into a URL. That
 * last part meant a 12-post page cost 13 round trips; the new endpoint returns
 * the image URL inline.
 *
 * Brand scoping is no longer this page's problem either: lib/blogs.js fills in
 * `store` from STORE_ID, where before it depended on resolving the right
 * WordPress category per brand.
 */

const DEFAULT_DESCRIPTION = `Read the latest blogs about ${STORE_NAME}.`;

export async function generateMetadata() {
  // Metadata comes from the newest post, as it did before — but from one
  // request that is already cached for the page render below.
  const { results } = await getBlogs({ pageSize: 1 });
  const post = results[0];

  const title = post?.title
    ? `Latest Blog Posts | ${STORE_NAME}`
    : "Latest Blog Posts";
  const description = post?.excerpt?.trim() || DEFAULT_DESCRIPTION;
  const image = post?.featured_image?.trim() || DEFAULT_BLOG_IMAGE;

  return {
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: { title, description, images: [image] },
  };
}

export default async function Blogs({ searchParams }) {
  const urlParams = await searchParams;

  const { results, totalPages, page } = await getBlogs({
    page: urlParams?.page,
    // per_page is kept as an accepted alias so existing links and bookmarks
    // built against the WordPress-era URLs keep working.
    pageSize: urlParams?.page_size || urlParams?.per_page,
    search: urlParams?.search,
    category: urlParams?.category,
    ordering: urlParams?.ordering,
  });

  const props = { posts: results, totalPages, page };

  if (ISOKO) return <OKOBlogsPage {...props} />;
  if (ISBBQ) return <BBQBlogsPage {...props} />;
  return <NewBlogsPage {...props} />;
}
