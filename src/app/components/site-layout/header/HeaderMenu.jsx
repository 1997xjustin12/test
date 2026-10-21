"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { CURRENT_DEALS_URL, isNavVisible } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";

/**
 * The configured header's navigation.
 *
 * The links are the menu, not configuration of their own: the menu builder at
 * /admin/menu-builder already owns what the site's navigation is, including the
 * "Show in navigation" toggle, and a second editor for the same links would be
 * a second answer to the same question.
 *
 * How the menu is drawn follows the brand's own navbar (new-design and
 * bbq-design layout/Navbar.jsx), so switching the configured header on doesn't
 * change how the navigation behaves: a dropdown opens on hover or locks open on
 * a click of its label, leads with "All {name}", lays long lists out in up to
 * three columns, and shows a spinner on the link being opened. Only the colours
 * are the configured header's own (`--sh-*`).
 *
 * "Current Deals" goes where the brand navbar sends it — the Eloquence deals
 * collection on the Outdoor Kitchen Outlet store (CURRENT_DEALS_URL) — and not
 * to its menu entry's own URL, /current-deals, a listing with no products
 * (reported 2026). Like the brand navbars, it is drawn last as a plain link,
 * on every brand.
 *
 * On a phone the row becomes a drawer, because seven top-level categories do
 * not fit across 412px and a header that scrolls sideways is a header nobody
 * can use.
 */

/**
 * Top-level entries this header never shows as categories.
 *
 * Matched on the url as well as the label, so renaming "Brands" in the menu
 * builder does not quietly put it back, and lowercased because both are an
 * operator's free text. "Current Deals" is here because it is drawn separately.
 */
const HIDDEN = ["search", "home", "brands", "current deals", "current-deals"];
const isHidden = (item) =>
  HIDDEN.includes(String(item?.url ?? "").toLowerCase()) ||
  HIDDEN.includes(String(item?.name ?? "").toLowerCase());

/** Where Current Deals leads, as in the brand navbars. */
const CURRENT_DEALS_HREF = CURRENT_DEALS_URL;

/** The menu, filtered the way the menu builder says. */
function useMenuLinks() {
  const { solana_categories: menu } = useSolanaCategories();
  return useMemo(
    () =>
      (menu ?? [])
        .filter((item) => !isHidden(item))
        .filter(isNavVisible)
        .map((item) => ({ ...item, children: (item.children || []).filter(isNavVisible) })),
    [menu],
  );
}

/** The brand navbar's spinner, shown on the link being opened. */
function NavSpinner({ className = "" }) {
  return (
    <svg className={`h-3 w-3 flex-shrink-0 animate-spin text-theme-500 ${className}`} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

const keyOf = (item) => item.id ?? item.url ?? item.name;

/**
 * The row, for screens wide enough to hold it.
 *
 * Separate from the button because the two live in different rows of the
 * header, and one component rendered in both places would draw the row twice.
 */
export function HeaderMenuBar() {
  const links = useMenuLinks();
  const pathname = usePathname();
  const rowRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [locked, setLocked] = useState(null);
  const [loadingHref, setLoadingHref] = useState(null);

  // A click anywhere else lets go of a locked dropdown.
  useEffect(() => {
    const onDown = (e) => {
      if (!rowRef.current?.contains(e.target)) setLocked(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // A navigation closes the dropdown and clears its spinner.
  useEffect(() => {
    setLoadingHref(null);
    setLocked(null);
    setHovered(null);
  }, [pathname]);

  if (links.length === 0 && !CURRENT_DEALS_HREF) return null;

  // Opening the page you're already on wouldn't navigate, so the spinner would
  // never clear: close the dropdown instead.
  const follow = (href) => () => {
    if (href === pathname) {
      setLocked(null);
      setHovered(null);
      return;
    }
    setLoadingHref(href);
  };

  return (
    <nav aria-label="Main" className="w-full">
      <ul ref={rowRef} className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 xl:gap-x-6">
        {links.map((item) => {
          const id = keyOf(item);
          const href = `/${item.url}`;
          const children = item.children;

          // Nothing to drop down: the label is the link.
          if (children.length === 0) {
            return (
              <li key={id}>
                <Link
                  href={href}
                  prefetch={false}
                  onClick={follow(href)}
                  className="inline-flex items-center gap-1.5 py-2 text-[13px] font-medium transition-opacity hover:opacity-70 xl:text-[15px]"
                  style={{ color: "var(--sh-menu)" }}
                >
                  {item.name}
                  <NavSpinner className={loadingHref === href ? "visible" : "invisible"} />
                </Link>
              </li>
            );
          }

          const isLocked = locked === id;
          const isOpen = isLocked || hovered === id;
          const cols = children.length > 16 ? 3 : children.length > 8 ? 2 : 1;
          const colClass = cols === 3 ? "columns-3" : cols === 2 ? "columns-2" : "columns-1";
          const minWClass = cols === 3 ? "min-w-[540px]" : cols === 2 ? "min-w-[380px]" : "min-w-[220px]";

          return (
            <li
              key={id}
              className="relative"
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* The label opens the dropdown; "All {name}" inside it is the
                  link. A click locks it open for anyone not using a mouse. */}
              <Link
                href={href}
                prefetch={false}
                onClick={(e) => {
                  e.preventDefault();
                  setLocked(isLocked ? null : id);
                }}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-1 py-2 text-[13px] font-medium transition-opacity hover:opacity-70 xl:text-[15px]"
                style={{ color: "var(--sh-menu)" }}
              >
                {item.name}
                <ChevronDown
                  className={`h-3.5 w-3.5 opacity-60 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </Link>

              <div
                className={`absolute left-1/2 top-full z-40 -translate-x-1/2 pt-1 transition-all duration-200 ${
                  isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"
                }`}
              >
                <div className={`overflow-hidden rounded-xl border border-stone-100 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900 ${minWClass}`}>
                  <Link
                    href={href}
                    prefetch={false}
                    onClick={follow(href)}
                    className="group/parent flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-2.5 text-[13px] font-semibold text-charcoal transition-colors hover:text-theme-500 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  >
                    <span>All {item.name}</span>
                    <span className="relative flex h-3 w-3 flex-shrink-0 items-center justify-center">
                      <span
                        className={`absolute text-xs text-theme-500 transition-opacity ${
                          loadingHref === href ? "invisible" : "opacity-0 group-hover/parent:opacity-100"
                        }`}
                      >
                        →
                      </span>
                      <NavSpinner className={loadingHref === href ? "visible" : "invisible"} />
                    </span>
                  </Link>
                  <div className={`max-h-[70vh] overflow-auto p-2 ${colClass}`}>
                    {children.map((child) => {
                      const childHref = `/${child.url}`;
                      return (
                        <Link
                          key={keyOf(child)}
                          href={childHref}
                          prefetch={false}
                          onClick={follow(childHref)}
                          className="flex break-inside-avoid items-center justify-between rounded-lg px-4 py-2 text-[12px] text-stone-700 transition-colors hover:bg-stone-50 hover:text-theme-500 dark:text-stone-300 dark:hover:bg-stone-800"
                        >
                          <span>{child.name}</span>
                          <NavSpinner className={loadingHref === childHref ? "visible" : "invisible"} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </li>
          );
        })}

        {CURRENT_DEALS_HREF && (
          <li>
            {/* External: a plain link, and no spinner — the spinner clears on
                an in-app route change, which leaving the site never makes. */}
            <a
              href={CURRENT_DEALS_HREF}
              className="inline-flex items-center gap-1.5 py-2 text-[13px] font-semibold transition-opacity hover:opacity-70 xl:text-[15px]"
              style={{ color: "var(--sh-menu)" }}
            >
              Current Deals 🔥
            </a>
          </li>
        )}
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

  if (links.length === 0 && !CURRENT_DEALS_HREF) return null;

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

            <ul className="flex-1 overflow-auto px-2 py-2">
              {links.map((item) => {
                const id = keyOf(item);
                const href = `/${item.url}`;

                if (item.children.length === 0) {
                  return (
                    <li key={id}>
                      <Link
                        href={href}
                        prefetch={false}
                        className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
                        style={{ color: "var(--sh-menu)" }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                }

                // As in the brand navbar: the row expands, "All {name}" leads.
                const isExpanded = expanded === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
                      style={{ color: "var(--sh-menu)" }}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <div className={`grid transition-all duration-200 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <div className="mb-1 ml-3 mt-0.5 flex flex-col gap-0.5 border-l-2 border-theme-100 pl-3 dark:border-theme-900">
                          <Link
                            href={href}
                            prefetch={false}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-theme-500 transition-colors hover:bg-theme-50 dark:hover:bg-theme-950"
                          >
                            All {item.name}
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={keyOf(child)}
                              href={`/${child.url}`}
                              prefetch={false}
                              className="rounded-lg px-3 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-theme-500 dark:text-stone-400 dark:hover:bg-stone-800"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}

              {CURRENT_DEALS_HREF && (
                <li>
                  <a
                    href={CURRENT_DEALS_HREF}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-theme-500"
                  >
                    Current Deals 🔥
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
