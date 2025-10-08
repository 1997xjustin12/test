// next.config.js

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
  "https://r2.leadsy.ai", // Required for the new script
  "https://admin.solanabbqgrills.com",
  "https://loyal-sloth-59774.upstash.io",
  // "http://164.92.65.4", // Assuming 9200 is unnecessary and you need the IP
];

module.exports = {
  // Required: Next.js Image component configuration
  images: {
    domains: imageDomains,
  },

  async headers() {
    const CSP = `
      default-src 'self';
      
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://r2.leadsy.ai;
      
      style-src 'self' 'unsafe-inline';
      
      img-src 'self' data: blob: ${imageDomains.join(" ")}; 
      
      connect-src 'self' ${connectDomains.join(" ")}; 
    `;

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Clean up the string for a valid HTTP header
            value: CSP.replace(/\s+/g, " ").trim(),
          },
        ],
      },
    ];
  },
};
