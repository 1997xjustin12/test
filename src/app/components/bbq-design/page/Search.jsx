import Link from "next/link";
import Image from "next/image";
import IdleState from "@/app/components/bbq-design/sections/search/IdleState";
import NoSearchResults from "@/app/components/bbq-design/sections/search/NoSearchResults";
import ProductsSection from "@/app/components/molecule/ProductsSectionV2";
import { BASE_URL } from "@/app/lib/helpers";

const PageWrapper = ({ children }) => (
  <div className="min-h-screen text-char dark:text-ash font-sora">
    <div className="max-w-[1240px] mx-auto">{children}</div>
  </div>
);

function CategoryResults({ searchResult }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 pb-6">
      <div className="divide-y divide-grate dark:divide-white/10">
        {searchResult.map((c, i) => (
          <Link
            prefetch={false}
            key={`category-search-result-${c?.slug}-${i}`}
            href={`${BASE_URL}/category/${c?.slug}`}
            className="flex gap-3 px-2 py-4 hover:bg-paper dark:hover:bg-smoke transition-colors group"
          >
            <div className="rounded-sm min-w-32 min-h-32 bg-white dark:bg-char relative overflow-hidden flex-shrink-0 border border-grate dark:border-white/10">
              {c?.image && (
                <Image
                  src={c.image}
                  alt={c.name || "Category"}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash group-hover:text-theme-600 dark:group-hover:text-theme-500 transition-colors">
                {c.name}
              </div>
              <div className="text-sm font-light text-stone-500 dark:text-stone-400">{c.sub}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-char/40 dark:text-ash/40">
                  {c.count} product{c.count > 1 ? "s" : ""}
                </span>
                <svg className="w-4 h-4 text-grate dark:text-white/20 group-hover:text-theme-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BrandResults({ searchResult }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 pb-6">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResult.map((b) => (
          <Link
            prefetch={false}
            key={`search-brand-result-${b.url}`}
            href={b.url || "#"}
            className="flex items-center gap-4 p-4 rounded-sm border border-grate dark:border-white/10 bg-paper dark:bg-smoke hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200 group"
          >
            <div className="rounded-sm min-w-32 min-h-32 bg-white dark:bg-char relative overflow-hidden flex-shrink-0 border border-grate dark:border-white/10">
              {b?.image && (
                <Image
                  src={b.image}
                  alt={b.name || "Brand"}
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              )}
            </div>
            <div>
              <p className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash group-hover:text-theme-600 dark:group-hover:text-theme-500 transition-colors">
                {b.name}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{b.desc}</p>
              <p className="font-oswald text-xs font-semibold uppercase tracking-wide mt-1 text-theme-600">
                {b.count} product{b.count > 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BBQSearchPage({
  query,
  ACTIVE_TAB,
  categories,
  productTotal,
  categoryResults,
  brandResults,
  searchResults,
  urlParams,
  populars,
}) {
  if (query === "") {
    return (
      <PageWrapper>
        <IdleState populars={populars} categories={categories} />
      </PageWrapper>
    );
  }

  if (productTotal === 0) {
    return (
      <PageWrapper>
        <NoSearchResults query={query} populars={populars} categories={categories} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6">
        <p className="text-sm text-char/50 dark:text-ash/40 mb-3">
          Results found for{" "}
          <span className="font-oswald font-semibold uppercase tracking-wide text-theme-600">{query}</span>
        </p>
      </div>

      <div className="w-full border-b border-grate dark:border-white/10 mb-0 sticky top-[64px] lg:top-[105px] bg-ash dark:bg-char z-10 overflow-x-auto">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex">
            {searchResults.map((t) => (
              <Link
                key={`search-tab-${t.prop}`}
                prefetch={false}
                href={t?.url || "#"}
                className={`px-6 py-3.5 font-oswald text-sm font-semibold uppercase tracking-wide border-b-2 transition-all whitespace-nowrap ${
                  ACTIVE_TAB === t?.prop
                    ? "border-theme-600 text-theme-600 dark:text-theme-500"
                    : "border-transparent text-char/40 dark:text-ash/40 hover:text-char dark:hover:text-ash"
                }`}
              >
                {t.label}{" "}
                <span className={`ml-1 text-xs ${ACTIVE_TAB === t.prop ? "text-theme-600 dark:text-theme-500" : "text-char/30 dark:text-ash/30"}`}>
                  ({t.total || 0})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-5 items-start">
        <div className={`w-full ${ACTIVE_TAB === "product" ? "flex" : "hidden"}`}>
          <ProductsSection category="search" search={urlParams?.query || ""} />
        </div>
        <div className={`w-full ${ACTIVE_TAB === "category" ? "flex" : "hidden"}`}>
          <CategoryResults searchResult={categoryResults} />
        </div>
        <div className={`w-full ${ACTIVE_TAB === "brand" ? "flex" : "hidden"}`}>
          <BrandResults searchResult={brandResults} />
        </div>
      </div>
    </PageWrapper>
  );
}
