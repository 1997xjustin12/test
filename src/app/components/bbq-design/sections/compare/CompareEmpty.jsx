import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

// The empty states on /compare, BBQ's design (bbq-design-patterns.md empty
// state block and primary CTA).

export default function CompareEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm text-center">
      <div className="w-12 h-12 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center text-theme-600 mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18" />
        </svg>
      </div>
      <h2 className="font-oswald font-bold text-2xl uppercase text-char dark:text-ash mb-2">Nothing to compare yet</h2>
      <p className="font-sora text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400 max-w-sm mb-6">
        Tick <strong className="font-semibold">Compare</strong> on up to four products, then open the comparison from the tray at the bottom of the page.
      </p>
      <Link
        href={`${BASE_URL}/categories`}
        prefetch={false}
        className="px-6 py-2.5 bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm transition-colors"
      >
        Browse products
      </Link>
    </div>
  );
}

export function CompareAddColumn() {
  return (
    <Link
      href={`${BASE_URL}/categories`}
      prefetch={false}
      className="m-3 sm:m-4 flex flex-col items-center justify-center gap-2 h-[calc(100%-1.5rem)] min-h-[220px] rounded-sm border-2 border-dashed border-grate dark:border-white/15 text-char/35 dark:text-ash/30 hover:border-theme-600 hover:text-theme-600 transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span className="font-oswald text-xs font-semibold uppercase tracking-wide">Add another product</span>
    </Link>
  );
}
