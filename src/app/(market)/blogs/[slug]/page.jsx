const DEFAULT_URL = "https://bbq-blog.onsitestorage.com";

import { ISBBQ } from "@/app/lib/helpers";
import NewBlogPost from "@/app/components/new-design/page/BlogPost";
import BBQBlogPost from "@/app/components/bbq-design/page/BlogPost";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const DEFAULT_BLOG_IMAGE = `https://bbq-spaces.sfo3.digitaloceanspaces.com/uploads/blog-default.png`;

  const res = await fetch(
    `${DEFAULT_URL}/index.php?rest_route=/wp/v2/posts&slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return { title: "Blog Not Found" };

  const posts = await res.json();
  const post = posts[0] || {};

  return {
    title: post.yoast_head_json?.title || post.title?.rendered || "Blog Post",
    description:
      post.yoast_head_json?.description ||
      post.excerpt?.rendered?.replace(/<[^>]*>?/gm, "").substring(0, 150),
    openGraph: {
      title: post.yoast_head_json?.og_title || post.title?.rendered || "Blog Post",
      description:
        post.yoast_head_json?.og_description ||
        post.excerpt?.rendered?.replace(/<[^>]*>?/gm, "").substring(0, 150),
      images: [post.yoast_head_json?.og_image?.[0]?.url || DEFAULT_BLOG_IMAGE],
      url: `${DEFAULT_URL}/blogs/${post.slug}`,
    },
    twitter: {
      title: post.yoast_head_json?.twitter_title || post.title?.rendered || "Blog Post",
      description:
        post.yoast_head_json?.twitter_description ||
        post.excerpt?.rendered?.replace(/<[^>]*>?/gm, "").substring(0, 150),
      images: [post.yoast_head_json?.twitter_image || DEFAULT_BLOG_IMAGE],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const CATEGORY_ID = 2;
  const PER_PAGE = 5;
  const DEFAULT_BLOG_IMAGE = `${DEFAULT_URL}/wp-content/uploads/2025/03/blog-default.png`;

  const res = await fetch(
    `${DEFAULT_URL}/index.php?rest_route=/wp/v2/posts&slug=${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return <p className="text-red-500 p-8">Post not found.</p>;

  const posts = await res.json();
  const post = posts[0];

  if (!post) return <p className="text-gray-500 p-8">No content available.</p>;

  let featuredImage = DEFAULT_BLOG_IMAGE;
  if (post.featured_media !== 0) {
    const mediaRes = await fetch(
      `${DEFAULT_URL}/wp-json/wp/v2/media/${post.featured_media}`
    );
    if (mediaRes.ok) {
      const media = await mediaRes.json();
      featuredImage = media.source_url || DEFAULT_BLOG_IMAGE;
    }
  }

  const otherPostsRes = await fetch(
    `${DEFAULT_URL}/index.php?rest_route=/wp/v2/posts&categories=${CATEGORY_ID}&per_page=${PER_PAGE}`,
    { cache: "no-store" }
  );

  let otherPosts = await otherPostsRes.json();
  otherPosts = otherPosts.filter((p) => p.id !== post.id);

  const otherPostsWithImages = await Promise.all(
    otherPosts.map(async (otherPost) => {
      let imageUrl = DEFAULT_BLOG_IMAGE;
      if (otherPost.featured_media !== 0) {
        const mediaRes = await fetch(
          `${DEFAULT_URL}/wp-json/wp/v2/media/${otherPost.featured_media}`
        );
        if (mediaRes.ok) {
          const media = await mediaRes.json();
          imageUrl = media.source_url || DEFAULT_BLOG_IMAGE;
        }
      }
      return { ...otherPost, imageUrl };
    })
  );

  if (ISBBQ) {
    return (
      <BBQBlogPost
        post={post}
        featuredImage={featuredImage}
        otherPostsWithImages={otherPostsWithImages}
      />
    );
  }

  return (
    <NewBlogPost
      post={post}
      featuredImage={featuredImage}
      otherPostsWithImages={otherPostsWithImages}
    />
  );
}
