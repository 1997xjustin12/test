import ProductsSection from "./components/section/Products";
import TuiNavbar from "./components/template/tui_navbar";
import TuiHero from "./components/template/tui_hero";

export default async function HomePage({ params }) {
  const page_data = {
    name: "All Products",
    children: [],
    banner_img: null,
  };
  return (
    <div>
      {/* <TuiNavbar /> */}
      <TuiHero data={page_data} />
      <ProductsSection category={"all-products"} />
    </div>
  );
}
