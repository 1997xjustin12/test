import { NextResponse } from "next/server";
import { getAdminUser } from "@/app/lib/admin-auth";

/**
 * GET /api/admin-session -> { admin: boolean }
 *
 * Whether the caller's own session may use /admin. The admin cookie is
 * httpOnly and signed, so the browser cannot read it and the client has no way
 * to know on its own — this is how the storefront decides whether to offer the
 * link.
 *
 * Open to anyone, because it only ever reports on the cookie the caller already
 * holds: a visitor without one is told false, which they knew. It grants
 * nothing either way — /admin is guarded by the proxy, which checks the same
 * cookie against the same allowlist, so a forged answer here would buy a link
 * that leads to a 404.
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  return NextResponse.json({ admin: Boolean(await getAdminUser(request)) });
}
