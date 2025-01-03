"use client";
import { usePathname } from "next/navigation";
import TuiHero from "../components/template/tui_hero";
import ProductsSection from "../components/section/Products";

export default function GenericCategoryPage() {
  const path = usePathname();
  return (
    <div>
      {/* {path} */}
      <TuiHero />
      <ProductsSection category={"all-products"} />
    </div>
  );
}
