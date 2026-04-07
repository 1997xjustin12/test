"use client"
import React from "react";
import { useReveal } from "@/app/hooks/useReveal";
import { PHONE, PHONE_HREF } from "@/app/data/new-homepage";
import { PhoneIcon } from "@/app/components/new-design/ui/Icons";

export default function Cta() {
  const ref = useReveal();
  return (
    <section className="relative overflow-hidden text-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0300] via-[#1a0803] to-[#0d0300]" />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 py-20 md:py-24">
        <div className="max-w-[1240px] mx-auto px-6">
          <div ref={ref} className="opacity-0 translate-y-6 transition-all duration-700">
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire-light mb-3">Ready to Get Started?</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight">
              Let's Design Your Dream Space Together
            </h2>
            <p className="text-white/60 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Our heating specialists are standing by to help you find the perfect fireplace or outdoor kitchen — no pressure, just expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-fire hover:bg-fire-light text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fire/30">
                Browse Products
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-white/60 text-white hover:bg-white/10 font-semibold text-base transition-all duration-200">
                Get a Free Quote
              </a>
            </div>
            <a href={PHONE_HREF} className="inline-flex items-center gap-2 text-white font-semibold text-lg mt-7">
              <span className="text-fire-light"><PhoneIcon size={18} /></span>
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}