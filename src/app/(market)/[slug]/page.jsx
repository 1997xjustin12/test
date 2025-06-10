import { notFound } from "next/navigation";
import { keys, redis } from "@/app/lib/redis";
import { getPageData } from "@/app/lib/helpers";
import TuiHero from "@/app/components/template/tui_hero";
import ProductsSection from "@/app/components/section/Products";
import ShopifyProductsSection from "@/app/components/molecule/ProductsSection";
import MobileLoader from "@/app/components/molecule/MobileLoader";

const isShopify = true;

const defaultMenuKey = keys.default_shopify_menu.value;

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
    title: pageData.meta_title || "Solana Fireplaces | Stylish Indoor & Outdoor Heating",
    description: pageData.meta_description || "Transform your home with Solana Fireplaces! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!",
  };
}

export default async function GenericCategoryPage({ params }) {
  const { slug } = await params;
  const menuData = await redis.get(defaultMenuKey);
  const flatData = flattenNav(menuData);
  const pageData = getPageData(slug, flatData);

  if (!pageData) return notFound();

  return (
    <div>
      <MobileLoader isLoading={!pageData} />
      <TuiHero data={pageData} />
      {
        isShopify ?
      <ShopifyProductsSection category={slug} />
        :
      <ProductsSection category={slug} />
      }
    </div>
  );
}