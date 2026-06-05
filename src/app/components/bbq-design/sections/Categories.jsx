import { unstable_cache } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import { ArrowIcon } from "@/app/components/bbq-design/ui/Icons";
import CategoriesGrid from "./CategoriesGrid";
import { BASE_URL } from "@/app/lib/helpers";

// Same key + tags as the layout's getCachedCategories → shares the same cache entry.
// Only one fetchUniqueCategories() call happens per cache period regardless of
// how many server components request it.
const getCategoriesCache = unstable_cache(
  () => fetchUniqueCategories(),
  ["layout-categories"],
  { revalidate: 86400, tags: ["layout-data"] },
);

export default async function Categories() {
  const categories = await getCategoriesCache();

  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
              Shop by Category
            </p>
            <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1 text-stone-900 dark:text-ash">
              Find Your Perfect Setup
            </h2>
          </div>
          {/* <Link
            href="/categories"
            className="font-oswald font-semibold text-sm tracking-wide border-b-2 border-ember pb-0.5 hover:text-ember transition-colors"
          >
            View All Categories →
          </Link> */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(({ image, name, slug, index }) => (
            <Link
              key={`category-card-${slug}`}
              href={`${BASE_URL}/category/${slug}`}
              className="bg-ash dark:bg-stone-900 border border-grate dark:border-stone-700 rounded-sm text-center hover:bg-char hover:text-ash dark:hover:bg-stone-800 hover:-translate-y-1 transition-all group"
            >
              {/* <span className="text-3xl block mb-2">{icon}</span> */}
              <div className="relative w-full aspect-w-3 aspect-h-2 overflow-hidden">
                {image && (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) calc(50vw - 2rem), calc(33vw - 2rem)"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={40}
                    priority={index === 0}
                  />
                )}
              </div>
              <div className="p-4 sm:p-5">
                <b className="font-oswald text-xs sm:text-sm font-semibold tracking-wide text-stone-900 dark:text-ash group-hover:text-ash">
                  {name}
                </b>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
