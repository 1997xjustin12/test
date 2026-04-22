import dynamic from "next/dynamic";
import { getCollectionProducts } from "@/app/lib/fn_server";
import { UIV2 } from "@/app/lib/helpers";

const NewHomePage = dynamic(() => import("@/app/components/new-design/page/HomePage"));
const OldHomePage = dynamic(() => import("@/app/components/pages/HomePage"));

export default async function HomePage() {
  if (UIV2) {
    const BEST_SELLERS_FOR_BLAZE = 137;
    const blazeProducts = await getCollectionProducts(BEST_SELLERS_FOR_BLAZE);
    return <NewHomePage initialProducts={blazeProducts} />;
  }

  return <OldHomePage />;
}
