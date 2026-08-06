import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Busts the cached `page_seo` read so admin edits show on the storefront
// immediately instead of waiting out the 24h TTL.
//
// Called by the Page SEO admin screen right after a successful save.
export async function POST() {
  revalidateTag("page-seo");
  return NextResponse.json({ revalidated: true, tags: ["page-seo"] });
}
