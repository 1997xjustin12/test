import { Suspense } from "react";
import { BASE_URL, ES_INDEX } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

import { fetchProduct,getReviewsByProductId } from "@/app/lib/fn_server";

import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder";
import ProductClient from "@/app/components/molecule/ProductClient";
import SingleProductPage from "@/app/components/new-design/page/SingleProductPage";

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

  // Clean description from HTML
  const cleanDescription = stripHtml(
    product?.seo?.description || product.title || "",
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
  const { slug, product_path } = await params;

  const product = await fetchProduct(product_path);
  const product_id = product?.product_id;
  
  if(!product || !product_id){
    notFound();
  }

  const product_reviews = await getReviewsByProductId(product_id) || [];
  return (
    <Suspense fallback={<ProductPlaceholder />}>
      <SingleProductPage product={product} slug={slug} reviews={product_reviews}/>
      {/* <ProductClient params={params} /> */}
    </Suspense>
  );
}
