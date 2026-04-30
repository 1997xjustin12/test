"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BASE_URL,
  exclude_brands,
  exclude_collections,
} from "@/app/lib/helpers";

function SubcategoryTabs({ subs }) {
  const pathname = usePathname();
  const active_url = `${BASE_URL}${pathname}`;
  console.log("ACTIVE_URL", active_url);
  return (
    <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-[64px] md:top-[105px] z-10 min-h-[50px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px">
          {Array.isArray(subs) &&
            subs.map((s, i) => (
              <Link
                key={`sub-category-tab-${s?.name}-${i}`}
                href={s?.url || "#"}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${active_url === s?.url ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600"}`}
              >
                {s?.name}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${`${BASE_URL}${pathname}` === s.url ? "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400" : s?.hot ? "bg-orange-100 dark:bg-orange-950 text-orange-500" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"}`}
                >
                  {s?.count}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SubcategoryTabs;
