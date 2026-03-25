"use client";
import { useReveal } from "@/app/hooks/useReveal";
import { PHONE, PHONE_HREF } from "@/app/data/new-homepage";
import Image from "next/image";
import Link from "next/link";

const STATS = [
  { num: "6K+", label: "Products" },
  { num: "4.4★", label: "122 Reviews" },
  { num: "20+", label: "Brands" },
];
const TRUST = [
  "Free Shipping Available",
  "Expert Consultations",
  "Contractor Pricing",
];
const CARDS = [
  {
    image: "/images/feature/gas-fireplaces-1.webp",
    url: "/gas-fireplaces",
    title: "Gas Fireplaces",
    sub: "Instant Warmth & Modern Ambiance",
  },
  {
    image: "/images/feature/Built-In Grill 2.webp",
    url: "/built-in-grills",
    title: "Built-In Grills",
    sub: "Elevate Your Outdoor Kitchen Luxury",
  },
];

export default function Hero() {
  const contentRef = useReveal();
  const cardsRef = useReveal();
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <img
        src="https://solanafireplaces.com/_next/image?url=%2Fimages%2Fbanner%2Fhome-banner-202509.webp&w=3840&q=75"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
      {/* Fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0600] via-[#3d1208] to-[#0d0300]" />
      {/* Directional overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 w-full">
        <div
          className="
          grid gap-14 items-center py-20
          grid-cols-1 md:grid-cols-2
        "
        >
          {/* ── Left: Copy ── */}
          <div
            ref={contentRef}
            className="opacity-0 translate-y-6 transition-all duration-700"
          >
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire-light mb-3">
              Premium Outdoor Solutions
            </p>
            {/* <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.8rem] text-white leading-[1.15] mb-5">
              Ignite the Heart<br />of Your <em className="not-italic text-fire-light">Home</em>
            </h1> */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.8rem] text-white leading-[1.15] mb-5">
              Your Dream
              <br />
              Kitchen <em className="not-italic text-fire-light">One</em>
              <br />
              Call Away
            </h1>
            <p className="text-white/70 text-base lg:text-lg max-w-md mb-9 leading-relaxed">
              From stunning gas fireplaces to all-weather outdoor kitchens — we
              bring warmth, beauty, and craftsmanship to every space.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="#categories"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-fire hover:bg-fire-light text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fire/30"
              >
                Shop All Products
              </Link>
              <Link
                href={PHONE_HREF}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/60 text-white hover:bg-white/10 font-semibold transition-all duration-200"
              >
                Get Expert Advice
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mb-5">
              {STATS.map(({ num, label }) => (
                <div key={label}>
                  <div className="font-serif text-3xl font-bold text-white">
                    {num}
                  </div>
                  <div className="text-[11px] tracking-widest uppercase text-white/40 mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {TRUST.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-1.5 text-white/55 text-xs before:content-['✓'] before:text-fire-light before:font-bold"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Feature Cards — hidden on mobile ── */}
          <div
            ref={cardsRef}
            className="hidden md:flex flex-col gap-3 opacity-0 translate-y-6 transition-all duration-700 delay-150"
          >
            {CARDS.map(({ image, url, title, sub }) => (
              <Link
                key={title}
                href={url}
                className="
                rounded-2xl overflow-hidden
                bg-white/7 backdrop-blur-md
                border border-white/10
                shadow-[0_8px_32px_rgba(0,0,0,.3)]
                hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,.4)]
                transition-all duration-300 group
              "
              >
                {/* <div className="h-40 bg-gradient-to-br from-stone-900 to-stone-800 relative overflow-hidden"> */}
                <div className="h-40 bg-white relative overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
                <div className="px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-[15px] font-semibold">
                      {title}
                    </h3>
                    <p className="text-white/50 text-xs mt-0.5">{sub}</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-fire flex items-center justify-center text-white text-sm group-hover:bg-fire-light transition-colors">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
