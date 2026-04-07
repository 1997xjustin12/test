"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import { useSolanaCategories } from "@/app/context/category";
import { createSlug } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import ProductsSection from "@/app/components/molecule/ProductsSection";
import Link from "next/link";

function BreadCrumbs({ category }) {
  const category_slug = createSlug(category);
  return (
    <div>
      <Link prefetch={false} href="/">
        Home
      </Link>
      /{" "}
      <Link prefetch={false} href="/categories">
        Categories
      </Link>{" "}
      /{" "}
      <Link prefetch={false} href={`/category/${category_slug}`}>
        {category}
      </Link>
    </div>
  );
}

export function CategoryHero({ category }) {
  return (
    <section className="relative overflow-hidden bg-[#080200] min-h-[300px] sm:min-h-[340px] flex items-center">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 75% 60%, rgba(232,93,38,0.26) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 15% 50%, rgba(249,115,22,0.14) 0%, transparent 60%)",
          }}
        />
        <div className="absolute right-12 lg:right-20 top-1/2 -translate-y-1/2 w-56 md:w-72 opacity-20 pointer-events-none">
          {/* <FpSvg c={["#1a0803", "#3d1a08"]} glow="#E85D26" /> */}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-5 sm:px-8 py-16 sm:py-24 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/30 mb-5">
          {[
            { name: "Home", url: "/" },
            { name: "Category", url: "/categories" },
          ].map((l, i) => (
            <span
              key={`breadcrumb-item-${l?.slug}-${i}`}
              className="flex items-center gap-1.5"
            >
              {i > 0 && <span>/</span>}
              <a
                href={l?.url || "#"}
                className="hover:text-white/60 transition-colors no-underline text-white/30"
              >
                {l?.name}
              </a>
            </span>
          ))}
          <span>/</span>
          <span className="text-white/75">{category?.name}</span>
        </nav>

        <div className="max-w-xl">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 bg-[#E85D26]/[.16] border border-[#E85D26]/30 text-[#F97316] text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
            🔥 {category?.count} Products
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            {category?.name}
          </h1>
          <p className="text-white/50 text-[15px] leading-relaxed mb-8">
            {category?.sub}
          </p>

          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-[#E85D26] hover:bg-[#F97316] text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_18px_rgba(232,93,38,0.38)] hover:-translate-y-0.5">
              Shop All →
            </button>
            <button className="px-6 py-3 bg-transparent text-white/60 border border-white/20 hover:border-[#E85D26] hover:text-[#E85D26] font-semibold text-sm rounded-xl transition-all">
              Get Expert Help
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsBar() {
  const BENEFITS = [
    { icon: "🚚", title: "Free Shipping", sub: "On orders over $1,999" },
    { icon: "🛡️", title: "5-Year Warranty", sub: "Full parts & labor" },
    { icon: "📞", title: "Expert Support", sub: "Mon–Sat 8am–6pm PST" },
    { icon: "↩️", title: "30-Day Returns", sub: "Hassle-free policy" },
  ];
  return (
    <div className="bg-[#FAF7F4] dark:bg-[#161616] border-b border-stone-200 dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-stone-200 dark:divide-[#2A2A2A]">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-3 px-5 sm:px-7 py-4"
          >
            <span className="text-2xl flex-shrink-0">{b.icon}</span>
            <div>
              <p className="text-[13px] font-bold text-[#1A1A1A] dark:text-[#EDE8E2] m-0">
                {b.title}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-[#6B6760] mt-0.5 m-0">
                {b.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubcatTabs({ active, setActive }) {
  const SUBCATS = [
    { label: "All", count: 48 },
    { label: "Linear / Modern", count: 18 },
    { label: "Traditional", count: 14 },
    { label: "See-Through", count: 6 },
    { label: "Corner Units", count: 5 },
    { label: "Inserts", count: 5 },
  ];
  return (
    <div className="sticky top-16 z-40 bg-white dark:bg-[#0C0C0C] border-b border-stone-200 dark:border-[#2A2A2A] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto scrollbar-hide gap-0">
        {SUBCATS.map((sc) => {
          const isActive = active === sc.label;
          return (
            <button
              key={sc.label}
              onClick={() => setActive(sc.label)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3.5 text-[13px] font-medium whitespace-nowrap border-b-2 transition-all bg-transparent
                ${
                  isActive
                    ? "border-[#E85D26] text-[#E85D26] font-bold"
                    : "border-transparent text-stone-500 dark:text-[#6B6760] hover:text-[#E85D26] hover:bg-[#FAF7F4] dark:hover:bg-[#1F1F1F]"
                }`}
            >
              {sc.label}
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold
                ${
                  isActive
                    ? "bg-[#E85D26]/10 text-[#E85D26]"
                    : "bg-stone-100 dark:bg-[#1F1F1F] text-stone-400 dark:text-[#6B6760]"
                }`}
              >
                {sc.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FAQSection({category, faqs=[]}) {
  const [open, setOpen] = useState(null);
  const FAQS = [
    {
      q: "What's the difference between direct vent and natural vent?",
      a: "Direct vent fireplaces draw combustion air from outside and exhaust through a sealed flue — highly efficient and safe for any room. Natural vent units use interior air and require a traditional chimney.",
    },
    {
      q: "Can I convert a natural gas unit to propane?",
      a: "Most of our gas fireplaces include a conversion kit or offer one as an accessory. Always consult a licensed technician for the conversion.",
    },
    {
      q: "Do gas fireplaces need electricity to operate?",
      a: "Models with electronic ignition require electricity. Many units include a millivolt system allowing operation without power — ideal during outages.",
    },
  ];

  return (
    <section className="bg-[#FAF7F4] dark:bg-[#111] py-16 sm:py-20 px-5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#E85D26] m-0 mb-2">
            Got Questions?
          </p>
          <h2 className="font-serif font-bold text-[clamp(1.6rem,3vw,2.2rem)] text-[#1A1A1A] dark:text-[#EDE8E2] m-0">
            {category?.name} FAQ
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="border border-stone-200 dark:border-[#2A2A2A] rounded-2xl overflow-hidden bg-white dark:bg-[#161616]"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-4 bg-transparent border-none cursor-pointer text-left gap-4"
              >
                <span className="text-[14px] font-semibold text-[#1A1A1A] dark:text-[#EDE8E2] leading-snug">
                  {f.q}
                </span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 text-[#E85D26] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 sm:px-6 pb-5 pt-4 text-[13px] text-stone-500 dark:text-[#888880] leading-relaxed border-t border-stone-100 dark:border-[#2A2A2A]">
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

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-[#080200] py-16 sm:py-24 px-5 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 50%, rgba(232,93,38,0.22) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 75% 50%, rgba(249,115,22,0.14) 0%, transparent 60%)",
          }}
        />
      </div>
      <div className="relative z-10 max-w-lg mx-auto">
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#F97316] m-0 mb-3">
          Need Help Choosing?
        </p>
        <h2 className="font-serif font-bold text-[clamp(1.7rem,3.5vw,2.5rem)] text-white m-0 mb-4 leading-tight">
          Talk to a Fireplace Expert
        </h2>
        <p className="text-white/50 text-[15px] leading-relaxed m-0 mb-8">
          Our certified specialists will help you find the perfect gas fireplace
          — free of charge.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            prefetch={false}
            href={`tel:${STORE_CONTACT}`}
            className="flex items-center gap-2 px-7 py-3.5 bg-[#E85D26] hover:bg-[#F97316] text-white font-bold text-sm rounded-xl no-underline shadow-[0_4px_20px_rgba(232,93,38,0.38)] transition-all hover:-translate-y-0.5"
          >
            📞 {STORE_CONTACT}
          </Link>
          {/* <button className="px-7 py-3.5 bg-transparent text-white/60 border border-white/20 hover:border-[#E85D26] hover:text-[#E85D26] font-semibold text-sm rounded-xl cursor-pointer transition-all">
            💬 Live Chat
          </button> */}
        </div>
      </div>
    </section>
  );
}

function CategoryPageClient({ category_slug }) {
  const { categories } = useSolanaCategories();
  const category = categories.find((c) => c?.slug === category_slug);
  // console.log("categories", categories);
  if (!category_slug || !category) notFound();

  const [dark, setDark] = useState(false);
  // const [activeTab, setActiveTab] = useState("All");
  // const [activeFilters, setAF] = useState([]);
  // const [price, setPrice] = useState([500, 8000]);
  // const [drawerOpen, setDrawerOpen] = useState(false);

  // const toggle = (key) =>
  //   setAF((f) => (f.includes(key) ? f.filter((x) => x !== key) : [...f, key]));
  // const clear = () => setAF([]);

  return (
    // Wrap in `dark` class to enable dark mode (Tailwind class strategy)
    <div className={dark ? "dark" : ""}>
      <div className="bg-[#FDFCFB] dark:bg-[#0C0C0C] text-[#1A1A1A] dark:text-[#EDE8E2] transition-colors duration-300">
        <CategoryHero category={category} />
        <BenefitsBar />
        {/* <SubcatTabs active={activeTab} setActive={setActiveTab} /> */}

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex gap-7 items-start">
            <ProductsSection category={category_slug} />
          </div>
        </div>

        {/* <MobileFilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          activeFilters={activeFilters}
          toggle={toggle}
          clear={clear}
          price={price}
          setPrice={setPrice}
        /> */}

        <FAQSection category={category}/>
        <CTABanner />
      </div>
    </div>
  );
}

export default CategoryPageClient;
