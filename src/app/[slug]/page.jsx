import TuiHero from "../components/template/tui_hero";
import ProductsSection from "../components/section/Products";
import { getPageData } from "../lib/helpers";
import cat_json from "../data/category.json";
import { notFound } from "next/navigation";

const main_categories = cat_json
  .filter((i) => i.menu.visible)
  .map((i) => ({
    ...i,
    url: i.menu.href,
    children: i.links.flatMap((i) => i),
  }));
console.log("main", main_categories);
const sub_categories = cat_json.flatMap((i) => i.links).flatMap((i) => i);
const child_categories = sub_categories.flatMap((i) => i.children);
const main_cat_array = main_categories.map((i) => i.menu.href);
const flatCategories = [
  ...main_categories,
  ...sub_categories,
  ...child_categories,
];

export default async function GenericCategoryPage({ params }) {
  const slug = (await params)?.slug;
  const page_data = getPageData(slug, flatCategories);
  console.log("page_data", page_data);
  if (page_data === undefined) {
    notFound();
  }
  return (
    <div>
      <TuiHero data={page_data} />
      <ProductsSection
        category={main_cat_array.includes(slug) ? slug : "all-products"}
      />
    </div>
  );
}
