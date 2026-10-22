"use client";
import Link from "next/link";
import Image from "next/image";
import useCompareTray from "@/app/components/compare/useCompareTray";

// Solana's compare tray, drawn to new-design-patterns.md: a soft white card
// (rounded-2xl, light shadow) floating at the bottom of the screen. Behaviour
// is in useCompareTray.
//
// It keeps clear of the two chat launchers fixed in the bottom corners (the AI
// chat bottom-left, Zoho bottom-right): side margins on wider screens, and on
// phones it floats above them.
export default function CompareTray() {
  const tray = useCompareTray();
  if (!tray.visible) return null;

  return (
    <div
      role="region"
      aria-label="Compare products"
      className={`fixed inset-x-3 sm:inset-x-24 ${tray.bottomClass} z-40 flex justify-center pointer-events-none`}
    >
      <div className="pointer-events-auto w-full min-w-0 max-w-[880px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl shadow-neutral-900/10 dark:shadow-black/40">
        {/* Header: count, collapse, clear */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={tray.toggleCollapsed}
            aria-expanded={!tray.collapsed}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white"
          >
            Compare products
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              ({tray.count} of {tray.limit})
            </span>
            <svg
              className={`w-4 h-4 text-neutral-400 transition-transform ${tray.collapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={tray.clear}
              className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
            >
              Clear all
            </button>
            {tray.collapsed && <CompareButton tray={tray} compact />}
          </div>
        </div>

        {!tray.collapsed && (
          <div className="flex flex-col sm:flex-row gap-3 px-4 pb-4">
            <ul className="grid grid-cols-4 gap-2 flex-1">
              {tray.items.map((item) => (
                <li
                  key={item.handle}
                  className="relative flex flex-col items-center gap-1.5 p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50"
                >
                  <div className="relative w-full h-14 sm:h-16 rounded-lg bg-white dark:bg-neutral-800 overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill sizes="96px" className="object-contain p-1" />
                    )}
                  </div>
                  <p className="hidden sm:block w-full text-[11px] leading-snug text-neutral-700 dark:text-neutral-300 line-clamp-2" title={item.title}>
                    {item.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => tray.remove(item.handle)}
                    aria-label={`Remove ${item.title} from compare`}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 flex items-center justify-center shadow-sm transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
              {Array.from({ length: tray.emptySlots }).map((_, i) => (
                <li
                  key={`empty-${i}`}
                  className="flex items-center justify-center aspect-square sm:aspect-auto rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-[11px] text-neutral-400 dark:text-neutral-500 text-center p-2"
                >
                  Add a product
                </li>
              ))}
            </ul>
            <div className="flex sm:flex-col justify-center gap-2 sm:w-44">
              <CompareButton tray={tray} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CompareButton({ tray, compact = false }) {
  const size = compact ? "px-3 py-1.5 text-xs" : "w-full px-4 py-2.5 text-sm";
  if (!tray.canCompare) {
    return (
      <span className={`${size} rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold text-center`}>
        Add {tray.needed} more to compare
      </span>
    );
  }
  return (
    <Link
      href={tray.compareUrl}
      prefetch={false}
      className={`${size} rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold text-center transition-colors`}
    >
      Compare ({tray.count})
    </Link>
  );
}
