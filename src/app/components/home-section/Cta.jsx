import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const TRUST_ITEMS = [
  { icon: "🚚", label: "Free Shipping Available" },
  { icon: "💬", label: "Expert Consultation" },
  { icon: "🏷️", label: "Best Price Guarantee" },
  { icon: "🔄",  label: "Hassle-Free Returns" },
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────

export default function CTASection() {
  return (
    <section id="cta" className="relative overflow-hidden">

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta/fireplace-cta-bg.webp"
          alt="Cozy fireplace background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay — heavier on mobile */}
        <div className="absolute inset-0
                        bg-black/85
                        sm:bg-black/80
                        lg:bg-black/75" />
        {/* Subtle warm glow from center */}
        <div className="absolute inset-0
                        bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.18)_0%,transparent_70%)]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6
                      py-16 sm:py-20 lg:py-28">
        <div className="flex flex-col items-center text-center">

          {/* Label */}
          <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em]
                        uppercase text-orange-400 mb-3 sm:mb-4">
            Ready to Get Started?
          </p>

          {/* Headline */}
          <h2 className="font-serif
                         text-2xl
                         sm:text-3xl
                         md:text-4xl
                         lg:text-5xl
                         text-white leading-tight
                         max-w-xs sm:max-w-lg lg:max-w-2xl
                         mb-4 sm:mb-5">
            Let's Design Your Dream Space Together
          </h2>

          {/* Description */}
          <p className="text-white/60 text-sm sm:text-base leading-relaxed
                        max-w-sm sm:max-w-md lg:max-w-lg mb-8 sm:mb-10">
            Our heating specialists are standing by to help you find the perfect
            fireplace or outdoor kitchen — no pressure, just expertise.
          </p>

          {/* CTAs */}
          <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-3 mb-10 sm:mb-12 w-full xs:w-auto">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2
                         bg-orange-500 hover:bg-orange-400 text-white
                         font-semibold px-7 sm:px-8 py-3.5 sm:py-4
                         rounded-lg text-sm sm:text-base
                         transition-all duration-200
                         hover:-translate-y-0.5
                         hover:shadow-[0_8px_28px_rgba(249,115,22,0.45)]
                         w-full xs:w-auto"
            >
              Browse Products
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/free-quote"
              className="inline-flex items-center justify-center gap-2
                         border-2 border-white/40 hover:border-white/70
                         hover:bg-white/10 text-white
                         font-semibold px-7 sm:px-8 py-3.5 sm:py-4
                         rounded-lg text-sm sm:text-base
                         transition-all duration-200
                         w-full xs:w-auto"
            >
              Get a Free Quote
            </Link>
          </div>

          {/* Phone CTA */}
          <a
            href="tel:8885759720"
            className="inline-flex items-center gap-2.5
                       text-white/70 hover:text-white
                       text-sm sm:text-base font-medium
                       transition-colors duration-200 mb-10 sm:mb-14
                       group"
          >
            <span className="w-8 h-8 rounded-full bg-orange-500/20 group-hover:bg-orange-500/40
                             flex items-center justify-center transition-colors duration-200">
              <Phone size={14} className="text-orange-400" />
            </span>
            <span>
              Call us at{" "}
              <span className="font-semibold text-white">(888) 575-9720</span>
            </span>
          </a>

          {/* Divider */}
          <div className="w-full max-w-md sm:max-w-xl h-px bg-white/10 mb-8 sm:mb-10" />

          {/* Trust items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-2xl">
            {TRUST_ITEMS.map(({ icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="text-2xl sm:text-3xl leading-none">{icon}</span>
                <span className="text-white/50 text-xs sm:text-sm leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}