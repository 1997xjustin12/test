"use client"
import Link from "next/link";
import { useReveal } from "@/app/hooks/useReveal";
import { PROMO_CARDS, PHONE_HREF } from "@/app/data/new-homepage";
import { BASE_URL } from "@/app/lib/helpers";


export default function Promo() {
  const copyRef  = useReveal();
  const cardsRef = useReveal();
  return (
    <section className="py-14 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

        <Link href={`${BASE_URL}/open-box`}
          className="relative overflow-hidden rounded min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-8 sm:p-10 bg-gradient-to-br from-[#3a2f23] to-char text-ash hover:-translate-y-1 transition-transform"
        >
          <p className="font-oswald text-xs font-semibold tracking-[.12em] text-white/60 uppercase">Scratch &amp; Dent</p>
          <h3 className="font-oswald font-bold text-2xl sm:text-3xl uppercase mt-1.5 mb-2">Premium Grills, Discount Prices</h3>
          <p className="text-sm text-white/75 font-light max-w-xs mb-4">Slight cosmetic imperfections, same great grilling power — top brands for way less.</p>
          <span className="font-oswald font-semibold text-sm tracking-wide flex items-center gap-2">Shop All Open Box →</span>
        </Link>

        <Link href={`${BASE_URL}/package-deals`}
          className="relative overflow-hidden rounded min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-8 sm:p-10 bg-gradient-to-br from-ember-deep to-[#7a2606] text-ash hover:-translate-y-1 transition-transform"
        >
          <p className="font-oswald text-xs font-semibold tracking-[.12em] text-white/60 uppercase">Complete Setups</p>
          <h3 className="font-oswald font-bold text-2xl sm:text-3xl uppercase mt-1.5 mb-2">Outdoor Kitchen Packages</h3>
          <p className="text-sm text-white/75 font-light max-w-xs mb-4">Grill, storage and stylish extras bundled together — less planning, more grilling.</p>
          <span className="font-oswald font-semibold text-sm tracking-wide flex items-center gap-2">Shop Package Deals →</span>
        </Link>
      </div>
    </section>
    
  );
}
