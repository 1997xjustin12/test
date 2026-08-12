"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useSolanaCategories } from "@/app/context/category";
import ProductsSection from "@/app/components/molecule/ProductsSectionV2";
import { STORE_CONTACT } from "@/app/lib/store_constants";

// CategoryHero — OKO breadcrumb band: cream-dim surface, 12px stone breadcrumb
// with "/" separators (current in char-soft), mono barn eyebrow (product count),
// slab display H1 (sentence case), char-soft descriptor, and a barn phone CTA.
// No glows, no shadows (spec §1, §9 breadcrumb).
function CategoryHero({ category }) {
  return (
    <section className="bg-oko-cream-dim dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 font-inter text-[12px]">
          <Link
            href="/"
            className="text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
          >
            Home
          </Link>
          <span className="text-oko-stone-line dark:text-oko-line-dark" aria-hidden="true">/</span>
          <span className="text-oko-char-soft dark:text-oko-ondark font-medium">
            {category?.name}
          </span>
        </nav>

        <div className="max-w-[640px]">
          {/* Product-count eyebrow */}
          <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
            {category?.count} products
          </span>

          <h1 className="font-oko-display font-semibold text-[clamp(26px,5vw,42px)] leading-[1.12] text-oko-char dark:text-oko-cream">
            {category?.name}
          </h1>

          {category?.sub && (
            <p className="font-inter text-[15.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mt-4 max-w-[560px]">
              {category?.sub}
            </p>
          )}

          {/* Barn phone CTA — matches the homepage hero */}
          <div className="mt-7">
            <Link
              href={`tel:${STORE_CONTACT}`}
              className="inline-flex items-center gap-2 font-inter font-semibold text-[13.5px] px-6 py-3.5 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call {STORE_CONTACT}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Trust strip (spec §8.6) — white, four items, 1px stone-line dividers, barn
// stroke icons, 12.5px labels. Inline stroke SVGs only (§6, no emoji).
function BenefitsBar() {
  const BENEFITS = [
    {
      title: "Free shipping",
      sub: "On orders over $79.99",
      icon: (
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 19a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      ),
    },
    {
      title: "5-year warranty",
      sub: "Full parts & labor",
      icon: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3zM9 12l2 2 4-4" />,
    },
    {
      title: "Expert support",
      sub: "Mon–Sat 8am–6pm PST",
      icon: (
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      ),
    },
    {
      title: "30-day returns",
      sub: "Hassle-free policy",
      icon: <path d="M3 12a9 9 0 019-9 9 9 0 016.7 3H15m6-3v6h-6M21 12a9 9 0 01-9 9 9 9 0 01-6.7-3H9m-6 3v-6h6" />,
    },
  ];
  return (
    <div className="bg-white dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <div
            key={b.title}
            className={`flex items-center gap-3 py-4 md:px-6
              ${i % 2 === 1 ? "border-l border-oko-stone-line dark:border-oko-line-dark pl-5 md:pl-6" : "md:pl-6"}
              ${i >= 2 ? "border-t border-oko-stone-line dark:border-oko-line-dark md:border-t-0" : ""}
              ${i === 2 ? "md:border-l md:border-oko-stone-line dark:md:border-oko-line-dark" : ""}`}
          >
            <svg
              className="w-[18px] h-[18px] flex-shrink-0 text-oko-barn dark:text-oko-barn-light"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {b.icon}
            </svg>
            <div>
              <p className="font-inter font-semibold text-[12.5px] uppercase tracking-[0.03em] text-oko-char dark:text-oko-cream leading-tight">
                {b.title}
              </p>
              <p className="font-inter text-[11.5px] text-oko-stone mt-0.5">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// FAQ accordion (spec §9) — section header pattern, rows separated by stone-line
// with a stroke chevron, no shadow.
function FAQSection({ category }) {
  const [open, setOpen] = useState(null);
  const FAQS = [
    { q: "What's the difference between direct vent and natural vent?", a: "Direct vent fireplaces draw combustion air from outside and exhaust through a sealed flue — highly efficient and safe for any room. Natural vent units use interior air and require a traditional chimney." },
    { q: "Can I convert a natural gas unit to propane?", a: "Most of our gas fireplaces include a conversion kit or offer one as an accessory. Always consult a licensed technician for the conversion." },
    { q: "Do gas fireplaces need electricity to operate?", a: "Models with electronic ignition require electricity. Many units include a millivolt system allowing operation without power — ideal during outages." },
  ];

  return (
    <section className="bg-oko-cream dark:bg-oko-night py-16">
      <div className="max-w-[720px] mx-auto px-5 sm:px-8">
        {/* Section header (8.7) */}
        <div className="mb-8">
          <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
            Got questions?
          </span>
          <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
            {category?.name} FAQ
          </h2>
        </div>

        <div className="border-t border-oko-stone-line dark:border-oko-line-dark">
          {FAQS.map((f, i) => (
            <div key={i} className="border-b border-oko-stone-line dark:border-oko-line-dark">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 py-4 text-left bg-transparent"
              >
                <span className="font-inter font-medium text-[15.5px] text-oko-char dark:text-oko-cream leading-snug">
                  {f.q}
                </span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 text-oko-barn dark:text-oko-barn-light transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <p className="pb-5 font-inter text-[14.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark max-w-[600px]">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA — the single dark feature band (spec §8.11): char-soft surface,
// barn-light eyebrow, white slab H2, and a solid barn phone block.
function CTABanner() {
  return (
    <section className="bg-oko-char-soft dark:bg-oko-night-3 py-16">
      <div className="max-w-[560px] mx-auto px-5 sm:px-8 text-center">
        <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn-light mb-3">
          Need help choosing?
        </span>
        <h2 className="font-oko-display font-semibold text-[29px] leading-[1.18] text-white mb-4">
          Talk to a fireplace expert.
        </h2>
        <p className="font-inter text-[14.5px] leading-[1.55] text-oko-ondark mb-8 max-w-[440px] mx-auto">
          Our certified specialists will help you find the perfect gas fireplace — free of charge, with prices we can only give by phone.
        </p>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="inline-flex items-center gap-2.5 bg-oko-barn hover:bg-oko-barn-dark text-white rounded-[2px] px-6 py-4 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="font-oko-display font-bold text-[20px] leading-none">{STORE_CONTACT}</span>
        </Link>
      </div>
    </section>
  );
}

export default function Category({ category_slug }) {
  const { categories } = useSolanaCategories();
  const category = categories.find((c) => c?.slug === category_slug);
  if (!category_slug || !category) notFound();

  return (
    <div className="bg-oko-cream dark:bg-oko-night font-inter">
      <CategoryHero category={category} />
      <BenefitsBar />
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <ProductsSection category={category_slug} />
      </div>
      <FAQSection category={category} />
      <CTABanner />
    </div>
  );
}
