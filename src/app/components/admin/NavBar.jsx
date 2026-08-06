"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const TITLES = {
  "/admin": "Dashboard",
  "/admin/favicon-and-logo": "Favicon & Logo",
  "/admin/theme-color": "Theme Color",
  "/admin/faqs-updater": "FAQs Updater",
  "/admin/menu-builder": "Menu Builder",
};

function titleFor(pathName) {
  if (TITLES[pathName]) return TITLES[pathName];
  const match = Object.keys(TITLES)
    .filter((url) => url !== "/admin" && pathName.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ? TITLES[match] : "Admin";
}

function AdminNav({ onOpenMenu = () => {} }) {
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8 dark:border-white/10 dark:bg-zinc-950/80">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        aria-controls="sidebar"
        className="-ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 lg:hidden dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <h1 className="truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
        {titleFor(pathName)}
      </h1>
    </header>
  );
}

export default AdminNav;
