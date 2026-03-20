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
import {BASE_URL} from "@/app/lib/helpers";

const BEST_SELLERS_FOR_BLAZE = 137;
const getInitialProducts = async (id) => {
  // Use a full URL if calling from the server, or relative if client-side
  const res = await fetch(`${BASE_URL}/api/collections/collection-products/${id}`, {
    next: { revalidate: 3600 } // Optional: Cache for 1 hour
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch products');
  }

  return res.json();
};


export default async function HomePage() {
  const blazeProducts = await getInitialProducts(BEST_SELLERS_FOR_BLAZE);

  return (
    <>
      <main>
        <Hero />
        <Features />
        <Brands />
        <Categories />
        <Products initialProducts={blazeProducts}/>
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