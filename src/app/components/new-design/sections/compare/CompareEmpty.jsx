import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

// The empty states on /compare, Solana's design (new-design-patterns.md
// empty-state block): a soft card with one theme-colour button.

/** No (valid) products in the address. */
export default function CompareEmpty() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-theme-50 dark:bg-[color-mix(in_oklab,var(--theme-primary-600)_20%,#171717)] text-theme-600 dark:text-theme-500 flex items-center justify-center mb-4">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl text-charcoal dark:text-white mb-2">Nothing to compare yet</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        Tick <strong>Compare</strong> on up to four products, then open the comparison from the tray at the bottom of the page.
      </p>
      <Link
        href={`${BASE_URL}/categories`}
        prefetch={false}
        className="px-5 py-2.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white text-sm font-semibold transition-colors"
      >
        Browse products
      </Link>
    </div>
  );
}

/** The spare column while fewer than four products are shown. */
export function CompareAddColumn() {
  return (
    <Link
      href={`${BASE_URL}/categories`}
      prefetch={false}
      className="m-3 sm:m-4 flex flex-col items-center justify-center gap-2 h-[calc(100%-1.5rem)] min-h-[220px] rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 hover:border-theme-500 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span className="text-xs font-semibold">Add another product</span>
    </Link>
  );
}
