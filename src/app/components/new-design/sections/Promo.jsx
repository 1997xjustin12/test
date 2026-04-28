"use client"
import Link from "next/link";
import { useReveal } from "@/app/hooks/useReveal";
import { PROMO_CARDS, PHONE_HREF } from "@/app/data/new-homepage";
import { BASE_URL } from "@/app/lib/helpers";


export default function Promo() {
  const copyRef  = useReveal();
  const cardsRef = useReveal();
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0300] via-[#1a0d00] to-[#0a1a10]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/35" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center py-20">

          {/* Copy */}
          <div ref={copyRef} className="opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire-light mb-3">Limited-Time Deals</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white leading-tight mb-4">
              Name Your Budget.<br />We'll Find Your Fireplace.
            </h2>
            <p className="text-white/60 text-base mb-7 leading-relaxed">
              From open box savings to close-out deals, we make luxury heating accessible. Talk to an expert and discover your best deal today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link prefetch={false} href={PHONE_HREF} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-fire hover:bg-fire-light text-white font-semibold transition-all duration-200 hover:-translate-y-0.5">
                Call to Save Now
              </Link>
              <Link prefetch={false} href={`${BASE_URL}/close-out-deals`} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/60 text-white hover:bg-white/10 font-semibold transition-all duration-200">
                Browse All Deals
              </Link>
            </div>
          </div>

          {/* Promo cards */}
          <div ref={cardsRef} className="flex flex-col gap-3 opacity-0 translate-y-6 transition-all duration-700 delay-150">
            {PROMO_CARDS.map(({ icon, title, desc, url }) => (
              <Link key={`promo-back-links-${title}`} className="
                flex items-center gap-4 px-5 py-4 rounded-xl
                bg-white/7 border border-white/10 backdrop-blur-sm
              "
              prefetch={false}
              href={url || "#"}
              >
                <span className="text-3xl flex-shrink-0">{icon}</span>
                <div>
                  <h4 className="text-white text-sm font-semibold mb-0.5">{title}</h4>
                  <p className="text-white/45 text-xs">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
