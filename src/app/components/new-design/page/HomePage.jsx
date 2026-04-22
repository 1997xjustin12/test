import dynamic from "next/dynamic";

// Above the fold — load immediately
import Hero from "@/app/components/new-design/sections/Hero";
import Features from "@/app/components/new-design/sections/Features";

// Below the fold — lazy loaded to reduce initial JS parse/execution
const Brands      = dynamic(() => import("@/app/components/new-design/sections/Brands"));
const Categories  = dynamic(() => import("@/app/components/new-design/sections/Categories"));
const Products    = dynamic(() => import("@/app/components/new-design/sections/Products"));
const WhySolana   = dynamic(() => import("@/app/components/new-design/sections/WhySolana"));
const Promo       = dynamic(() => import("@/app/components/new-design/sections/Promo"));
const Reviews     = dynamic(() => import("@/app/components/new-design/sections/Reviews"));
const Blog        = dynamic(() => import("@/app/components/new-design/sections/Blog"));
const Cta         = dynamic(() => import("@/app/components/new-design/sections/Cta"));
const NewsLetter  = dynamic(() => import("@/app/components/new-design/sections/NewsLetter"));
const StickyCall  = dynamic(() => import("@/app/components/new-design/ui/StickyCall"));

function HomePage({ initialProducts }) {
  return (
    <>
      <div>
        <Hero />
        <Features />
        <Brands />
        <Categories />
        <Products initialProducts={initialProducts} />
        <WhySolana />
        <Promo />
        <Reviews />
        <Blog />
        <Cta />
        <NewsLetter />
      </div>
      <StickyCall />
    </>
  );
}

export default HomePage;
