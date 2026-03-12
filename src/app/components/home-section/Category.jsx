import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const CATEGORIES = [
  {
    title: "Fireplaces",
    desc: "Gas, wood-burning & electric fireplaces to transform any room into a warm sanctuary.",
    href: "/fireplaces",
    image: "/images/categories/fireplaces.webp",
    badge: null,
  },
  {
    title: "Patio Heaters",
    desc: "Keep your outdoor space warm and comfortable year-round with our premium patio heaters.",
    href: "/patio-heaters",
    image: "/images/categories/patio-heaters.webp",
    badge: null,
  },
  {
    title: "Built-In Grills",
    desc: "Professional-grade built-in grills for the ultimate permanent outdoor cooking experience.",
    href: "/built-in-grills",
    image: "/images/categories/built-in-grills.webp",
    badge: "Popular",
  },
  {
    title: "Freestanding Grills",
    desc: "Versatile freestanding grills in gas, charcoal and pellet — perfect for any backyard.",
    href: "/freestanding-grills",
    image: "/images/categories/freestanding-grills.webp",
    badge: null,
  },
  {
    title: "Outdoor Refrigeration",
    desc: "Keep drinks and ingredients perfectly chilled with our outdoor-rated refrigerators and coolers.",
    href: "/outdoor-refrigeration",
    image: "/images/categories/outdoor-refrigeration.webp",
    badge: "New",
  },
  {
    title: "Fire Pits & Storage",
    desc: "Fire pits, outdoor storage, and accessories to complete your dream outdoor living setup.",
    href: "/fire-pits",
    image: "/images/categories/fire-pits.webp",
    badge: null,
  },
];

// ─────────────────────────────────────────
// CATEGORY CARD
// ─────────────────────────────────────────

function CategoryCard({ title, desc, href, image, badge }) {
  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden
                 border border-stone-100 shadow-md
                 hover:shadow-2xl hover:-translate-y-1.5
                 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 z-10
                           bg-orange-500 text-white text-[0.65rem] font-bold
                           tracking-widest uppercase px-3 py-1 rounded-full">
            {badge}
          </span>
        )}

        {/* Title on image */}
        <h3 className="absolute bottom-0 left-0 right-0 z-10
                       font-serif text-lg sm:text-xl font-bold text-white
                       px-4 sm:px-5 pb-4
                       drop-shadow-md">
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 justify-between gap-3 px-4 sm:px-5 py-4">
        <p className="text-stone-500 text-sm leading-relaxed">
          {desc}
        </p>
        <div className="inline-flex items-center gap-1.5 text-orange-500 text-sm font-semibold
                        group-hover:gap-2.5 transition-all duration-200">
          Shop {title}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────

export default function CategoriesSection() {
  return (
    <section id="categories" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em] uppercase
                        text-orange-500 mb-2 sm:mb-3">
            Browse by Category
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900
                         leading-tight mb-3 sm:mb-4">
            Everything You Need to Create<br className="hidden sm:block" /> Your Perfect Space
          </h2>
          <p className="text-stone-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            From cozy indoor fireplaces to expansive outdoor setups — shop our full collection.
          </p>
        </div>

        {/* Grid
            • Mobile  : 1 column
            • sm      : 2 columns
            • lg      : 3 columns
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.title} {...cat} />
          ))}
        </div>

      </div>
    </section>
  );
}