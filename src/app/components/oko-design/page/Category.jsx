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
        <nav className="flex items-center gap-1.5 mb-5">
          <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">Home</a>
          <span className="text-xs text-white/20">❯</span>
          <a href="/categories" className="text-xs text-white/30 hover:text-white/60 transition-colors">Category</a>
          <span className="text-xs text-white/20">❯</span>
          <span className="text-xs text-white/75 font-medium">{category?.name}</span>
        </nav>

        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-theme-600/15 border border-theme-600/30 text-theme-500 font-oswald text-[10px] font-semibold tracking-[.12em] uppercase px-3 py-1 rounded-sm mb-5">
            🔥 {category?.count} Products
          </div>

          <h1 className="font-oswald font-bold text-4xl sm:text-5xl uppercase text-white mb-4 leading-tight">
            {category?.name}
          </h1>
          <p className="text-sm font-light leading-relaxed text-white/60 mb-8 max-w-lg">
            {category?.sub}
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5">
              Shop All →
            </button>
            <button className="px-6 py-3 rounded-sm bg-white/5 border border-white/15 text-ash font-oswald font-semibold text-sm uppercase tracking-wide hover:border-theme-600 hover:text-theme-500 transition-colors">
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
    <div className="bg-ash dark:bg-char border-b border-grate dark:border-white/10">
      <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-grate dark:divide-white/10">
        {BENEFITS.map((b) => (
          <div key={b.title} className="flex items-center gap-3 px-5 sm:px-7 py-4">
            <span className="text-2xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="font-oswald font-semibold text-sm uppercase tracking-wide text-char dark:text-ash">{b.title}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{b.sub}</p>
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
    <section className="bg-ash dark:bg-char py-14 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase mb-1">
            Got Questions?
          </p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1 text-stone-900 dark:text-ash">
            {category?.name} FAQ
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <div key={i} className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left gap-4 bg-transparent"
              >
                <span className="font-oswald font-semibold text-base uppercase tracking-wide text-char dark:text-ash leading-snug">
                  {f.q}
                </span>
                <span className="text-2xl text-theme-600 shrink-0 ml-3">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="px-5 sm:px-6 pb-5 text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400 border-t border-grate dark:border-white/10">
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

function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#080200] py-16 sm:py-24 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 25% 50%, rgba(232,93,38,0.22) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 75% 50%, rgba(249,115,22,0.14) 0%, transparent 60%)" }} />
      </div>
      <div className="relative max-w-lg mx-auto px-4 sm:px-6">
        <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase mb-3">
          Need Help Choosing?
        </p>
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase text-white mb-4 leading-tight">
          Talk to a Fireplace Expert
        </h2>
        <p className="text-sm font-light leading-relaxed text-white/60 mb-8 max-w-md mx-auto">
          Our certified specialists will help you find the perfect gas fireplace — free of charge.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            prefetch={false}
            href={`tel:${STORE_CONTACT}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            {STORE_CONTACT}
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
    <div className="bg-ash dark:bg-char font-sora">
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
