"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProductsByCollectionId } from "@/app/lib/api";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import SectionHeading from "@/app/components/new-design/sections/sp/SectionHeading";
import StarRating from "@/app/components/new-design/ui/StarRating";
import GrillMockSVG from "@/app/components/new-design/sections/sp/GrillMockSVG";

const CollectionStrip = ({ product }) => {
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loader = [1, 2, 3, 4];

  useEffect(() => {
    const brand = product?.brand;
    const collections = product?.collections;
    if (brand && collections) {
      const collection_id =
        collections.find(({ name }) => name === brand)?.id || null;
      if (collection_id) {
        getProductsByCollectionId(collection_id)
          .then((res) => res.json())
          .then((res) => {
            setCollectionProducts(res.map(i=>  formatProduct(i, "card")));
          })
          .catch((err) => {
            console.log("Error", err);
            setCollectionProducts([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [product]);

  if (!Array.isArray(collectionProducts) || collectionProducts.length === 0)
    return null;

  return (
    <section className="mb-14">
      <SectionHeading>Shop This Collection</SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(collectionProducts || []).slice(0, 4).map((p, i) => (
          <Link
            key={`collection-options-${p?.title}-${i}`}
            prefetch={false} href={p?.url || "#"}
            className="relative group border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="h-28 bg-gray-50 dark:bg-gray-800 overflow-hidden">
              <GrillMockSVG slot={i} />
            </div>
            <div className="p-4 flex flex-col items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[32px]" title={p?.title}>
                  {p?.title}
                </div>
                <div className="py-2">
                  <StarRating rating={p?.ratings} />
                </div>
                <p className="text-xs text-gray-700 mt-0.5">
                  ${formatPrice(p?.price || 0)}
                </p>
              </div>
              <svg
                className="absolute bottom-4 right-2 w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionStrip;
