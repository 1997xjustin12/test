"use client"
import React from "react";
import { useReveal } from "@/app/hooks/useReveal";
import { WHY_POINTS } from "@/app/data/new-homepage";

export default function WhySolana() {
  const visRef  = useReveal();
  const copyRef = useReveal();
  return (
    <section id="why" className="py-20 md:py-24 bg-white dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">

          {/* ── Visual column ── */}
          <div ref={visRef} className="relative opacity-0 translate-y-6 transition-all duration-700">
            {/* Main image */}
            <div className="rounded-2xl overflow-hidden h-[420px] md:h-[480px] bg-gradient-to-br from-stone-800 to-stone-900">
              <img
                src="/images/banner/fireplace-banner.webp"
                alt="About Solana Fireplaces"
                className="w-full h-full object-contain"
                onError={e => (e.currentTarget.style.display = "none")}
              />
            </div>
            {/* Small inset — hidden on mobile */}
            <div className="
              hidden sm:block
              absolute -bottom-5 -right-5
              w-44 h-36 rounded-xl overflow-hidden
              bg-gradient-to-br from-stone-700 to-stone-800
              border-4 border-white dark:border-stone-950
              shadow-xl">
              <img
                src="/images/banner/fireplace-banner.webp"
                alt="About Solana Fireplaces"
                className="w-full h-full object-contain"
                onError={e => (e.currentTarget.style.display = "none")}
              />
            </div>
            {/* Float badge — hidden on mobile */}
            <div className="
              hidden sm:block
              absolute top-5 -left-4
              bg-white dark:bg-stone-900
              rounded-xl shadow-xl px-4 py-3 w-36
              border border-stone-100 dark:border-stone-700
            ">
              <div className="font-serif text-[1.9rem] font-bold text-fire leading-none">98%</div>
              <p className="text-xs text-stone-400 mt-1">Customer Satisfaction</p>
            </div>
          </div>

          {/* ── Copy column ── */}
          <div ref={copyRef} className="opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-2.5">Why Choose Solana</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white mb-3 leading-tight">
              Your Trusted Partner in Warmth & Style
            </h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-md leading-relaxed mb-7">
              We don't just sell fireplaces — we help you create spaces where memories are made.
            </p>

            <div className="flex flex-col gap-5">
              {WHY_POINTS.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-11 h-11 rounded-[11px] bg-fire/10 flex items-center justify-center text-xl flex-shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-charcoal dark:text-white mb-1">{title}</h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <a href="#" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-fire hover:bg-fire-light text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fire/30">
                Learn About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}