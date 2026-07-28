"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getProductsByCollectionId } from "@/app/lib/api";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import SectionHeading from "@/app/components/oko-design/sections/sp/SectionHeading";
import StarRating from "@/app/components/oko-design/sections/sp/StarRating";

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
    <section className="mb-12">
      <SectionHeading eyebrow="From this brand">Shop this collection</SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[22px]">
        {collectionProducts.slice(0, 4).map((p, i) => (
          <article
            key={`collection-${p?.title}-${i}`}
            className="group flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden"
          >
            <Link prefetch={false} href={p?.url || "#"} tabIndex={-1} aria-hidden="true" className="block">
              <div className="relative aspect-1 bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark overflow-hidden">
                {p?.image && (
                  <Image src={p.image} alt={p?.title || "Product"} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]" />
                )}
              </div>
            </Link>
            <div className="p-4 flex flex-col gap-1.5">
              <Link
                prefetch={false}
                href={p?.url || "#"}
                className="font-inter text-[14px] font-medium text-oko-char dark:text-oko-cream leading-[1.3] line-clamp-2 min-h-[36px] hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
              >
                {p?.title}
              </Link>
              <StarRating rating={p?.ratings || 0} showCount count={p?.reviews || 0} />
              <p className="mt-1">
                <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
                  ${formatPrice(p?.price || 0)}
                </span>
                {p?.was && (
                  <span className="ml-1.5 font-inter text-[12px] text-oko-stone line-through">
                    ${formatPrice(p.was)}
                  </span>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CollectionStrip;
