"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useSolanaCategories } from "@/app/context/category";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import ProductsSection from "@/app/components/molecule/ProductsSectionV2";

function CategoryHero({ category }) {
  return (
    <section className="relative overflow-hidden bg-[#080200] min-h-[300px] sm:min-h-[340px] flex items-center">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 75% 60%, rgba(232,93,38,0.26) 0%, transparent 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 50%, rgba(249,115,22,0.14) 0%, transparent 60%)" }} />
      </div>

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/30 mb-5">
          <a href="/" className="hover:text-white/60 transition-colors">Home</a>
          <span>/</span>
          <a href="/categories" className="hover:text-white/60 transition-colors">Category</a>
          <span>/</span>
          <span className="text-white/75">{category?.name}</span>
        </nav>

        <div className="max-w-xl">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-theme-600/15 border border-theme-600/30 text-theme-500 text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
            🔥 {category?.count} Products
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            {category?.name}
          </h1>
          <p className="text-white/50 text-[15px] leading-relaxed mb-8">
            {category?.sub}
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-theme-600 hover:bg-theme-500 text-gray-900 font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-500/30">
              Shop All →
            </button>
            <button className="px-6 py-3 border-2 border-white/60 text-white hover:bg-white/10 font-semibold text-sm rounded-xl transition-all duration-200">
              Get Expert Help
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsBar() {
  const BENEFITS = [
    { icon: "🚚", title: "Free Shipping",   sub: "On orders over $1,999" },
    { icon: "🛡️", title: "5-Year Warranty", sub: "Full parts & labor" },
    { icon: "📞", title: "Expert Support",  sub: "Mon–Sat 8am–6pm PST" },
    { icon: "↩️", title: "30-Day Returns",  sub: "Hassle-free policy" },
  ];
  return (
    <div className="bg-stone-50 dark:bg-gray-900 border-b border-stone-200 dark:border-gray-800">
      <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-stone-200 dark:divide-gray-800">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex items-center gap-3 px-5 sm:px-7 py-4">
            <span className="text-2xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="text-[13px] font-bold text-charcoal dark:text-white">{b.title}</p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection({ category }) {
  const [open, setOpen] = useState(null);
  const FAQS = [
    { q: "What's the difference between direct vent and natural vent?", a: "Direct vent fireplaces draw combustion air from outside and exhaust through a sealed flue — highly efficient and safe for any room. Natural vent units use interior air and require a traditional chimney." },
    { q: "Can I convert a natural gas unit to propane?",                 a: "Most of our gas fireplaces include a conversion kit or offer one as an accessory. Always consult a licensed technician for the conversion." },
    { q: "Do gas fireplaces need electricity to operate?",               a: "Models with electronic ignition require electricity. Many units include a millivolt system allowing operation without power — ideal during outages." },
  ];

  return (
    <section className="bg-stone-100 dark:bg-stone-900 py-16 sm:py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 dark:text-theme-500 mb-2">
            Got Questions?
          </p>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-charcoal dark:text-white">
            {category?.name} FAQ
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left gap-4 bg-transparent"
              >
                <span className="text-sm font-semibold text-charcoal dark:text-white leading-snug">
                  {f.q}
                </span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 text-theme-600 dark:text-theme-500 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 sm:px-6 pb-5 pt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-700">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#080200] py-16 sm:py-24 px-5 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 25% 50%, rgba(232,93,38,0.22) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 75% 50%, rgba(249,115,22,0.14) 0%, transparent 60%)" }} />
      </div>
      <div className="relative max-w-lg mx-auto">
        <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-500 mb-3">
          Need Help Choosing?
        </p>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white mb-4 leading-tight">
          Talk to a Fireplace Expert
        </h2>
        <p className="text-white/50 text-[15px] leading-relaxed mb-8">
          Our certified specialists will help you find the perfect gas fireplace — free of charge.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            prefetch={false}
            href={`tel:${STORE_CONTACT}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-theme-600 hover:bg-theme-500 text-gray-900 font-semibold text-sm rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-500/30"
          >
            📞 {STORE_CONTACT}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Category({ category_slug }) {
  const { categories } = useSolanaCategories();
  const category = categories.find((c) => c?.slug === category_slug);
  if (!category_slug || !category) notFound();

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-charcoal dark:text-white">
      <CategoryHero category={category} />
      <BenefitsBar />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <ProductsSection category={category_slug} />
      </div>
      <FAQSection category={category} />
      <CTABanner />
    </div>
  );
}
