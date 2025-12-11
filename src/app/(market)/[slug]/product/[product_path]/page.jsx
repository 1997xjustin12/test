import { Suspense } from "react";
import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder";
import ProductClient from "@/app/components/molecule/ProductClient";
import { BASE_URL, ES_INDEX } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

// Helper function to strip HTML tags
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

// Helper function to fetch product data directly from Elasticsearch
async function fetchProductData(product_path) {
  try {
    const ESURL = process.env.NEXT_ES_URL;
    const ESShard = ES_INDEX;
    const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

    if (!ESURL || !ESApiKey || !ESShard) {
      console.error("Missing Elasticsearch configuration");
      return null;
    }

    const response = await fetch(`${ESURL}/${ESShard}/_search`, {
      method: "POST",
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        size: 1,
        query: {
          term: {
            "handle.keyword": {
              value: product_path,
            },
          },
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch product data from Elasticsearch");
      return null;
    }

    const data = await response.json();
    const products = data?.hits?.hits.map((i) => i._source);
    return products?.[0] || null;
  } catch (error) {
    console.error("Error fetching product data for metadata:", error);
    return null;
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug, product_path } = await params;

  const product = await fetchProductData(product_path);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  // Clean description from HTML
  const cleanDescription = stripHtml(
    product?.seo?.description || product.title || ""
  );
  const metaDescription = cleanDescription.substring(0, 160) || product.title;

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

export default async function ProductPage({ params }) {
  return (
    <Suspense fallback={<ProductPlaceholder />}>
      <ProductClient params={params} />
    </Suspense>
  );
}
