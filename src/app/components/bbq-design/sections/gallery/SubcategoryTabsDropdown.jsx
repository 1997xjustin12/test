"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import SubcategoryTabsMobile from "./SubcategoryTabsMobile";

const VISIBLE_COUNT = 3;

function SubcategoryTabsDropdown({ subs }) {
  const pathname = usePathname();
  const active_url = `${BASE_URL}${pathname}`;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const visible = subs?.slice(0, VISIBLE_COUNT) ?? [];
  const overflow = subs?.slice(VISIBLE_COUNT) ?? [];
  const activeInOverflow = overflow.some((s) => s?.url === active_url);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabClass = (url) =>
    `flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 font-oswald uppercase tracking-wide ${
      active_url === url
        ? "border-theme-600 text-theme-600 dark:text-theme-500"
        : "border-transparent text-char/60 dark:text-ash/50 hover:text-char dark:hover:text-ash hover:border-grate dark:hover:border-white/20"
    }`;

  const badgeClass = (url, hot) =>
    `text-xs px-2 py-0.5 font-medium font-oswald ${
      active_url === url
        ? "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500"
        : hot
        ? "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500"
        : "bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40"
    }`;

  return (
    <>
      {/* Mobile / Tablet */}
      <div className="block lg:hidden">
        <SubcategoryTabsMobile subs={subs} />
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex items-center gap-0 -mb-px">
        {visible.map((s, i) => (
          <Link
            key={`desk-tab-${i}`}
            href={s?.url || "#"}
            className={tabClass(s?.url)}
          >
            {s?.name}
            <span className={badgeClass(s?.url, s?.hot)}>{s?.count}</span>
          </Link>
        ))}

        {overflow.length > 0 && (
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex font-oswald uppercase tracking-wide items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeInOverflow
                  ? "border-theme-600 text-theme-600 dark:text-theme-500"
                  : "border-transparent text-char/60 dark:text-ash/50 hover:text-char dark:hover:text-ash hover:border-grate"
              }`}
            >
              {activeInOverflow ? "More •" : `More (${overflow.length})`}
              <span className="inline-block w-[0.625rem] text-center text-[10px] leading-none">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
              <div className="absolute top-full left-0 mt-1 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm shadow-lg shadow-char/10 dark:shadow-black/30 z-20 min-w-[200px] py-1">
                {overflow.map((s, i) => (
                  <Link
                    key={`desk-overflow-${i}`}
                    href={s?.url || "#"}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-colors font-oswald uppercase tracking-wide ${
                      active_url === s?.url
                        ? "text-theme-600 dark:text-theme-500 bg-theme-600/5 dark:bg-theme-600/10"
                        : "text-char/70 dark:text-ash/60 hover:bg-ash dark:hover:bg-white/5 hover:text-char dark:hover:text-ash"
                    }`}
                  >
                    {s?.name}
                    <span className={badgeClass(s?.url, s?.hot)}>{s?.count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SubcategoryTabsDropdown;
