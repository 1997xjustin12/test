// next.config.ts
import type { NextConfig } from "next";

// 1. Define all necessary external hostnames once
const imageDomains = [
  "cdn11.bigcommerce.com",
  "onsite-cdn.sfo3.cdn.digitaloceanspaces.com",
  "bbq-spaces.sfo3.digitaloceanspaces.com",
  "cdn.shopify.com",
  "bbq-spaces.sfo3.cdn.digitaloceanspaces.com",
];

// 2. Define all external hosts your application fetches/connects to (client-side)
const connectDomains = [
  "https://admin.solanabbqgrills.com",
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
  "https://es.solanabbqgrills.com", // ES
];

const styleSrcDomains = ["https://assets.braintreegateway.com"];

const frameSrcDomains = [
  "https://tag.trovo-tag.com",
  "https://assets.braintreegateway.com",
  "https://www.google.com", // reCAPTCHA
  "https://www.gstatic.com", // reCAPTCHA frames
];

const config: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: [
      "@heroicons/react",
      "lucide-react",
      "@headlessui/react",
      "@iconify/react",
    ],
  },
  images: {
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
      
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://r2.leadsy.ai https://tag.trovo-tag.com https://www.google.com https://www.gstatic.com https://static.cloudflareinsights.com;
      
      style-src 'self' 'unsafe-inline' ${styleSrcDomains.join(" ")};

      img-src 'self' data: blob: ${imageDomains
        .map((d) => `https://${d}`)
        .join(" ")};

      connect-src 'self' ${connectDomains.join(" ")}; 

      frame-src 'self' ${frameSrcDomains.join(" ")}; 
    `;

    return [
      {
        // Homepage — cache at Cloudflare edge for 1 hour, revalidate in background
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
          },
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

export default config;
