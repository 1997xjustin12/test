import { BRANDS } from "@/app/data/new-homepage";

export default function Brands() {
  return (
    <section className="bg-cream dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-11">
      <div className="max-w-[1240px] mx-auto px-6">
        <p className="text-center text-stone-400 dark:text-stone-600 text-[11px] tracking-[.12em] uppercase mb-5">
          Trusted Brands We Carry
        </p>
        <div className="flex items-center justify-center gap-8 sm:gap-11 flex-wrap">
          {BRANDS.map(b => (
            <span key={b} className="font-serif text-base font-semibold text-stone-300 dark:text-stone-600 hover:text-charcoal dark:hover:text-stone-300 transition-colors duration-200 cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}