"use client";

// The controls above the table on /compare, OKO's design: square barn
// checkboxes, Inter labels, a bordered note for mixed categories — no pill,
// no shadow (oko-design-patterns.md §5). State lives in useComparePage.

const checkboxCls = "w-4 h-4 rounded-[2px] accent-oko-barn flex-shrink-0 cursor-pointer";
const labelCls = "inline-flex items-center gap-2 font-inter text-[13px] font-semibold text-oko-char dark:text-oko-cream cursor-pointer select-none";

// Share this comparison: OKO's secondary outline button (2px, char border,
// inverts on hover), a stroke icon, no emoji (§6); sage with a check once
// copied (§5 — sage marks the reassuring path). Behaviour is in useComparePage.
function ShareButton({ page }) {
  const done = page.shareState === "copied" || page.shareState === "shared";
  return (
    <button
      type="button"
      onClick={page.share}
      className={`inline-flex items-center gap-2 h-9 px-4 rounded-[2px] border font-inter text-[13px] font-semibold transition-colors ${
        done
          ? "border-oko-sage dark:border-oko-sage-light text-oko-sage dark:text-oko-sage-light"
          : "border-oko-char dark:border-oko-cream text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char"
      }`}
    >
      {done ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
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
          <span className="font-normal text-[12px] text-oko-stone">({page.differenceCount} specs differ)</span>
        </label>
        <label className={labelCls}>
          <input type="checkbox" className={checkboxCls} checked={page.highlightDifferences} onChange={(e) => page.setHighlightDifferences(e.target.checked)} />
          Highlight differences
        </label>
      </div>
      <ShareButton page={page} />
      </div>
      {mixedCategories && (
        <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark border-l-2 border-l-oko-barn rounded-[2px] px-3.5 py-2.5">
          These products are in different categories, so many specs only apply to some of them.
        </p>
      )}
    </div>
  );
}
