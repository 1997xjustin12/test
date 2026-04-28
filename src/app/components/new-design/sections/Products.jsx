"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatPrice } from "@/app/lib/helpers";
import { useReveal } from "@/app/hooks/useReveal";
import { useSolanaCategories } from "@/app/context/category";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
import Link from "next/link";
import Image from "next/image";

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
    next: { revalidate: 3600 }, // Optional: Cache for 1 hour
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

function ProductCard({ product }) {
  const { isPriceVisible, getProductUrl } = useSolanaCategories();
  const ref = useReveal();

  const product_attr = useMemo(() => {
    const image =
      product?.images?.find((item) => item?.position == 1)?.src || null;

    return {
      title: product?.title,
      brand: product?.brand,
      url: getProductUrl(product),
      image,
      price: product?.variants?.[0]?.price,
      was: product?.variants?.[0]?.compare_at_price,
      rating: Number(product?.ratings?.rating_count),
    };
  }, [product]);

  return (
    <article
      ref={ref}
      className="
        opacity-0 translate-y-6 transition-all duration-700
        rounded-xl overflow-hidden bg-white dark:bg-stone-900
        border border-stone-100 dark:border-stone-800
        hover:shadow-[0_12px_48px_rgba(0,0,0,.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,.5)]
        hover:-translate-y-1 group
      "
    >
      {/* Image placeholder */}
      <Link href={product_attr.url} title={product_attr?.title}>
        <div className="relative h-48 bg-white dark:from-stone-800 dark:to-stone-900">
          {/* {badge && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span className={`${badgeCls} text-white text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full`}>
                {badge}
              </span>
            </div>
          )} */}
          {product_attr?.image && (
            <Image
              src={product_attr?.image} // Ensure this is a full URL or absolute path
              alt={product_attr?.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              // priority={index < 4} // Uncomment if these are the first things a user sees
            />
          )}
        </div>
      </Link>
      {/* Body */}
      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-0.5">
          {product_attr?.brand}
        </p>
        <Link href={product_attr.url} title={product_attr?.title}>
          <h3 className="font-serif text-base text-charcoal dark:text-white mb-2 leading-snug line-clamp-2">
            {product_attr?.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-3">
          <div className="flex items-center gap-1">
            {/* The Rated Stars */}
            <span className="text-amber-400">
              {"★".repeat(Math.round(product_attr?.rating || 0))}
            </span>

            {/* The Unrated Stars */}
            <span className="text-stone-300 dark:text-stone-600 drop-shadow-sm">
              {"★".repeat(5 - Math.round(product_attr?.ratings || 0))}
            </span>
          </div>
          {product_attr?.ratings || ""}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-charcoal dark:text-white">
            ${formatPrice(product_attr?.price)}
            {product_attr?.was && (
              <s className="text-sm font-normal text-stone-400 ml-1.5">
                ${formatPrice(product_attr?.was)}
              </s>
            )}
          </div>
          <AddToCartButtonWrap product={product}>
            <button
              aria-label={`Add ${product_attr?.title} to cart`}
              className="w-9 h-9 rounded-lg bg-fire hover:bg-fire-light text-white flex items-center justify-center text-lg font-light transition-colors duration-200 border-none"
            >
              +
            </button>
          </AddToCartButtonWrap>
        </div>
      </div>
    </article>
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const hdrRef = useReveal();

  const handleChangeTab = async (tab) => {
    setActive(tab?.name);
    const newProducts = await getProductsByCollectionId(tab?.collection_id);
    setProducts(newProducts);
  };

  useEffect(() => {


    // // Define the function inside to avoid dependency warnings
    const fetchInitialData = async () => {
      try {
        // Hardcoding '137' is fine for a default,
        // but ensure this matches your "All" or default tab logic
        const initialProducts = await getProductsByCollectionId(137);

        if (initialProducts) {
          setProducts(initialProducts);
        }
      } catch (error) {
        console.error("Error loading initial products:", error);
      }
    };

    fetchInitialData();

  }, []);

  return (
    <section
      id="products"
      className="py-20 md:py-24 bg-cream dark:bg-stone-950"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={hdrRef}
          className="
            opacity-0 translate-y-6 transition-all duration-700
            flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10
          "
        >
          <div>
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-1.5">
              Featured Products
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white mb-4 leading-tight">
              Blaze Bestsellers
            </h2>
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
              {PRODUCT_TABS.map((t, index) => (
                <button
                  key={`product-tabs-${t?.name}-${index}`}
                  onClick={() => handleChangeTab(t)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200
                    ${
                      active === t?.name
                        ? "border-fire text-fire bg-fire/5"
                        : "border-stone-200 dark:border-stone-700 text-stone-400 dark:text-stone-500 hover:border-fire hover:text-fire"
                    }
                  `}
                >
                  {t?.name}
                </button>
              ))}
            </div>
          </div>
          <Link
            href={VIEW_ALL_URL}
            className="
            inline-flex items-center gap-2 px-7 py-3 rounded-lg
            border-2 border-fire text-fire hover:bg-fire hover:text-white
            font-semibold text-sm transition-all duration-200 self-start sm:self-auto flex-shrink-0
          "
          >
            View All Products
          </Link>
        </div>

        {/* Grid: 1 col → 2 col tablet → 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, 4).map((p, index) => (
            <ProductCard
              key={`homepage-product-item-${p.title}-${index}`}
              product={p}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
