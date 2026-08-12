import { NextResponse } from "next/server";
import { getAdminUser, isDevBypass, requestHost } from "@/app/lib/admin-auth";

/**
 * Next.js request proxy (the Next 16 rename of "middleware").
 *
 * In addition to the existing cart/auth routing rules, this gates the store
 * admin (/admin) surface. Two credentials are accepted:
 *
 *   1. The signed admin cookie minted by /api/login for a username listed in
 *      ADMIN_USERNAMES. This is the normal way in — an operator signs in on the
 *      storefront and /admin simply works.
 *   2. A signed token in the query string, minted by the Django admin
 *      (app/stores/views.py::generate_token). Kept so the existing iframe entry
 *      point continues to work.
 *
 * Denials return 404, not 401 or 403. A 403 confirms there is something at
 * /admin worth finding; a 404 says nothing at all, and the difference costs us
 * nothing because anyone entitled to be here has a working way in.
 *
 * Unlike the previous version this is always on. It used to sit behind
 * ENABLE_ADMIN_TOKEN_GATE and was inert unless that was set to "true", which
 * meant production served the admin HTML to anyone who asked and relied on a
 * client-side component to hide it.
 */

const BACKEND_URL =
  process.env.NEXT_SOLANA_BACKEND_URL || "http://localhost:8000";

/**
 * Uniform denial. Self-contained rather than rewritten to a page, so a denied
 * request does not run any of the admin layout's data loading on its way to
 * being refused.
 */
function notFound() {
  return new NextResponse(
    "<!doctype html><title>404</title><h1>404</h1><p>This page could not be found.</p>",
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

/** True if the Django-minted token is currently valid. */
async function hasValidBackendToken(token) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/stores/validate-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && Boolean(data.valid);
  } catch {
    // Backend unreachable. Refuse rather than fall open.
    return false;
  }
}

/**
 * Returns a denial response if the request is not allowed, or null to continue.
 */
async function guardAdmin(request) {
  const { searchParams } = request.nextUrl;

  // Dev bypass on localhost, matching the previous behaviour here and in the
  // client-side validator this replaces. Never true on a deployed brand.
  if (isDevBypass(requestHost(request))) return null;

  if (await getAdminUser(request)) return null;

  const token = searchParams.get("token");
  if (token && (await hasValidBackendToken(token))) return null;

  return notFound();
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Admin/configurator access gate. Full-page loads carry the token in the
  // query string; in-app client navigations don't hit the proxy.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const denied = await guardAdmin(request);
    return denied ?? NextResponse.next();
  }

  const cart = JSON.parse(request.cookies.get("cart")?.value || "[]");
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true";

  if (pathname === "/checkout" && cart.length === 0) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Already logged in → block auth routes
  if (isLoggedIn && ["/login", "/register", "/reset-password", "/forgot-password"].includes(pathname)) {
    return NextResponse.redirect(new URL("/my-account", request.url));
  }

  // Not logged in → block private routes
  if (!isLoggedIn && (pathname.startsWith("/my-account") || pathname.startsWith("/logout"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout",
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password",
    "/my-account/:path*",
    "/logout/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
