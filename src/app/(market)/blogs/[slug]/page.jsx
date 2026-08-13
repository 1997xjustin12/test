import { notFound } from "next/navigation";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { DEFAULT_BLOG_IMAGE, blogImage, getBlog, getBlogs } from "@/app/lib/blogs";

import NewBlogPost from "@/app/components/new-design/page/BlogPost";
import BBQBlogPost from "@/app/components/bbq-design/page/BlogPost";
import OKOBlogPost from "@/app/components/oko-design/page/BlogPost";

/**
 * Single blog post.
 *
 * Reads from the backend blogs API. The post carries its own `seo` object, so
 * metadata no longer has to be dug out of WordPress's yoast_head_json, and the
 * body arrives as `html` — note `content` is a structured object, not markup,
 * so it is the wrong field to render.
 *
 * Brand scoping is preserved: lib/blogs.js sends `store`, and the backend 404s
 * a slug belonging to another brand. Without that, a Solana article URL would
 * render on the BBQ storefront.
 */

const RELATED_COUNT = 5;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlog(slug);

  if (!post) return { title: "Blog Not Found" };

  const seo = post.seo || {};
  const title = seo.title || post.title || "Blog Post";
  const description = seo.description || post.excerpt || "";
  const image = seo.og_image?.trim() || blogImage(post);

  return {
    title,
    description,
    ...(seo.canonical_url ? { alternates: { canonical: seo.canonical_url } } : {}),
    openGraph: {
      title: seo.og_title || title,
      description: seo.og_description || description,
      images: [image],
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      title: seo.og_title || title,
      description: seo.og_description || description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  const post = await getBlog(slug);
  // A missing slug — or one belonging to another brand — is a genuine 404
  // rather than a page that renders "no content available" with a 200.
  if (!post) notFound();

  const { results } = await getBlogs({ pageSize: RELATED_COUNT + 1 });
  const otherPosts = results.filter((p) => p.slug !== post.slug).slice(0, RELATED_COUNT);

  const props = { post, featuredImage: blogImage(post), otherPosts };

  if (ISOKO) return <OKOBlogPost {...props} />;
  if (ISBBQ) return <BBQBlogPost {...props} />;
  return <NewBlogPost {...props} />;
}
