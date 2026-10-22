"use client";
import { useMemo } from "react";
import useComparePage from "@/app/components/compare/useComparePage";
import CompareProductHeader, { CompareProductHeaderCompact } from "@/app/components/oko-design/sections/compare/CompareProductHeader";
import CompareSpecTable from "@/app/components/oko-design/sections/compare/CompareSpecTable";
import CompareToolbar from "@/app/components/oko-design/sections/compare/CompareToolbar";
import CompareEmpty, { CompareAddColumn } from "@/app/components/oko-design/sections/compare/CompareEmpty";

// OKO's /compare page (oko-design-patterns.md): cream page, the §8.7 section
// header (mono barn eyebrow over a slab heading), a §9 specs table with labels
// fixed on the left. The compact bar is a floating surface: solid char, no
// shadow (§5). Behaviour is in useComparePage; data from
// app/(market)/compare/page.jsx.
export default function Compare({ products = [], groups = [], handles = [] }) {
  const page = useComparePage({ handles, groups });
  const mixedCategories = useMemo(
    () => new Set(products.map((p) => p.product_category?.[0]?.category_name).filter(Boolean)).size > 1,
    [products],
  );

  return (
    <div className="bg-oko-cream dark:bg-oko-night min-h-[60vh]">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
          Compare
        </span>
        <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream mb-6">
          {products.length ? `Comparing ${products.length} product${products.length === 1 ? "" : "s"}` : "Compare products"}
        </h1>

        {products.length === 0 ? (
          <CompareEmpty />
        ) : (
          <>
            <CompareToolbar page={page} mixedCategories={mixedCategories} />
            <div className="overflow-x-auto rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2">
              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-[2] w-[120px] sm:w-[190px] bg-oko-cream-dim dark:bg-oko-night-3 border-b border-r border-oko-stone-line dark:border-oko-line-dark px-3 sm:px-4 py-3 text-left align-bottom">
                      <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone">
                        {products.length} of 4 products
                      </span>
                      <span ref={page.headerSentinel} aria-hidden="true" className="block h-px" />
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.handle}
                        scope="col"
                        className="w-[160px] sm:w-[240px] min-w-[160px] sm:min-w-[240px] border-b border-oko-stone-line dark:border-oko-line-dark align-top text-left font-normal"
                      >
                        <CompareProductHeader product={product} onRemove={page.removeProduct} />
                      </th>
                    ))}
                    {page.canAddMore && (
                      <th className="w-[160px] sm:w-[240px] min-w-[160px] sm:min-w-[240px] border-b border-oko-stone-line dark:border-oko-line-dark align-top font-normal">
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
                  className="pointer-events-auto w-full max-w-[880px] grid gap-3 px-4 py-2.5 bg-oko-char border border-oko-line-dark rounded-[2px]"
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
