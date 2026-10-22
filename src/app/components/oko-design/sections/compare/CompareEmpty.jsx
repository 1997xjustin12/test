import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

// The empty states on /compare, OKO's design: the §9 empty state — centred
// slab heading, 13.5px stone line, one barn button (oko-design-patterns.md).

export default function CompareEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-center">
      <svg className="w-8 h-8 text-oko-barn dark:text-oko-barn-light mb-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M12 3v18" />
      </svg>
      <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream mb-2">Nothing to compare yet</h2>
      <p className="font-inter text-[13.5px] text-oko-stone mb-6 max-w-sm leading-relaxed">
        Tick Compare on up to four products, then open the comparison from the bar at the bottom of the page.
      </p>
      <Link
        href={`${BASE_URL}/categories`}
        prefetch={false}
        className="px-6 py-3 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] transition-colors"
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
      className="m-3 sm:m-4 flex flex-col items-center justify-center gap-2 h-[calc(100%-1.5rem)] min-h-[220px] rounded-[2px] border border-dashed border-oko-stone-line dark:border-oko-line-dark text-oko-stone hover:border-oko-barn hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span className="font-inter text-[12.5px] font-semibold">Add another product</span>
    </Link>
  );
}
