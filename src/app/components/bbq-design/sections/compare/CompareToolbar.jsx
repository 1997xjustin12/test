"use client";

// The controls above the table on /compare, BBQ's design: near-square theme
// checkboxes, Oswald labels, a gold-edged note for mixed categories
// (bbq-design-patterns.md). State lives in useComparePage.

const checkboxCls = "h-4 w-4 rounded-sm accent-[var(--theme-primary-600)] flex-shrink-0 cursor-pointer";
const labelCls = "inline-flex items-center gap-2 font-oswald text-xs font-semibold uppercase tracking-wide text-char dark:text-ash cursor-pointer select-none";

// Share this comparison: BBQ's outline button — near-square, Oswald
// uppercase, theme on hover — turning bbq-green with a check once copied.
// Behaviour is in useComparePage.
function ShareButton({ page }) {
  const done = page.shareState === "copied" || page.shareState === "shared";
  return (
    <button
      type="button"
      onClick={page.share}
      className={`inline-flex items-center gap-2 h-9 px-4 rounded-sm border font-oswald text-xs font-semibold uppercase tracking-wide transition-colors ${
        done
          ? "border-bbq-green text-bbq-green"
          : "border-grate dark:border-white/15 bg-paper dark:bg-smoke text-char dark:text-ash hover:border-theme-600 hover:text-theme-600"
      }`}
    >
      {done ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
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
        <label className={labelCls}>
          <input type="checkbox" className={checkboxCls} checked={page.onlyDifferences} onChange={(e) => page.setOnlyDifferences(e.target.checked)} />
          Show only differences
          <span className="font-sora normal-case tracking-normal font-normal text-char/40 dark:text-ash/30">({page.differenceCount} specs differ)</span>
        </label>
        <label className={labelCls}>
          <input type="checkbox" className={checkboxCls} checked={page.highlightDifferences} onChange={(e) => page.setHighlightDifferences(e.target.checked)} />
          Highlight differences
        </label>
      </div>
      <ShareButton page={page} />
      </div>
      {mixedCategories && (
        <p className="font-sora text-xs sm:text-sm text-char/80 dark:text-ash/80 bg-paper dark:bg-smoke border border-grate dark:border-white/10 border-l-4 border-l-gold rounded-sm px-3.5 py-2.5">
          These products are in different categories, so many specs only apply to some of them.
        </p>
      )}
    </div>
  );
}
