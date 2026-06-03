"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProductsByCollectionId } from "@/app/lib/api";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import SectionHeading from "@/app/components/bbq-design/sections/sp/SectionHeading";
import StarRating from "@/app/components/bbq-design/sections/sp/StarRating";
import GrillMockSVG from "@/app/components/bbq-design/sections/sp/GrillMockSVG";

const CollectionStrip = ({ product }) => {
  const [collectionProducts, setCollectionProducts] = useState([]);

  useEffect(() => {
    const brand = product?.brand;
    const collections = product?.collections;
    if (brand && collections) {
      const collection_id = collections.find(({ name }) => name === brand)?.id || null;
      if (collection_id) {
        getProductsByCollectionId(collection_id)
          .then((res) => res.json())
          .then((res) => setCollectionProducts(res.map((i) => formatProduct(i, "card"))))
          .catch(() => setCollectionProducts([]));
      }
    }
  }, [product]);

  if (!Array.isArray(collectionProducts) || collectionProducts.length === 0) return null;

  return (
    <section className="mb-6">
      <SectionHeading>Shop This Collection</SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {collectionProducts.slice(0, 4).map((p, i) => (
          <Link
            key={`collection-${p?.title}-${i}`}
            prefetch={false}
            href={p?.url || "#"}
            className="group relative bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600 hover:-translate-y-1 transition-all duration-200"
          >
            <div className="h-28 bg-white dark:bg-char overflow-hidden relative">
              {p?.image && (
                <Image src={p.image} alt={p?.title || "Product"} fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
              )}
            </div>
            <div className="p-3 flex flex-col gap-1">
              <p className="font-sora text-xs font-semibold text-char dark:text-ash line-clamp-2 min-h-[32px]">
                {p?.title}
              </p>
              <StarRating rating={p?.ratings} />
              <p className="font-oswald font-bold text-sm text-ember-deep dark:text-ember">
                ${formatPrice(p?.price || 0)}
                {p?.was && (
                  <span className="ml-1.5 text-xs text-char/30 dark:text-ash/30 line-through font-normal">
                    ${formatPrice(p.was)}
                  </span>
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionStrip;
