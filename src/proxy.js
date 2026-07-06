import { NextResponse } from "next/server";

/**
 * Next.js request proxy (the Next 16 rename of "middleware").
 *
 * In addition to the existing cart/auth routing rules, this gates the store
 * admin (/admin) surface. Previously /admin was reachable only through Django's
 * server-side proxy, which injected a secret X-Admin-Proxy header that an nginx
 * edge rule checked. The direct-iframe approach instead loads /admin straight
 * from this origin and authorizes access with the same signed token the Django
 * admin already mints (see app/stores/views.py::generate_token).
 *
 * The admin gate is inert by default: it only enforces when
 * ENABLE_ADMIN_TOKEN_GATE === "true", so this can ship ahead of the cut-over
 * without changing behavior. Flip the env var once the edge secret-header rule
 * is relaxed.
 */

const BACKEND_URL =
  process.env.NEXT_SOLANA_BACKEND_URL || "http://localhost:8000";
const ADMIN_GATE_ENABLED = process.env.ENABLE_ADMIN_TOKEN_GATE === "true";

function deny(status, message) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain" },
  });
}

/**
 * Returns a denial response if the request is not allowed, or null to continue.
 */
async function guardAdmin(request) {
  if (!ADMIN_GATE_ENABLED) return null;

  const { searchParams, hostname } = request.nextUrl;

  // Dev bypass on localhost (mirrors useTokenValidation's existing behavior)
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;

  const token = searchParams.get("token");
  if (!token) return deny(401, "Missing access token");

  try {
    const res = await fetch(`${BACKEND_URL}/api/stores/validate-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.valid) {
      return deny(403, "Invalid or expired access token");
    }
  } catch {
    return deny(502, "Unable to validate access token");
  }

  return null;
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
