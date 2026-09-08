// next.config.ts
import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  analyzerMode: "static",
  openAnalyzer: false,
});

// 1. Define all necessary external hostnames once
const imageDomains = [
  "cdn11.bigcommerce.com",
  "onsite-cdn.sfo3.cdn.digitaloceanspaces.com",
  "bbq-spaces.sfo3.digitaloceanspaces.com",
  "cdn.shopify.com",
  "bbq-spaces.sfo3.cdn.digitaloceanspaces.com",
];

// 2. Define all external hosts your application fetches/connects to (client-side)
//
// The Solana backend and Elasticsearch entries are belt-and-braces: both are
// reached only from server code (NEXT_SOLANA_BACKEND_URL and NEXT_ES_URL carry
// no NEXT_PUBLIC_ prefix, so the browser never sees them and connect-src does
// not apply). They are kept, and kept current, so that a future client-side
// call is not blocked by a stale allowlist.
const connectDomains = [
  "https://be-admin.solanabbqgrills.com", // Solana backend
  "https://*.zoho.com", // Zoho SalesIQ
  "https://*.zohopublic.com", // Zoho SalesIQ (EU/IN/AU)
  "https://*.zohocdn.com", // Zoho SalesIQ CDN
  "wss://*.zoho.com", // Zoho SalesIQ WebSocket
  "wss://*.zohopublic.com", // Zoho SalesIQ WebSocket
  "https://loyal-sloth-59774.upstash.io",
  "https://api.iconify.design", // icons
  "https://r2.leadsy.ai", // Required for the new script
  "https://wvbknd.leadsy.ai",
  "https://api.iconify.design",
  "https://tag.trovo-tag.com",
  "https://api.zippopotam.us",
  "https://payments.sandbox.braintree-api.com",
  "https://gateway-sand.sandbox.braintree-api.com",
  "https://origin-analytics-sand.sandbox.braintree-api.com",
  "https://assets.braintreegateway.com",
  "https://www.paypal.com",
  "https://www.google.com", // reCAPTCHA
  "https://www.gstatic.com", // reCAPTCHA
  "https://elasticsearch.solanabbqgrills.com", // ES
];

const styleSrcDomains = ["https://assets.braintreegateway.com", "https://*.zohocdn.com"];

// Origins allowed to embed this app in an iframe.
//
// This used to be opt-in: unset meant no frame-ancestors directive at all, so
// embedding stayed open to anyone. That was for the Django admin's store-page
// configurator, which is no longer in use (confirmed 8 Sep 2026), and secsuite
// run 41 flagged the open default as a clickjacking risk.
//
// The default is now 'none' — nothing may frame the storefront. Setting
//   _NEXT_ADMIN_FRAME_ANCESTORS="https://be-admin.solanabbqgrills.com"
// reopens it to 'self' plus those origins, should an embedding integration
// ever come back.
//
// Note this constrains who may frame *us*. Embedding others — Braintree's
// payment fields, brand videos — is frame-src, which is untouched.
const adminFrameAncestors = (process.env._NEXT_ADMIN_FRAME_ANCESTORS || "")
  .split(/\s+/)
  .filter(Boolean);

/** True when embedding is deliberately reopened; drives both CSP and X-Frame-Options. */
const framingAllowed = adminFrameAncestors.length > 0;

const frameSrcDomains = [
  "https://tag.trovo-tag.com",
  "https://assets.braintreegateway.com",
  "https://www.google.com", // reCAPTCHA
  "https://www.gstatic.com", // reCAPTCHA frames
  "https://*.zoho.com", // Zoho SalesIQ widget iframe
  "https://*.zohopublic.com", // Zoho SalesIQ widget iframe
];

const config: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@heroicons/react",
      "lucide-react",
      "@headlessui/react",
      "@iconify/react",
    ],
  },
  images: {
    // Serve AVIF first (smallest), fall back to WebP
    formats: ["image/avif", "image/webp"],
    // Next 16 restricts `quality` to this list and silently coerces anything
    // else to 75. Without it, the existing quality={40} on the category cards
    // was being ignored — and the hand-built `&q=40` preload URLs in
    // (home)/page.jsx no longer matched what <Image> actually requested, so the
    // preload was wasted and the browser downloaded each card image twice.
    qualities: [40, 50, 60, 75],
    // Cache optimized images for 24 h at the edge
    minimumCacheTTL: 86400,
    // Explicit breakpoints so Next.js generates the right srcset for mobile
    deviceSizes: [375, 512, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },
      {
        protocol: "https",
        hostname: "onsite-cdn.sfo3.cdn.digitaloceanspaces.com",
      },
      { protocol: "https", hostname: "bbq-spaces.sfo3.digitaloceanspaces.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      {
        protocol: "https",
        hostname: "bbq-spaces.sfo3.cdn.digitaloceanspaces.com",
      },
    ],
  },

  async headers() {
    const CSP = `
      default-src 'self';
      
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://r2.leadsy.ai https://tag.trovo-tag.com https://www.google.com https://www.gstatic.com https://static.cloudflareinsights.com https://*.zoho.com https://*.zohopublic.com https://*.zohocdn.com;
      
      style-src 'self' 'unsafe-inline' ${styleSrcDomains.join(" ")};

      img-src 'self' data: blob: ${imageDomains
        .map((d) => `https://${d}`)
        .join(" ")} https://*.zoho.com https://*.zohopublic.com https://*.zohocdn.com;

      font-src 'self' data: https://*.zohocdn.com;

      connect-src 'self' ${connectDomains.join(" ")};

      frame-src 'self' ${frameSrcDomains.join(" ")};
      frame-ancestors ${framingAllowed ? `'self' ${adminFrameAncestors.join(" ")}` : "'none'"};
    `;

    return [
      {
        // Baseline security headers, on every response including static assets.
        //
        // Added 8 Sep 2026 after secsuite run 41 flagged both as missing on the
        // live storefront. Neither takes an argument that could break a page —
        // they constrain how the browser treats a response we already control.
        //
        // HSTS is deliberately absent here: the platform already sends
        // `Strict-Transport-Security: max-age=63072000`, and a second, weaker
        // value emitted by the app would be the one browsers see on any route
        // this matched first.
        source: "/:path*",
        headers: [
          {
            // Stops the browser second-guessing a declared Content-Type. Without
            // it, a file we serve as text/plain can be sniffed as HTML or
            // JavaScript and executed — the whole point of the header is that
            // our Content-Type is the final word.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Full URL to our own origin, origin-only when crossing to HTTPS,
            // nothing at all when downgrading to HTTP. Keeps product paths and
            // any query string out of third-party Referer logs while leaving
            // internal analytics intact. This is also the modern browser
            // default; sending it explicitly means we do not depend on that.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Legacy counterpart to frame-ancestors, for browsers that predate
          // CSP Level 2. Where both are understood the CSP directive wins, so
          // these must not contradict each other — hence the shared flag rather
          // than two independent conditions. Omitted entirely when embedding is
          // deliberately reopened, because X-Frame-Options has no allowlist:
          // it could only say DENY or SAMEORIGIN, and either would block the
          // cross-origin embed that frame-ancestors was just told to permit.
          ...(framingAllowed
            ? []
            : [{ key: "X-Frame-Options", value: "DENY" }]),
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Content-Security-Policy",
            value: CSP.replace(/\s+/g, " ").trim(),
          },
        ],
      },
      {
        // Static assets — cache long term
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Product pages — edge-cache the SSR response.
        //
        // This route is server-rendered on every request: it is a dynamic
        // segment with no generateStaticParams, so Next emits
        // `Cache-Control: private, no-cache, no-store` and its
        // `export const revalidate = 86400` never takes effect. Measured
        // 2026-07-23: PDP TTFB 0.72-2.48s vs 0.32s on the cached /fireplaces.
        //
        // The natural fix — adding generateStaticParams so the route becomes
        // ISR — is not usable here: under static prerendering this page emits
        // zero <img> tags (A/B tested on one build: 35 with on-demand SSR, 0
        // when prerendered, navbar logo included), which would strip product
        // imagery from 6,000+ indexed pages. So instead of changing how the
        // page renders, we keep the correct SSR output and cache it at the CDN.
        //
        // Safe to cache: product pages carry no per-user content. src/proxy.js
        // only matches /checkout, the auth routes, /my-account, /logout and
        // /admin, so cart and auth state never affect this response — they are
        // read client-side after hydration.
        //
        // TTL is deliberately short. A CDN cache is invisible to
        // revalidatePath/revalidateTag, so /api/revalidate-pdp cannot flush it;
        // 5 minutes bounds how long a price or stock edit can be stale while
        // still absorbing effectively all repeat traffic. stale-while-
        // revalidate serves instantly from cache for a day while refreshing in
        // the background.
        source: "/:slug/product/:product_path",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // All other pages — CSP only, no HTML caching
        source: "/((?!_next).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: CSP.replace(/\s+/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(config);
