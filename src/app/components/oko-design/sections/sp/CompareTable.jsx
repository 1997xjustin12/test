"use server"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { accentuateSpecLabels } from "@/app/lib/filter-helper";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import StarRating from "@/app/components/oko-design/sections/sp/StarRating";
import CompareItemAddToCart from "@/app/components/oko-design/sections/sp/CompareItemAddToCart";
import SectionHeading from "@/app/components/oko-design/sections/sp/SectionHeading";

const extractProductSpecs = (product) => {
  const accentuate = product?.accentuate_data || null;
  if (!accentuate) return null;
  const accentuateKeys = Object.keys(accentuate);
  const specsConfig = accentuateSpecLabels
    .filter((asl) => accentuateKeys.includes(asl?.key))
    .map((asl) => ({ ...asl, value: accentuate[asl?.key] }));
  return specsConfig
    .filter((sc) => sc?.value)
    .map((sc) => {
      const rawValue = accentuate[sc?.key];
      const renderValue = typeof sc?.transform === "function" ? sc.transform(rawValue) : rawValue;
      return { ...sc, value: renderValue };
    });
};

const ItemValue = ({ specs, specKey, isActive }) => {
  const specsObject = Object.fromEntries(specs.map((item) => [item.key, item.value]));
  const value = specsObject?.[specKey] || "—";
  return (
    <td className={`px-5 py-3.5 border-b border-oko-stone-line dark:border-oko-line-dark font-inter text-[13px] text-center ${
      isActive
        ? "bg-oko-barn/5 dark:bg-oko-barn/15 border-x border-oko-barn/25 text-oko-char dark:text-oko-cream font-medium"
        : "text-oko-char-soft dark:text-oko-ondark"
    }`}>
      {value}
    </td>
  );
};

const ProductTableHeadItem = ({ product, activeId }) => {
  const isActive = product?.product_id === activeId;
  return (
    <th className={`min-w-[220px] sm:min-w-[260px] border-b border-oko-stone-line dark:border-oko-line-dark align-top ${
      isActive ? "bg-oko-barn/5 dark:bg-oko-barn/15 border-x border-oko-barn/25" : ""
    }`}>
      {/* Product image */}
      <Link prefetch={false} href={product?.url || "#"} title={product?.title}>
        <div className="relative aspect-[16/9] bg-oko-cream-dim dark:bg-oko-night-3">
          {product?.image && (
            <Image
              src={product.image}
              alt={product?.title || "Compare Product"}
              fill
              className="object-contain p-2"
            />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <Link
          prefetch={false}
          href={product?.url || "#"}
          title={product?.title}
          className="font-inter text-[13px] font-medium text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light line-clamp-2 leading-snug transition-colors"
        >
          {product?.name}
        </Link>

        <StarRating rating={product?.ratings || 0} />

        <p className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
          ${formatPrice(product?.price)}
        </p>

        {isActive ? (
          <div className="h-9 flex items-center justify-center font-inter font-semibold text-[13px] px-3 text-oko-barn dark:text-oko-barn-light border border-oko-barn/40 bg-oko-barn/10 rounded-[2px]">
            Current product
          </div>
        ) : (
          <CompareItemAddToCart product={product} label="Add to cart" />
        )}
      </div>
    </th>
  );
};

const CompareTable = ({ products, activeProductId }) => {
  const activeProduct = products.find((p) => p.product_id === activeProductId);
  const otherProducts = products.filter((p) => p.product_id !== activeProductId);
  const orderedProducts = [activeProduct, ...otherProducts].map((op) => formatProduct(op, "card"));
  const orderedSpecs = orderedProducts.map((op) => ({ ...op, compare_specs: extractProductSpecs(op) }));
  const specKeys = (orderedSpecs?.[0]?.compare_specs || []).map(({ label, key }) => ({ label, key }));

  return (
    <section className="mb-12">
      <SectionHeading eyebrow="Side by side">Compare product options</SectionHeading>

      <div className="overflow-x-auto rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark">
        <table className="w-full text-left border-collapse bg-white dark:bg-oko-night-2">
          <thead>
            <tr>
              {/* Features column header */}
              <th className="sticky left-0 z-[1] min-w-[180px] sm:min-w-[210px] p-4 border-b border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone">
                Features
              </th>
              {orderedProducts.map((product, i) => (
                <ProductTableHeadItem
                  key={`compare-head-${product?.product_id}-${i}`}
                  product={product}
                  activeId={activeProductId}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {specKeys.map(({ label, key }) => (
              <tr key={`tr-${key}`}>
                {/* Spec label — sticky */}
                <td className="sticky left-0 z-[1] px-4 py-3 border-b border-oko-stone-line dark:border-oko-line-dark font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-oko-stone bg-oko-cream-dim dark:bg-oko-night-3 min-w-[180px] sm:min-w-[210px]">
                  {label}
                </td>
                {orderedSpecs.map((product) => (
                  <ItemValue
                    key={`cell-${product.product_id}-${key}`}
                    specs={product?.compare_specs || []}
                    specKey={key}
                    isActive={product?.product_id === activeProductId}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CompareTable;
