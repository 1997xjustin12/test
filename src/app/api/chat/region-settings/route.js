import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import {
  CHAT_REGION_TAG,
  CORE_COUNTRIES,
  EXTRA_COUNTRY,
  allowedCountries,
  isUsCaOnly,
  saveRegionSettings,
} from "@/app/lib/chat-region";

/**
 * GET  /api/chat/region-settings  -> current switch and the resulting list
 * PUT  /api/chat/region-settings  -> { usCaOnly: boolean }
 *
 * Replaces the CHAT_ALLOWED_COUNTRIES and CHAT_REGION_LOCK environment
 * variables. Those needed editing in three Vercel projects and a redeploy;
 * worse, the last time the restriction was lifted for a demo it was done with a
 * hardcoded return in the source, which then stayed in production for three
 * weeks. A switch that can be flipped back in one click is the point.
 *
 * The setting is global — one value for all three brands. See lib/chat-region.js.
 */
export const dynamic = "force-dynamic";

const fail = (error, status) =>
  NextResponse.json({ status: "error", error }, { status });

async function guard(request) {
  if (await isAuthorizedAdminRequest(request)) return null;
  return fail("Unauthorized", 401);
}

export async function GET(request) {
  const denied = await guard(request);
  if (denied) return denied;

  return NextResponse.json({
    status: "ok",
    usCaOnly: await isUsCaOnly(),
    countries: await allowedCountries(),
    core: CORE_COUNTRIES,
    extra: EXTRA_COUNTRY,
    // The switch only bites on production; local and preview stay open so the
    // team is not locked out of their own dev servers. Surfaced so the screen
    // can say so rather than implying it applies everywhere.
    enforcedHere: process.env.VERCEL_ENV === "production",
    shared: true,
  });
}

export async function PUT(request) {
  const denied = await guard(request);
  if (denied) return denied;

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Body must be JSON.", 400);
  }

  if (typeof body?.usCaOnly !== "boolean") {
    return fail("usCaOnly must be true or false.", 400);
  }

  try {
    const saved = await saveRegionSettings(body.usCaOnly);
    revalidateTag(CHAT_REGION_TAG);

    return NextResponse.json({
      status: "ok",
      ...saved,
      countries: await allowedCountries(),
      // The widget caches its availability check per browser session, so a
      // visitor who already loaded a page keeps the previous answer until they
      // open a new one. Said plainly here rather than left as a surprise.
      note: "Takes effect immediately. Visitors with a page already open keep the previous answer until their next session.",
    });
  } catch (error) {
    console.error("chat/region-settings: save failed:", error?.message || error);
    return fail("Couldn't save. The setting is unchanged.", 502);
  }
}
