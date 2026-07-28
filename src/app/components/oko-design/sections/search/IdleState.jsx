import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";

export default async function IdleState({categories, populars}) {

  

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-8">
      {/* Promo — charcoal band, barn action button (8.4) */}
      <div className="rounded-[2px] p-6 mb-8 flex flex-wrap items-center justify-between gap-4 bg-oko-char dark:bg-oko-night-3 border border-oko-char dark:border-oko-line-dark">
        <div>
          <p className="font-oko-display font-semibold text-[21px] leading-[1.2] text-white mb-1">
            Spring sale — up to 30% off.
          </p>
          <p className="text-[13.5px] text-oko-ondark-muted">
            Limited-time deals on top fireplace brands
          </p>
        </div>
        <button className="shrink-0 font-inter font-semibold text-[13.5px] px-5 py-2.5 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white transition-colors">
          Shop sale
        </button>
      </div>

      {/* Trending */}
      <div className="mb-7">
        <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-3">
          Trending searches
        </p>
        <div className="flex flex-wrap gap-2">
          {populars.map((t, i) => (
            <Link
              key={`idle-state-popular-${t}`}
              href={`${BASE_URL}/search?query=${t}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[12.5px] font-inter bg-oko-cream-dim dark:bg-oko-night-3 text-oko-char-soft dark:text-oko-ondark border border-oko-stone-line dark:border-oko-line-dark hover:border-oko-barn hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              <span className="font-oko-mono text-[10px] text-oko-stone">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-3">
          Browse by category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((c) => (
            <Link
              prefetch={false}
              href={`${BASE_URL}/category/${c.slug}`}
              key={`idle-search-category-${c.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2 hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors group overflow-hidden pb-2"
            >
              <div className="relative aspect-1 w-full bg-oko-cream-dim dark:bg-oko-night-3 overflow-hidden">
                {c?.image && (
                  <Image
                    src={c.image} // or your specific object path
                    alt={c.name || "Category search result thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, 64px"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    priority={false}
                  />
                )}
              </div>
              <div className="text-[12.5px] font-medium text-oko-char dark:text-oko-cream text-center leading-tight group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors px-2">
                {c.name}
              </div>
              <div className="text-[10px] text-oko-stone px-2">
                {c.count} product{c.count > 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
