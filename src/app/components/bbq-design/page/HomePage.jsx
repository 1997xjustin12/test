import dynamic from "next/dynamic";

// Above the fold — load immediately
import Hero from "@/app/components/bbq-design/sections/Hero";
import Features from "@/app/components/bbq-design/sections/Features";
import Categories from "@/app/components/bbq-design/sections/Categories";

// Below the fold — lazy loaded to reduce initial JS parse/execution
const Brands      = dynamic(() => import("@/app/components/bbq-design/sections/Brands"));
const Products    = dynamic(() => import("@/app/components/bbq-design/sections/Products"));
const WhySolana   = dynamic(() => import("@/app/components/bbq-design/sections/WhySolana"));
const Promo       = dynamic(() => import("@/app/components/bbq-design/sections/Promo"));
const Reviews     = dynamic(() => import("@/app/components/bbq-design/sections/Reviews"));
const Blog        = dynamic(() => import("@/app/components/bbq-design/sections/Blog"));
const Cta         = dynamic(() => import("@/app/components/bbq-design/sections/Cta"));
const NewsLetter  = dynamic(() => import("@/app/components/bbq-design/sections/NewsLetter"));
const Faqs  = dynamic(() => import("@/app/components/bbq-design/sections/Faqs"));

function HomePage({ heroBg, initialProducts }) {
  return (
    <div>
      <Hero background={heroBg} />
      <Features />
      {/* <div className="hidden md:block"><Brands /></div> */}
      <Categories />
      <Products initialProducts={initialProducts} />
      {/* <div className="hidden md:block"><WhySolana /></div> */}
      <div className="hidden md:block"><Promo /></div>
      <Reviews />
      <Faqs />
      {/* <Cta /> */}
      <NewsLetter />
    </div>
  );
}

export default HomePage;
