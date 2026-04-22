"use client";
import React from "react";
import { useReveal } from "@/app/hooks/useReveal";
import { REVIEWS } from "@/app/data/new-homepage";

function ReviewCard({ initial, gradient, name, loc, text }) {
  const ref = useReveal();
  return (
    <article
      ref={ref}
      className="
        opacity-0 translate-y-6 transition-all duration-700
        relative bg-white dark:bg-stone-900 rounded-2xl p-6
        shadow-[0_4px_24px_rgba(0,0,0,.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,.4)]
        border border-stone-100 dark:border-stone-800
      "
    >
      {/* Decorative quote mark */}
      <span className="absolute top-2 left-4 font-serif text-[4rem] leading-none text-fire/10 select-none">"</span>

      <p className="relative z-10 text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5">
        "{text}"
      </p>

      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
          {initial}
        </div>
        <div>
          <div className="text-sm font-semibold text-charcoal dark:text-white">{name}</div>
          <div className="text-xs text-stone-400 mt-0.5">⭐⭐⭐⭐⭐ · {loc}</div>
        </div>
      </div>
    </article>
  );
}

export default function Reviews() {
  const hdrRef = useReveal();
  return (
    <section id="reviews" className="py-20 md:py-24 bg-cream dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div ref={hdrRef} className="opacity-0 translate-y-6 transition-all duration-700 text-center mb-12">
          <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-2.5">Customer Reviews</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white mb-4 leading-tight">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-4">
            <span className="font-serif text-[3.5rem] font-bold text-charcoal dark:text-white leading-none">4.4</span>
            <div>
              <div className="text-xl text-amber-400">★★★★★</div>
              <p className="text-xs text-stone-400 mt-1">Based on 122 verified reviews</p>
            </div>
          </div>
        </div>

        {/* Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map(r => <ReviewCard key={r.name} {...r} />)}
        </div>
      </div>
    </section>
  );
}