import { unstable_cache } from "next/cache";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { getCollectionProducts } from "@/app/lib/fn_server";

// SOLANA COMPONENTS
import HeroBackground from "@/app/components/new-design/sections/HeroBackground";
import NewHomePage from "@/app/components/new-design/page/HomePage";
// BBQ COMPONENTS
import BBQHeroBackground from "@/app/components/bbq-design/sections/HeroBackground";
import BBQNewHomePage from "@/app/components/bbq-design/page/HomePage";
// OKO COMPONENTS
import OKOHeroBackground from "@/app/components/oko-design/sections/HeroBackground";
import OKONewHomePage from "@/app/components/oko-design/page/HomePage";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/");
// Cache the full rendered page at Vercel's CDN edge for 24h (ISR).
// TTFB drops to ~50ms globally instead of hitting the origin server.
// revalidateTag("home-products") from /api/revalidate-all also busts this.
export const revalidate = 86400;

const getCachedCollectionProducts = unstable_cache(
  (id) => getCollectionProducts(id),
  ["home-collection-products"],
  { revalidate: 86400, tags: ["home-products"] },
);

// No preload for the category card images. The four cards were preloaded here
// as "above the fold on mobile", one of them at fetchPriority="high" — they
// are not: measured on a 412x915 mobile viewport the first card starts at
// 1556px, and at 1366x900 at 1538px. The URLs did not match the image either.
// next/image builds ?url=..&w=..&q=.., these were built ?url=..&q=..&w=.., so
// the browser treated them as different resources: all four preloads were
// wasted and the first card was downloaded twice (seen on the wire at 613ms
// and again at 800ms). The cards load lazily on approach, as cards should.
export default async function HomePage() {
  // const ISBBQ = true;
  const initColId = (ISBBQ || ISOKO) ? 252: 137;
  const initialProducts = await getCachedCollectionProducts(initColId);

  if(ISOKO) return (
    <>
      <OKONewHomePage heroBg={<OKOHeroBackground />} initialProducts={initialProducts} />
    </>
  );

  if(ISBBQ) return (
    <>
      <BBQNewHomePage heroBg={<BBQHeroBackground />} initialProducts={initialProducts} />
    </>
  );
  return (
    <>
      <NewHomePage heroBg={<HeroBackground />} initialProducts={initialProducts} />
    </>
  );
}
