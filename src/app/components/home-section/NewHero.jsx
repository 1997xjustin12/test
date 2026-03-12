import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const STATS = [
  { value: "15K+", label: "Products" },
  { value: "4.4★", label: "122 Reviews" },
  { value: "20+",  label: "Brands" },
];

const TRUST = [
  "Free Shipping Available",
  "Expert Consultations",
  "Contractor Pricing",
];

const HERO_CARDS = [
  {
    title: "Gas Fireplaces",
    sub:   "Starting from $1,299",
    href:  "/fireplaces/gas",
    bg:    "from-stone-950 to-orange-950",
    icon:  "🔥",
  },
  {
    title: "Outdoor Kitchens",
    sub:   "Clearance — Up to 40% Off",
    href:  "/outdoor/kitchens",
    bg:    "from-stone-950 to-green-950",
    icon:  "🍖",
  },
];

const FEATURES = [
  { icon: "🚚", title: "Free Shipping",  sub: "On selected orders"    },
  { icon: "💬", title: "Expert Support", sub: "Talk to a specialist"  },
  { icon: "🔄", title: "Easy Returns",   sub: "Hassle-free policy"    },
  { icon: "🏷️", title: "Best Prices",    sub: "Price match guarantee" },
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────

export default function HeroSection() {
  return (
    <section className="relative flex flex-col">

      {/* ── Hero ── */}
      <div className="relative min-h-[100svh] sm:min-h-[92vh] flex items-center overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner/home-banner-202509.webp"
            alt="Solana Fireplaces – Premium Heating Solutions"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Overlay — heavier on mobile for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 sm:from-black/90 sm:via-black/70 sm:to-black/30" />
          {/* Bottom fade into features bar */}
          <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-t from-stone-900 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center
                          pt-10 pb-36
                          sm:pt-14 sm:pb-40
                          lg:py-20 lg:pb-36">

            {/* ── Left – Copy ── */}
            <div className="flex flex-col">

              {/* Label */}
              <p className="text-[0.65rem] sm:text-xs font-semibold tracking-[0.15em] uppercase text-orange-400 mb-2 sm:mb-3">
                Premium Heating Solutions
              </p>

              {/* Headline */}
              <h1 className="font-serif
                             text-3xl
                             sm:text-4xl
                             md:text-5xl
                             xl:text-6xl
                             text-white leading-[1.15] mb-4 sm:mb-5">
                Ignite the Heart<br />
                of Your{" "}
                <em className="not-italic text-orange-400">Home</em>
              </h1>

              {/* Description */}
              <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-md mb-7 sm:mb-9">
                From stunning gas fireplaces to all-weather outdoor kitchens — we
                bring warmth, beauty, and craftsmanship to every space.
              </p>

              {/* CTAs */}
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 mb-8 sm:mb-10">
                <Link
                  href="#categories"
                  className="inline-flex items-center justify-center gap-2
                             bg-orange-500 hover:bg-orange-400 text-white font-semibold
                             px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg
                             transition-all hover:-translate-y-0.5
                             hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)]
                             text-sm w-full xs:w-auto"
                >
                  Shop All Products
                  <ArrowRight size={15} />
                </Link>
                <a
                  href="tel:8885759720"
                  className="inline-flex items-center justify-center gap-2
                             border-2 border-white/50 hover:bg-white/15 text-white font-semibold
                             px-6 sm:px-7 py-3 sm:py-3.5 rounded-lg
                             transition-colors text-sm w-full xs:w-auto"
                >
                  <Phone size={15} />
                  Get Expert Advice
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-8 mb-6 sm:mb-7">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-white leading-none">
                      {value}
                    </div>
                    <div className="text-[0.6rem] sm:text-[0.65rem] font-medium tracking-[0.1em] uppercase text-white/40 mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust badges — hide on very small screens to avoid clutter */}
              <div className="hidden xs:flex flex-wrap gap-3 sm:gap-4">
                {TRUST.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 text-white/55 text-xs
                               before:content-['✓'] before:text-orange-400 before:font-bold"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right – Cards (desktop only) ── */}
            <div className="hidden lg:flex flex-col gap-4">
              {HERO_CARDS.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group rounded-2xl overflow-hidden
                             border border-white/10 bg-white/5 backdrop-blur-md
                             shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                             hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]
                             hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`h-44 bg-gradient-to-br ${card.bg} flex items-center justify-center relative overflow-hidden`}>
                    <span className="text-6xl filter drop-shadow-lg">{card.icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-0.5">{card.title}</h3>
                      <p className="text-white/45 text-xs">{card.sub}</p>
                    </div>
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center
                                    text-white shrink-0 group-hover:bg-orange-400 transition-colors">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* ── Features Bar — sits at bottom inside hero ── */}
        <div className="absolute bottom-0 w-full z-20 bg-stone-900/95 backdrop-blur-sm">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4
                            divide-y divide-white/[0.08]
                            lg:divide-y-0 lg:divide-x lg:divide-white/[0.08]">
              {FEATURES.map(({ icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3 sm:gap-3.5 px-3 sm:px-6 py-4 sm:py-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-500/15
                                  flex items-center justify-center text-base sm:text-xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <strong className="block text-white text-xs sm:text-sm font-semibold leading-snug">
                      {title}
                    </strong>
                    <span className="text-white/40 text-[0.65rem] sm:text-xs hidden sm:block">
                      {sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}