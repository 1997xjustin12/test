import { unstable_cache } from "next/cache";
import { ISBBQ } from "@/app/lib/helpers";
import { getCollectionProducts } from "@/app/lib/fn_server";

// SOLANA COMPONENTS
import HeroBackground from "@/app/components/new-design/sections/HeroBackground";
import NewHomePage from "@/app/components/new-design/page/HomePage";
// BBQ COMPONENTS
import BBQHeroBackground from "@/app/components/bbq-design/sections/HeroBackground";
import BBQNewHomePage from "@/app/components/bbq-design/page/HomePage";
// Cache the full rendered page at Vercel's CDN edge for 24h (ISR).
// TTFB drops to ~50ms globally instead of hitting the origin server.
// revalidateTag("home-products") from /api/revalidate-all also busts this.
export const revalidate = 86400;

const getCachedCollectionProducts = unstable_cache(
  (id) => getCollectionProducts(id),
  ["home-collection-products"],
  { revalidate: 86400, tags: ["home-products"] },
);

export default async function HomePage() {
  // const ISBBQ = true; 
  const initColId = ISBBQ ? 252: 137;
  const initialProducts = await getCachedCollectionProducts(initColId);

  if(ISBBQ) return <BBQNewHomePage heroBg={<BBQHeroBackground />} initialProducts={initialProducts} />; 
  return <NewHomePage heroBg={<HeroBackground />} initialProducts={initialProducts} />;
}
