import Link from "next/link";
import Image from "next/image";
import IdleState from "@/app/components/oko-design/sections/search/IdleState";
import NoSearchResults from "@/app/components/oko-design/sections/search/NoSearchResults";
import ProductsSection from "@/app/components/molecule/ProductsSectionV2";
import { BASE_URL } from "@/app/lib/helpers";

const PageWrapper = ({ children }) => (
  <div className="min-h-screen bg-oko-cream dark:bg-oko-night text-oko-char dark:text-oko-cream font-inter">
    <div className="max-w-[1240px] mx-auto">{children}</div>
  </div>
);

function CategoryResults({ searchResult }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 pb-6">
      <div className="divide-y divide-oko-stone-line dark:divide-oko-line-dark">
        {searchResult.map((c, i) => (
          <Link
            prefetch={false}
            key={`category-search-result-${c?.slug}-${i}`}
            href={`${BASE_URL}/category/${c?.slug}`}
            className="flex gap-3 px-2 py-4 hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 transition-colors group"
          >
            <div className="rounded-[2px] min-w-32 min-h-32 bg-white dark:bg-oko-night relative overflow-hidden flex-shrink-0 border border-oko-stone-line dark:border-oko-line-dark">
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
              <div className="font-inter font-medium text-[14px] leading-[1.3] text-oko-char dark:text-oko-cream group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors">
                {c.name}
              </div>
              <div className="text-[13.5px] text-oko-stone">{c.sub}</div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-oko-stone">
                  {c.count} product{c.count > 1 ? "s" : ""}
                </span>
                <svg className="w-4 h-4 text-oko-stone-line dark:text-oko-line-dark group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
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
            className="flex items-center gap-4 p-4 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2 hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors group"
          >
            <div className="rounded-[2px] min-w-32 min-h-32 bg-white dark:bg-oko-night relative overflow-hidden flex-shrink-0 border border-oko-stone-line dark:border-oko-line-dark">
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
              <p className="font-oko-display text-[15px] font-semibold text-oko-char dark:text-oko-cream group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors">
                {b.name}
              </p>
              <p className="text-[12px] text-oko-stone mt-0.5">{b.desc}</p>
              <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] mt-1 text-oko-barn dark:text-oko-barn-light">
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
        <p className="text-[13px] text-oko-char-soft dark:text-oko-ondark mb-3">
          Results found for{" "}
          <span className="font-inter font-semibold text-oko-barn dark:text-oko-barn-light">{query}</span>
        </p>
      </div>

      <div className="w-full border-b border-oko-stone-line dark:border-oko-line-dark mb-0 sticky top-[64px] lg:top-[105px] bg-white dark:bg-oko-night-2 z-10 overflow-x-auto">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex -mb-px">
            {searchResults.map((t) => (
              <Link
                key={`search-tab-${t.prop}`}
                prefetch={false}
                href={t?.url || "#"}
                className={`flex items-center gap-2 px-4 py-3.5 whitespace-nowrap border-b-2 transition-colors font-inter font-semibold text-[12.5px] uppercase tracking-[0.05em] ${
                  ACTIVE_TAB === t?.prop
                    ? "border-oko-barn dark:border-oko-barn-light text-oko-barn dark:text-oko-barn-light"
                    : "border-transparent text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light hover:border-oko-barn dark:hover:border-oko-barn-light"
                }`}
              >
                {t.label}
                <span
                  className={`font-oko-mono text-[11px] px-1.5 py-0.5 rounded-[2px] ${
                    ACTIVE_TAB === t.prop
                      ? "bg-oko-barn/10 text-oko-barn dark:bg-oko-barn-light/15 dark:text-oko-barn-light"
                      : "bg-oko-cream-dim dark:bg-oko-night-3 text-oko-stone"
                  }`}
                >
                  {t.total || 0}
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
