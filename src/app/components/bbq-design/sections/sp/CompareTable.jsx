"use server"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { accentuateSpecLabels } from "@/app/lib/filter-helper";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import StarRating from "@/app/components/bbq-design/sections/sp/StarRating";
import CompareItemAddToCart from "@/app/components/bbq-design/sections/sp/CompareItemAddToCart";
import SectionHeading from "@/app/components/bbq-design/sections/sp/SectionHeading";

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
    <td className={`px-5 py-3.5 border-b border-grate dark:border-white/5 text-xs text-center font-sora ${
      isActive
        ? "bg-theme-600/5 dark:bg-theme-600/10 border-x border-theme-600/20 dark:border-theme-600/15 text-char dark:text-ash font-medium"
        : "text-char/60 dark:text-ash/50"
    }`}>
      {value}
    </td>
  );
};

const ProductTableHeadItem = ({ product, activeId }) => {
  const isActive = product?.product_id === activeId;
  return (
    <th className={`min-w-[220px] sm:min-w-[260px] border-b border-grate dark:border-white/10 align-top ${
      isActive ? "bg-theme-600/5 dark:bg-theme-600/10 border-x border-theme-600/20 dark:border-theme-600/15" : ""
    }`}>
      {/* Product image */}
      <Link prefetch={false} href={product?.url || "#"} title={product?.title}>
        <div className="relative aspect-[16/9] bg-white dark:bg-char">
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
          className="font-sora text-xs text-theme-600 hover:text-theme-500 line-clamp-2 hover:underline leading-snug"
        >
          {product?.name}
        </Link>

        <StarRating rating={product?.ratings || 0} />

        <p className="font-oswald font-bold text-base text-ember-deep dark:text-ember">
          ${formatPrice(product?.price)}
        </p>

        {isActive ? (
          <div className="h-9 flex items-center justify-center font-oswald font-semibold text-xs uppercase tracking-wide px-3 text-theme-600 border border-theme-600 bg-theme-600/10 rounded-sm">
            Current Product
          </div>
        ) : (
          <CompareItemAddToCart product={product} label="Add to Cart" />
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
    <section className="mb-6">
      <SectionHeading>Compare Product Options</SectionHeading>

      <div className="overflow-x-auto rounded-sm border border-grate dark:border-white/10">
        <table className="w-full text-left border-collapse bg-paper dark:bg-smoke">
          <thead>
            <tr>
              {/* Features column header */}
              <th className="sticky left-0 z-[1] min-w-[180px] sm:min-w-[210px] p-4 border-b border-grate dark:border-white/10 bg-ash dark:bg-char font-oswald text-xs font-semibold uppercase tracking-wide text-char/60 dark:text-ash/40">
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
            {specKeys.map(({ label, key }, rowIdx) => (
              <tr
                key={`tr-${key}`}
                className={rowIdx % 2 === 0 ? "bg-paper dark:bg-smoke" : "bg-ash/60 dark:bg-char/20"}
              >
                {/* Spec label — sticky */}
                <td className="sticky left-0 z-[1] px-4 py-3 border-b border-grate/60 dark:border-white/5 font-oswald text-xs font-semibold uppercase tracking-wide text-char/50 dark:text-ash/40 bg-ash dark:bg-char min-w-[180px] sm:min-w-[210px]">
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
