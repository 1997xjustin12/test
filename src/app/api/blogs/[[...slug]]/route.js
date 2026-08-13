import { NextResponse } from "next/server";
import { STORE_ID } from "@/app/lib/store";
import { withRouteRateLimit } from "@/app/lib/rate-limit";
import {
  BLOG_ORDERING,
  DEFAULT_ORDERING,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  getBlog,
  getBlogs,
} from "@/app/lib/blogs";

/**
 * GET /api/blogs            — list, with ?category ?search ?page ?page_size ?ordering
 * GET /api/blogs/{slug}     — one post, with content
 *
 * One optional catch-all segment rather than two route files, because the two
 * cases differ only by whether a slug is present. Both delegate to lib/blogs.js
 * so this route and any server component render from the same code — the thing
 * that stops a listing page and its API disagreeing about what "latest" means.
 *
 * Note there is no `store` parameter. The brand comes from STORE_ID on the
 * server; accepting it from the query string would let ?store=solana on the BBQ
 * storefront return Solana's posts.
 */
export const dynamic = "force-dynamic";

async function handler(request, ctx) {
  const params = await ctx?.params;
  const segments = params?.slug ?? [];

  // /api/blogs/a/b is not a thing — only a bare list or a single slug.
  if (segments.length > 1) {
    return NextResponse.json(
      { error: true, message: "Not found." },
      { status: 404 },
    );
  }

  if (segments.length === 1) {
    const post = await getBlog(segments[0]);
    if (!post) {
      return NextResponse.json(
        { error: true, message: "Post not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ store: STORE_ID, post });
  }

  const sp = request.nextUrl.searchParams;
  const data = await getBlogs({
    category: sp.get("category") || undefined,
    search: sp.get("search") || undefined,
    page: sp.get("page") || undefined,
    // Accept both spellings: page_size matches the backend, pageSize is what a
    // JS caller reaches for first.
    pageSize: sp.get("page_size") || sp.get("pageSize") || undefined,
    ordering: sp.get("ordering") || undefined,
  });

  return NextResponse.json({
    store: STORE_ID,
    ...data,
    meta: {
      defaultPageSize: DEFAULT_PAGE_SIZE,
      maxPageSize: MAX_PAGE_SIZE,
      ordering: BLOG_ORDERING,
      defaultOrdering: DEFAULT_ORDERING,
    },
  });
}

export const GET = withRouteRateLimit(handler, "light");
