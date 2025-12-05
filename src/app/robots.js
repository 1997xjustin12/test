export default function robots() {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL || "https://yourdomain.com";

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
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
