import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const WHY_POINTS = [
  {
    icon: "🏆",
    title: "20+ Premium Brands",
    desc: "We carry the industry's most trusted names so you always get quality you can count on.",
  },
  {
    icon: "👷",
    title: "Expert Consultation",
    desc: "Our specialists guide you from selection through installation — at no extra cost.",
  },
  {
    icon: "🛡️",
    title: "Contractor Program",
    desc: "Special pricing and dedicated support for builders, designers & contractors.",
  },
  {
    icon: "💰",
    title: "Best Price Guarantee",
    desc: "Found a better price? We'll match it. Your satisfaction is our bottom line.",
  },
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────

export default function WhySection() {
  return (
    <section id="why" className="bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left – Visual ── */}
          <div className="relative">

            {/* Main image */}
            <div className="relative h-72 sm:h-96 lg:h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/why/fireplace-living-room.webp"
                alt="Beautiful fireplace in a living room"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Small inset image — visible sm+ */}
            <div className="hidden sm:block absolute -bottom-5 -right-4 lg:-right-6
                            w-36 sm:w-44 lg:w-48
                            h-28 sm:h-32 lg:h-36
                            rounded-xl overflow-hidden
                            border-4 border-white shadow-xl">
              <Image
                src="/images/why/outdoor-kitchen-small.webp"
                alt="Outdoor kitchen"
                fill
                className="object-cover object-center"
                sizes="200px"
              />
            </div>

            {/* Floating stat card — visible sm+ */}
            <div className="hidden sm:block absolute -left-4 lg:-left-6 top-6
                            bg-white rounded-xl shadow-xl px-4 py-3 w-36 sm:w-40">
              <p className="font-serif text-3xl sm:text-4xl font-bold text-orange-500 leading-none">
                98%
              </p>
              <p className="text-stone-400 text-xs mt-1 leading-snug">
                Customer Satisfaction
              </p>
            </div>

            {/* Floating stat card — mobile only, inline */}
            <div className="sm:hidden flex items-center gap-3 mt-5
                            bg-orange-50 border border-orange-100
                            rounded-xl px-4 py-3">
              <p className="font-serif text-3xl font-bold text-orange-500 leading-none">
                98%
              </p>
              <p className="text-stone-500 text-sm leading-snug">
                Customer Satisfaction Rate
              </p>
            </div>

          </div>

          {/* ── Right – Copy ── */}
          <div>
            <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em] uppercase
                          text-orange-500 mb-2 sm:mb-3">
              Why Choose Solana
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900
                           leading-tight mb-3 sm:mb-4">
              Your Trusted Partner in<br className="hidden sm:block" /> Warmth & Style
            </h2>

            <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mb-8 sm:mb-10">
              We don't just sell fireplaces — we help you create spaces where memories are made.
            </p>

            {/* Why points */}
            <div className="flex flex-col gap-5 sm:gap-6 mb-8 sm:mb-10">
              {WHY_POINTS.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl
                                  bg-orange-500/10 flex items-center justify-center
                                  text-xl sm:text-2xl mt-0.5">
                    {icon}
                  </div>
                  {/* Text */}
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-stone-900 mb-1">
                      {title}
                    </h4>
                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/about"
              className="inline-flex items-center gap-2
                         bg-orange-500 hover:bg-orange-400 text-white
                         font-semibold px-6 sm:px-7 py-3 sm:py-3.5
                         rounded-lg text-sm transition-all duration-200
                         hover:-translate-y-0.5
                         hover:shadow-[0_8px_24px_rgba(249,115,22,0.35)]"
            >
              Learn About Us
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}