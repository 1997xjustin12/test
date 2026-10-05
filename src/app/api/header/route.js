import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import { HEADER_TAG, getHeader, saveHeader, starterHeader } from "@/app/lib/site-layout/header";

/**
 * GET /api/header  -> this brand's header record, or a starter to edit
 * PUT /api/header  -> replace it
 *
 * Admin-only. Like the footer, this is on every page, so a save busts the whole
 * route cache rather than one path.
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const header = await getHeader();
  return NextResponse.json({ header: header.content ? header : starterHeader() });
}

export async function PUT(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a header record" }, { status: 400 });
  }

  const header = await saveHeader(body);
  revalidateTag(HEADER_TAG);
  revalidatePath("/", "layout");

  return NextResponse.json({ header });
}
