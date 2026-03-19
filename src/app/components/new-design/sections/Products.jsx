'use client';

import React, { useState } from "react";
import { useReveal } from "@/app/hooks/useReveal";
import { PRODUCTS, PRODUCT_TABS } from "@/app/data/new-homepage";

function ProductCard({ brand, name, price, was, rating, reviews, badge, badgeCls }) {
  const ref = useReveal();
  return (
    <article
      ref={ref}
      className="
        opacity-0 translate-y-6 transition-all duration-700
        rounded-xl overflow-hidden bg-white dark:bg-stone-900
        border border-stone-100 dark:border-stone-800
        hover:shadow-[0_12px_48px_rgba(0,0,0,.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,.5)]
        hover:-translate-y-1 group
      "
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
        {badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`${badgeCls} text-white text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full`}>
              {badge}
            </span>
          </div>
        )}
      </div>
      {/* Body */}
      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">{brand}</p>
        <h3 className="font-serif text-base text-charcoal dark:text-white mb-2 leading-snug">{name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
          <span className="text-amber-400">{"★".repeat(Math.round(rating))}</span>
          {rating} ({reviews})
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-charcoal dark:text-white">
            {price}
            {was && <s className="text-sm font-normal text-stone-400 ml-1.5">{was}</s>}
          </div>
          <button
            aria-label={`Add ${name} to cart`}
            className="w-9 h-9 rounded-lg bg-fire hover:bg-fire-light text-white flex items-center justify-center text-lg font-light transition-colors duration-200 border-none"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Products() {
  const [active, setActive] = useState("All");
  const hdrRef = useReveal();
  return (
    <section id="products" className="py-20 md:py-24 bg-cream dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-6">

        {/* Header */}
        <div
          ref={hdrRef}
          className="
            opacity-0 translate-y-6 transition-all duration-700
            flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10
          "
        >
          <div>
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-1.5">Featured Products</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white mb-4 leading-tight">Bestsellers & New Arrivals</h2>
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {PRODUCT_TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setActive(t)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200
                    ${active === t
                      ? "border-fire text-fire bg-fire/5"
                      : "border-stone-200 dark:border-stone-700 text-stone-400 dark:text-stone-500 hover:border-fire hover:text-fire"}
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <a href="#" className="
            inline-flex items-center gap-2 px-7 py-3 rounded-lg
            border-2 border-fire text-fire hover:bg-fire hover:text-white
            font-semibold text-sm transition-all duration-200 self-start sm:self-auto flex-shrink-0
          ">
            View All Products
          </a>
        </div>

        {/* Grid: 1 col → 2 col tablet → 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map(p => <ProductCard key={p.name} {...p} />)}
        </div>
      </div>
    </section>
  );
}