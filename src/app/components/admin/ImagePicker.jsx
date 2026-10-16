"use client";

/**
 * A grid of ready-made images to pick from, for the Favicon & Logo admin.
 *
 * The options are every image in public/favicon or public/logo, listed at
 * build time in next.config.ts. Picking one only selects it — the updater's
 * own Save button applies it, exactly as a pasted URL would.
 *
 * Files named for this brand ("bbq-…" on BBQ) come first; the rest stay
 * selectable. Each thumbnail sits half on light, half on dark, because a logo
 * that vanishes on one of them is the usual surprise.
 *
 * @param options   image paths, e.g. ["/favicon/bbq-favicon.ico", …]
 * @param current   the path saved now, marked "Current"
 * @param selected  the path picked but not yet saved
 * @param brand     STORE_ID, to put this brand's files first
 * @param wide      logo tiles (2:1) rather than favicon tiles (1:1)
 */
export default function ImagePicker({ options = [], current, selected, onSelect, brand, wide = false, folder }) {
  if (!options.length) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No images yet. Add files to <code className="font-mono">public/{folder}</code> and deploy — they appear here.
      </p>
    );
  }

  const nameOf = (src) => decodeURIComponent(src.split("/").pop());
  const isBrand = (src) => brand && nameOf(src).toLowerCase().startsWith(`${brand}-`);
  const sorted = [...options].sort((a, b) => Number(isBrand(b)) - Number(isBrand(a)));

  return (
    <ul className={`grid gap-3 ${wide ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"}`}>
      {sorted.map((src) => {
        const isCurrent = src === current;
        const isSelected = src === selected;
        return (
          <li key={src}>
            <button
              type="button"
              onClick={() => onSelect(src)}
              aria-pressed={isSelected}
              title={nameOf(src)}
              className={`w-full text-left rounded-lg border-2 overflow-hidden transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                isSelected
                  ? "border-blue-600"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
              }`}
            >
              <div className="grid grid-cols-2 aspect-[2/1]">
                {["bg-white", "bg-gray-900"].map((bg) => (
                  <div key={bg} className={`${bg} flex items-center justify-center p-2`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails; .ico is not an optimisable format */}
                    <img src={src} alt="" className={`max-w-full max-h-full object-contain ${wide ? "" : "w-8 h-8"}`} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-800">
                <span className="flex-1 min-w-0 truncate text-xs text-gray-700 dark:text-gray-200">{nameOf(src)}</span>
                {isCurrent && (
                  <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-green-100 text-green-800">
                    Current
                  </span>
                )}
                {isSelected && !isCurrent && (
                  <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    Selected
                  </span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
