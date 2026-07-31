export default function robots() {
  // No placeholder fallback: pointing crawlers at a sitemap on a domain we do
  // not own is worse than omitting the directive, so an unset base URL simply
  // drops the Sitemap line. See the matching guard in sitemap.js.
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/dev/*",
          "/checkout/*",
          "/my-account/*",
          "/login",
          "/register",
          "/logout",
          "/forgot-password",
          "/reset-password/*",
          "/cart",
          "/payment_success",
          "/subscribe",
          "/unsubscribe",
        ],
      },
    ],
    ...(BASE_URL ? { sitemap: `${BASE_URL}/sitemap.xml` } : {}),
  };
}
