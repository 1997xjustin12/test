"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import { useReveal } from "@/app/hooks/useReveal";
import { useSolanaCategories } from "@/app/context/category";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";

const PRODUCT_TABS = [
  {
    name: "All",
    collection_id: 137,
  },
  {
    name: "Fireplaces",
    collection_id: 953,
  },
  {
    name: "Built-In Grills",
    collection_id: 954,
  },
  {
    name: "Freestanding Grills",
    collection_id: 955,
  },
  {
    name: "Accessories",
    collection_id: 78,
  },
  {
    name: "Open Box",
    collection_id: 480,
  },
];

const VIEW_ALL_URL = "/blaze-outdoor-products";

async function getProductsByCollectionId(id) {
  // Use a full URL if calling from the server, or relative if client-side
  const res = await fetch(`/api/collections/collection-products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

function ProductCard({ product }) {
  const ref = useReveal();

  const onSale = !!product.was && product?.save_amt > 0;

  return (
    <article
      ref={ref}
      className="
        bg-white border border-grate rounded overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-stone-300 transition-all group
      "
    >
      {/* Image */}
      <Link
        href={product?.url || "#"}
        aria-label={product?.title}
        title={product?.title}
      >
        <div className="relative h-48 bg-white">
          {/* Flags */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product?.badge && (
              <span className="font-oswald text-[10px] font-semibold px-2 py-1 text-white bg-gold uppercase tracking-wide rounded-sm z-[1]">
                {product?.badge}
              </span>
            )}
            {product?.save_pct && (
              <span className="font-oswald text-[10px] font-semibold px-2 py-1 text-white bg-theme-600 uppercase tracking-wide rounded-sm z-[1]">
                -{product?.save_pct}%
              </span>
            )}
          </div>
          {product?.image && (
            <Image
              src={product?.image}
              alt={product?.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-stone-400 tracking-widest uppercase font-medium line-clamp-1">
          {product?.brand}
        </p>
        <Link
          href={product?.url || "#"}
          aria-label={product?.title}
          title={product?.title}
        >
          <h3 className="font-sora font-medium text-sm leading-snug mt-1 mb-2 flex-1 hover:text-theme-600 transition-colors line-clamp-2">
            {product?.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-2">
          <span className="text-gold tracking-wider">
            {"★".repeat(Math.round(product?.ratings))}
            {"☆".repeat(5 - Math.round(product?.ratings))}
          </span>
          {product?.ratings}
          {/* ({reviewCount}) */}
        </div>

        <div className="min-h-[46px]">
          <div className="flex items-baseline gap-2">
            <span className="font-oswald font-bold text-xl">
              ${formatPrice(product?.price)}
            </span>
            {product?.was && (
              <span className="text-xs text-stone-400 line-through">
                ${formatPrice(product.was)}
              </span>
            )}
          </div>
          {product?.save_amt && (
            <p className="text-xs font-semibold text-bbq-green mt-0.5">
              Save ${formatPrice(product.save_amt)}
            </p>
          )}
        </div>

        {/* <p className={`text-xs mt-1.5 flex items-center gap-1 ${lowStock ? 'text-ember-deep' : 'text-bbq-green'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${lowStock ? 'bg-ember-deep' : 'bg-bbq-green'}`} />
          {stock}
        </p> */}

        <button className="mt-3 w-full py-2.5 bg-theme-600 text-white font-oswald font-semibold text-xs uppercase tracking-wide rounded-sm hover:bg-theme-700 transition-colors">
          Add to Cart
        </button>

        {/* Price + Button */}
        {/* <div className="mt-auto">
          {onSale ? (
            <div className="flex items-end justify-between gap-2">
              <div>
                <s className="text-xs text-stone-400 block leading-none mb-0.5">
                  ${formatPrice(product?.was)}
                </s>
                <span className="text-lg font-bold text-red-500">
                  ${formatPrice(product?.price)}
                </span>
              </div>
              <AddToCartButtonWrap product={product}>
                <button
                  aria-label={`Add ${product.title} to cart`}
                  className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-lg font-light transition-colors duration-200"
                >
                  +
                </button>
              </AddToCartButtonWrap>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-charcoal dark:text-white">
                ${formatPrice(product?.price)}
              </span>
              <AddToCartButtonWrap product={product}>
                <button
                  aria-label={`Add ${product?.title} to cart`}
                  className="flex-shrink-0 w-9 h-9 rounded-lg bg-theme-500 hover:bg-theme-500-light text-white flex items-center justify-center text-lg font-light transition-colors duration-200"
                >
                  +
                </button>
              </AddToCartButtonWrap>
            </div>
          )}
        </div> */}
      </div>
    </article>
  );
}

const MOBILE_INITIAL = 2;

export default function Products({ initialProducts = [] }) {
  const [products, setProducts] = useState(
    (initialProducts || []).map((i) => formatProduct(i)),
  );
  const [active, setActive] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const hdrRef = useReveal();

  const handleChangeTab = async (tab) => {
    setActive(tab?.name);
    setShowAll(false);
    const newProducts = await getProductsByCollectionId(tab?.collection_id);
    setProducts((newProducts || []).map((i) => formatProduct(i)));
  };

  return (
    <section id="products" className="py-20 md:py-24 bg-ash dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
              Limited Quantities
            </p>
            <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1">
              Open-Box &amp; Clearance Deals
            </h2>
          </div>
          <Link
            href={`${BASE_URL}/open-box`}
            className="font-oswald font-semibold text-sm tracking-wide border-b-2 border-theme-600 pb-0.5 hover:text-theme-600 transition-colors"
          >
            Shop All Open Box →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {(products || []).slice(0, 4).map((p) => (
            <ProductCard key={p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
