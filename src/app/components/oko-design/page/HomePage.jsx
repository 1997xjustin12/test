import dynamic from "next/dynamic";

// Above the fold — load immediately
import Hero from "@/app/components/oko-design/sections/Hero";
import Features from "@/app/components/oko-design/sections/Features";
import Categories from "@/app/components/oko-design/sections/Categories";

// Below the fold — lazy loaded to reduce initial JS parse/execution
const Brands      = dynamic(() => import("@/app/components/oko-design/sections/Brands"));
const Products    = dynamic(() => import("@/app/components/oko-design/sections/Products"));
const Promo       = dynamic(() => import("@/app/components/oko-design/sections/Promo"));
const Reviews     = dynamic(() => import("@/app/components/oko-design/sections/Reviews"));
const Blog        = dynamic(() => import("@/app/components/oko-design/sections/Blog"));
const Cta         = dynamic(() => import("@/app/components/oko-design/sections/Cta"));
const NewsLetter  = dynamic(() => import("@/app/components/oko-design/sections/NewsLetter"));
const Faqs  = dynamic(() => import("@/app/components/oko-design/sections/Faqs"));

function HomePage({ heroBg, initialProducts }) {
  return (
    <div>
      <Hero background={heroBg} />
      <Features />
      <div className="hidden md:block"><Brands /></div>
      <Categories />
      <Products initialProducts={initialProducts} />
      <div className="hidden md:block"><Promo /></div>
      <Reviews />
      <Faqs />
      <Blog />
      <Cta />
      <NewsLetter />
    </div>
  );
}

export default HomePage;
