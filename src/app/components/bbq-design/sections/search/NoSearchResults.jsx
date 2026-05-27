import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";

export default function NoSearchResults({ categories, query, populars }) {
  const tips = [
    "Check your spelling",
    "Try broader keywords",
    "Search by brand name",
    "Browse by category",
  ];

  return (
    <div className="py-16 flex flex-col items-center text-center px-4">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-theme-800"
      >
        <svg
          className="w-9 h-9"
          fill="none"
          stroke="text-theme-500"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 11h6M11 8v6" strokeDasharray="2 2" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        No results for <span className="text-theme-500">"{query}"</span>
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        We couldn't find any products matching your search. Here are a few tips:
      </p>

      {/* Tips */}
      <ul className="mb-8 space-y-1.5">
        {tips.map((t) => (
          <li
            key={t}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <svg
              className="w-4 h-4 shrink-0 text-theme-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            {t}
          </li>
        ))}
      </ul>

      {/* Suggest searches */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Try these popular searches</p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {populars.slice(0,6).map(t=>(
          <Link key={`no-result-popular-${t}`} href={`${BASE_URL}/search?query=${t}`} className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all">
            {t}
          </Link>
        ))}
      </div>

      {/* Category browse */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Browse categories</p>
      
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
  );
}