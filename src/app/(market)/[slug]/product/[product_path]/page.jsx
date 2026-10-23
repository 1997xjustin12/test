import "@/app/styles/product-pages.css";

// Safety-net fallback: pages self-heal after 24h even if a manual
// revalidation trigger was missed. Primary invalidation is on-demand
// via /api/revalidate-pdp using revalidatePath + revalidateTag.
export const revalidate = 86400;
import { unstable_cache } from "next/cache";
import { redis, keys } from "@/app/lib/redis";
import { notFound } from "next/navigation";
import {
  getCatalogExclusions,
  isExcludedProductBrand,
} from "@/app/lib/catalog-exclusions";
import RatingStyles from "@/app/components/atom/RatingStyles";
import { BASE_URL, ES_INDEX, ISBBQ, ISOKO, createSlug, fixMojibake } from "@/app/lib/helpers";
import { getMenuPageUrls } from "@/app/lib/menu-pages";
import { readOrDegrade } from "@/app/lib/upstream";
import { STORE_NAME } from "@/app/lib/store_constants";

import {
  fetchProduct,
  getReviewsByProductId,
  getYMALProducts,
} from "@/app/lib/fn_server";

import {
  buildBreadcrumbs,
  buildFaqPage,
  buildProduct,
  serializeJsonLd,
} from "@/app/lib/structured-data";

import SingleProductPage from "@/app/components/new-design/page/SingleProductPage";
import BBQSingleProductPage from "@/app/components/bbq-design/page/SingleProductPage";
import OKOSingleProductPage from "@/app/components/oko-design/page/SingleProductPage";

/**
 * CACHED (ISR): each product page renders on its first request and is then
 * served from the cache, refreshed by /api/revalidate-pdp or after 24 hours.
 * See generateStaticParams below and docs/reference/vercel-optimization-guide.md (B6).
 *
 * History: without generateStaticParams this route was rendered on every view
 * (`Cache-Control: private, no-store`, 0.7–1.6 s on the live site, Oct 2026),
 * and the 5-minute CDN header rule added for it in next.config.ts on
 * 2026-07-23 never took effect, because Next sends its own no-store header for
 * pages rendered per request. ISR was tried then and rejected: the
 * prerendered HTML had no <img> tags at all (35 versus 0). Re-tested
 * 2026-10-23 on Next 16.3.8: the cached page matches the per-request one
 * (16–17 <img>, same heading, JSON-LD and visible text), so that problem is
 * gone and the header rule was removed.
 *
 * When Elasticsearch fails, fetchProduct throws and nothing is cached: a
 * first render answers 500 with the branded pages/500.jsx and the next request
 * tries again; an already-cached page keeps being served until it's purged.
 */

/**
 * The four FAQ blocks are site-wide static copy, identical on every product
 * page. Reading them straight from Upstash on each render opted this route out
 * of static generation (the client fetches with `cache: "no-store"`), which
 * defeated `export const revalidate = 86400` above. Caching the read keeps the
 * route statically renderable so it can actually be served from the CDN edge.
 */
const getFaqContent = unstable_cache(
  () =>
    redis.mget([
      keys.faqs_about_brand.value,
      keys.faqs_shipping_policy.value,
      keys.faqs_return_policy.value,
      keys.faqs_warranty.value,
    ]),
  ["pdp-faq-content"],
  { tags: ["pdp", "pdp-faqs"], revalidate: 86400 },
);

// Helper function to strip HTML tags
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

// No product is prebuilt at deploy (6,000+ would make every build slow), but
// exporting this makes the route ISR: each page is cached after its first
// render instead of being rendered on every view. dynamicParams stays on.
export async function generateStaticParams() {
  return [];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug, product_path } = await params;

  // fetchProduct throws when Elasticsearch fails. Metadata runs outside the
  // product error boundary (error.jsx), so fall back to a plain title and let
  // the page below hit the same error, where it's handled: a 500 with
  // pages/500.jsx on a full page load, error.jsx on a client-side navigation.
  let product;
  try {
    product = await fetchProduct(product_path);
  } catch {
    return { title: STORE_NAME, robots: { index: false } };
  }

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const seoDesc = fixMojibake(product?.seo?.description)?.trim();
  const bodyDesc = stripHtml(fixMojibake(product?.body_html || "")).trim();
  // Skip seo.description if it contains the generic Shopify pricing template.
  const validSeoDesc =
    seoDesc && !seoDesc.toLowerCase().includes("best pricing")
      ? seoDesc
      : `${product.title} - Call us now for best pricing!`;
  const rawDescription = validSeoDesc || bodyDesc || product.title || "";
  const metaDescription = rawDescription.substring(0, 160) || product.title;

  // Get the first image or use a fallback
  const productImage = product.images?.[0]?.src;
  const siteName = STORE_NAME;

  const metaTitle = product?.seo?.title || `${product.title} | ${siteName}`;

  return {
    title: metaTitle || "Product",
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: productImage
        ? [
            {
              url: productImage,
              width: 1200,
              height: 630,
              alt: metaTitle,
            },
          ]
        : [],
      type: "website",
      siteName: siteName,
      url: `${BASE_URL}/${slug}/product/${product_path}`,
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: productImage ? [productImage] : [],
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}/product/${product_path}`,
    },
    // Product-specific metadata for structured data
    other: {
      "product:price:amount": product.variants?.[0]?.price || "",
      "product:price:currency": "USD",
      "product:availability": product.published ? "in stock" : "out of stock",
      "product:brand": product.brand || product.vendor || "",
      "og:type": "product",
      "og:price:amount": product.variants?.[0]?.price || "",
      "og:price:currency": "USD",
    },
  };
}

function MainSection({ ...props }) {
  if (ISOKO) {
    return (
      <OKOSingleProductPage
        {...props}
      />
    );
  }

  if (ISBBQ) {
    return (
      <BBQSingleProductPage
        {...props}
      />
    );
  }

  return (
    <SingleProductPage
      {...props}
    />
  );
}

export default async function ProductPage({ params }) {
  const { slug, product_path } = await params;

  const product = await fetchProduct(product_path);
  const product_id = product?.product_id;
  const ymal_products = await getYMALProducts();

  if (!product || !product_id) {
    notFound();
  }

  // A product of an excluded brand is not for sale.
  //
  // Deliberately different from the menu-visibility rule one level up, which
  // leaves products selling at their own URLs: hiding a menu entry is a
  // navigation decision, while excluding a brand says it is out of the
  // catalogue. Leaving these reachable meant the brand was hidden from every
  // listing and still bought from a link or a search result.
  //
  // Degrades open, not closed. A failed read of the exclusion list returns the
  // built-in defaults rather than throwing, so the worst case is a product that
  // should have been hidden staying up for a moment — never a catalogue that
  // 404s itself because Redis blinked.
  const { brands: excludedBrands } = await getCatalogExclusions();
  if (isExcludedProductBrand(product?.brand, excludedBrands)) notFound();

  // A brand only has a page if the menu has one. OutdoorKitchenOutlet does not,
  // so its products linked to /outdoorkitchenoutlet — the stray 404 the
  // September SEO audit found. Without a page there is no brand link, and no
  // brand step in the breadcrumb markup. If the menu cannot be read, the links
  // stay as they were rather than disappearing sitewide.
  const menuPageUrls = await getMenuPageUrls().catch(() => null);
  const hasBrandPage = menuPageUrls ? menuPageUrls.includes(createSlug(product?.brand)) : true;
  // The visible breadcrumb's brand step carries the same URL; it keeps the name
  // but points nowhere, since every non-final step renders as a <Link>.
  const pageProduct = hasBrandPage
    ? product
    : {
        ...product,
        brand_url: undefined,
        breadcrumbs: product?.breadcrumbs?.map((crumb) =>
          crumb?.url === product?.brand_url ? { ...crumb, url: "#" } : crumb,
        ),
      };

  const product_reviews = (await getReviewsByProductId(product_id)) || [];

  // The FAQ block is worth losing; the product page is not. Without this, a
  // Redis blip threw here and the whole page became an HTTP 500 with an empty
  // body — see lib/upstream.js.
  const [about, shipping_policy, return_policy, warranty] = await readOrDegrade(
    "pdp:faq-content",
    getFaqContent,
    [null, null, null, null],
  );

  const FAQS = [
    { q: `About ${STORE_NAME}`, a: about },
    { q: `Shipping Policy`, a: shipping_policy },
    { q: `Return Policy`, a: return_policy },
    { q: `Warranty`, a: warranty },
  ];

  // Product + BreadcrumbList + FAQPage in one block. The FAQ content is the
  // same shipping/returns/warranty copy already rendered below — marking it up
  // costs nothing and is exactly what an agent reads to answer "does this ship
  // free" without loading the page. See docs/agentic-ai/agentic-ai-readiness.md.
  const jsonLd = serializeJsonLd(
    buildProduct({
      product,
      url: `/${slug}/product/${product_path}`,
    }),
    buildBreadcrumbs([
      ...(hasBrandPage
        ? [{ name: product?.brand || product?.vendor || slug, url: `/${slug}` }]
        : []),
      { name: product?.title, url: `/${slug}/product/${product_path}` },
    ]),
    buildFaqPage(FAQS),
  );

  return (
    <>
      <RatingStyles />
      {jsonLd && (
        // eslint-disable-next-line react/no-danger
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <div className={`min-h-svh ${(ISBBQ || ISOKO) ? "bg-ash dark:bg-char" : "bg-white dark:bg-gray-950"}`}>
        <MainSection
          product={pageProduct}
          slug={slug}
          reviews={product_reviews}
          faqs={FAQS}
          ymalProducts={ymal_products}
        />
      </div>
    </>
  );
}
