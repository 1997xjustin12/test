import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
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
    "/logout/:path*"
  ],
};
