import { unstable_cache } from "next/cache";
import { STORE_NAME, STORE_CONTACT, STORE_EMAIL } from "@/app/lib/store_constants";
import { BASE_URL } from "@/app/lib/helpers";
import { fetchUniqueCategories } from "@/app/lib/fn_server";

/**
 * fetchUniqueCategories() fetches with `cache: "no-store"`, which is
 * incompatible with the `revalidate` below: during the build Next throws
 * DYNAMIC_SERVER_USAGE to bail this route out to dynamic rendering, but
 * fetchUniqueCategories catches its own errors and returns [] — swallowing that
 * signal. The result shipped a statically rendered llms.txt with the category
 * list missing entirely, while dev looked correct because dev renders per
 * request. Caught by `next build`, not by dev.
 *
 * Wrapping in unstable_cache gives the read its own cache scope, so it neither
 * bails the route out nor re-hits Elasticsearch on every request. Same pattern
 * the market layout uses for the identical call.
 */
const getCachedCategories = unstable_cache(
  () => fetchUniqueCategories(),
  ["llms-txt-categories"],
  { revalidate: 86400, tags: ["layout-data"] },
);

/**
 * /llms.txt — a plain-language map of the site for LLM-based agents.
 *
 * robots.txt says what may be fetched; llms.txt says what is worth fetching and
 * where the machine-readable data lives. It is a convention rather than a
 * standard, but it costs one route and saves an agent from crawling its way to
 * the same conclusions.
 *
 * Kept honest on purpose: it points at the product feed and sitemap, which are
 * fully server-rendered, and does not oversell the category pages while their
 * listings are still client-rendered (see docs/agentic-ai-readiness.md).
 */
export const revalidate = 86400;

export async function GET() {
  let categories = [];
  try {
    categories = (await getCachedCategories()) || [];
  } catch {
    // A failed category read should degrade this file, not 500 it.
    categories = [];
  }

  const categoryLines = categories
    .filter((c) => c?.slug && c?.name)
    .map(
      (c) =>
        `- [${c.name}](${BASE_URL}/category/${c.slug})${
          c.count ? `: ${c.count} products` : ""
        }`,
    )
    .join("\n");

  const body = `# ${STORE_NAME}

> Online retailer of outdoor kitchen equipment — grills, fireplaces, patio
> heaters, outdoor refrigeration, storage and accessories. Prices, availability
> and specifications are published per product and updated continuously.

## Machine-readable data

Prefer these over scraping HTML. All are server-rendered and always current.

- [Full context](${BASE_URL}/llms-full.txt): policies, shipping, warranty, and the full category and brand structure in one file.
- [Product feed](${BASE_URL}/products_sitemap.xml): full catalog with price, availability, brand and images (Google Merchant Center format).
- [Sitemap](${BASE_URL}/sitemap.xml): every indexable URL.

Product pages carry schema.org \`Product\` JSON-LD with price, availability,
brand, SKU and aggregate rating. The site root carries \`Organization\` and
\`WebSite\` JSON-LD.

## Catalogue API — prefer this over scraping

A read-only JSON API. Rate limited; responses carry RateLimit-* headers and
answer 429 with Retry-After, so back off rather than retrying immediately.

- Search: \`${BASE_URL}/api/catalog/search?q={terms}&brand=&category=&min_price=&max_price=&limit=20\`
- Product: \`${BASE_URL}/api/catalog/product/{handle}\` — handles come from search
- [OpenAPI specification](${BASE_URL}/openapi.json)
- MCP endpoint: \`${BASE_URL}/api/mcp\` — Model Context Protocol, JSON-RPC 2.0 over POST. Tools: search_products, get_product.

## Search (human-facing)

- Product search: \`${BASE_URL}/search?query={terms}\`

## Categories

${categoryLines || "- See the sitemap for the current category list."}

## Notes for agents

- Category and search result pages currently render their product grids
  client-side. Use the product feed above for a complete, JS-free view of the
  catalog.
- **Availability means purchasable, not on a shelf.** This store sources to
  order: an item marked InStock can be bought and will be sourced and shipped,
  but it is not a live warehouse count. Do not tell a customer an item is
  physically in stock or quote a dispatch time.
- **Shipping cost is calculated per order**, from destination and item, at
  checkout. There is no flat rate or published free-shipping threshold to
  quote — direct the customer to checkout or to call for a figure.
- Pricing is USD. Prices shown are current; some items are phone-only or
  price-matched, in which case the page says so.
- For anything not covered here, contact ${STORE_EMAIL || STORE_CONTACT || "the store"}.

## Not for crawling

/admin, /api, /checkout, /my-account, /cart and the auth routes. See
${BASE_URL}/robots.txt.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
