"use client"
import { useReveal } from "@/app/hooks/useReveal";
import { CATEGORIES } from "@/app/data/new-homepage";
import { ArrowIcon } from "@/app/components/new-design/ui/Icons";

function CategoryCard({ title, desc, link }) {
  const ref = useReveal();
  return (
    <article
      ref={ref}
      className="
        opacity-0 translate-y-6 transition-all duration-700
        rounded-2xl overflow-hidden bg-white dark:bg-stone-900
        shadow-[0_4px_24px_rgba(0,0,0,.10)] dark:shadow-[0_4px_24px_rgba(0,0,0,.4)]
        hover:shadow-[0_12px_48px_rgba(0,0,0,.20)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,.6)]
        hover:-translate-y-1.5 cursor-pointer group
        border border-transparent dark:border-stone-800
      "
    >
      {/* Image placeholder — swap for <img> */}
      <div className="relative h-56 sm:h-60 bg-gradient-to-br from-stone-800 to-stone-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-lg">{title}</h3>
        </div>
      </div>
      {/* Body */}
      <div className="p-4 pb-5 bg-white dark:bg-stone-900">
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">{desc}</p>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-fire group-hover:gap-2.5 transition-all duration-200">
          {link} <ArrowIcon />
        </div>
      </div>
    </article>
  );
}

export default function Categories() {
  const hdrRef = useReveal();
  return (
    <section id="categories" className="py-20 md:py-24 bg-white dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-6">

        {/* Header */}
        <div ref={hdrRef} className="opacity-0 translate-y-6 transition-all duration-700 text-center mb-12">
          <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-2.5">Browse by Category</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white mb-3 leading-tight">
            Everything You Need to Create Your Perfect Space
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mx-auto leading-relaxed">
            From cozy indoor fireplaces to expansive outdoor setups — shop our full collection.
          </p>
        </div>

        {/* Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map(c => <CategoryCard key={c.title} {...c} />)}
        </div>
      </div>
    </section>
  );
}
