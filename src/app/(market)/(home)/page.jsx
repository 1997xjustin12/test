import { unstable_cache } from "next/cache";
import { ISBBQ } from "@/app/lib/helpers";
import { getCollectionProducts, fetchUniqueCategories } from "@/app/lib/fn_server";

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

/**
 * Preloads the first 4 category card images — all above the fold on mobile
 * (INITIAL_COUNT = 4 in Categories.jsx), with index 0 as the LCP candidate.
 * React hoists these <link> tags into <head>, so the browser fetches them in
 * parallel with JS parsing instead of discovering them after hydration.
 *
 * Lives on the homepage rather than (market)/layout.jsx on purpose: the layout
 * wraps every market route, so preloading there made product and category pages
 * fetch four images they never render — one at fetchPriority="high", competing
 * with those pages' actual LCP element.
 */
// fetchUniqueCategories fetches with `cache: "no-store"`, so calling it raw
// would make this page dynamic and lose its edge cache. (market)/layout.jsx
// wraps it the same way for the same reason.
const getCachedCategories = unstable_cache(
  () => fetchUniqueCategories(),
  ["home-category-preloads"],
  { revalidate: 86400, tags: ["categories"] },
);

async function CategoryCardPreloads() {
  const categories = await getCachedCategories();
  return (categories || []).slice(0, 4).map((cat, i) => {
    const base = `/_next/image?url=%2Fimages%2Fcategories%2F${cat.slug}.webp&q=40`;
    return (
      <link
        key={cat.slug}
        rel="preload"
        as="image"
        href={`${base}&w=512`}
        imageSrcSet={`${base}&w=375 375w, ${base}&w=512 512w, ${base}&w=640 640w, ${base}&w=750 750w`}
        imageSizes="(max-width: 1024px) calc(50vw - 2rem), calc(33vw - 2rem)"
        fetchPriority={i === 0 ? "high" : undefined}
      />
    );
  });
}

export default async function HomePage() {
  // const ISBBQ = true;
  const initColId = ISBBQ ? 252: 137;
  const initialProducts = await getCachedCollectionProducts(initColId);

  if(ISBBQ) return (
    <>
      <CategoryCardPreloads />
      <BBQNewHomePage heroBg={<BBQHeroBackground />} initialProducts={initialProducts} />
    </>
  );
  return (
    <>
      <CategoryCardPreloads />
      <NewHomePage heroBg={<HeroBackground />} initialProducts={initialProducts} />
    </>
  );
}
