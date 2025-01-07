import ProductsSection from "./components/section/Products";
import TuiNavbar from "./components/template/tui_navbar";
import TuiHero from "./components/template/tui_hero";
import MobileLoader from "./components/molecule/MobileLoader";
export default async function HomePage({ params }) {
  const page_data = {
    name: "All Products",
    children: [],
    banner_img: null,
  };
  return (
    <div>
      <MobileLoader />
      <TuiHero data={page_data} />
      <ProductsSection category={"all-products"} />
    </div>
  );
}
