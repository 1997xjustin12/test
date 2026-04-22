import dynamic from "next/dynamic";
import { getCollectionProducts } from "@/app/lib/fn_server";

const NewHomePage = dynamic(() => import("@/app/components/new-design/page/HomePage"));

export default async function HomePage() {
  const BEST_SELLERS_FOR_BLAZE = 137;
  const blazeProducts = await getCollectionProducts(BEST_SELLERS_FOR_BLAZE);
  return <NewHomePage initialProducts={blazeProducts} />;
}
