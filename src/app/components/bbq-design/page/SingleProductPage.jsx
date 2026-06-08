import dynamic from "next/dynamic";
import { formatProduct } from "@/app/lib/helpers";
import PixelViewContent from "@/app/components/widget/PixelViewContent";

// Above-fold — load immediately
import Breadcrumb from "@/app/components/bbq-design/sections/sp/Breadcrumb";
import Topbar from "@/app/components/bbq-design/sections/sp/Topbar";
import ImageGallery from "@/app/components/bbq-design/sections/sp/ImageGallery";
import ProductInfo from "@/app/components/bbq-design/sections/sp/ProductInfo";
import CompareTable from "@/app/components/bbq-design/sections/sp/CompareTable";
import FrequentlyBoughtTogether from "@/app/components/bbq-design/sections/sp/FrequentlyBoughtTogether";
import StickyCTA from "@/app/components/bbq-design/sections/sp/StickyCTA";
import MobileStickyCTA from "@/app/components/bbq-design/sections/sp/MobileStickyCTA";

// Below-fold — lazy loaded to reduce initial JS bundle.
// Each dynamic() gets its own loading:()=>null so chunk-fetch suspense is
// contained per-section and never bubbles up to the page-level Suspense
// boundary (which would flash ProductPlaceholder over the whole page).
const CollectionStrip = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/CollectionStrip"),
  { loading: () => null },
);
const DescriptionSection = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/DescriptionSection"),
  { loading: () => null },
);
const SpecsShipping = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/SpecsShipping"),
  { loading: () => null },
);
const ReviewsSection = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/ReviewsSection"),
  { loading: () => null },
);
const FAQSection = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/FAQSection"),
  { loading: () => null },
);
const SupportCTA = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/SupportCTA"),
  { loading: () => null },
);
const ProductGrid = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/ProductGrid"),
  { loading: () => null },
);
const RecentViews = dynamic(
  () => import("@/app/components/bbq-design/sections/sp/RecentViews"),
  { loading: () => null },
);

function SingleProductPage({
  product,
  slug,
  reviews,
  recentlyViewed,
  faqs,
  ymalProducts,
}) {
  const firstVariant = product?.variants?.[0];
  const price = parseFloat(firstVariant?.price) || 0;

  return (
    <div className="text-char dark:text-ash font-sora">
      <PixelViewContent id={product?.id} name={product?.title} price={price} />
      <Topbar />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 pb-28 lg:pb-20">
        <Breadcrumb crumbs={product?.breadcrumbs} />

        {/* HERO: GALLERY + INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 lg:items-start">
          <div className="lg:sticky lg:top-[140px]">
            <ImageGallery
              images={product?.images || []}
              productTitle={product?.title}
            />
          </div>
          <ProductInfo product={product} />
        </div>

        {/* BELOW-FOLD SECTIONS */}
        <FrequentlyBoughtTogether product={product} />
        <CollectionStrip product={product} />
        <DescriptionSection
          brand={product?.brand}
          brandHref={product?.brand_url}
          brandImage={product?.brand_image}
          description={product?.body_html}
        />
        <SpecsShipping
          specs={product?.product_specs}
          shipping={product?.shipping_info}
          isFreeshipping={product?.is_freeshipping || false}
        />
        {product?.sp_product_options &&
          Array.isArray(product?.sp_product_options) &&
          product?.sp_product_options.length > 1 && (
            <CompareTable
              products={product?.sp_product_options}
              activeProductId={product?.product_id}
            />
          )}
        <ReviewsSection
          rating={reviews?.summary?.average_rating || 0}
          reviewCount={reviews?.summary?.total_reviews || reviews?.results?.length || 0}
          reviews={reviews?.results || []}
          summary={reviews?.summary || null}
          product_id={product?.product_id}
        />
        <FAQSection faqs={faqs} />
        <SupportCTA />
        {Array.isArray(product?.fbt_carousel) &&
          product.fbt_carousel?.length > 0 && (
            <ProductGrid
              title="Frequently Bought Together"
              items={product.fbt_carousel.map((i) => formatProduct(i, "card"))}
            />
          )}
        {ymalProducts && (
          <ProductGrid title="You May Also Like" items={ymalProducts} />
        )}
        <RecentViews product_id={product?.product_id} />
      </div>

      <StickyCTA product={product} />
      <MobileStickyCTA product={product} />
    </div>
  );
}

export default SingleProductPage;
