"use client";
import { useState } from "react";
import Link from "next/link";
import { useSolanaCategories } from "@/app/context/category";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const TYPE_BADGE = {
  outdoor:   "bg-green-900/70 text-green-300 border-green-700/50",
  technical: "bg-sky-900/70 text-sky-300 border-sky-700/50",
  general:   "bg-stone-800 text-stone-300 border-stone-700/50",
  deals:     "bg-theme-900/70 text-theme-300 border-theme-700/50",
};

function CategoryCard({ cat }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Link
      href={`/category/${cat?.slug}`}
      className="group bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-white dark:bg-char">
        {!imgErr ? (
          <img
            src={cat?.image}
            alt={cat?.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-ash dark:bg-char">
            🔥
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Type badge */}
        <span className={`absolute top-2 left-2 font-oswald text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide rounded-sm border backdrop-blur-sm ${TYPE_BADGE[cat?.type] ?? TYPE_BADGE.general}`}>
          {cat?.type}
        </span>

        {/* Count chip */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-sm px-2 py-1 text-right">
          <div className="text-white font-oswald text-sm font-bold leading-none">{cat?.count}</div>
          <div className="text-white/50 font-oswald text-[9px] uppercase tracking-widest leading-none mt-0.5">items</div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-oswald font-semibold text-sm text-white leading-tight drop-shadow">{cat?.name}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-light text-stone-500 dark:text-stone-400 leading-relaxed flex-1 mb-3">
          {cat?.sub}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-grate dark:border-white/10">
          <span className="font-oswald font-semibold text-xs uppercase tracking-wide text-theme-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Shop now →
          </span>
          <span className="font-oswald text-[10px] text-char/40 dark:text-ash/30 uppercase tracking-wide">
            {cat?.count} products
          </span>
        </div>
      </div>
    </Link>
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
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
            What We Carry
          </p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1 text-stone-900 dark:text-ash">
            Shop by Category
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap p-1 rounded-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 self-start sm:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`font-oswald font-semibold text-sm px-4 py-2 rounded-sm transition-all ${
                active === tab.id
                  ? "bg-white dark:bg-char text-charcoal dark:text-white shadow-sm"
                  : "text-stone-500 dark:text-stone-400 hover:text-char dark:hover:text-ash"
              }`}
            >
              {tab.label} <span className="opacity-50">({tab.count})</span>
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
      className="bg-gradient-to-r from-[#1a0600] via-[var(--via-color)] to-[#1a0600] py-14"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <span className="font-oswald text-[10px] font-semibold px-2 py-0.5 text-white bg-theme-600 uppercase tracking-wide rounded-sm inline-block mb-4">
            Limited Time
          </span>
          <h2 className="font-oswald font-bold text-3xl md:text-4xl text-white uppercase leading-tight mb-3">
            Open Box Sale —<br className="hidden sm:block" /> Up to 40% Off
          </h2>
          <p className="text-sm font-light leading-relaxed text-white/60 max-w-lg">
            Certified units with full warranty. Showroom returns, discontinued models &amp; overstocks at unbeatable prices.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/open-box"
            className="px-6 py-3.5 rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5 text-center"
          >
            Shop Open Box
          </Link>
          <Link
            href="/brand/eloquence"
            className="px-6 py-3.5 rounded-sm bg-white/5 border border-white/15 text-ash font-oswald font-semibold text-sm uppercase tracking-wide hover:border-theme-600 hover:text-theme-500 transition-colors text-center"
          >
            View All Deals
          </Link>
        </div>
      </div>
    </section>
  );
}

function BrandSpotlight({ brands = [] }) {
  return (
    <section className="border-y border-grate dark:border-white/10 py-10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase text-center mb-6">
          Authorized Dealer For
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {brands.map((b) => (
            <span
              key={b?.slug}
              className="px-5 py-2.5 border border-grate dark:border-white/10 bg-paper dark:bg-smoke rounded-sm font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash hover:border-theme-600 dark:hover:border-theme-600/60 hover:text-theme-600 dark:hover:text-theme-500 transition-all cursor-pointer"
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
    <section className="bg-paper dark:bg-smoke border-t border-grate dark:border-white/10 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="text-5xl mb-5">👨‍🔧</div>
        <h2 className="font-oswald font-bold text-3xl uppercase text-char dark:text-ash mb-3">
          Not Sure Where to Start?
        </h2>
        <p className="text-sm font-light leading-relaxed text-stone-500 dark:text-stone-400 mb-10 max-w-md mx-auto">
          Our certified fireplace specialists will help you find the perfect fit — no pressure, just expertise.
        </p>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="inline-flex items-center gap-3 px-6 py-4 rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <div className="text-left">
            <div className="font-oswald font-semibold text-sm uppercase tracking-wide">Call Us Now</div>
            <div className="text-xs text-white/70 font-sora">{STORE_CONTACT}</div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default function Categories({ brands }) {
  return (
    <main className="bg-ash dark:bg-char font-sora">
      <PromoBanner />
      <CategoryGrid />
      <PromoBanner />
      <BrandSpotlight brands={brands} />
      <ExpertCTA />
    </main>
  );
}
