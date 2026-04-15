// PRIMARILY USED IN /[slug] page
import React from "react";
import HeroBanner from "@/app/components/new-design/sections/gallery/HeroBanner";
import SubcategoryTabs from "@/app/components/new-design/sections/gallery/SubcategoryTabs";
import ProductsSection from "@/app/components/molecule/ProductsSection";

function ProductGallery({ config, slug }) {
  console.log("config", config);
  return (
    <main>
      <HeroBanner config={config} />
      {config?.root?.url !== "brands" && <SubcategoryTabs config={config} />}
      <div className="px-1 md:px-[20px]">
        <ProductsSection category={slug} />
      </div>
    </main>
  );
}

export default ProductGallery;
