import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import { getHomePage, saveHomePage, HOME_PAGE_TAG } from "@/app/lib/home-page/store";
import { SECTION_TYPES } from "@/app/lib/home-page/sections";

/**
 * GET  /api/home-page  -> this brand's configured homepage
 * PUT  /api/home-page  -> replace it
 *
 * Admin-only, like the rest of the admin API. The record is store-scoped, so a
 * save from one brand's admin changes only that brand's homepage.
 */
export const dynamic = "force-dynamic";

const fail = (error, status) => NextResponse.json({ status: "error", error }, { status });

async function guard(request) {
  if (await isAuthorizedAdminRequest(request)) return null;
  return fail("Unauthorized", 401);
}

export async function GET(request) {
  const denied = await guard(request);
  if (denied) return denied;

  return NextResponse.json({
    status: "ok",
    homePage: await getHomePage(),
    // The editor builds its forms from this, so the schema is never duplicated
    // in the admin bundle.
    schema: SECTION_TYPES,
  });
}

export async function PUT(request) {
  const denied = await guard(request);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Body must be JSON", 400);
  }

  if (!Array.isArray(body?.sections)) return fail("sections must be a list", 400);

  // saveHomePage normalises every section against its schema, so an unknown
  // type or a colour that is not a colour never reaches the storefront.
  const saved = await saveHomePage({ enabled: body.enabled, sections: body.sections });

  // The homepage is prerendered with a day's revalidate: without this the
  // operator saves, looks at the site, and sees yesterday's page.
  revalidateTag(HOME_PAGE_TAG);
  revalidatePath("/");

  return NextResponse.json({ status: "ok", homePage: saved });
}
