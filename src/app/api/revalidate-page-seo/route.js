import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";

// Busts the cached `page_seo` read so admin edits show on the storefront
// immediately instead of waiting out the 24h TTL.
//
// Called by the Page SEO admin screen right after a successful save. Gated:
// cache busting is cheap to request and expensive to serve, so an open endpoint
// is a way to make every page miss on demand.
export async function POST(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("page-seo");
  return NextResponse.json({ revalidated: true, tags: ["page-seo"] });
}
