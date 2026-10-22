"use client";
import Link from "next/link";
import Image from "next/image";
import useCompareTray from "@/app/components/compare/useCompareTray";

// BBQ's compare tray, drawn to bbq-design-patterns.md: a paper panel with a
// grate border and near-square corners, Oswald uppercase labels, theme-colour
// primary CTA. Behaviour is in useCompareTray. Clear of the chat launchers in
// both bottom corners, as on every brand.
export default function CompareTray() {
  const tray = useCompareTray();
  if (!tray.visible) return null;

  return (
    <div
      role="region"
      aria-label="Compare products"
      className="fixed inset-x-3 bottom-24 sm:inset-x-24 sm:bottom-4 z-40 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-[880px] bg-paper dark:bg-smoke border border-grate dark:border-white/10 border-t-2 border-t-theme-600 rounded-sm shadow-lg shadow-char/10 dark:shadow-black/40">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={tray.toggleCollapsed}
            aria-expanded={!tray.collapsed}
            className="flex items-center gap-2 font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash"
          >
            Compare products
            <span className="font-sora normal-case tracking-normal text-xs font-normal text-char/50 dark:text-ash/40">
              ({tray.count} of {tray.limit})
            </span>
            <svg
              className={`w-4 h-4 text-char/40 dark:text-ash/40 transition-transform ${tray.collapsed ? "rotate-180" : ""}`}
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
              className="font-oswald text-[11px] font-semibold uppercase tracking-wide text-char/50 dark:text-ash/40 hover:text-theme-600 transition-colors"
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
                  className="relative flex flex-col items-center gap-1.5 p-2 rounded-sm border border-grate dark:border-white/10 bg-white dark:bg-char"
                >
                  <div className="relative w-full h-14 sm:h-16 bg-white dark:bg-char overflow-hidden">
                    {item.image && <Image src={item.image} alt={item.title} fill sizes="96px" className="object-contain p-1" />}
                  </div>
                  <p className="hidden sm:block w-full font-sora text-[11px] leading-snug text-char/80 dark:text-ash/70 line-clamp-2" title={item.title}>
                    {item.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => tray.remove(item.handle)}
                    aria-label={`Remove ${item.title} from compare`}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-sm bg-char dark:bg-ash text-ash dark:text-char hover:bg-theme-600 hover:text-white flex items-center justify-center transition-colors"
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
                  className="flex items-center justify-center aspect-square sm:aspect-auto rounded-sm border border-dashed border-grate dark:border-white/15 font-oswald text-[10px] uppercase tracking-wide text-char/35 dark:text-ash/30 text-center p-2"
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
  const size = compact ? "px-3 py-1.5 text-[11px]" : "w-full px-4 py-2.5 text-sm";
  if (!tray.canCompare) {
    return (
      <span className={`${size} rounded-sm bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40 font-oswald font-semibold uppercase tracking-wide text-center`}>
        Add {tray.needed} more to compare
      </span>
    );
  }
  return (
    <Link
      href={tray.compareUrl}
      prefetch={false}
      className={`${size} rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold uppercase tracking-wide text-center transition-colors`}
    >
      Compare ({tray.count})
    </Link>
  );
}
