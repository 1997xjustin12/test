
// NEXT
import { notFound } from "next/navigation";

// HELPERS
import { keys, redis } from "@/app/lib/redis";
import { STORE_NAME } from "@/app/lib/store_constants";
import { getRootByUrl, getPageData, BASE_URL } from "@/app/lib/helpers";

// OLD UI
import OldProductGallery from "@/app/components/pages/ProductGallery"

// NEW UI
import NewProductGallery from "@/app/components/new-design/page/ProductGallery";

// COMMON
import BaseNavPage from "@/app/components/template/BaseNavItemPage";

const UIV2 = process.env.NEXT_PUBLIC_UIV2;

const feat_carousel_items = [
  {
    label: "Fireplaces",
    img: "/images/feature/Firepit.webp",
    url: `${BASE_URL}/fireplaces`,
  },
  {
    label: "Patio Heaters",
    img: "/images/feature/patio-heaters-1.webp",
    url: `${BASE_URL}/patio-heaters`,
  },
  {
    label: "Built-In Grills",
    img: "/images/feature/Built-in Grill 2.webp",
    url: `${BASE_URL}/built-in-grills`,
  },
  {
    label: "Freestanding Grills",
    img: "/images/feature/Freestanding Grill 2.webp",
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
      pageData.meta_title || pageData.name || `${STORE_NAME} | Stylish Indoor & Outdoor Heating`,
    description:
      pageData.meta_description ||
      `Transform your home with ${STORE_NAME}! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!`,
  };
}

export default async function GenericCategoryPage({ params }) {
  const { slug } = await params;
  const menuData = await redis.get(defaultMenuKey);
  const flatData = flattenNav(
    menuData.map((i) => ({
      ...i,
      is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name),
    }))
  );
  const pageData = getPageData(slug, flatData);
  const url = pageData?.url;

  if (!pageData || !url) return notFound();
  const rootNav = getRootByUrl(menuData, url);

  if (!rootNav) return notFound();

  if (pageData?.is_base_nav) return <BaseNavPage page_details={pageData} />;

  const navConfig = {
    root: rootNav,
    url: url 
  }

  if(UIV2){
    return (
      <NewProductGallery slug={slug} config={navConfig}/>
    )
  }
  return (
    <OldProductGallery pageData={pageData} slug={slug}/>
  );
}
