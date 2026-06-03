"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import SectionHeading from "@/app/components/bbq-design/sections/sp/SectionHeading";
import { Icon } from "@iconify/react";
import { formatProduct, formatPrice } from "@/app/lib/helpers";
import { useCart } from "@/app/context/cart";

function FrequentlyBoughtTogether({ product }) {
  const fbt_bundle = useMemo(() => {
    if (!(product?.fbt_bundle || []).length) return [];
    return [product, ...product.fbt_bundle].map((item) => formatProduct(item, "fbt_bundle"));
  }, [product]);

  const [selected, setSelected] = useState(() => new Set(fbt_bundle.map((item) => item.id)));
  const { addItemsToCart } = useCart();

  if (!fbt_bundle.length) return null;

  const selectedItems = fbt_bundle.filter((item) => selected.has(item.id));
  const total = selectedItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  const toggleItem = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="mb-6">
      <SectionHeading>Frequently Bought Together</SectionHeading>

      <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden">

        {/* Images row + Total */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 sm:p-6">

          {/* Thumbnails */}
          <div className="flex items-center flex-wrap gap-y-3 overflow-x-auto pb-1">
            {fbt_bundle.map((item, index) => (
              <React.Fragment key={`fbt-img-${item.id}-${index}`}>
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] flex-shrink-0 rounded-sm border-2 overflow-hidden bg-white dark:bg-char transition-all duration-150 ${
                    selected.has(item.id)
                      ? "border-theme-600 opacity-100"
                      : "border-grate dark:border-white/10 opacity-45"
                  }`}
                >
                  {item.image ? (
                    <Image src={item.image} alt={item.title || "Product"} fill className="object-contain p-2" sizes="120px" priority={false} />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-char/40 dark:text-ash/40 p-2 text-center leading-tight">
                      {item.title}
                    </span>
                  )}
                </button>
                {index < fbt_bundle.length - 1 && (
                  <span className="flex items-center justify-center w-8 flex-shrink-0 text-char/30 dark:text-ash/30 font-bold text-base">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px self-stretch bg-grate dark:bg-white/10 flex-shrink-0" />

          {/* Total + CTA */}
          <div className="flex flex-col gap-2 sm:min-w-[210px]">
            <p className="font-oswald text-xs font-semibold text-char/50 dark:text-ash/40 uppercase tracking-wider">
              Total
            </p>
            <p className="font-oswald font-bold text-2xl text-ember-deep dark:text-ember">
              ${formatPrice(total)}
            </p>
            <button
              type="button"
              onClick={() => addItemsToCart(selectedItems.map((item) => ({ ...item, quantity: 1 })))}
              disabled={selectedItems.length === 0}
              className="mt-1 flex items-center justify-center gap-2 h-11 px-5 rounded-sm font-oswald font-semibold text-sm uppercase tracking-wide text-white bg-theme-600 hover:bg-theme-700 hover:-translate-y-0.5 active:scale-[.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              Add {selectedItems.length} selected item{selectedItems.length !== 1 ? "s" : ""} to cart
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-grate dark:border-white/10" />

        {/* Item list */}
        <div>
          {fbt_bundle.map((item, index) => (
            <label
              key={`fbt-list-${item.id}-${index}`}
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 cursor-pointer transition-colors hover:bg-ash dark:hover:bg-white/5 ${
                index < fbt_bundle.length - 1 ? "border-b border-grate dark:border-white/10" : ""
              } ${index % 2 !== 0 ? "bg-ash/60 dark:bg-char/30" : ""}`}
            >
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 rounded-sm accent-theme-600 flex-shrink-0 cursor-pointer"
              />
              <div className="flex-1 min-w-0 flex items-start gap-1.5">
                <span className="text-xs sm:text-sm text-char dark:text-ash leading-snug line-clamp-2">
                  {index === 0 && (
                    <span className="font-oswald font-semibold uppercase tracking-wide text-char dark:text-ash">
                      This Item:{" "}
                    </span>
                  )}
                  {item.title}
                </span>
                {index !== 0 && (
                  <a
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-shrink-0 mt-0.5 text-char/30 dark:text-ash/30 hover:text-theme-600 transition-colors"
                    title="Open in new tab"
                  >
                    <Icon icon="material-symbols:open-in-new" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <span className="font-oswald font-bold text-sm text-ember-deep dark:text-ember flex-shrink-0 ml-2">
                ${formatPrice(parseFloat(item.price || 0))}
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FrequentlyBoughtTogether;
