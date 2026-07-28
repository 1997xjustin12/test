"use client"
import React from "react";
import { useReveal } from "@/app/hooks/useReveal";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { PhoneIcon } from "@/app/components/oko-design/ui/Icons";
import { BASE_URL } from "@/app/lib/helpers"
import Link from "next/link";

export default function Cta() {
  const ref = useReveal();
  return (
    <section className="relative overflow-hidden text-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0300] via-[#1a0803] to-[#0d0300]" />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 py-20 md:py-24">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div ref={ref} className="opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-500 mb-3">Ready to Get Grilling?</p>
            <h2 className="font-oswald font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight uppercase">
              Let's Build Your Dream Outdoor Kitchen
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Our grill specialists are standing by to help you find the perfect setup — from built-in islands to freestanding grills, no pressure, just expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link prefetch={false} href={`${BASE_URL}/grills`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm bg-theme-600 hover:bg-theme-500 text-white font-oswald font-semibold text-sm uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-600/30">
                Browse Grills
              </Link>
              <Link prefetch={false} href={`${BASE_URL}/contact`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm border-2 border-white/60 text-white hover:bg-white/10 font-oswald font-semibold text-sm uppercase tracking-wide transition-all duration-200">
                Get a Free Quote
              </Link>
            </div>
            <a href={`tel:${STORE_CONTACT}`} className="inline-flex items-center gap-2 text-white font-semibold text-lg mt-7">
              <span className="text-theme-500"><PhoneIcon size={18} /></span>
              {STORE_CONTACT}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}