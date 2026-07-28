import Link from "next/link";
import Image from "next/image";

const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

const HERO_POINTS = [
  "We beat any competitor's price, including Amazon",
  "Free shipping on every order",
  "Exclusive phone-only discounts",
  "Expert design help & concierge service",
];

// 8.5 Hero — 520px media over charcoal with a horizontal scrim; left-anchored
// copy overlay on desktop. Stacks to a ~300px banner + copy-on-char at ≤1024
// (spec §11). `background` prop kept for the existing call signature.
export default function Hero({ background }) {
  return (
    <section className="relative bg-oko-char">
      {/* Media */}
      <div className="relative h-[300px] lg:h-[520px]">
        {background}
        <Image
          src="/images/banner/outdoor-kitchen-banner.webp"
          alt="Built-in stainless BBQ grill on an outdoor kitchen patio island"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={60}
          className="object-cover opacity-90"
        />
        {/* Horizontal scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(38,34,31,0.88) 0%, rgba(38,34,31,0.62) 42%, rgba(38,34,31,0.08) 72%)",
          }}
        />
        {/* Corner tag */}
        <Link
          href={OKO_PHONE_HREF}
          className="absolute bottom-6 right-5 sm:right-8 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[14px] px-5 py-3.5 rounded-[2px] transition-colors z-10"
        >
          Call now for exclusive discount →
        </Link>
      </div>

      {/* Copy — overlays media on desktop, sits below on char at ≤1024 */}
      <div className="lg:absolute lg:inset-0 lg:flex lg:items-center lg:pointer-events-none">
        <div className="max-w-[1260px] w-full mx-auto px-5 sm:px-8">
          <div className="max-w-[640px] py-9 lg:py-0 lg:pointer-events-auto">
            <h1 className="font-oko-display font-semibold text-white text-[clamp(26px,5vw,42px)] leading-[1.12]">
              The best prices on built-in BBQ grills &amp; accessories —{" "}
              <em className="italic text-oko-barn-light">guaranteed.</em>
            </h1>
            <p className="font-inter text-[15.5px] leading-[1.55] text-oko-ondark max-w-[460px] mt-[18px]">
              Looking for the best deal on outdoor kitchen equipment? At Outdoor Kitchen Outlet, we price match every competitor, including Amazon. Call for exclusive discounts you won&apos;t find listed online.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mt-[26px]">
              {HERO_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-[13.5px] leading-snug text-oko-ondark"
                >
                  <span className="text-oko-barn-light font-semibold" aria-hidden="true">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3.5 mt-[30px]">
              <Link
                href={OKO_PHONE_HREF}
                className="font-inter font-semibold text-[13.5px] px-6 py-3.5 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white transition-colors"
              >
                Call {OKO_PHONE}
              </Link>
              <Link
                href="/grills"
                className="font-inter font-semibold text-[13.5px] px-6 py-3.5 rounded-[2px] border border-white/50 text-white hover:bg-white/10 transition-colors"
              >
                Shop grills
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
