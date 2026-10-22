"use client";
import Link from "next/link";
import Image from "next/image";
import useCompareTray from "@/app/components/compare/useCompareTray";

// OKO's compare tray, drawn to oko-design-patterns.md: a floating surface, so
// solid char with a border and no shadow (§5); 2px corners, cream image wells,
// one barn action. Behaviour is in useCompareTray. Clear of the chat launchers
// in both bottom corners, as on every brand.
export default function CompareTray() {
  const tray = useCompareTray();
  if (!tray.visible) return null;

  return (
    <div
      role="region"
      aria-label="Compare products"
      className="fixed inset-x-3 bottom-24 sm:inset-x-24 sm:bottom-4 z-40 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-[880px] bg-oko-char border border-oko-line-dark rounded-[2px] text-oko-cream">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={tray.toggleCollapsed}
            aria-expanded={!tray.collapsed}
            className="flex items-center gap-2"
          >
            <span className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn-light">Compare</span>
            <span className="font-inter text-[13px] font-semibold text-oko-cream">
              {tray.count} of {tray.limit} products
            </span>
            <svg
              className={`w-4 h-4 text-oko-ondark-faint transition-transform ${tray.collapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
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
              className="font-inter text-[12.5px] font-semibold text-oko-ondark-muted border-b border-transparent hover:border-oko-ondark-muted transition-colors"
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
                <li key={item.handle} className="relative flex flex-col gap-1.5 p-2 rounded-[2px] border border-oko-line-dark bg-oko-night-2">
                  <div className="relative w-full h-14 sm:h-16 bg-oko-cream-dim rounded-[2px] overflow-hidden">
                    {item.image && <Image src={item.image} alt={item.title} fill sizes="96px" className="object-contain p-1" />}
                  </div>
                  <p className="hidden sm:block font-inter text-[11px] leading-snug text-oko-ondark line-clamp-2" title={item.title}>
                    {item.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => tray.remove(item.handle)}
                    aria-label={`Remove ${item.title} from compare`}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-[2px] bg-oko-cream text-oko-char border border-oko-char hover:bg-oko-barn hover:text-white hover:border-oko-barn flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
              {Array.from({ length: tray.emptySlots }).map((_, i) => (
                <li
                  key={`empty-${i}`}
                  className="flex items-center justify-center aspect-square sm:aspect-auto rounded-[2px] border border-dashed border-oko-line-dark font-inter text-[11px] text-oko-ondark-faint text-center p-2"
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
  const size = compact ? "px-3 py-1.5 text-[12px]" : "w-full px-4 py-3 text-[13.5px]";
  if (!tray.canCompare) {
    return (
      <span className={`${size} rounded-[2px] border border-dashed border-oko-line-dark text-oko-ondark-faint font-inter font-semibold text-center`}>
        Add {tray.needed} more to compare
      </span>
    );
  }
  return (
    <Link
      href={tray.compareUrl}
      prefetch={false}
      className={`${size} rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-center transition-colors`}
    >
      Compare ({tray.count})
    </Link>
  );
}
