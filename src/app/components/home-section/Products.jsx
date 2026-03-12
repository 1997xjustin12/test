"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Star } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const TABS = ["All", "Gas", "Electric", "Outdoor", "On Sale"];

const PRODUCTS = [
  {
    id: 1,
    brand: "Napoleon",
    name: "Ascent 60 Linear Gas Fireplace",
    price: 3299,
    originalPrice: 3899,
    rating: 4.8,
    reviews: 34,
    image: "/images/products/napoleon-ascent-60.webp",
    badge: "Bestseller",
    badgeColor: "bg-orange-500",
    tab: ["All", "Gas"],
  },
  {
    id: 2,
    brand: "Dimplex",
    name: "Revillusion 36\" Electric Fireplace",
    price: 1499,
    originalPrice: 1799,
    rating: 4.9,
    reviews: 52,
    image: "/images/products/dimplex-revillusion-36.webp",
    badge: "New",
    badgeColor: "bg-sky-700",
    tab: ["All", "Electric"],
  },
  {
    id: 3,
    brand: "Hearth & Home",
    name: "Outdoor Propane Fire Pit Table",
    price: 899,
    originalPrice: 1199,
    rating: 4.6,
    reviews: 18,
    image: "/images/products/hearth-fire-pit.webp",
    badge: "Sale",
    badgeColor: "bg-green-700",
    tab: ["All", "Outdoor", "On Sale"],
  },
  {
    id: 4,
    brand: "Lynx Grills",
    name: "Professional 54\" Built-In Grill",
    price: 5499,
    originalPrice: null,
    rating: 5.0,
    reviews: 9,
    image: "/images/products/lynx-54-builtin.webp",
    badge: null,
    badgeColor: null,
    tab: ["All", "Outdoor"],
  },
  {
    id: 5,
    brand: "Regency",
    name: "City Series 40\" Gas Fireplace",
    price: 2799,
    originalPrice: 3199,
    rating: 4.7,
    reviews: 27,
    image: "/images/products/regency-city-40.webp",
    badge: "Sale",
    badgeColor: "bg-green-700",
    tab: ["All", "Gas", "On Sale"],
  },
  {
    id: 6,
    brand: "Blaze",
    name: "32\" 4-Burner Gas Grill",
    price: 1299,
    originalPrice: null,
    rating: 4.8,
    reviews: 41,
    image: "/images/products/blaze-32-grill.webp",
    badge: "Bestseller",
    badgeColor: "bg-orange-500",
    tab: ["All", "Outdoor"],
  },
  {
    id: 7,
    brand: "Majestic",
    name: "Marquis II 36\" Wood Fireplace",
    price: 1899,
    originalPrice: 2299,
    rating: 4.5,
    reviews: 15,
    image: "/images/products/majestic-marquis-36.webp",
    badge: "Sale",
    badgeColor: "bg-green-700",
    tab: ["All", "On Sale"],
  },
  {
    id: 8,
    brand: "Dimplex",
    name: "Ignite XL 50\" Electric Fireplace",
    price: 1099,
    originalPrice: null,
    rating: 4.7,
    reviews: 63,
    image: "/images/products/dimplex-ignite-xl-50.webp",
    badge: "New",
    badgeColor: "bg-sky-700",
    tab: ["All", "Electric"],
  },
];

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-stone-200 text-stone-200"
          }
        />
      ))}
    </div>
  );
}

function formatPrice(n) {
  return "$" + n.toLocaleString();
}

// ─────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────

function ProductCard({ brand, name, price, originalPrice, rating, reviews, image, badge, badgeColor, href = "#" }) {
  return (
    <article
      className="group flex flex-col bg-white rounded-2xl overflow-hidden
                 border border-stone-100 shadow-sm
                 hover:shadow-xl hover:-translate-y-1
                 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 z-10 ${badgeColor}
                            text-white text-[0.6rem] font-bold tracking-widest
                            uppercase px-2.5 py-1 rounded-full`}>
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 justify-between p-4">
        <div>
          {/* Brand */}
          <p className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-stone-400 mb-1">
            {brand}
          </p>

          {/* Name */}
          <h3 className="font-serif text-sm sm:text-base text-stone-900 leading-snug mb-2 line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating rating={rating} />
            <span className="text-[0.7rem] text-stone-400">
              {rating.toFixed(1)} ({reviews})
            </span>
          </div>
        </div>

        {/* Footer — price + add button */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-stone-900">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <button
            aria-label={`Add ${name} to cart`}
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-orange-500 hover:bg-orange-400
                       text-white rounded-lg flex items-center justify-center
                       transition-colors duration-200 active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────

export default function ProductsSection() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = PRODUCTS.filter((p) => p.tab.includes(activeTab));

  return (
    <section id="products" className="bg-[#FAF7F4] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">

          {/* Left */}
          <div>
            <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em] uppercase
                          text-orange-500 mb-2">
              Featured Products
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
              Bestsellers & New Arrivals
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mt-4">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border-2
                              transition-colors duration-200
                              ${activeTab === tab
                                ? "border-orange-500 text-orange-500 bg-orange-50"
                                : "border-stone-200 text-stone-500 hover:border-orange-400 hover:text-orange-500"
                              }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 self-start sm:self-auto shrink-0
                       border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white
                       font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors duration-200"
          >
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Product Grid
              • Mobile  : 1 col
              • xs      : 2 cols
              • lg      : 3 cols
              • xl      : 4 cols
        ── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-stone-400 text-sm">
            No products found in this category.
          </div>
        )}

      </div>
    </section>
  );
}