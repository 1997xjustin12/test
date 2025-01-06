import TuiHero from "../components/template/tui_hero";
import ProductsSection from "../components/section/Products";

import cat_json from "../data/category.json";

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
  const page_data = flatCategories.find(({ url }) => url === slug);

  console.log("slug", slug);
  console.log("page_data", page_data);
  // const category = "fire-pits";
  // const hero_props = {
  //   banner_img: "/images/banner/firepit-banner.webp",
  //   text: "Shop All Fire Pits",
  // };

  return (
    <div>
      <TuiHero data={page_data} />
      <ProductsSection
        category={main_cat_array.includes(slug) ? slug : "all-products"}
      />
    </div>
  );
}
