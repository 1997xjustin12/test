import Hero        from "@/app/components/new-design/sections/Hero";
import Features    from "@/app/components/new-design/sections/Features";
import Brands      from "@/app/components/new-design/sections/Brands";
import Categories  from "@/app/components/new-design/sections/Categories";
import Products    from "@/app/components/new-design/sections/Products";
import WhySolana   from "@/app/components/new-design/sections/WhySolana";
import Promo       from "@/app/components/new-design/sections/Promo";
import Reviews     from "@/app/components/new-design/sections/Reviews";
import Blog        from "@/app/components/new-design/sections/Blog";
import Cta         from "@/app/components/new-design/sections/Cta";
import NewsLetter  from "@/app/components/new-design/sections/NewsLetter";
import StickyCall  from "@/app/components/new-design/ui/StickyCall";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <Brands />
        <Categories />
        <Products />
        <WhySolana />
        <Promo />
        <Reviews />
        <Blog />
        <Cta />
        <NewsLetter />
      </main>
      <StickyCall />
    </>
  );
}