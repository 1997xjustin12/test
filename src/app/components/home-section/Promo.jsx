import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const PROMO_CARDS = [
  {
    icon: "📦",
    title: "Open Box Deals",
    desc: "Certified products at unbeatable prices",
  },
  {
    icon: "🏷️",
    title: "Close-Out Pricing",
    desc: "Last-chance inventory at deep discounts",
  },
  {
    icon: "🎁",
    title: "Package Bundles",
    desc: "Combine products and save more",
  },
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────

export default function PromoSection() {
  return (
    <section id="promo" className="relative overflow-hidden">

      {/* ── Background Image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/promo/outdoor-kitchen-promo.webp"
          alt="Outdoor kitchen and fireplace promo"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay — heavier on mobile, lightens toward right on desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90
                                        sm:bg-gradient-to-r sm:from-black/90 sm:via-black/75 sm:to-black/40" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6
                      py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left – Copy ── */}
          <div>
            {/* Label */}
            <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em] uppercase
                          text-orange-400 mb-2 sm:mb-3">
              Limited-Time Deals
            </p>

            {/* Headline */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl
                           text-white leading-tight mb-3 sm:mb-4">
              Name Your Budget.<br className="hidden sm:block" />
              We'll Find Your Fireplace.
            </h2>

            {/* Description */}
            <p className="text-white/65 text-sm sm:text-base leading-relaxed
                          max-w-lg mb-7 sm:mb-9">
              From open box savings to close-out deals, we make luxury heating
              accessible. Talk to an expert and discover your best deal today.
            </p>

            {/* CTAs */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3">
              <a
                href="tel:8885759720"
                className="inline-flex items-center justify-center gap-2
                           bg-orange-500 hover:bg-orange-400 text-white
                           font-semibold px-6 sm:px-7 py-3 sm:py-3.5
                           rounded-lg text-sm transition-all duration-200
                           hover:-translate-y-0.5
                           hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)]
                           w-full xs:w-auto"
              >
                <Phone size={15} />
                Call to Save Now
              </a>
              <Link
                href="/deals"
                className="inline-flex items-center justify-center gap-2
                           border-2 border-white/50 hover:bg-white/15 text-white
                           font-semibold px-6 sm:px-7 py-3 sm:py-3.5
                           rounded-lg text-sm transition-colors duration-200
                           w-full xs:w-auto"
              >
                Browse All Deals
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* ── Right – Promo Cards ── */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {PROMO_CARDS.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4
                           bg-white/8 hover:bg-white/12
                           border border-white/10 hover:border-white/20
                           backdrop-blur-sm rounded-xl
                           px-4 sm:px-5 py-4 sm:py-5
                           transition-all duration-200 cursor-default"
              >
                {/* Icon */}
                <div className="text-3xl sm:text-4xl leading-none shrink-0">
                  {icon}
                </div>
                {/* Text */}
                <div>
                  <h4 className="text-white font-semibold text-sm sm:text-base mb-0.5">
                    {title}
                  </h4>
                  <p className="text-white/50 text-xs sm:text-sm leading-snug">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}