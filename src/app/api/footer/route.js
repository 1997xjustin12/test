import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import { FOOTER_TAG, getFooter, saveFooter, starterFooter } from "@/app/lib/site-layout/footer";

/**
 * GET /api/footer  -> this brand's footer record, or a starter to edit
 * PUT /api/footer  -> replace it
 *
 * Admin-only, like the rest of the admin API.
 *
 * The footer is on every page, so a save busts the whole route cache rather
 * than one path. Changing a footer link and finding it changed on the homepage
 * but not on a product page would be worse than the rebuild costs.
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const footer = await getFooter();
  // A brand that has never configured one gets something to edit rather than
  // an empty form it has to fill from nothing.
  return NextResponse.json({ footer: footer.content ? footer : starterFooter() });
}

export async function PUT(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a footer record" }, { status: 400 });
  }

  const footer = await saveFooter(body);
  revalidateTag(FOOTER_TAG);
  revalidatePath("/", "layout");

  return NextResponse.json({ footer });
}
