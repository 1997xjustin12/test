"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  {
    label: "Fireplaces",
    items: ["Gas Fireplaces", "Electric Fireplaces", "Wood-Burning", "Fireplace Inserts", "Mantels & Surrounds"],
  },
  {
    label: "Patio Heaters",
    items: ["Propane Heaters", "Electric Heaters", "Infrared Heaters", "Wall-Mounted"],
  },
  {
    label: "Built-In Grills",
    items: ["Gas Built-In", "Charcoal Built-In", "BBQ Islands", "Grill Accessories"],
  },
  {
    label: "Freestanding Grills",
    items: ["Gas Freestanding", "Charcoal Grills", "Pellet Grills", "Portable Grills"],
  },
  {
    label: "Outdoor",
    items: ["Outdoor Refrigeration", "Outdoor Storage", "Fire Pits", "Outdoor Kitchens"],
  },
];

function DropdownMenu({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-2 rounded-md text-xs font-inter font-medium text-stone-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 min-w-[200px] bg-white border border-stone-100 rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {items.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-lg text-xs font-inter text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-stone-900 text-stone-400 text-xs font-inter py-2 text-center">
        <span className="mx-3">🔥 Free Shipping on Select Orders</span>
        <span className="mx-1 text-stone-600">|</span>
        <span className="mx-3">
          Expert Support:{" "}
          <a href="tel:8885759720" className="text-orange-400 font-semibold hover:text-orange-300">
            (888) 575-9720
          </a>
        </span>
        <span className="mx-1 text-stone-600">|</span>
        <Link href="/contractor" className="mx-3 text-orange-400 font-semibold hover:text-orange-300">
          Contractor Discount Program
        </Link>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex items-center justify-between h-[70px] gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center text-lg leading-none">
                🔥
              </div>
              <span className="font-serif text-[1.3rem] font-bold text-stone-900 tracking-tight">
                Solana Fireplaces
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((nav) => (
                <DropdownMenu key={nav.label} label={nav.label} items={nav.items} />
              ))}
              <Link
                href="/open-box"
                className="px-3 py-2 rounded-md text-xs font-inter font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Open Box
              </Link>
              <Link
                href="/deals"
                className="px-3 py-2 rounded-md text-xs font-inter font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Current Deals 🔥
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <a
                href="tel:8885759720"
                className="hidden md:flex items-center gap-1.5 text-xs font-inter font-semibold text-stone-800 hover:text-orange-600 transition-colors shrink-0"
              >
                <Phone size={14} className="text-orange-500" />
                (888) 575-9720
              </a>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 hover:bg-orange-500 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
              </Link>

              {/* Hamburger */}
              <button
                className="lg:hidden flex flex-col gap-[5px] p-1.5 rounded-md hover:bg-stone-100 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white max-h-[80vh] overflow-y-auto">
            <div className="max-w-[1240px] mx-auto px-6 py-4 flex flex-col gap-1">

              {NAV_LINKS.map((nav) => (
                <div key={nav.label}>
                  <button
                    onClick={() =>
                      setMobileExpanded((v) => (v === nav.label ? null : nav.label))
                    }
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-inter font-medium text-stone-800 hover:bg-orange-50 transition-colors"
                  >
                    {nav.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        mobileExpanded === nav.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileExpanded === nav.label && (
                    <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-orange-100 pl-3">
                      {nav.items.map((item) => (
                        <Link
                          key={item}
                          href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 rounded-lg text-xs font-inter text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/open-box"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-xs font-inter font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Open Box
              </Link>
              <Link
                href="/deals"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-xs font-inter font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Current Deals 🔥
              </Link>

              <div className="pt-3 border-t border-stone-100 mt-2">
                <a
                  href="tel:8885759720"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-inter font-semibold text-stone-800 hover:bg-orange-50 transition-colors"
                >
                  <Phone size={15} className="text-orange-500" />
                  (888) 575-9720
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}