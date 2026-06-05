const DEFAULT_URL = "https://bbq-blog.onsitestorage.com";
import "@/app/search.css";
import Link from "next/link";
import { ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

import NewBlogsPage from "@/app/components/new-design/page/Blogs";
import BBQBlogsPage from "@/app/components/bbq-design/page/Blogs";

export async function generateMetadata() {
  const CATEGORY_ID = 2;
  const DEFAULT_BLOG_IMAGE = `https://bbq-spaces.sfo3.cdn.digitaloceanspaces.com/uploads/blog-default.png`;
  const DEFAULT_DESCRIPTION = `Read the latest blogs about ${STORE_NAME}.`;
  const res = await fetch(
    `${DEFAULT_URL}/index.php?rest_route=/wp/v2/posts&categories=${CATEGORY_ID}&per_page=1`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return {
      title: "Latest Blog Posts",
      description: DEFAULT_DESCRIPTION,
      openGraph: {
        title: "Latest Blog Posts",
        description: DEFAULT_DESCRIPTION,
        images: [DEFAULT_BLOG_IMAGE],
      },
      twitter: {
        title: "Latest Blog Posts",
        description: DEFAULT_DESCRIPTION,
        images: [DEFAULT_BLOG_IMAGE],
      },
    };
  }

  const posts = await res.json();
  const post = posts[0] || {};

  return {
    title: post.yoast_head_json?.title || "Latest Blog Posts",
    description: post.yoast_head_json?.description || DEFAULT_DESCRIPTION,
    openGraph: {
      title: post.yoast_head_json?.og_title || "Latest Blog Posts",
      description: post.yoast_head_json?.og_description || DEFAULT_DESCRIPTION,
      images: [post.yoast_head_json?.og_image?.[0]?.url || DEFAULT_BLOG_IMAGE],
      url: `${DEFAULT_URL}/blogs`,
    },
    twitter: {
      title: post.yoast_head_json?.twitter_title || "Latest Blog Posts",
      description:
        post.yoast_head_json?.twitter_description || DEFAULT_DESCRIPTION,
      images: [post.yoast_head_json?.twitter_image || DEFAULT_BLOG_IMAGE],
    },
  };
}

export default async function Blogs({ searchParams }) {
  const urlParams = await searchParams;
  const page = urlParams?.page || 1;
  const perPage = urlParams?.per_page || 12;
  const search = urlParams?.search;
  const CATEGORY_ID = 2;
  const DEFAULT_BLOG_IMAGE = `${DEFAULT_URL}/wp-content/uploads/2025/03/blog-default.png`;

  const res = await fetch(
    `${DEFAULT_URL}/index.php?rest_route=/wp/v2/posts&categories=${CATEGORY_ID}&page=${page}&per_page=${perPage}${
      search ? `&search=${search}` : ""
    }`,
    { cache: "no-store" },
  );

  if (!res.ok)
    return <p className="text-red-500 p-8">Error fetching blog posts.</p>;

  const posts = await res.json();
  const totalPages = res.headers.get("X-WP-TotalPages");

  const postsWithImages = await Promise.all(
    posts.map(async (post) => {
      let featuredImage = DEFAULT_BLOG_IMAGE;
      if (post.featured_media !== 0) {
        try {
          const mediaRes = await fetch(
            `${DEFAULT_URL}/wp-json/wp/v2/media/${post.featured_media}`,
          );
          if (mediaRes.ok) {
            const media = await mediaRes.json();
            featuredImage = media.source_url || DEFAULT_BLOG_IMAGE;
          }
        } catch {
          // fall through to default image
        }
      }
      return { ...post, featuredImage };
    }),
  );

  if (ISBBQ) {
    return (
      <BBQBlogsPage
        postsWithImages={postsWithImages}
        totalPages={totalPages}
        page={page}
      />
    );
  }

  return (
    <NewBlogsPage
      postsWithImages={postsWithImages}
      totalPages={totalPages}
      page={page}
    />
  );
}
