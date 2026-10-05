"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { isNavVisible } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";

/**
 * The configured header's navigation.
 *
 * The links are the menu, not configuration of their own: the menu builder at
 * /admin/menu-builder already owns what the site's navigation is, including the
 * "Show in navigation" toggle, and a second editor for the same links would be
 * a second answer to the same question.
 *
 * Only "Search" and "Home" are dropped — neither is a destination anyone
 * navigates to from a nav bar. Everything else the menu marks visible is shown,
 * so trimming the row is done where the menu is.
 *
 * On a phone the row becomes a drawer, because seven top-level categories do
 * not fit across 412px and a header that scrolls sideways is a header nobody
 * can use.
 */

/** The menu, filtered the way the menu builder says. */
function useMenuLinks() {
  const { solana_categories: menu } = useSolanaCategories();
  return useMemo(
    () =>
      (menu ?? [])
        .filter(({ name }) => !["Search", "Home"].includes(name))
        .filter(isNavVisible)
        .map((item) => ({ ...item, children: (item.children || []).filter(isNavVisible) })),
    [menu],
  );
}

/**
 * The row, for screens wide enough to hold it.
 *
 * Separate from the button because the two live in different rows of the
 * header, and one component rendered in both places would draw the row twice.
 */
export function HeaderMenuBar() {
  const links = useMenuLinks();
  if (links.length === 0) return null;

  return (
    <nav aria-label="Main" className="w-full">
      <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 xl:gap-x-10">
        {links.map((item) => (
          <li key={item.url || item.name} className="group relative">
            <Link
              href={`/${item.url}`}
              className="inline-flex items-center gap-1 py-2 text-[15px] font-medium transition-opacity hover:opacity-70 xl:text-base"
              style={{ color: "var(--sh-menu)" }}
            >
              {item.name}
              {item.children.length > 0 && (
                <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              )}
            </Link>

            {item.children.length > 0 && (
              <div className="invisible absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 pt-1 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="max-h-[70vh] overflow-auto rounded-xl border border-stone-200 bg-white py-2 shadow-2xl dark:border-stone-700 dark:bg-stone-900">
                  {item.children.map((child) => (
                    <li key={child.url || child.name}>
                      <Link
                        href={`/${child.url}`}
                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The button and its drawer, for screens that cannot hold the row. */
export default function HeaderMenu() {
  const links = useMenuLinks();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // A navigation closes the thing that caused it.
  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  // The drawer takes over the screen; the page behind it should not scroll.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (links.length === 0) return null;

  return (
    <>
      {/* Phone: one control, and the row lives in a drawer. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-opacity hover:opacity-70 lg:hidden"
        style={{ color: "var(--sh-icon)", borderColor: "var(--sh-icon)" }}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-2xl dark:bg-stone-900">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 dark:border-stone-700">
              <span className="text-sm font-semibold text-stone-900 dark:text-white">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="flex-1 overflow-auto py-2">
              {links.map((item) => (
                <li key={item.url || item.name} className="border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center">
                    <Link
                      href={`/${item.url}`}
                      className="flex-1 px-4 py-3 text-base font-medium"
                      style={{ color: "var(--sh-menu)" }}
                    >
                      {item.name}
                    </Link>
                    {item.children.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === item.name ? null : item.name)}
                        aria-label={`${expanded === item.name ? "Hide" : "Show"} ${item.name} subcategories`}
                        aria-expanded={expanded === item.name}
                        className="px-4 py-3 text-stone-400"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expanded === item.name ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>

                  {expanded === item.name && (
                    <ul className="bg-stone-50 pb-2 dark:bg-stone-800/50">
                      {item.children.map((child) => (
                        <li key={child.url || child.name}>
                          <Link
                            href={`/${child.url}`}
                            className="block py-2 pl-8 pr-4 text-sm text-stone-600 dark:text-stone-300"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
