import {
  ES_INDEX,
  createSlug,
  stripHtmlTags,
  exclude_brands,
  exclude_collections,
} from "@/app/lib/helpers";

// Google Merchant Center product feed, served at /products_sitemap.xml.
//
// Despite the filename this is NOT a sitemap — Merchant Center cannot read
// sitemap.xml, which only lists URLs. This is an RSS 2.0 document in the
// http://base.google.com/ns/1.0 namespace carrying the product attributes
// Merchant Center actually ingests (price, availability, identifiers). Register
// it in Merchant Center under Products → Feeds → "scheduled fetch".
//
// Regular crawl/index discovery still belongs in app/sitemap.js.
export const revalidate = 3600;

const ESURL = process.env.NEXT_ES_URL;
const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

// Google caps titles at 150 chars and descriptions at 5000.
const MAX_TITLE = 150;
const MAX_DESCRIPTION = 5000;
// A feed item may carry up to 10 additional images beyond image_link.
const MAX_EXTRA_IMAGES = 10;
// ES page size. The catalog is ~5k products; search_after pages through all of
// them so this never runs into the 10,000 max_result_window ceiling that a
// plain `size: 10000` query would silently cap at.
//
// Kept at 500 because body_html makes the responses heavy: at 1000 each page
// came back 3-5MB, over Next's 2MB data-cache ceiling, so every page was
// serialized and then thrown away uncached and the whole catalog was re-read
// from Elasticsearch on each revalidation.
const PAGE_SIZE = 500;

// Drop anything outside the XML 1.0 legal character range. Product copy is
// pasted from manufacturer sources and occasionally carries stray control
// bytes; a single one makes the whole document unparseable and Merchant Center
// rejects the entire fetch rather than the offending item.
function stripIllegalXmlChars(text) {
  let out = "";
  for (const char of text) {
    const code = char.codePointAt(0);
    const legal =
      code === 0x9 ||
      code === 0xa ||
      code === 0xd ||
      (code >= 0x20 && code <= 0xd7ff) ||
      (code >= 0xe000 && code <= 0xfffd) ||
      code >= 0x10000;
    if (legal) out += char;
  }
  return out;
}

function escapeXml(value) {
  return stripIllegalXmlChars(String(value ?? ""))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(text, limit) {
  const clean = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1).trimEnd()}…` : clean;
}

// Two decimals, as Google requires: "183.00 USD".
function formatFeedPrice(amount) {
  return `${Number(amount).toFixed(2)} USD`;
}

async function fetchAllProducts() {
  const products = [];
  let searchAfter = null;

  // search_after needs a deterministic total ordering; _doc is the cheapest.
  while (true) {
    const body = {
      size: PAGE_SIZE,
      sort: [{ _doc: "asc" }],
      ...(searchAfter ? { search_after: searchAfter } : {}),
      query: {
        bool: {
          must: [{ term: { published: true } }],
          must_not: [
            { terms: { "brand.keyword": exclude_brands || [] } },
            { terms: { "collections.name.keyword": exclude_collections || [] } },
          ],
          filter: [
            { exists: { field: "brand.keyword" } },
            { exists: { field: "handle.keyword" } },
          ],
        },
      },
      _source: [
        "title",
        "brand",
        "handle",
        "images",
        "seo",
        "body_html",
        "product_category",
        "product_type",
        "variants",
      ],
    };

    const res = await fetch(`${ESURL}/${ES_INDEX}/_search`, {
      method: "POST",
      next: { revalidate: 3600 },
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Elasticsearch responded ${res.status}`);
    }

    const data = await res.json();
    const hits = data?.hits?.hits || [];
    if (hits.length === 0) break;

    products.push(...hits.map((hit) => hit._source));
    searchAfter = hits[hits.length - 1].sort;

    if (hits.length < PAGE_SIZE) break;
  }

  return products;
}

// Retailer taxonomy for g:product_type. product_category is populated on ~97%
// of the catalog and reads as a hierarchy ("Home & Garden" → "Household
// Appliance Accessories" → "Patio Heater Accessories"); product_type is set on
// only ~13%, so it is a fallback rather than the primary source. We do not emit
// google_product_category: these strings resemble Google's taxonomy but are not
// verified against it, and an invalid value is an item-level error. Google
// infers the category on its own when the attribute is absent.
function buildProductType(product) {
  const path = (product.product_category || [])
    .map((entry) => entry?.category_name)
    .filter(Boolean);

  if (path.length > 0) return path.join(" > ");
  return product.product_type?.trim() || "";
}

function buildDescription(product) {
  const seo = product.seo?.description?.trim();
  if (seo) return truncate(seo, MAX_DESCRIPTION);
  return truncate(stripHtmlTags(product.body_html || ""), MAX_DESCRIPTION);
}

function buildItem(product, baseUrl) {
  const variant = product.variants?.[0];
  const sku = variant?.sku?.trim();
  const price = Number(variant?.price);
  const images = (product.images || [])
    .map((image) => image?.src)
    .filter((src) => src && src.trim() !== "");

  // Merchant Center rejects items missing any required attribute, and one
  // rejected item does not invalidate the feed — but shipping known-bad rows
  // inflates the disapproval count and buries real problems. ~5.7% of the
  // catalog has no image; those are skipped here rather than sent to fail.
  if (!sku || !product.title || !product.brand || !product.handle) return null;
  if (!images.length || !Number.isFinite(price) || price <= 0) return null;

  const link = `${baseUrl}/${createSlug(product.brand)}/product/${product.handle}`;
  const description = buildDescription(product);
  if (!description) return null;

  // compare_at_price is the "was" price and sits at 0 when the item is not
  // discounted. Google wants the regular price in g:price and the current one
  // in g:sale_price, which is the reverse of how they are stored here.
  const compareAt = Number(variant?.compare_at_price);
  const onSale = Number.isFinite(compareAt) && compareAt > price;

  const productType = buildProductType(product);

  const parts = [
    `<g:id>${escapeXml(sku)}</g:id>`,
    `<g:title>${escapeXml(truncate(product.title, MAX_TITLE))}</g:title>`,
    `<g:description>${escapeXml(description)}</g:description>`,
    `<g:link>${escapeXml(link)}</g:link>`,
    `<g:image_link>${escapeXml(images[0])}</g:image_link>`,
    ...images
      .slice(1, 1 + MAX_EXTRA_IMAGES)
      .map((src) => `<g:additional_image_link>${escapeXml(src)}</g:additional_image_link>`),
    // Only published products are queried, and the catalog carries no usable
    // stock level (variants.qty is null across the index), so availability is
    // a constant. Revisit if real inventory lands in ES — Merchant Center
    // suspends items whose availability disagrees with the landing page.
    `<g:availability>in_stock</g:availability>`,
    `<g:condition>new</g:condition>`,
    `<g:price>${escapeXml(formatFeedPrice(onSale ? compareAt : price))}</g:price>`,
    ...(onSale ? [`<g:sale_price>${escapeXml(formatFeedPrice(price))}</g:sale_price>`] : []),
    `<g:brand>${escapeXml(product.brand)}</g:brand>`,
    // The catalog has no GTIN field. SKUs are manufacturer part numbers, not
    // internal codes — they carry per-brand prefixes (BH… Bromic, AOG… American
    // Outdoor Grill), encode model attributes (SSVH-60-DC = Summerset vent hood,
    // 60in, duct cover), and are appended verbatim to the product titles. Google
    // accepts brand + mpn as the identifier pair when no GTIN is available.
    `<g:mpn>${escapeXml(sku)}</g:mpn>`,
    `<g:identifier_exists>yes</g:identifier_exists>`,
    ...(productType ? [`<g:product_type>${escapeXml(productType)}</g:product_type>`] : []),
  ];

  return `<item>${parts.join("")}</item>`;
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL;

  // Fail loudly rather than publishing a feed of placeholder URLs. Every link
  // in this document is absolute, and Merchant Center caches what it fetches —
  // a feed built against a missing env var would register thousands of dead
  // landing pages before anyone noticed.
  if (!baseUrl) {
    return new Response(
      "NEXT_PUBLIC_SITE_BASE_URL is not set; refusing to build a product feed with unresolvable links.",
      { status: 500, headers: { "Content-Type": "text/plain" } },
    );
  }

  let products;
  try {
    products = await fetchAllProducts();
  } catch (error) {
    console.error("products_sitemap: Elasticsearch fetch failed:", error);
    return new Response("Failed to build product feed.", {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const items = products
    .map((product) => buildItem(product, baseUrl))
    .filter(Boolean);

  console.log(
    `products_sitemap: ${items.length} of ${products.length} products included ` +
      `(${products.length - items.length} skipped for missing required attributes)`,
  );

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">` +
    `<channel>` +
    `<title>${escapeXml(process.env.NEXT_PUBLIC_STORE_NAME || "Product feed")}</title>` +
    `<link>${escapeXml(baseUrl)}</link>` +
    `<description>Google Merchant Center product feed</description>` +
    items.join("") +
    `</channel>` +
    `</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
