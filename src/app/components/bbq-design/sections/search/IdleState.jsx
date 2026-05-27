import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";

export default async function IdleState({categories, populars}) {

  

  return (
    <div className="max-w-[1240] mx-auto px-6 py-8">
      {/* Promo */}
      <div
        className="rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: "linear-gradient(120deg,#1a0600,#3d1208)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, color-mix(in srgb, var(--theme-primary-500), transparent 80%), transparent 65%)`,
          }}
        />
        <div className="relative z-10">
          <p className="text-white font-bold text-lg mb-1">
            🔥 Spring Sale — Up to 30% off
          </p>
          <p className="text-orange-200 text-sm">
            Limited-time deals on top fireplace brands
          </p>
        </div>
        <button className="relative z-10 shrink-0 bg-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-theme-500">
          Shop Sale
        </button>
      </div>

      {/* Trending */}
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Trending searches
        </p>
        <div className="flex flex-wrap gap-2">
          {populars.map((t, i) => (
            <Link
              key={`idle-state-popular-${t}`}
              href={`${BASE_URL}/search?query=${t}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
            >
              <span className="text-[10px] text-gray-300 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Browse by category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link
              prefetch={false}
              href={`${BASE_URL}/category/${c.slug}`}
              key={`idle-search-category-${c.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-400 hover:shadow-md transition-all group overflow-hidden pb-2"
            >
              <div className="relative aspect-1 w-full">
                {c?.image && (
                  <Image
                    src={c.image} // or your specific object path
                    alt={c.name || "Category search result thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-cover"
                    priority={false}
                  />
                )}
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors px-2">
                {c.name}
              </div>
              <div className="text-[10px] text-gray-400 px-2">
                {c.count} product{c.count > 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
