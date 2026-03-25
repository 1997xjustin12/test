"use client"
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { SEARCH_SUGGESTIONS, TRENDING, PHONE, PHONE_HREF } from "@/app/data/new-homepage";
import { SearchIcon, PhoneIcon, CartIcon } from "@/app/components/new-design/ui/Icons";
import CartButton from "@/app/components/new-design/ui/CartButton";

import { useSolanaCategories } from "@/app/context/category";

export default function Navbar() {
  const { solana_categories: solana_menu_object } = useSolanaCategories();
  const [scrolled,   setScrolled]   = useState(false);
  const [query,      setQuery]      = useState("");
  const [showDrop,   setShowDrop]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [lockedMenu, setLockedMenu] = useState(null);
  const searchRef                   = useRef(null);
  const navRowRef                   = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (!searchRef.current?.contains(e.target)) setShowDrop(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (!navRowRef.current?.contains(e.target)) setLockedMenu(null); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const filtered = query.trim()
    ? SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const handleSearch = () => { if (query.trim()) alert("Searching: " + query); };

  const NAV_LINKS = useMemo(()=>{
    return solana_menu_object
    .filter(({name})=> !["Search", "Home", "Brands", "Current Deals"].includes(name))
    // .filter(({}))
  },[solana_menu_object])
  return (
    <nav className={`
      sticky top-0 z-20
      bg-white/95 dark:bg-charcoal/95
      backdrop-blur-md
      border-b border-stone-100 dark:border-stone-800
      transition-shadow duration-300
      ${scrolled ? "shadow-md" : ""}
    `}>
      <div className="max-w-[1240px] mx-auto px-6">

        {/* ── Row 1: Logo + Search + Actions ── */}
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fire to-red-700 flex items-center justify-center text-lg">
              🔥
            </div>
            <span className="font-serif font-bold text-xl text-charcoal dark:text-white hidden sm:block">
              Solana Fireplaces
            </span>
          </Link>

          {/* Search — hidden on mobile, visible md+ */}
          <div ref={searchRef} className="relative flex-1 max-w-2xl mx-auto hidden md:block">
            <div className="
              flex items-center
              bg-stone-100 dark:bg-stone-800
              border border-transparent focus-within:border-fire focus-within:bg-white dark:focus-within:bg-stone-900
              focus-within:ring-2 focus-within:ring-fire/10
              rounded-full px-5 py-2.5 gap-3
              transition-all duration-200
            ">
              <SearchIcon />
              <input
                type="text"
                value={query}
                placeholder="Search fireplaces, brands, BTUs…"
                aria-label="Search products"
                className="flex-1 bg-transparent border-none outline-none text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 min-w-0"
                onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              {/* Category divider — hidden on tablet */}
              <div className="hidden lg:flex items-center gap-2">
                <div className="w-px h-5 bg-stone-300 dark:bg-stone-600" />
                <select className="bg-transparent text-xs text-stone-500 dark:text-stone-400 outline-none cursor-pointer">
                  {["All Categories","Gas Fireplaces","Electric Fireplaces","Wood-Burning","Patio Heaters","Built-In Grills","Outdoor"]
                    .map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-fire hover:bg-fire-light text-white text-xs font-semibold transition-all duration-200 hover:shadow-md flex-shrink-0"
              >
                <SearchIcon size={12} /> Search
              </button>
            </div>

            {/* Dropdown */}
            {showDrop && (
              <div className="
                absolute top-[calc(100%+6px)] left-0 right-0
                bg-white dark:bg-stone-900
                border border-stone-100 dark:border-stone-700
                rounded-2xl shadow-2xl overflow-hidden z-50
              ">
                {query.trim() === "" ? (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-stone-400 bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700">
                      Trending
                    </div>
                    <div className="flex flex-wrap gap-2 p-3">
                      {TRENDING.map(t => (
                        <span
                          key={t}
                          onClick={() => { setQuery(t); setShowDrop(false); }}
                          className="px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 cursor-pointer hover:bg-fire hover:text-white hover:border-fire transition-all duration-150"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : filtered.length > 0 ? (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase text-stone-400 bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700">
                      Suggestions
                    </div>
                    {filtered.map(s => (
                      <div
                        key={s}
                        onClick={() => { setQuery(s); setShowDrop(false); }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-fire transition-colors"
                      >
                        <SearchIcon size={12} />
                        <span dangerouslySetInnerHTML={{
                          __html: s.replace(new RegExp(query, "gi"), m => `<mark class="bg-transparent text-fire font-semibold">${m}</mark>`)
                        }} />
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0 flex-shrink-0">
            {/* Phone — hidden on mobile/tablet */}
            <Link href={PHONE_HREF} className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-charcoal dark:text-white whitespace-nowrap">
              <span className="text-fire"><PhoneIcon /></span>
              {PHONE}
            </Link>
            {/* Cart */}
            <CartButton />
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-charcoal dark:bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-5 h-0.5 bg-charcoal dark:bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-0.5 bg-charcoal dark:bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Row 2: Nav Links — desktop only ── */}
        <div ref={navRowRef} className="hidden lg:flex items-center h-10 gap-0.5 border-t border-stone-100 dark:border-stone-800">
          {NAV_LINKS.map(({ name, children, id, url }) => {
            const isLocked = lockedMenu === id;
            return (
            <div key={`desktop-nav-item-${id}`} className="relative group flex items-center">
              <Link
                href={`/${url}`}
                prefetch={false}
                onClick={e => { e.preventDefault(); setLockedMenu(isLocked ? null : id); }}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 flex items-center gap-0.5
                  ${isLocked ? "bg-stone-100 dark:bg-stone-800 text-fire" : "text-charcoal dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-fire"}`}
              >
                {name} <span className={`text-[10px] opacity-60 transition-transform duration-150 ${isLocked ? "rotate-180" : ""}`}>▾</span>
              </Link>
              <div className={`
                absolute top-[calc(100%+4px)] left-0
                bg-white dark:bg-stone-900
                border border-stone-100 dark:border-stone-700
                rounded-xl shadow-2xl min-w-[200px] overflow-hidden
                transition-all duration-200 z-30
                ${isLocked
                  ? "opacity-100 pointer-events-auto translate-y-0"
                  : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0"}
              `}>
                {/* Parent category link */}
                <Link
                  href={`/${url}`}
                  onClick={() => setLockedMenu(null)}
                  className="flex items-center justify-between px-4 py-2.5 bg-stone-50 dark:bg-stone-800 border-b border-stone-100 dark:border-stone-700 text-[13px] font-semibold text-charcoal dark:text-white hover:text-fire transition-colors group/parent"
                >
                  <span>All {name}</span>
                  <span className="text-fire opacity-0 group-hover/parent:opacity-100 transition-opacity text-xs">→</span>
                </Link>
                {/* Children */}
                <div className="p-2">
                  {children.map(c => (
                    <Link key={`desktop-child-nav-item-${c.id}`} href={`${c?.url}`} className="block px-4 py-2 rounded-lg text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-fire transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
          {/* <Link href="#" className="px-3 py-1.5 rounded-md text-[13px] font-semibold text-fire hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">Open Box</Link> */}
          <Link href="#" className="px-3 py-1.5 rounded-md text-[13px] font-semibold text-fire hover:bg-stone-100 dark:hover:bg-stone-800 transition-all">Current Deals 🔥</Link>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 dark:border-stone-800 py-4 flex flex-col gap-1">
            {/* Mobile search */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full px-4 py-2.5 gap-2 mb-2">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-sm placeholder-stone-400"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            {NAV_LINKS.map(({ name, url, id }) => (
              <Link key={`mobile-nav-item-${id}`} href={`/${url}`} prefetch={false} className="px-3 py-2.5 text-sm font-medium text-charcoal dark:text-stone-200 hover:text-fire hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors">
                {name}
              </Link>
            ))}
            {/* <Link href="#" className="px-3 py-2.5 text-sm font-semibold text-fire">Open Box</Link> */}
            <Link href="#" className="px-3 py-2.5 text-sm font-semibold text-fire">Current Deals 🔥</Link>
            <Link href={PHONE_HREF} className="mt-2 flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-charcoal dark:text-white">
              <span className="text-fire"><PhoneIcon /></span> {PHONE}
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
}