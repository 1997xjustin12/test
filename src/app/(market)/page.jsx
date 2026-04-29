import HeroBackground from "@/app/components/new-design/sections/HeroBackground";
import NewHomePage from "@/app/components/new-design/page/HomePage";
import { getCollectionProducts } from "@/app/lib/fn_server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialProducts = await getCollectionProducts(137);
  return <NewHomePage heroBg={<HeroBackground />} initialProducts={initialProducts} />;
}
