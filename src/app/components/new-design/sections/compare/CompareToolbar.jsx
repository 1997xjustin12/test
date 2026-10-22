"use client";

// The controls above the table on /compare, Solana's design: theme-colour
// checkboxes as switches, a soft amber note for mixed categories
// (new-design-patterns.md). State lives in useComparePage.

const checkboxCls = "h-4 w-4 rounded accent-[var(--theme-primary-600)] flex-shrink-0 cursor-pointer";

// Share this comparison: a soft rounded secondary button with a share icon,
// turning green with a check once the link is copied. Behaviour (share sheet
// or copy, the label) is in useComparePage.
function ShareButton({ page }) {
  const done = page.shareState === "copied" || page.shareState === "shared";
  return (
    <button
      type="button"
      onClick={page.share}
      className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border text-sm font-semibold transition-colors ${
        done
          ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:border-theme-500 hover:text-theme-600 dark:hover:text-theme-500"
      }`}
    >
      {done ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" />
        </svg>
      )}
      <span aria-live="polite">{page.shareLabel}</span>
    </button>
  );
}

export default function CompareToolbar({ page, mixedCategories }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
      <ShareButton page={page} />
      </div>
      {mixedCategories && (
        <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl px-3.5 py-2.5">
          These products are in different categories, so many specs only apply to some of them.
        </p>
      )}
    </div>
  );
}
