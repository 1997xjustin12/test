"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

const VISIBLE_COUNT = 6;

function SubcategoryTabsExpand({ subs }) {
  const pathname = usePathname();
  const active_url = `${BASE_URL}${pathname}`;

  const visible = subs?.slice(0, VISIBLE_COUNT) ?? [];
  const overflow = subs?.slice(VISIBLE_COUNT) ?? [];
  const activeInOverflow = overflow.some((s) => s?.url === active_url);

  const [expanded, setExpanded] = useState(activeInOverflow);

  useEffect(() => {
    if (activeInOverflow) setExpanded(true);
  }, [activeInOverflow]);

  const displayed = expanded ? (subs ?? []) : visible;

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
    <div className="flex flex-wrap gap-0 -mb-px items-center">
      {displayed.map((s, i) => (
        <Link
          key={`exp-tab-${i}`}
          href={s?.url || "#"}
          className={tabClass(s?.url)}
        >
          {s?.name}
          <span className={badgeClass(s?.url, s?.hot)}>{s?.count}</span>
        </Link>
      ))}

      {overflow.length > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-3.5 whitespace-nowrap border-b-2 border-transparent font-inter font-semibold text-[12.5px] uppercase tracking-[0.05em] text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors flex-shrink-0"
        >
          {expanded ? (
            <>Show less <span className="text-[10px]">▲</span></>
          ) : (
            <>Show {overflow.length} more <span className="text-[10px]">▾</span></>
          )}
        </button>
      )}
    </div>
  );
}

export default SubcategoryTabsExpand;
