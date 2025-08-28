import { notFound } from "next/navigation";
import { keys, redis } from "@/app/lib/redis";
import { getPageData, BASE_URL } from "@/app/lib/helpers";
import TuiHero from "@/app/components/template/tui_hero";
import ProductsSection from "@/app/components/section/Products";
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
import ShopifyProductsSection from "@/app/components/molecule/ProductsSection";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import Faq from "@/app/components/molecule/Faq";
import Reviews from "@/app/components/molecule/Reviews";
import CategoriesCarousel from "@/app/components/molecule/CategoriesCarousel";
import HeroNotice from "@/app/components/atom/HeroNotice";
import NewsLetter from "@/app/components/section/NewsLetter";
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
import BaseNavPage from "@/app/components/template/BaseNavItemPage";

const isShopify = true;

const feat_carousel_items = [
  {
    label: "Fireplaces",
    img: "/images/home/categories/Fireplace.webp",
    url: `${BASE_URL}/fireplaces`,
  },
  {
    label: "Patio Heaters",
    img: "/images/feature/patio-heaters-1.webp",
    url: `${BASE_URL}/patio-heaters`,
  },
  {
    label: "Built-In Grills",
    img: "/images/feature/built-in-grills.webp",
    url: `${BASE_URL}/built-in-grills`,
  },
  {
    label: "Freestanding Grills",
    img: "/images/feature/freestanding-grills.webp",
    url: `${BASE_URL}/freestanding-grills`,
  },
  {
    label: "Open Box",
    img: "/images/feature/open-box.webp",
    url: `${BASE_URL}/open-box`,
  },
  {
    label: "Current Deals",
    img: "/images/home/categories/clearance.webp",
    url: `${BASE_URL}/brand/eloquence`,
  },
];

// const defaultMenuKey = keys.default_shopify_menu.value;
const defaultMenuKey = keys.dev_shopify_menu.value; // dev-menu-object

const flattenNav = (navItems) => {
  let result = [];
  const extractLinks = (items) => {
    items.forEach(({ children = [], ...rest }) => {
      result.push({ ...rest, children });
      extractLinks(children);
    });
  };
  extractLinks(navItems);
  return result;
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const menuData = await redis.get(defaultMenuKey);
  const flatData = flattenNav(menuData);
  const pageData = getPageData(slug, flatData);

  if (!pageData) return {};

  return {
    title:
      pageData.meta_title ||
      "Solana Fireplaces | Stylish Indoor & Outdoor Heating",
    description:
      pageData.meta_description ||
      "Transform your home with Solana Fireplaces! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!",
  };
}

export default async function GenericCategoryPage({ params }) {
  const { slug } = await params;
  const menuData = await redis.get(defaultMenuKey);
  const flatData = flattenNav(
    menuData.map((i) => ({ ...i, is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name) }))
  );
  const pageData = getPageData(slug, flatData);

  if (!pageData) return notFound();

  if (pageData?.is_base_nav) return <BaseNavPage page_details={pageData} />;

  return (
    <div>
      <MobileLoader isLoading={!pageData} />
      <HeroNotice data={pageData} />
      <TuiHero data={pageData} />
      {isShopify ? (
        <ShopifyProductsSection category={slug} />
      ) : (
        <ProductsSection category={slug} />
      )}

      {pageData?.collections &&
        Array.isArray(pageData.collections) &&
        pageData.collections.length > 0 && (
          <div className="container mx-auto flex flex-col gap-[50px]">
            {pageData.collections.map((collection) => (
              <CollectionCarouselWrap
                key={`collection-carousel-${collection?.mb_uid}`}
                data={collection}
              />
            ))}
          </div>
        )}

      <Reviews />
      {/* <CategoriesCarousel /> */}

      <FeatureCategoriesSection items={feat_carousel_items} />
        
      {pageData?.faqs &&
        pageData?.faqs?.visible &&
        pageData?.faqs?.data &&
        Array.isArray(pageData.faqs.data) &&
        pageData.faqs.data.length > 0 && <Faq data={pageData.faqs.data} />}

      <NewsLetter />
    </div>
  );
}
