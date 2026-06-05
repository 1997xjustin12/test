"use client";
import React, { useState } from "react";
import { useSolanaCategories } from "@/app/context/category";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { UIV2 } from "@/app/lib/helpers";

const CONTAINER_CLASS = UIV2 ? "max-w-[1240px]" : "container";

const TYPE_BADGE = {
  outdoor:   "bg-green-900/70 text-green-300 border-green-700/50",
  technical: "bg-sky-900/70 text-sky-300 border-sky-700/50",
  general:   "bg-purple-900/70 text-purple-300 border-purple-700/50",
  deals:     "bg-theme-900/70 text-theme-300 border-theme-700/50",
};

function CategoryCard({ cat }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={`/category/${cat?.slug}`}
      className="group relative block rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-800 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-theme-200/40 dark:hover:shadow-theme-900/40 transition-all duration-300 bg-white dark:bg-gray-900"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-white dark:bg-gray-800 rounded-t-2xl">
        {!imgErr ? (
          <img
            src={cat?.image}
            alt={cat?.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-theme-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
            🔥
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Type badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm uppercase tracking-wider ${TYPE_BADGE[cat?.type] ?? TYPE_BADGE.general}`}>
          {cat?.type}
        </span>

        {/* Count chip */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-right">
          <div className="text-white text-sm font-bold leading-none">{cat?.count}</div>
          <div className="text-white/50 text-[9px] uppercase tracking-widest leading-none mt-0.5">items</div>
        </div>

        {/* Title pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-sm leading-tight drop-shadow">{cat?.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-white dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{cat?.sub}</p>
        <div className="absolute bottom-4 w-full flex items-center justify-between">
          <span className="text-xs font-bold text-theme-500 flex items-center gap-1">
            Shop now
            <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium pr-8">{cat?.count} products</span>
        </div>
      </div>
    </a>
  );
}

function CategoryGrid() {
  const { categories } = useSolanaCategories();
  const [active, setActive] = useState("all");

  const tabs = [
    { id: "all",       label: "All",          count: categories.length },
    { id: "outdoor",   label: "🌿 Outdoor",   count: categories.filter((c) => c.type === "outdoor").length },
    { id: "technical", label: "⚙️ Technical", count: categories.filter((c) => c.type === "technical").length },
  ];
  const shown = active === "all" ? categories : categories.filter((c) => c.type === active);

  return (
    <section className={`${CONTAINER_CLASS} mx-auto px-4 sm:px-6 py-12`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 dark:text-theme-500 mb-1.5">
            What We Carry
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white leading-tight">
            Shop by Category
          </h2>
        </div>

        {/* Tabs — pill style */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                active === tab.id
                  ? "border-theme-500 text-theme-600 dark:text-theme-500 bg-theme-600/5"
                  : "border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-theme-500 hover:text-theme-600 dark:hover:text-theme-500"
              }`}
            >
              {tab.label} <span className="opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {shown.map((cat, index) => (
          <CategoryCard key={`category-card-${index}-${cat?.slug}`} cat={cat} />
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section
      style={{ "--via-color": "var(--theme-primary-950)" }}
      className="bg-gradient-to-r from-neutral-950 via-[var(--via-color)] to-neutral-950 py-14 px-5"
    >
      <div className={`${CONTAINER_CLASS} mx-auto flex flex-col md:flex-row items-center justify-between gap-8`}>
        <div>
          <span className="inline-block bg-theme-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-4">
            Limited Time
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3 leading-tight">
            Open Box Sale —<br className="hidden sm:block" /> Up to 40% Off
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg">
            Certified units with full warranty. Showroom returns, discontinued models &amp; overstocks at unbeatable prices.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="/open-box"
            className="px-6 py-3.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-gray-900 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-500/30 text-center"
          >
            Shop Open Box
          </a>
          <a
            href="/brand/eloquence"
            className="px-6 py-3.5 rounded-xl border-2 border-white/60 text-white hover:bg-white/10 text-sm font-semibold transition-all duration-200 text-center"
          >
            View All Deals
          </a>
        </div>
      </div>
    </section>
  );
}

function BrandSpotlight({ brands = [] }) {
  return (
    <section className="bg-stone-100 dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800 py-10 px-5">
      <div className={`${CONTAINER_CLASS} mx-auto`}>
        <p className="text-center text-[11px] tracking-[.15em] uppercase font-semibold text-stone-400 dark:text-stone-500 mb-6">
          Authorized Dealer For
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {brands.map((b) => (
            <span
              key={b?.slug}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 cursor-pointer hover:border-theme-500 hover:text-theme-600 dark:hover:border-theme-500 dark:hover:text-theme-400 transition-all"
            >
              {b?.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertCTA() {
  return (
    <section className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-16 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-5">👨‍🔧</div>
        <h2 className="font-serif text-2xl text-gray-900 dark:text-white mb-3">
          Not Sure Where to Start?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
          Our certified fireplace specialists will help you find the perfect fit — no pressure, just expertise.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={`tel:${STORE_CONTACT}`}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-theme-600 hover:bg-theme-500 text-gray-900 font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-500/30"
          >
            <span className="text-xl">📞</span>
            <div className="text-left">
              <div className="text-sm font-bold">Call Us Now</div>
              <div className="text-xs opacity-60">{STORE_CONTACT}</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Categories({ brands }) {
  return (
    <main>
      <PromoBanner />
      <CategoryGrid />
      <PromoBanner />
      <BrandSpotlight brands={brands} />
      <ExpertCTA />
    </main>
  );
}
