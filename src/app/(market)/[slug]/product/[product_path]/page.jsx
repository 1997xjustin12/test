import "@/app/styles/product-pages.css";

// Safety-net fallback: pages self-heal after 24h even if a manual
// revalidation trigger was missed. Primary invalidation is on-demand
// via /api/revalidate-pdp using revalidatePath + revalidateTag.
export const revalidate = 86400;
import { unstable_cache } from "next/cache";
import { redis, keys } from "@/app/lib/redis";
import { notFound } from "next/navigation";
import RatingStyles from "@/app/components/atom/RatingStyles";
import { BASE_URL, ES_INDEX, ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

import {
  fetchProduct,
  getReviewsByProductId,
  getYMALProducts,
} from "@/app/lib/fn_server";

import ProductClient from "@/app/components/molecule/ProductClient";
import SingleProductPage from "@/app/components/new-design/page/SingleProductPage";
import BBQSingleProductPage from "@/app/components/bbq-design/page/SingleProductPage";

/**
 * WHY THIS ROUTE IS SERVER-RENDERED PER REQUEST (and cached at the CDN instead).
 *
 * Resolved 2026-07-23: edge caching for this route is now handled by a
 * Cache-Control rule on /:slug/product/:product_path in next.config.ts, NOT by
 * ISR. `export const revalidate = 86400` below is therefore inert — it is kept
 * only because /api/revalidate-pdp still uses revalidateTag/revalidatePath to
 * bust the unstable_cache data caches used by the fetches in this file.
 * The history below explains why ISR was rejected; do not "fix" it by adding
 * generateStaticParams.
 *
 * Because there is no `generateStaticParams` export, Next treats this dynamic
 * segment as pure SSR: it appears in neither `routes` nor `dynamicRoutes` in
 * the prerender manifest, and every response ships
 * `Cache-Control: private, no-cache, no-store`. That silently defeats the
 * `export const revalidate = 86400` above — every product view re-renders on
 * the origin, while the sibling /[slug] route (which does export it) is served
 * from cache. Measured 2026-07-23: PDP TTFB 0.72–2.48s vs 0.32s on /fireplaces.
 *
 * Adding `export async function generateStaticParams() { return [] }` DOES fix
 * the caching — verified locally, Cache-Control becomes s-maxage=3600 and warm
 * TTFB drops to ~9ms. But it also drops every product <img> from the
 * server-rendered HTML: A/B tested on the same build, 35 <img> tags without it
 * versus 0 with it, and the whole ImageGallery stops server-rendering. That
 * trade is not worth taking on 6,000+ indexed product pages — it removes the
 * LCP image from the initial document and guts the HTML for crawlers.
 *
 * Note the loss is not gallery-specific and not a data failure: the
 * prerendered file on disk still contained the product title and all 239 image
 * URLs in its flight data, yet emitted no <img> anywhere — the navbar logo
 * included. Rather than reverse-engineer that, we kept the SSR output that is
 * known-correct and cached it at the CDN edge.
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

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug, product_path } = await params;

  const product = await fetchProduct(product_path);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const seoDesc = product?.seo?.description?.trim();
  const bodyDesc = stripHtml(product?.body_html || "").trim();
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

function buildJsonLd(product, slug, product_path) {
  const variant = product?.variants?.[0];
  const price = variant?.price;
  const availability = product?.published
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtml(product?.body_html || ""),
    image: product.images?.map((img) => img.src).filter(Boolean) || [],
    sku: variant?.sku || "",
    brand: {
      "@type": "Brand",
      name: product.vendor || STORE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/${slug}/product/${product_path}`,
      priceCurrency: "USD",
      price: price || "0",
      availability,
      seller: {
        "@type": "Organization",
        name: STORE_NAME,
      },
    },
  };

  if (product?.ratings) {
    const ratingValue = parseFloat(product.ratings) || 0;
    const reviewCount = product.reviews;
    if (ratingValue > 0 && reviewCount > 0) {
      jsonLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: ratingValue.toFixed(1),
        bestRating: "5",
        worstRating: "1",
        reviewCount,
      };
    }
  }

  return jsonLd;
}

function MainSection({ ...props }) {
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

  const product_reviews = (await getReviewsByProductId(product_id)) || [];
  const jsonLd = buildJsonLd(product, slug, product_path);

  const [about, shipping_policy, return_policy, warranty] = await getFaqContent();

  const FAQS = [
    { q: `About ${STORE_NAME}`, a: about },
    { q: `Shipping Policy`, a: shipping_policy },
    { q: `Return Policy`, a: return_policy },
    { q: `Warranty`, a: warranty },
  ];

  return (
    <>
      <RatingStyles />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={`min-h-svh ${ISBBQ ? "bg-ash dark:bg-char" : "bg-white dark:bg-gray-950"}`}>
        <MainSection
          product={product}
          slug={slug}
          reviews={product_reviews}
          faqs={FAQS}
          ymalProducts={ymal_products}
        />
      </div>
    </>
  );
}
