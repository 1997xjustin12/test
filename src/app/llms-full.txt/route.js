import { unstable_cache } from "next/cache";
import { redis, keys } from "@/app/lib/redis";
import {
  STORE_NAME,
  STORE_CONTACT,
  STORE_EMAIL,
  STORE_DOMAIN,
} from "@/app/lib/store_constants";
import { BASE_URL } from "@/app/lib/helpers";
import { fetchUniqueCategories, fetchBrands } from "@/app/lib/fn_server";
import { stripHtml } from "@/app/lib/structured-data";

/**
 * /llms-full.txt — the consolidated context file, scoped for retail.
 *
 * The convention comes from documentation tooling, where dumping an entire
 * corpus into one file is reasonable because the corpus is a few hundred
 * kilobytes. Doing that literally here would mean serialising 6,000+ products:
 * tens of megabytes, too large for any context window, and nothing would ever
 * fetch it. So this carries what an agent genuinely needs in prose — policies,
 * shipping, warranty, the category and brand structure — and points at the
 * product feed for the catalogue itself, which is already machine-readable and
 * always current.
 *
 * See docs/agentic-ai-readiness.md, "Points we are challenging".
 */
export const revalidate = 86400;

// Both underlying reads fetch with `cache: "no-store"` and swallow their own
// errors, so calling them directly would let the DYNAMIC_SERVER_USAGE signal
// get caught and ship an empty file. Wrapping gives them their own cache scope.
const getCachedTaxonomy = unstable_cache(
  async () => {
    const [categories, brands] = await Promise.all([
      fetchUniqueCategories(),
      fetchBrands(),
    ]);
    return { categories: categories || [], brands: brands || [] };
  },
  ["llms-full-taxonomy"],
  { revalidate: 86400, tags: ["layout-data"] },
);

const getCachedPolicies = unstable_cache(
  () =>
    redis.mget([
      keys.faqs_about_brand.value,
      keys.faqs_shipping_policy.value,
      keys.faqs_return_policy.value,
      keys.faqs_warranty.value,
    ]),
  ["llms-full-policies"],
  { revalidate: 86400, tags: ["pdp-faqs"] },
);

const section = (heading, body) =>
  body ? `## ${heading}\n\n${body}\n` : "";

export async function GET() {
  const [{ categories, brands }, policies] = await Promise.all([
    getCachedTaxonomy().catch(() => ({ categories: [], brands: [] })),
    getCachedPolicies().catch(() => []),
  ]);

  const [about, shipping, returns, warranty] = policies || [];

  const categoryLines = categories
    .filter((c) => c?.name && c?.url)
    .map(
      (c) =>
        `- **${c.name}** — ${BASE_URL}${c.url}` +
        (c.count ? ` (${c.count} products)` : "") +
        (c.sub ? `\n  Includes: ${c.sub}` : ""),
    )
    .join("\n");

  const brandLines = brands
    .filter((b) => b?.name)
    .map((b) => `- ${b.name}${b.count ? ` (${b.count})` : ""}`)
    .join("\n");

  const body = `# ${STORE_NAME} — full context for AI agents

Retailer of outdoor kitchen equipment: grills, fireplaces, patio heaters,
outdoor refrigeration, storage and accessories. Prices are USD and reflect the
storefront at time of generation.

Canonical site: ${STORE_DOMAIN || BASE_URL}
Generated: ${new Date().toISOString().slice(0, 10)} · refreshed daily

---

## How to use this file

This file carries policies and catalogue **structure**. It deliberately does not
inline the product catalogue — that runs to thousands of items and would not fit
a context window. For products, use:

- **Product feed** — ${BASE_URL}/products_sitemap.xml
  Every product with price, availability, brand, images and identifiers, in
  Google Merchant Center format. This is the authoritative catalogue source.
- **Sitemap** — ${BASE_URL}/sitemap.xml
- **Search** — ${BASE_URL}/search?query={terms}

Every product page carries schema.org \`Product\` JSON-LD with price, currency,
availability, brand, SKU and condition. Category and brand pages carry
\`ItemList\` describing the products shown. All pages render server-side, so no
JavaScript execution is required to read them.

---

${section("Categories", categoryLines || "See the sitemap.")}
---

${section(`Brands carried (${brands.length})`, brandLines || "See the sitemap.")}
---

${section(`About ${STORE_NAME}`, stripHtml(about || ""))}
${section("Shipping policy", stripHtml(shipping || ""))}
${section("Return policy", stripHtml(returns || ""))}
${section("Warranty", stripHtml(warranty || ""))}
---

## Contact

${STORE_CONTACT ? `Phone: ${STORE_CONTACT}\n` : ""}${STORE_EMAIL ? `Email: ${STORE_EMAIL}\n` : ""}
Many items are price-matched or phone-only; where that applies the product page
says so. When a quoted price matters, re-read the product page or the feed
rather than relying on a cached copy of this file.

## How to read availability and shipping

**Availability means purchasable, not on a shelf.** This store sources to order.
An item marked InStock can be bought and will be sourced and shipped, but the
value is not a live warehouse count. Do not tell a customer an item is
physically in stock, and do not quote a dispatch time.

**Shipping cost is calculated per order** from destination and item, at
checkout. There is no flat rate and no published free-shipping threshold to
quote. Direct the customer to checkout, or to call, for an actual figure.

## Not for crawling

/admin, /api, /checkout, /my-account, /cart and the auth routes.
See ${BASE_URL}/robots.txt.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
