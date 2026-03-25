import { BRANDS } from "@/app/data/new-homepage";

export default function Brands() {
  return (
    <section className="bg-cream dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-11 overflow-hidden">
      <p className="text-center text-stone-600 dark:text-stone-600 text-[11px] tracking-[.12em] uppercase mb-5">
        Trusted Brands We Carry
      </p>
      <div className="relative flex">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="font-serif text-base font-semibold text-stone-400 dark:text-stone-600 cursor-default">
              {b}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}