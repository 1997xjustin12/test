"use client";

// The controls above the table on /compare, OKO's design: square barn
// checkboxes, Inter labels, a bordered note for mixed categories — no pill,
// no shadow (oko-design-patterns.md §5). State lives in useComparePage.

const checkboxCls = "w-4 h-4 rounded-[2px] accent-oko-barn flex-shrink-0 cursor-pointer";
const labelCls = "inline-flex items-center gap-2 font-inter text-[13px] font-semibold text-oko-char dark:text-oko-cream cursor-pointer select-none";

export default function CompareToolbar({ page, mixedCategories }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
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
      {mixedCategories && (
        <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark border-l-2 border-l-oko-barn rounded-[2px] px-3.5 py-2.5">
          These products are in different categories, so many specs only apply to some of them.
        </p>
      )}
    </div>
  );
}
