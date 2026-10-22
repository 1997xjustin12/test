"use client";
import { useMemo } from "react";
import useComparePage from "@/app/components/compare/useComparePage";
import CompareProductHeader, { CompareProductHeaderCompact } from "@/app/components/bbq-design/sections/compare/CompareProductHeader";
import CompareSpecTable from "@/app/components/bbq-design/sections/compare/CompareSpecTable";
import CompareToolbar from "@/app/components/bbq-design/sections/compare/CompareToolbar";
import CompareEmpty, { CompareAddColumn } from "@/app/components/bbq-design/sections/compare/CompareEmpty";

// BBQ's /compare page (bbq-design-patterns.md): ash page, Oswald overline and
// uppercase heading, a grate-bordered table with labels fixed on the left.
// Behaviour is in useComparePage; data from app/(market)/compare/page.jsx.
export default function Compare({ products = [], groups = [], handles = [] }) {
  const page = useComparePage({ handles, groups });
  const mixedCategories = useMemo(
    () => new Set(products.map((p) => p.product_category?.[0]?.category_name).filter(Boolean)).size > 1,
    [products],
  );

  return (
    <div className="bg-ash dark:bg-char font-sora min-h-[60vh]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">Compare</p>
        <h1 className="font-oswald font-bold text-2xl sm:text-3xl uppercase tracking-tight text-char dark:text-ash mt-1 mb-6">
          {products.length ? `Comparing ${products.length} product${products.length === 1 ? "" : "s"}` : "Compare products"}
        </h1>

        {products.length === 0 ? (
          <CompareEmpty />
        ) : (
          <>
            <CompareToolbar page={page} mixedCategories={mixedCategories} />
            <div className="overflow-x-auto rounded-sm border border-grate dark:border-white/10 bg-paper dark:bg-smoke">
              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-[2] w-[120px] sm:w-[190px] bg-ash dark:bg-char border-b border-r border-grate dark:border-white/10 px-3 sm:px-4 py-3 text-left align-bottom">
                      <span className="font-oswald text-[11px] font-semibold uppercase tracking-wide text-char/50 dark:text-ash/40">
                        {products.length} of 4 products
                      </span>
                      <span ref={page.headerSentinel} aria-hidden="true" className="block h-px" />
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.handle}
                        scope="col"
                        className="w-[160px] sm:w-[240px] min-w-[160px] sm:min-w-[240px] border-b border-grate dark:border-white/10 align-top text-left font-normal"
                      >
                        <CompareProductHeader product={product} onRemove={page.removeProduct} />
                      </th>
                    ))}
                    {page.canAddMore && (
                      <th className="w-[160px] sm:w-[240px] min-w-[160px] sm:min-w-[240px] border-b border-grate dark:border-white/10 align-top font-normal">
                        <CompareAddColumn />
                      </th>
                    )}
                  </tr>
                </thead>
                <CompareSpecTable
                  products={products}
                  groups={page.visibleGroups}
                  onlyDifferences={page.onlyDifferences}
                  highlightDifferences={page.highlightDifferences}
                  spareColumn={page.canAddMore}
                />
              </table>
            </div>

            {page.headerStuck && (
              <div className="fixed inset-x-3 bottom-24 sm:inset-x-24 sm:bottom-4 z-40 flex justify-center pointer-events-none">
                <div
                  className="pointer-events-auto w-full max-w-[880px] grid gap-3 px-4 py-2.5 bg-paper dark:bg-smoke border border-grate dark:border-white/10 border-t-2 border-t-theme-600 rounded-sm shadow-lg shadow-char/10"
                  style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
                >
                  {products.map((product) => (
                    <CompareProductHeaderCompact key={product.handle} product={product} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
