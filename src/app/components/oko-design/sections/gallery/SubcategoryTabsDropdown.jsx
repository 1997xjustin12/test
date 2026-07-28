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
    `flex items-center gap-2 px-4 py-3.5 whitespace-nowrap border-b-2 transition-colors flex-shrink-0 font-inter font-semibold text-[12.5px] uppercase tracking-[0.05em] ${
      active_url === url
        ? "border-oko-barn dark:border-oko-barn-light text-oko-barn dark:text-oko-barn-light"
        : "border-transparent text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light hover:border-oko-barn dark:hover:border-oko-barn-light"
    }`;

  const badgeClass = (url, hot) =>
    `font-oko-mono text-[11px] px-1.5 py-0.5 rounded-[2px] ${
      active_url === url || hot
        ? "bg-oko-barn/10 text-oko-barn dark:bg-oko-barn-light/15 dark:text-oko-barn-light"
        : "bg-oko-cream-dim dark:bg-oko-night-3 text-oko-stone"
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

        {overflow.length > 0 && (() => {
          const cols = overflow.length > 16 ? 3 : overflow.length > 8 ? 2 : 1;
          const colClass = cols === 3 ? "columns-3" : cols === 2 ? "columns-2" : "columns-1";
          const minWClass = cols === 3 ? "min-w-[540px]" : cols === 2 ? "min-w-[380px]" : "min-w-[200px]";
          return (
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className={`flex font-inter uppercase tracking-[0.05em] items-center gap-1.5 px-4 py-3.5 text-[12.5px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeInOverflow
                    ? "border-oko-barn dark:border-oko-barn-light text-oko-barn dark:text-oko-barn-light"
                    : "border-transparent text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light hover:border-oko-barn dark:hover:border-oko-barn-light"
                }`}
              >
                {activeInOverflow ? "More •" : `More (${overflow.length})`}
                <span className="inline-block w-[0.625rem] text-center text-[10px] leading-none">{open ? "▲" : "▼"}</span>
              </button>

              {open && (
                <div className={`absolute top-full left-0 mt-1 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] z-20 ${minWClass} py-1`}>
                  <div className={colClass}>
                    {overflow.map((s, i) => (
                      <Link
                        key={`desk-overflow-${i}`}
                        href={s?.url || "#"}
                        onClick={() => setOpen(false)}
                        className={`break-inside-avoid flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] font-semibold transition-colors font-inter uppercase tracking-[0.05em] ${
                          active_url === s?.url
                            ? "text-oko-barn dark:text-oko-barn-light bg-oko-barn/5 dark:bg-oko-barn-light/10"
                            : "text-oko-char-soft dark:text-oko-ondark hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 hover:text-oko-barn dark:hover:text-oko-barn-light"
                        }`}
                      >
                        {s?.name}
                        <span className={badgeClass(s?.url, s?.hot)}>{s?.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </>
  );
}

export default SubcategoryTabsDropdown;
