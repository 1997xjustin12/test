import Link from "next/link";
import { BASE_URL, formatPrice } from "@/app/lib/helpers";
// COMPONENTS — server
import Breadcrumb from "@/app/components/new-design/sections/sp/Breadcrumb";
import ReviewsSection from "@/app/components/new-design/sections/sp/ReviewsSection";
import SupportCTA from "@/app/components/new-design/sections/sp/SupportCTA";
import ProductGrid from "@/app/components/new-design/sections/sp/ProductGrid";
import MobileStickyCTA from "@/app/components/new-design/sections/sp/MobileStickyCTA";
// COMPONENTS — client
import Topbar from "@/app/components/new-design/sections/sp/Topbar";
import ImageGallery from "@/app/components/new-design/sections/sp/ImageGallery";
import ProductInfo from "@/app/components/new-design/sections/sp/ProductInfo";
import CollectionStrip from "@/app/components/new-design/sections/sp/CollectionStrip";
import DescriptionSection from "@/app/components/new-design/sections/sp/DescriptionSection";
import SpecsShipping from "@/app/components/new-design/sections/sp/SpecsShipping";
import FAQSection from "@/app/components/new-design/sections/sp/FAQSection";
import StickyCTA from "@/app/components/new-design/sections/sp/StickyCTA";

const STATIC_SPECS = [
  { label: "Class", value: "Premium" },
  { label: "BTU Output", value: "56,000" },
  { label: "Cutout Depth", value: "27 3/4 Inches" },
  { label: "Configuration", value: "Built-In" },
  { label: "Cutout Dimensions", value: "33 5/16 W × 21 1/4 D × 8 1/2 H Inches" },
  { label: "Cooking Grill Dimensions", value: "29 5/12 W × 18 D Inches" },
  { label: "Cutout Height", value: "8 1/2 Inches" },
];

const STATIC_SHIPPING = [
  { label: "Weight", value: "135 lbs" },
  { label: "Dimensions", value: "36″ × 25″ × 25″" },
];

const STATIC_FAQS = [
  {
    q: "About Solana Fireplaces",
    a: "Welcome to Solana Fireplaces! Since 1997, we have been offering a wide selection of top grill brands from our Southern California location. Our knowledgeable sales team is here to help you find the right product at unbeatable prices.",
  },
  {
    q: "Shipping Policy",
    a: "We offer free shipping on all orders over $79.99. Orders typically ship within 1–2 business days and arrive within 5–7 business days depending on your location.",
  },
  {
    q: "Return Policy",
    a: "We stand by our Satisfaction Guarantee. If you encounter any issues, our team is committed to supporting you both before and after your purchase with hassle-free returns.",
  },
  {
    q: "Warranty",
    a: "If you have an issue with a product we are happy to assist with the warranty claim and coordinate directly with the manufacturer on your behalf.",
  },
];

const RELATED = [
  { name: "Napoleon 700 Series Dual Range Top Burner", brand: "Napoleon", price: 889, was: 945, badge: "Popular" },
  { name: "Summit 76-Wide 2-Burner Radiant Cooking Block", brand: "Summit Appliance", price: 455, was: 500, badge: "Popular" },
  { name: "WPPO Karma 25-inch Wood-Fired Pizza Oven", brand: "WPPO", price: 1525, was: null, badge: null },
  { name: "RCS 27-Inch Freestanding Beverage Center", brand: "RCS", price: 4400, was: null, badge: null },
];

const RECENT = [
  { name: "American Fyre Designs 26 Inch Java Free-Standing Granite Shelf", brand: "American Fyre Design", price: 12490, was: 13960, badge: "Sale" },
  { name: "Blaze Freelan LBE 25-Inch 2-Burner Built-In Grill", brand: "Blaze Outdoor Products", price: 1409, was: null, badge: null },
  { name: "Bromic Heating Tungsten Smart-Heat 56,000 BTU", brand: "Bromic Heaters", price: 2250, was: 3000, badge: "Sale" },
  { name: "Sunglo Stainless Steel Patio Heater A270SS", brand: "Sunglo", price: 1325, was: null, badge: null },
];

function getSavingsPercentage(price, was) {
  if (!was || was <= 0 || price >= was) return 0;
  return Math.round(((was - price) / was) * 100);
}

function getSavings(price, was) {
  if (!was || was <= 0 || price >= was) return 0;
  return (was - price).toFixed(2);
}

function buildFormattedProduct(product) {
  if (!product) return null;
  const v = product?.variants?.[0];
  const price = parseFloat(v?.price);
  const was = parseFloat(v?.compare_at_price);
  return {
    ...product,
    name: product?.title,
    sku: v?.sku,
    rating: parseInt((product?.ratings?.rating_count || "").replace("'", "")) || 0,
    reviewCount: 0,
    price: formatPrice(price),
    was: formatPrice(was),
    savePct: getSavingsPercentage(price, was),
    saveAmt: formatPrice(getSavings(price, was)),
    ships: "Ships Within 1–2 Business Days",
    badges: [
      "Phone Discounts",
      "Package Deals",
      "Scratch & Dent",
      "Close Out Deals",
      "Free Accessory Bundle",
      "Open Box",
      "Finance Now",
      "Low Monthly Payments",
    ],
  };
}

function SingleProductPage({ product, slug, categoryName, reviews, recentlyViewed }) {
  const formattedProduct = buildFormattedProduct(product);

  const breadcrumbs = product && slug
    ? [
        { name: "Home", url: BASE_URL },
        { name: categoryName || slug, url: `${BASE_URL}/${slug}` },
        { name: product?.title || "", url: "#" },
      ]
    : [];

  const firstVariant = product?.variants?.[0];
  const price = parseFloat(firstVariant?.price) || 0;
  const was = parseFloat(firstVariant?.compare_at_price) || 0;

  const brandDescription = product?.vendor
    ? `Designed with features that make it easy to grill great food, every ${product.vendor} product is built for those who demand performance, durability, and bold outdoor style.`
    : "";

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-20">
        <Breadcrumb crumbs={breadcrumbs} />

        {/* HERO: GALLERY + INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 lg:gap-10 mb-12 lg:items-start">
          {/* min-h matches the gallery's lg:h-[460px] — prevents CLS during hydration */}
          <div className="lg:sticky lg:top-4 min-h-[300px] lg:min-h-[460px]">
            <ImageGallery images={product?.images || []} productTitle={product?.title} />
          </div>
          <ProductInfo product={formattedProduct} />
        </div>

        {/* BELOW-FOLD SECTIONS */}
        <CollectionStrip />
        <DescriptionSection
          brand={product?.vendor}
          brandDescription={brandDescription}
          description={product?.body_html}
        />
        <SpecsShipping specs={STATIC_SPECS} shipping={STATIC_SHIPPING} />
        <ReviewsSection rating={formattedProduct?.rating ?? 0} reviewCount={formattedProduct?.reviewCount ?? 0} />
        <FAQSection faqs={STATIC_FAQS} />
        <SupportCTA />
        <ProductGrid
          title="You May Also Like"
          items={RELATED}
          action={
            <Link href="#" className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1">
              View all{" "}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          }
        />
        <ProductGrid
          title="Recently Viewed"
          items={RECENT}
          action={
            <Link href="#" className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              Clear{" "}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          }
        />
      </div>

      <StickyCTA price={price} was={was} />
      <MobileStickyCTA price={price} was={was} />
    </div>
  );
}

export default SingleProductPage;
