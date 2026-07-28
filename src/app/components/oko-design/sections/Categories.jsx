import { unstable_cache } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import { BASE_URL } from "@/app/lib/helpers";

// Same key + tags as the layout's getCachedCategories → shares the cache entry.
const getCategoriesCache = unstable_cache(
  () => fetchUniqueCategories(),
  ["layout-categories"],
  { revalidate: 86400, tags: ["layout-data"] },
);

// Short "what's inside" descriptor per spec §8.8 / copy voice §10. Prefer the
// real sub-type list from the data; fall back to a slug map, then a generic.
const DESCRIPTORS = {
  "grills-and-smokers": "Gas, pellet, charcoal, kamado",
  "bbq-grills-and-smokers": "Gas, pellet, charcoal, kamado",
  "outdoor-kitchen-components": "Storage, sinks, vent hoods, islands",
  "outdoor-kitchen": "Storage, sinks, vent hoods, islands",
  "heating-and-fire": "Fire pits, heaters, patio furniture",
  "outdoor-living": "Fire pits, heaters, patio furniture",
  "outdoor-refrigeration": "Refrigeration, ranges, cooktops",
  appliances: "Refrigeration, ranges, cooktops",
  accessories: "Tools, covers, cookware",
};

export default async function Categories() {
  const categories = await getCategoriesCache();

  return (
    <section className="py-16 min-[560px]:py-11 bg-oko-cream dark:bg-oko-night">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        {/* Section header (8.7) */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
              Shop by category
            </span>
            <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
              Find your equipment
            </h2>
          </div>
          <Link
            href="/grills"
            className="font-inter font-semibold text-[13px] text-oko-sage dark:text-oko-sage-light border-b border-oko-sage dark:border-oko-sage-light pb-0.5 hover:text-oko-barn hover:border-oko-barn dark:hover:text-oko-barn-light transition-colors whitespace-nowrap"
          >
            View all categories →
          </Link>
        </div>

        {/* Category cards (8.8) — 4 → 2 (≤1024) → 1 (≤560) */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {(categories || []).map(({ image, name, slug }, index) => {
            const descriptor = DESCRIPTORS[slug] || "";
            return (
              <Link
                key={`oko-category-${slug}`}
                href={`${BASE_URL}/category/${slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-[2px] bg-oko-char"
              >
                {image && (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 1024px) calc(50vw - 2rem), calc(25vw - 2rem)"
                    quality={40}
                    priority={index === 0}
                    className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-[1.03] transition-[opacity,transform] duration-300"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 p-[18px]">
                  <span className="block font-oko-display font-semibold text-[16px] text-white">
                    {name}
                  </span>
                  {descriptor && (
                    <span className="block font-inter text-[11.5px] text-oko-cream-dim mt-1 line-clamp-1">
                      {descriptor}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
