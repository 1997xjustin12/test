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
        className="w-full flex items-center justify-between gap-3 px-3 py-2 border border-grate dark:border-white/10 bg-ash dark:bg-char hover:border-theme-600 dark:hover:border-theme-600/50 transition-colors rounded-sm"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-oswald text-sm font-medium uppercase tracking-wide text-char dark:text-ash truncate">
            {active?.name ?? "Select category"}
          </span>
          <span className="font-oswald text-xs px-2 py-0.5 font-medium bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500 flex-shrink-0">
            {active?.count}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-char/40 dark:text-ash/30 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm shadow-lg shadow-char/10 dark:shadow-black/30 z-20 overflow-hidden">
          {subs?.map((s, i) => {
            const isActive = active_url === s?.url;
            return (
              <Link
                key={`mob-drop-${i}`}
                href={s?.url || "#"}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors font-oswald uppercase tracking-wide ${
                  isActive
                    ? "bg-theme-600/5 dark:bg-theme-600/10 text-theme-600 dark:text-theme-500"
                    : "text-char/70 dark:text-ash/60 hover:bg-ash dark:hover:bg-white/5 hover:text-char dark:hover:text-ash"
                } ${i > 0 ? "border-t border-grate dark:border-white/10" : ""}`}
              >
                <span className="truncate">{s?.name}</span>
                <span
                  className={`font-oswald text-xs px-2 py-0.5 font-medium flex-shrink-0 ${
                    isActive
                      ? "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500"
                      : s?.hot
                      ? "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500"
                      : "bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40"
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
