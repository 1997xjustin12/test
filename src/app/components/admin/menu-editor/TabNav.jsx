"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  DEFAULT_MENU_EDITOR_TAB,
  MENU_EDITOR_TABS,
  menuEditorTabHref,
} from "./tabs";

/**
 * URL-driven tabs. `useSelectedLayoutSegment` reads the active child segment
 * of this layout, so the highlight follows the address bar (including
 * back/forward and deep links) instead of local state.
 */
export default function TabNav({ menu_id }) {
  const segment = useSelectedLayoutSegment() || DEFAULT_MENU_EDITOR_TAB;

  return (
    <div className="-mx-4 overflow-x-auto border-b border-zinc-200 px-4 sm:mx-0 sm:px-0 dark:border-white/10">
      <nav aria-label="Menu item sections" className="flex w-max min-w-full gap-1">
        {MENU_EDITOR_TABS.map((tab) => {
          const active = segment === tab.slug;
          return (
            <Link
              key={tab.slug}
              href={menuEditorTabHref(menu_id, tab.slug)}
              prefetch={false}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`relative whitespace-nowrap rounded-t-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                active
                  ? "text-indigo-700 dark:text-indigo-300"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 -bottom-px h-0.5 rounded-full transition-colors ${
                  active ? "bg-indigo-600 dark:bg-indigo-400" : "bg-transparent"
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
