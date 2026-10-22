"use client";
import { useMemo } from "react";
import useComparePage from "@/app/components/compare/useComparePage";
import CompareProductHeader, { CompareProductHeaderCompact } from "@/app/components/new-design/sections/compare/CompareProductHeader";
import CompareSpecTable from "@/app/components/new-design/sections/compare/CompareSpecTable";
import CompareToolbar from "@/app/components/new-design/sections/compare/CompareToolbar";
import CompareEmpty, { CompareAddColumn } from "@/app/components/new-design/sections/compare/CompareEmpty";

// Solana's /compare page (new-design-patterns.md): overline + serif heading,
// a soft rounded table with the labels fixed on the left so a phone can swipe
// through the products. Behaviour is in useComparePage; the products and rows
// come from app/(market)/compare/page.jsx.
export default function Compare({ products = [], groups = [], handles = [] }) {
  const page = useComparePage({ handles, groups });

  // Different categories → many specs only apply to some products.
  const mixedCategories = useMemo(() => {
    const names = new Set(products.map((p) => p.product_category?.[0]?.category_name).filter(Boolean));
    return names.size > 1;
  }, [products]);

  return (
    <div className="bg-cream dark:bg-stone-950 min-h-[60vh]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 dark:text-theme-500 mb-1.5">Compare</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white leading-tight mb-6">
          {products.length ? `Comparing ${products.length} product${products.length === 1 ? "" : "s"}` : "Compare products"}
        </h1>

        {products.length === 0 ? (
          <CompareEmpty />
        ) : (
          <>
            <CompareToolbar page={page} mixedCategories={mixedCategories} />
            <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <table className="w-full border-collapse min-w-max">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-[2] w-[120px] sm:w-[190px] bg-neutral-50 dark:bg-neutral-900 border-b border-r border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-3 text-left align-bottom">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {products.length} of 4 products
                      </span>
                      {/* When this scrolls out of view, the compact bar appears. */}
                      <span ref={page.headerSentinel} aria-hidden="true" className="block h-px" />
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.handle}
                        scope="col"
                        className="w-[160px] sm:w-[240px] min-w-[160px] sm:min-w-[240px] border-b border-neutral-200 dark:border-neutral-800 align-top text-left font-normal"
                      >
                        <CompareProductHeader product={product} onRemove={page.removeProduct} />
                      </th>
                    ))}
                    {page.canAddMore && (
                      <th className="w-[160px] sm:w-[240px] min-w-[160px] sm:min-w-[240px] border-b border-neutral-200 dark:border-neutral-800 align-top font-normal">
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

            {/* Compact header: the bottom of the screen is free here (the tray
                hides on /compare); the navbar owns the top. */}
            {page.headerStuck && (
              <div className="fixed inset-x-3 bottom-24 sm:inset-x-24 sm:bottom-4 z-40 flex justify-center pointer-events-none">
                <div className="pointer-events-auto w-full max-w-[880px] grid gap-3 px-4 py-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl shadow-neutral-900/10"
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
