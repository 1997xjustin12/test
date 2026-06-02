import Link from "next/link";
import Image from "next/image";

import { BASE_URL } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";

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
    image: "/images/banner/home-gas-fireplace.webp",
    url: "/gas-fireplaces",
    title: "Gas Fireplaces",
    sub: "Instant Warmth & Modern Ambiance",
  },
  {
    image: "/images/banner/home-built-in-grills.webp",
    url: "/built-in-grills",
    title: "Built-In Grills",
    sub: "Elevate Your Outdoor Kitchen Luxury",
  },
];

// CTA OPTIONS — delete the two you don't want, then remove this comment block
// Option A: "Call Now & Start Saving →"
// Option B: "Call. Tell Us Your Budget. Save. →"
// Option C: "Tell Us What You Need →"

// function TopbarRow({ cta, label }) {
//   return (
//     <div className="bg-charcoal dark:bg-black py-2.5 text-[11px] border-b border-white/5 last:border-0">
//       <div className="max-w-[1240px] mx-auto px-6">
//         <div className="hidden md:flex items-center justify-between">
//           <h2 className="font-normal tracking-wide text-xs">
//             <span className="text-white font-semibold uppercase tracking-[.1em] italic">
//               ✦ Name Your Price
//             </span>
//             <span className="text-neutral-400 mx-3">—</span>
//             <span className="text-white/50">Lowest Prices Guaranteed</span>
//           </h2>

//           <Link
//             href={`tel:${STORE_CONTACT}`}
//             className="text-theme-500 hover:text-theme-600 transition-colors duration-150 tracking-wide hover:underline"
//           >
//             {cta}
//           </Link>
//         </div>

//         <h2 className="md:hidden text-center font-normal">
//           <span className="text-white font-semibold uppercase tracking-[.1em] text-[10px]">
//             ✦ Name Your Price
//           </span>
//           <span className="text-white/20 mx-2.5">—</span>
//           <span className="text-white/50 font-semibold uppercase tracking-[.1em] text-[10px]">Lowest Prices Guaranteed</span>
//         </h2>
//       </div>
//     </div>
//   );
// }


export default function Hero({ background }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-smoke via-char to-[#100c08] text-ash">
      {/* Glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(226,84,29,.34),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(217,155,28,.20),transparent_40%)] pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Copy */}
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="font-oswald text-xs font-semibold tracking-widest px-3 py-1.5 bg-theme-600 border border-theme-600 rounded-sm uppercase">★ Outlet Pricing</span>
            <span className="font-oswald text-xs font-semibold tracking-widest px-3 py-1.5 border border-white/30 rounded-sm uppercase">4.4 ★ · 122 Reviews</span>
            <span className="font-oswald text-xs font-semibold tracking-widest px-3 py-1.5 border border-white/30 rounded-sm uppercase">Authorized Dealer</span>
          </div>
          <h1 className="font-oswald font-bold text-4xl sm:text-5xl xl:text-6xl uppercase leading-none">
            Premium Grills.<br />
            <em className="text-theme-600 not-italic">Outlet Prices.</em>
          </h1>
          <p className="mt-5 mb-8 text-base sm:text-lg text-stone-400 font-light max-w-md leading-relaxed">
            Top-brand gas grills, built-ins and outdoor kitchens — including inspected open-box units at up to 35% off retail.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/open-box" className="font-oswald font-semibold text-sm uppercase tracking-wide px-7 py-4 bg-theme-600 text-white rounded-sm hover:bg-theme-700 transition-all hover:-translate-y-0.5">
              Shop Open-Box Deals →
            </Link>
            <Link href="/grills" className="font-oswald font-semibold text-sm uppercase tracking-wide px-7 py-4 border border-white/40 text-ash rounded-sm hover:bg-white/10 transition-all hover:-translate-y-0.5">
              Browse All Grills
            </Link>
          </div>
        </div>

        {/* Featured product card */}
        <div className="bg-paper text-char rounded p-6 shadow-2xl rotate-[1.5deg] max-w-sm mx-auto lg:mx-0">
          <span className="inline-block bg-bbq-green text-white font-oswald font-semibold text-xs tracking-widest px-2 py-1 uppercase">Open Box · Save $1,026</span>
          <div className="flex items-center justify-center h-44 text-7xl bg-ash rounded mt-3 mb-3">🔥</div>
          <p className="font-sora font-medium text-sm leading-snug">Blaze Premium LTE 32" 4-Burner Built-In</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-oswald font-bold text-3xl text-ember-deep">$1,849</span>
            <span className="text-sm text-stone-400 line-through">$2,874.99</span>
          </div>
          <p className="text-xs font-semibold text-bbq-green mt-1">You save $1,025.99 (36%)</p>
        </div>

      </div>
    </section>
  );
}
