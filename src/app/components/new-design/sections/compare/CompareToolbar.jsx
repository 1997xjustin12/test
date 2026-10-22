"use client";

// The controls above the table on /compare, Solana's design: theme-colour
// checkboxes as switches, a soft amber note for mixed categories
// (new-design-patterns.md). State lives in useComparePage.

const checkboxCls = "h-4 w-4 rounded accent-[var(--theme-primary-600)] flex-shrink-0 cursor-pointer";

export default function CompareToolbar({ page, mixedCategories }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
          <input
            type="checkbox"
            className={checkboxCls}
            checked={page.onlyDifferences}
            onChange={(e) => page.setOnlyDifferences(e.target.checked)}
          />
          Show only differences
          <span className="text-xs text-neutral-400 dark:text-neutral-500">({page.differenceCount} specs differ)</span>
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
          <input
            type="checkbox"
            className={checkboxCls}
            checked={page.highlightDifferences}
            onChange={(e) => page.setHighlightDifferences(e.target.checked)}
          />
          Highlight differences
        </label>
      </div>
      {mixedCategories && (
        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-3.5 py-2.5">
          These products are in different categories, so many specs only apply to some of them.
        </p>
      )}
    </div>
  );
}
