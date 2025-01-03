import ProductsSection from "../components/section/Products";
import TuiNavbar from "../components/template/tui_navbar";
import TuiHero from "../components/template/tui_hero";
export default async function FirepitsPage({ params }) {
  return (
    <div>
      {/* <TuiNavbar /> */}
      <TuiHero />
      <ProductsSection category={"gas-logs"} />
    </div>
  );
}
