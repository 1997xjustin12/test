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
    `flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 font-oswald uppercase tracking-wide ${
      active_url === url
        ? "border-theme-600 text-theme-600 dark:text-theme-500"
        : "border-transparent text-char/60 dark:text-ash/50 hover:text-char dark:hover:text-ash hover:border-grate dark:hover:border-white/20"
    }`;

  const badgeClass = (url, hot) =>
    `font-oswald text-xs px-2 py-0.5 font-medium ${
      active_url === url
        ? "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500"
        : hot
        ? "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600 dark:text-theme-500"
        : "bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40"
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
          className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 border-transparent font-oswald uppercase tracking-wide text-char/60 dark:text-ash/50 hover:text-char dark:hover:text-ash hover:border-grate transition-colors flex-shrink-0"
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
