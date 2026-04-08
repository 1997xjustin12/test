import { getCollectionProducts } from "@/app/lib/fn_server";
// OLD UI
import OldHomePage from "@/app/components/pages/HomePage"

// NEW UI COMPONENTS
import NewHomePage from "@/app/components/new-design/page/HomePage"

const UIV2 = process.env.NEXT_PUBLIC_UIV2;

// NEW UI CONSTANTS & FUNCTIONS

export default async function HomePage() {
  if (UIV2) {
    const BEST_SELLERS_FOR_BLAZE = 137;
    const blazeProducts = await getCollectionProducts(BEST_SELLERS_FOR_BLAZE);
    console.log("INITPRODUCTS", blazeProducts)
    return (<NewHomePage initialProducts={blazeProducts}/> );
  }

  return (<OldHomePage />);
}
