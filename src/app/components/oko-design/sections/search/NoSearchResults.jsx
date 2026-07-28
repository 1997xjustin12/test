import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";

export default function NoSearchResults({ categories, query, populars }) {
  return (
    <div className="py-16 flex flex-col items-center text-center px-4">
      {/* Icon — stroke-only, muted (barn is action-only) */}
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark">
        <svg
          className="w-9 h-9 text-oko-stone"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 11h6M11 8v6" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* §9 empty state — slab heading, 13.5px stone line, one barn button, no apology */}
      <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream mb-2">
        No results for{" "}
        <span className="text-oko-barn dark:text-oko-barn-light">&ldquo;{query}&rdquo;</span>.
      </h2>
      <p className="text-[13.5px] text-oko-stone mb-6 max-w-md">
        Try a broader term or a brand name, or browse the categories below. For help finding it, call us.
      </p>

      <a
        href="tel:8886674986"
        className="inline-flex items-center font-inter font-semibold text-[13.5px] px-5 py-2.5 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white transition-colors mb-10"
      >
        Call 888-667-4986
      </a>

      {/* Suggest searches */}
      <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-3">
        Try these popular searches
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {populars.slice(0, 6).map((t) => (
          <Link
            key={`no-result-popular-${t}`}
            href={`${BASE_URL}/search?query=${t}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[12.5px] font-inter bg-oko-cream-dim dark:bg-oko-night-3 text-oko-char-soft dark:text-oko-ondark border border-oko-stone-line dark:border-oko-line-dark hover:border-oko-barn hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
          >
            {t}
          </Link>
        ))}
      </div>

      {/* Category browse */}
      <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-3">
        Browse categories
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
  );
}