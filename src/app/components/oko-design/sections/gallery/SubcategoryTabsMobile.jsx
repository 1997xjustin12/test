"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

function SubcategoryTabsMobile({ subs }) {
  const pathname = usePathname();
  const active_url = `${BASE_URL}${pathname}`;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = subs?.find((s) => s?.url === active_url) ?? subs?.[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative py-2" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 border border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors rounded-[2px]"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-inter text-[13px] font-semibold uppercase tracking-[0.04em] text-oko-char dark:text-oko-cream truncate">
            {active?.name ?? "Select category"}
          </span>
          <span className="font-oko-mono text-[11px] px-1.5 py-0.5 rounded-[2px] bg-oko-barn/10 text-oko-barn dark:bg-oko-barn-light/15 dark:text-oko-barn-light flex-shrink-0">
            {active?.count}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-oko-stone flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] z-20 overflow-hidden">
          {subs?.map((s, i) => {
            const isActive = active_url === s?.url;
            return (
              <Link
                key={`mob-drop-${i}`}
                href={s?.url || "#"}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-[12.5px] font-semibold transition-colors font-inter uppercase tracking-[0.05em] ${
                  isActive
                    ? "bg-oko-barn/5 dark:bg-oko-barn-light/10 text-oko-barn dark:text-oko-barn-light"
                    : "text-oko-char-soft dark:text-oko-ondark hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 hover:text-oko-barn dark:hover:text-oko-barn-light"
                } ${i > 0 ? "border-t border-oko-stone-line dark:border-oko-line-dark" : ""}`}
              >
                <span className="truncate">{s?.name}</span>
                <span
                  className={`font-oko-mono text-[11px] px-1.5 py-0.5 rounded-[2px] flex-shrink-0 ${
                    isActive || s?.hot
                      ? "bg-oko-barn/10 text-oko-barn dark:bg-oko-barn-light/15 dark:text-oko-barn-light"
                      : "bg-oko-cream-dim dark:bg-oko-night-3 text-oko-stone"
                  }`}
                >
                  {s?.count}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubcategoryTabsMobile;
