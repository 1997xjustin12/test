import Promo from "@/app/components/oko-design/sections/Promo";
import Hero from "@/app/components/oko-design/sections/Hero";
import Trust from "@/app/components/oko-design/sections/Trust";
import Categories from "@/app/components/oko-design/sections/Categories";
import Brands from "@/app/components/oko-design/sections/Brands";
import Products from "@/app/components/oko-design/sections/Products";
import WhyCall from "@/app/components/oko-design/sections/WhyCall";
import Reviews from "@/app/components/oko-design/sections/Reviews";
import SeoBlock from "@/app/components/oko-design/sections/SeoBlock";

// Homepage section order per the OKO design system / oko-homepage.html:
// PromoStrip → Hero → Trust → Categories → BrandStrip → Products(deals)
// → WhyCall (dark feature band) → Testimonials → SeoBlock.
// (Announcement bar, header/nav and footer are rendered by (market)/layout.jsx.)
function HomePage({ heroBg, initialProducts }) {
  return (
    <div>
      <Promo />
      <Hero background={heroBg} />
      <Trust />
      <Categories />
      <Brands />
      <Products initialProducts={initialProducts} />
      <WhyCall />
      <Reviews />
      <SeoBlock />
    </div>
  );
}

export default HomePage;
