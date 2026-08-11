import { BASE_URL } from "@/app/lib/helpers";
import {
  STORE_NAME,
  STORE_CONTACT,
  STORE_EMAIL,
  STORE_FACEBOOK,
  STORE_PINTEREST,
} from "@/app/lib/store_constants";

/**
 * Schema.org builders — the machine-readable layer of the site.
 *
 * Everything here exists so an agent (or a search crawler) can understand a page
 * without executing JavaScript. That matters more than usual for this app:
 * every listing surface renders its products client-side, so JSON-LD is
 * currently the *only* way a non-JS consumer can see what a category contains.
 * See docs/agentic-ai-readiness.md for the measured baseline.
 *
 * One module rather than per-page literals so the three brand themes cannot
 * drift into three different shapes of the same schema.
 */

/** Absolute URL. Schema.org consumers reject or silently drop relative ones. */
export const absUrl = (path = "") => {
  if (!path) return BASE_URL || "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL || ""}${path.startsWith("/") ? "" : "/"}${path}`;
};

/** Drops null/undefined/""/[]/{} so we never emit empty schema properties. */
export const compact = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v == null || v === "") return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "object") return Object.keys(v).length > 0;
      return true;
    }),
  );

export const stripHtml = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The store as an entity. Emitted once, in the market layout.
 */
export function buildOrganization() {
  return compact({
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${absUrl("/")}#organization`,
    name: STORE_NAME,
    url: absUrl("/"),
    email: STORE_EMAIL,
    telephone: STORE_CONTACT,
    sameAs: [STORE_FACEBOOK, STORE_PINTEREST].filter(Boolean),
    contactPoint: STORE_CONTACT
      ? {
          "@type": "ContactPoint",
          telephone: STORE_CONTACT,
          contactType: "sales",
          areaServed: "US",
          availableLanguage: "English",
        }
      : null,
  });
}

/**
 * The site, plus a machine-readable pointer at the search endpoint.
 *
 * potentialAction is the part that matters for agents: it advertises the query
 * URL shape so a client can search the catalog directly instead of inferring it
 * from markup or scraping a results page.
 */
export function buildWebSite() {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absUrl("/")}#website`,
    name: STORE_NAME,
    url: absUrl("/"),
    publisher: { "@id": `${absUrl("/")}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absUrl("/search")}?query={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

/**
 * Trail of {name, url} from the site root down to the current page.
 * Pass urls as paths or absolutes; the last crumb may omit url.
 */
export function buildBreadcrumbs(trail = []) {
  const items = [{ name: "Home", url: "/" }, ...trail].filter(
    (c) => c && c.name,
  );
  if (items.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.url ? { item: absUrl(crumb.url) } : {}),
    })),
  };
}

/**
 * A listing page's products.
 *
 * This is the single highest-value schema on the site right now — category and
 * brand pages currently expose zero products to a non-JS consumer, so without
 * this an agent cannot tell what any of them sell.
 *
 * Only emit products that are actually on the page: an ItemList that disagrees
 * with the rendered result set is cloaking, not optimisation.
 */
export function buildItemList({ name, url, products = [], offset = 0 }) {
  const entries = (products || []).filter(Boolean);
  if (!entries.length) return null;

  return compact({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: url ? absUrl(url) : null,
    numberOfItems: entries.length,
    itemListElement: entries.map((p, i) =>
      compact({
        "@type": "ListItem",
        position: offset + i + 1,
        item: compact({
          "@type": "Product",
          name: p.title,
          url: p.url ? absUrl(p.url) : null,
          image: p.image || null,
          sku: p.sku || null,
          brand: p.brand ? { "@type": "Brand", name: p.brand } : null,
          offers:
            p.price != null
              ? compact({
                  "@type": "Offer",
                  price: String(p.price),
                  priceCurrency: "USD",
                  availability:
                    p.available === false
                      ? "https://schema.org/OutOfStock"
                      : "https://schema.org/InStock",
                  url: p.url ? absUrl(p.url) : null,
                })
              : null,
        }),
      }),
    ),
  });
}

/**
 * Q&A blocks as FAQPage. The PDP already renders shipping/returns/warranty
 * copy as plain markup; this makes the same content machine-readable.
 * Answers are HTML in Redis, so they are stripped to text here.
 */
export function buildFaqPage(faqs = []) {
  const entries = (faqs || [])
    .map((f) => ({ q: f?.q, a: stripHtml(f?.a || "") }))
    .filter((f) => f.q && f.a);

  if (!entries.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * A product, with the fields shopping surfaces actually filter on.
 *
 * The original PDP schema carried name/description/image/sku/brand/offers only.
 * Google and the AI shopping surfaces built on the same feed data also read
 * itemCondition, priceValidUntil, shippingDetails and hasMerchantReturnPolicy —
 * a missing return policy or shipping block is a common reason an otherwise
 * valid Product is dropped from rich results.
 *
 * Anything not genuinely known is omitted rather than guessed: asserting
 * "free shipping" or a return window that does not match the published policy
 * is worse than staying silent, because merchants get penalised for feed data
 * that contradicts the storefront.
 *
 * `shippingDetails` is deliberately never populated. Confirmed with the client
 * 11 Aug 2026: shipping is calculated per order at checkout from destination
 * and item. schema.org expects a stated rate or a free-shipping threshold, and
 * we have neither — publishing one would be a promise checkout cannot keep.
 * (Note the storefront currently advertises both "$499+" and "over $1,999" for
 * free shipping in different components; that copy contradicts itself and the
 * calculated model, and is a separate issue for whoever owns it.)
 *
 * `hasMerchantReturnPolicy` stays available but unset until someone confirms
 * the return window, who pays return postage, and any restocking fee. The
 * storefront says "30-Day Returns" but that has not been verified as the
 * complete policy.
 *
 * `availability` is derived from the published flag. The store sources to
 * order, so this correctly means "purchasable" rather than "on a shelf" —
 * see the note in llms.txt that tells agents not to over-claim it.
 */
export function buildProduct({
  product,
  url,
  shipping,
  returnPolicy,
} = {}) {
  if (!product) return null;

  // Specs are {label, value} pairs rendered as a table on the page. As
  // additionalProperty they become filterable facts — an agent answering
  // "4-burner, at least 50,000 BTU, under 34 inches" can read them directly
  // instead of parsing the description prose. Capped at 60 so an outlier
  // product cannot bloat the page; the table remains the complete view.
  const specs = (product?.product_specs || [])
    .filter((s) => s?.label && s?.value != null && String(s.value).trim() !== "")
    .slice(0, 60)
    .map((s) => ({
      "@type": "PropertyValue",
      name: String(s.label).trim(),
      value: String(s.value).trim(),
    }));

  const variant = product?.variants?.[0];
  const price = variant?.price;

  const rating = parseFloat(product?.ratings) || 0;
  const reviewCount = Number(product?.reviews) || 0;

  // Offers must carry a validity horizon or consumers treat the price as
  // indefinite. One year out matches the 24h PDP revalidate cycle comfortably.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return compact({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtml(product?.body_html || ""),
    image: (product.images || []).map((img) => img?.src).filter(Boolean),
    sku: variant?.sku || null,
    // Shopify stores the barcode as GTIN-12/13/14; schema.org accepts the
    // generic `gtin` and infers the length. mpn falls back to the SKU, which is
    // what the merchant feed already sends.
    gtin: variant?.barcode || null,
    mpn: variant?.sku || null,
    brand: {
      "@type": "Brand",
      name: product.vendor || product.brand || STORE_NAME,
    },
    additionalProperty: specs,
    offers: compact({
      "@type": "Offer",
      url: absUrl(url),
      priceCurrency: "USD",
      price: price != null ? String(price) : null,
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: product?.published
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: STORE_NAME },
      shippingDetails: shipping || null,
      hasMerchantReturnPolicy: returnPolicy || null,
    }),
    aggregateRating:
      rating > 0 && reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating.toFixed(1),
            bestRating: "5",
            worstRating: "1",
            reviewCount,
          }
        : null,
  });
}

/**
 * Serialises one or more schema objects for a single <script> tag.
 * Nulls are dropped, so callers can pass builders that opted out.
 *
 * `<` is escaped because JSON-LD sits inside a raw <script> block: a product
 * description containing "</script>" would otherwise close the tag early and
 * inject markup.
 */
export function serializeJsonLd(...schemas) {
  const list = schemas.flat().filter(Boolean);
  if (!list.length) return null;
  const payload = list.length === 1 ? list[0] : list;
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}
