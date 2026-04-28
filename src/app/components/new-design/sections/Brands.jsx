import { BRANDS } from "@/app/data/new-homepage";

export default function Brands() {
  return (
    <section className="bg-cream dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-11 overflow-hidden">
      <p className="text-center text-stone-600 dark:text-stone-600 text-[11px] tracking-[.12em] uppercase mb-5">
        Trusted Brands We Carry
      </p>

      {/* Mobile: static wrap grid — no animation, no repaints */}
      <div className="md:hidden flex flex-wrap justify-center gap-x-6 gap-y-3 px-6">
        {BRANDS.slice(0, 12).map((b) => (
          <span key={b} className="font-serif text-sm font-semibold text-stone-400 dark:text-stone-600">
            {b}
          </span>
        ))}
      </div>

      {/* Desktop: scrolling marquee */}
      <div className="hidden md:flex relative">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="font-serif text-base font-semibold text-stone-400 dark:text-stone-600 cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}