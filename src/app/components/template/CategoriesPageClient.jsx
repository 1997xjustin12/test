"use client";
import React, { useState } from "react";
import { useSolanaCategories } from "@/app/context/category";
import {STORE_CONTACT} from "@/app/lib/store_constants";

// const CONTAINER_CLASS = "max-w-7xl";
const CONTAINER_CLASS = process.env.NEXT_PUBLIC_UIV2 ? "max-w-[1240px]":"container";

const TRENDING = [
  { label: "Linear Gas Fireplaces", badge: "🔥 Hot" },
  { label: "Electric Wall Mounts", badge: "✨ New" },
  { label: "Pellet Grills", badge: "📈 Rising" },
  { label: "Open Box Deals", badge: "💸 Save" },
];

const TYPE_BADGE = {
  outdoor: "bg-green-900/70 text-green-300 border-green-700/50",
  technical: "bg-sky-900/70 text-sky-300 border-sky-700/50",
  general: "bg-purple-900/70 text-purple-300 border-purple-700/50",
  deals: "bg-theme-900/70 text-theme-300 border-theme-700/50",
};

function CategoryCard({ cat }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <a
      href={`/category/${cat?.slug}`}
      className="group relative block rounded-2xl overflow-hidden cursor-pointer border border-white dark:border-neutral-800 hover:border-white dark:hover:border-theme-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-theme-200/40 dark:hover:shadow-theme-900/40 transition-all duration-300 bg-white dark:bg-neutral-900"
    >
      {/* ── Image ── */}
      <div className="relative h-48 overflow-hidden bg-white dark:bg-neutral-800 rounded-t-2xl">
        {!imgErr ? (
          <img
            src={cat?.image}
            alt={cat?.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-theme-50 to-red-50 dark:from-neutral-800 dark:to-neutral-900">
            🔥
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Type badge — top left */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm uppercase tracking-wider ${TYPE_BADGE[cat?.type] ?? TYPE_BADGE.general}`}
        >
          {cat?.type}
        </span>

        {/* Product count — top right */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 text-right">
          <div className="text-white text-sm font-bold leading-none">
            {cat?.count}
          </div>
          <div className="text-white/50 text-[9px] uppercase tracking-widest leading-none mt-0.5">
            items
          </div>
        </div>

        {/* Title pinned to bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-sm leading-tight drop-shadow">
            {cat?.name}
          </h3>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-4 bg-white dark:bg-neutral-900">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
          {cat?.sub}
        </p>
        <div className="absolute bottom-4 w-full flex items-center justify-between">
          <span className="text-xs font-bold text-theme-500 flex items-center gap-1">
            Shop now
            <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
              →
            </span>
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium pr-8">
            {cat?.count} products
          </span>
        </div>
      </div>
    </a>
  );
}

function CategoryGrid() {
  const { categories } = useSolanaCategories();
  const [active, setActive] = useState("all");
  // const tabs = [];
  const tabs = [
    { id: "all", label: "All", count: categories.length },
    
    {
      id: "outdoor",
      label: "🌿 Outdoor",
      count: categories.filter((c) => c.type === "outdoor").length,
    },
    {
      id: "technical",
      label: "⚙️ Technical",
      count: categories.filter((c) => c.type === "technical").length,
    },
    // {
    //   id: "deals",
    //   label: "🏷️ Deals",
    //   count: categories.filter((c) => c.type === "deals").length,
    // },
  ];
  const shown =
    active === "all" ? categories : categories.filter((c) => c.type === active);

  return (
    <section className={`${CONTAINER_CLASS} mx-auto px-5 py-12`}>
      {/* Header + tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-theme-500 text-xs font-bold tracking-widest uppercase mb-1">
            What We Carry
          </p>
          <h2 className="font-serif text-2xl text-neutral-900 dark:text-white">
            Shop by Category
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                active === tab.id
                  ? "bg-theme-500 border-theme-500 text-white shadow-md shadow-theme-200 dark:shadow-theme-900"
                  : "bg-white dark:bg-neutral-900 border-white-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-theme-400 hover:text-theme-500"
              }`}
            >
              {tab.label} <span className="opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
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
      className="bg-gradient-to-r from-neutral-950 via-[var(--via-color)] to-neutral-950 py-14 px-5 "
    >
      <div
        className={`${CONTAINER_CLASS} mx-auto flex flex-col md:flex-row items-center justify-between gap-8`}
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

function TrendingStrip() {
  return (
    <div className="bg-theme-50 dark:bg-neutral-900 border-b border-theme-100 dark:border-neutral-800 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-5 flex items-center h-11 gap-0 min-w-max">
        <span className="text-theme-600 dark:text-theme-400 text-xs font-bold tracking-widest uppercase mr-5 shrink-0">
          Trending
        </span>
        {TRENDING.map(({ label, badge }) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-2 px-5 border-r border-theme-100 dark:border-neutral-700 h-full text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-theme-600 dark:hover:text-theme-400 whitespace-nowrap transition-colors"
          >
            <span className="bg-theme-100 dark:bg-theme-950 text-theme-600 dark:text-theme-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {badge}
            </span>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ExpertCTA() {
  return (
    <section className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-16 px-5">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-5">👨‍🔧</div>
        <h2 className="font-serif text-2xl text-neutral-900 dark:text-white mb-3">
          Not Sure Where to Start?
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
          Our certified fireplace specialists will help you find the perfect fit
          — no pressure, just expertise.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {[
            {
              icon: "📞",
              label: "Call Us Now",
              sub: STORE_CONTACT,
              href: `tel:${STORE_CONTACT}`,
              primary: true,
            },
            // { icon:"💬", label:"Live Chat",      sub:"Avg. 2 min reply",href:"#",            primary:false },
            // { icon:"📅", label:"Book a Consult", sub:"Free 30-min call", href:"#",           primary:false },
          ].map(({ icon, label, sub, href, primary }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                primary
                  ? "bg-theme-500 border-theme-500 text-white hover:bg-theme-400 hover:shadow-lg hover:shadow-theme-200 dark:hover:shadow-theme-900"
                  : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-theme-400 dark:hover:border-theme-500"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <div className="text-left">
                <div className="text-sm font-bold">{label}</div>
                <div className="text-xs opacity-60">{sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandSpotlight({brands = []}) {
  return (
    <section className="bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 py-10 px-5">
      <div className={`${CONTAINER_CLASS} mx-auto`}>
        <p className="text-center text-[11px] font-bold text-neutral-400 tracking-widest uppercase mb-6">
          Authorized Dealer For
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {brands.map((b) => (
            <span
              key={b?.slug}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-500 dark:text-neutral-400 cursor-pointer hover:border-theme-400 hover:text-theme-500 dark:hover:border-theme-500 dark:hover:text-theme-400 transition-all"
            >
              {b?.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesPage({brands}) {
  return (
    <main>
      <PromoBanner />
      {/* <TrendingStrip /> */}
      <CategoryGrid />
      <PromoBanner />
      {/* <ShopByRoom /> */}
      <BrandSpotlight brands={brands}/>
      {/* <SocialProof /> */}
      <ExpertCTA />
    </main>
  );
}

export default CategoriesPage;
