"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// COMPONENTS
import Image from "next/image";
import Link from "next/link";
import ProductsSection from "@/app/components/molecule/ProductsSection";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
// CONTEXT
import { useSearch } from "@/app/context/search";
import { useSolanaCategories } from "@/app/context/category";
import { BASE_URL, formatPrice } from "@/app/lib/helpers";

const TRENDING = [
  "Napoleon Ascent",
  "Bromic Eclipse",
  "Twin Eagles pellet grill",
  "Gas fireplace insert",
  "Outdoor kitchen",
  "Patio heater",
  "Fire pit table",
  "Built-in grill",
];

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const F = "#E85D26",
  FL = "#F97316",
  FD = "rgba(232,93,38,0.1)";

// ─── RESULT TABS ──────────────────────────────────────────────────────────────
function ResultTabs({ searchResults, active, onChange }) {
  return (
    <div className="w-full  border-b border-gray-200 dark:border-gray-700 mb-0 sticky top-[64px] lg:top-[105px] bg-white z-10 overflow-x-auto">
      <div className="max-w-[1240px] mx-auto  px-4 sm:px-6">
        <div className="flex">
          {searchResults
            .filter((t) => !["top-product", "popular"].includes(t.prop))
            .map((t) => (
              <button
                key={`search-result-tabs-${t.prop}`}
                onClick={() => onChange(t.prop)}
                className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${active === t.prop ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
              >
                {t.label}{" "}
                <span
                  className={`ml-1 text-xs ${active === t.prop ? "text-orange-500" : "text-gray-400"}`}
                >
                  ({t.total || 0})
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-2/5" />
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mt-2" />
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg mt-2" />
      </div>
    </div>
  );
}

// ─── LOADING STATE ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div>
      {/* Fake sort bar */}
      <div className="flex justify-between mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse" />
        <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-lg w-36 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── CATEGORY TAB RESULTS ─────────────────────────────────────────────────────
function CategoryResults({ searchResult }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 pb-6">
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {searchResult.map((c, i) => (
          <Link
            prefetch={false}
            key={`category-search-page-result-${c?.slug}-${i}`}
            href={`${BASE_URL}/category/${c?.slug}`}
            className="flex gap-3 px-2 py-4 hover:bg-orange-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg group"
          >
            <div>
              <div className="rounded-lg min-w-32 min-h-32 bg-white relative overflow-hidden flex-shrink-0 border border-stone-100 dark:border-stone-700">
                {c?.image && (
                  <Image
                    src={c.image} // or your specific object path
                    alt={c.name || "Category search result thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-cover"
                    priority={false}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {/* <Hl text={c.} q={q} /> */}
                {c.name}
              </div>
              <div className="text-sm text-neutral-600">{c.sub}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {c.count} product{c.count > 1 ? "s" : ""}
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BrandResults({ searchResult }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 pb-6">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResult.map((b) => (
          <Link
            prefetch={false}
            key={`search-page-brand-result-${b.url}`}
            href={`${BASE_URL}/${b.url}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-400 hover:shadow-md transition-all group"
          >
            <div>
              <div className="rounded-lg min-w-32 min-h-32 bg-white relative overflow-hidden flex-shrink-0 border border-stone-100 dark:border-stone-700">
                {b?.image && (
                  <Image
                    src={b.image} // or your specific object path
                    alt={b.name || "Brand search result thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-contain"
                    priority={false}
                  />
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {b.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: F }}>
                {b.count} product{b.count > 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CollectionResults({ searchResult }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 pb-6">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResult.map((b) => (
          <Link
            prefetch={false}
            key={`search-page-brand-result-${b.url}`}
            href={`${BASE_URL}/${b.url}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-400 hover:shadow-md transition-all group"
          >
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {b.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{b.desc}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: F }}>
                {b.count} product{b.count > 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PromoBanner() {
  return (
    <section
      style={{ "--via-color": "var(--theme-primary-950)" }}
      className="bg-gradient-to-r from-neutral-950 via-[var(--via-color)] to-neutral-950 py-14 px-5 "
    >
      <div
        className={`max-w-[1240] mx-auto flex flex-col md:flex-row items-center justify-between gap-8`}
      >
        <div>
          <span className="inline-block bg-theme-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-4">
            Limited Time
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3 leading-tight">
            Open Box Sale —<br className="hidden sm:block" /> Up to 40% Off
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg">
            Certified units with full warranty. Showroom returns, discontinued
            models & overstocks at unbeatable prices.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="/open-box"
            className="px-6 py-3.5 rounded-xl bg-theme-500 hover:bg-theme-400 text-white text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-500/30 text-center"
          >
            Shop Open Box
          </a>
          <a
            href="/brand/eloquence"
            className="px-6 py-3.5 rounded-xl border border-white/25 hover:border-white/50 text-white/75 hover:text-white text-sm font-semibold transition-all text-center"
          >
            View All Deals
          </a>
        </div>
      </div>
    </section>
  );
}

function ExactMatchCard({ p, q }) {
  
  const [added, setAdded] = useState(false);
  const { getProductUrl } = useSolanaCategories();

  const save = p?.was ? p.was - p.price : 0;
  
  if(!p) return null;

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
      <div
        className="mb-4 rounded-2xl border-2 bg-white dark:bg-gray-900 overflow-hidden"
        style={{ borderColor: F }}
      >
        {/* Label */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b"
          style={{ background: FD, borderColor: "rgba(232,93,38,0.15)" }}
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: F }}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: F }}
          >
            Exact Match
          </span>
        </div>
        {/* Content */}
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Image */}
          <div className="relative sm:w-56 h-44 sm:h-auto bg-gray-50 dark:bg-gray-800 shrink-0 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full relative overflow-hidden">
              {p?.image && (
                <Image
                  src={p.image} // or your specific object path
                  alt={p.name || "Category search result thumbnail"}
                  fill
                  sizes="(max-width: 768px) 100vw, 64px"
                  className="object-cover"
                  priority={false}
                />
              )}
            </div>
            {/* <button
              onClick={() => setWished((w) => !w)}
              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${wished ? "bg-orange-500 border-orange-500 text-white" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-orange-500"}`}
            >
              <svg
                className="w-4 h-4"
                fill={wished ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button> */}
            {p.badge && (
              <div className="absolute top-2.5 left-2.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wide text-white px-2.5 py-1 rounded-full"
                  style={{ background: F }}
                >
                  Bestseller
                </span>
              </div>
            )}
          </div>
          {/* Details */}
          <div className="flex-1 p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
                {p.brand}
              </p>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2">
                <Hl text={p.title || ""} q={q} />
              </h3>
              <Stars
                r={p?.ratings?.rating_count || 0}
                count={p?.reviews || 0}
              />
              {/* Specs pills */}

              {/* <div className="flex flex-wrap gap-1.5 mt-3"> */}
                {/* {p.product_category && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {p.product_category}
                  </span>
                )} */}
                {/* <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">In Stock</span> */}
                {/* <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">Free Shipping</span> */}
              {/* </div> */}
              <a
                href="tel:8885759720"
                className="mt-2 text-xs inline-flex items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.01 1 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
                Found It Cheaper? (888) 575-9720
              </a>
            </div>
            {/* Price + actions */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:min-w-[160px]">
              <div className="text-right">
                <div className="flex items-baseline gap-2 flex-wrap justify-end">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ${formatPrice(p.price)}
                  </span>
                  {p.was && (
                    <span className="text-sm text-gray-400 line-through">
                      ${formatPrice(p.was)}
                    </span>
                  )}
                </div>
                {save > 0 && (
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 text-right">
                    Save ${save.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[140px]">
                <AddToCartButtonWrap product={p}>
                  <button
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90`}
                    style={{ background: F }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </AddToCartButtonWrap>
                <Link
                  href={getProductUrl(p)}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all bg-white dark:bg-gray-900"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HIGHLIGHT ────────────────────────────────────────────────────────────────
function Hl({ text, q }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-orange-600 dark:text-orange-400 font-semibold">
        {text.slice(i, i + q.length)}
      </span>
      {text.slice(i + q.length)}
    </>
  );
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function Stars({ r, count }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className="w-3.5 h-3.5"
            viewBox="0 0 20 20"
            fill={i <= Math.round(r) ? "#f59e0b" : "none"}
            stroke="#f59e0b"
            strokeWidth="1.5"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{count}</span>
    </div>
  );
}

// ─── IDLE STATE ───────────────────────────────────────────────────────────────
function IdleState() {
  const { categories } = useSolanaCategories();
  return (
    <div className="max-w-[1240] mx-auto px-6 py-8">
      {/* Promo */}
      <div
        className="rounded-2xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: "linear-gradient(120deg,#1a0600,#3d1208)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 80% 50%,${F}33,transparent 65%)`,
          }}
        />
        <div className="relative z-10">
          <p className="text-white font-bold text-lg mb-1">
            🔥 Spring Sale — Up to 30% off
          </p>
          <p className="text-orange-200 text-sm">
            Limited-time deals on top fireplace brands
          </p>
        </div>
        <button
          className="relative z-10 shrink-0 bg-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
          style={{ color: F }}
        >
          Shop Sale
        </button>
      </div>

      {/* Recent */}
      {/* <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Recent searches</p>
        <div className="flex flex-wrap gap-2">
          {RECENT.map(r=>(
            <button key={r} onClick={()=>onSelect(r)} className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all">
              <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {r}
            </button>
          ))}
        </div>
      </div> */}

      {/* Trending */}
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Trending searches
        </p>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((t, i) => (
            <button
              key={t}
              onClick={() => onSelect(t)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
            >
              <span className="text-[10px] text-gray-300 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Browse by category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link
              prefetch={false}
              href={`${BASE_URL}/category/${c.slug}`}
              key={`idle-search-category-${c.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-400 hover:shadow-md transition-all group overflow-hidden pb-2"
            >
              <div className="relative aspect-1 w-full">
                {c?.image && (
                  <Image
                    src={c.image} // or your specific object path
                    alt={c.name || "Category search result thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-cover"
                    priority={false}
                  />
                )}
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors px-2">
                {c.name}
              </div>
              <div className="text-[10px] text-gray-400 px-2">
                {c.count} product{c.count > 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function NoResults({ query }) {
  const tips = [
    "Check your spelling",
    "Try broader keywords",
    "Search by brand name",
    "Browse by category",
  ];
  const { categories } = useSolanaCategories();

  return (
    <div className="py-16 flex flex-col items-center text-center px-4">
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: FD }}
      >
        <svg
          className="w-9 h-9"
          fill="none"
          stroke={F}
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 11h6M11 8v6" strokeDasharray="2 2" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        No results for <span style={{ color: F }}>"{query}"</span>
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        We couldn't find any products matching your search. Here are a few tips:
      </p>

      {/* Tips */}
      <ul className="mb-8 space-y-1.5">
        {tips.map((t) => (
          <li
            key={t}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <svg
              className="w-4 h-4 shrink-0"
              style={{ color: F }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            {t}
          </li>
        ))}
      </ul>

      {/* Suggest searches */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Try these popular searches</p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TRENDING.slice(0,6).map(t=>(
          <button key={t} onClick={()=>onSuggest(t)} className="px-4 py-2 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all">
            {t}
          </button>
        ))}
      </div>

      {/* Category browse */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Browse categories</p>
      
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link
              prefetch={false}
              href={`${BASE_URL}/category/${c.slug}`}
              key={`idle-search-category-${c.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-orange-400 hover:shadow-md transition-all group overflow-hidden pb-2"
            >
              <div className="relative aspect-1 w-full">
                {c?.image && (
                  <Image
                    src={c.image} // or your specific object path
                    alt={c.name || "Category search result thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-cover"
                    priority={false}
                  />
                )}
              </div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors px-2">
                {c.name}
              </div>
              <div className="text-[10px] text-gray-400 px-2">
                {c.count} product{c.count > 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────
export default function NewSearchPage() {
  const { loading, searchQuery, searchResults, noResults } = useSearch();
  const [tab, setTab] = useState("product");
  const dropRef = useRef(null);

  const filtered = useCallback(
    (prop) => {
      return searchResults.find((result) => result?.prop === prop)?.data || [];
    },
    [searchResults],
  );

  const top = filtered("top-product");
  const topResult = top ? top.map((i) => ({ ...i, name: i.title })) : null;
  console.log("topResult", topResult);
  const categoryResults = filtered("category");
  const brandResults = filtered("brand");
  const collectionResults = filtered("collections");

  // close dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setShowDrop(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* <PromoBanner /> */}
      {/* Tabs */}
      <div className="max-w-[1240px] mx-auto">
        {/* ── IDLE ── */}
        {searchQuery.trim() === "" && <IdleState />}

        {/* ── LOADING ── */}
        {loading && searchQuery.trim() !== "" && (
          <div className="flex gap-6">
            {/* Sidebar skeleton */}
            <div className="w-64 shrink-0 hidden lg:block">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3 animate-pulse">
                {[80, 60, 90, 70, 50, 65, 75].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-200 dark:bg-gray-800 rounded"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <LoadingState />
            </div>
          </div>
        )}

        {/* ── NO RESULTS ── */}
        {noResults && <NoResults query={searchQuery} />}

        {/* ── RESULTS ── */}
        {!noResults && searchQuery.trim() !== "" && (
          <>
            {/* "Results for" label */}
            <div className="max-w-[1240px] mx-auto  px-4 sm:px-6 py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Results found for{" "}
                <span className="font-bold" style={{ color: F }}>
                  {searchQuery}
                </span>
              </p>
            </div>

            {topResult?.[0] && (
              <ExactMatchCard p={topResult[0]} q={searchQuery} />
            )}

            <ResultTabs
              searchResults={searchResults}
              onChange={setTab}
              active={tab}
            />

            <div className="flex gap-6 mt-5 items-start">
              <div
                className={`w-full ${tab === "product" ? "flex" : "hidden"}`}
              >
                <ProductsSection category={"search"} search={searchQuery} />
              </div>
              <div
                className={`w-full ${tab === "category" ? "flex" : "hidden"}`}
              >
                <CategoryResults searchResult={categoryResults} />
              </div>
              <div className={`w-full ${tab === "brand" ? "flex" : "hidden"}`}>
                <BrandResults searchResult={brandResults} />
              </div>
              <div
                className={`w-full ${tab === "collections" ? "flex" : "hidden"}`}
              >
                <CollectionResults searchResult={collectionResults} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
