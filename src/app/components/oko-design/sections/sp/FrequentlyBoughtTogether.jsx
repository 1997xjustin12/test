"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import SectionHeading from "@/app/components/oko-design/sections/sp/SectionHeading";
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="mb-12">
      <SectionHeading eyebrow="Bundle & save">Frequently bought together</SectionHeading>

      <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">

        {/* Images row + Total */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 sm:p-6">

          {/* Thumbnails */}
          <div className="flex items-center flex-wrap gap-y-3 overflow-x-auto pb-1">
            {fbt_bundle.map((item, index) => (
              <React.Fragment key={`fbt-img-${item.id}-${index}`}>
                <button
                  type="button"
                  aria-label={`${selected.has(item.id) ? "Remove" : "Add"} ${item.title || "product"} ${selected.has(item.id) ? "from" : "to"} bundle`}
                  aria-pressed={selected.has(item.id)}
                  onClick={() => toggleItem(item.id)}
                  className={`relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] flex-shrink-0 rounded-[2px] border overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 transition-all duration-150 ${
                    selected.has(item.id)
                      ? "border-oko-barn opacity-100"
                      : "border-oko-stone-line dark:border-oko-line-dark opacity-45"
                  }`}
                >
                  {item.image ? (
                    <Image src={item.image} alt={item.title || "Product"} fill className="object-contain p-2" sizes="120px" priority={false} />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-inter text-[10px] text-oko-stone p-2 text-center leading-tight">
                      {item.title}
                    </span>
                  )}
                </button>
                {index < fbt_bundle.length - 1 && (
                  <span className="flex items-center justify-center w-8 flex-shrink-0 text-oko-stone font-semibold text-base" aria-hidden="true">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px self-stretch bg-oko-stone-line dark:bg-oko-line-dark flex-shrink-0" />

          {/* Total + CTA */}
          <div className="flex flex-col gap-2 sm:min-w-[210px]">
            <p className="font-inter text-[11px] font-semibold text-oko-stone uppercase tracking-[0.08em]">
              Total
            </p>
            <p className="font-inter font-semibold text-[27px] leading-none text-oko-char dark:text-oko-cream">
              ${formatPrice(total)}
            </p>
            <button
              type="button"
              onClick={() => addItemsToCart(selectedItems.map((item) => ({ ...item, quantity: 1 })))}
              disabled={selectedItems.length === 0}
              className="mt-1 flex items-center justify-center gap-2 h-11 px-5 rounded-[2px] font-inter font-semibold text-[13.5px] text-white bg-oko-barn hover:bg-oko-barn-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add {selectedItems.length} selected item{selectedItems.length !== 1 ? "s" : ""} to cart
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-oko-stone-line dark:border-oko-line-dark" />

        {/* Item list */}
        <div>
          {fbt_bundle.map((item, index) => (
            <label
              key={`fbt-list-${item.id}-${index}`}
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 cursor-pointer transition-colors hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 ${
                index < fbt_bundle.length - 1 ? "border-b border-oko-stone-line dark:border-oko-line-dark" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 rounded-[2px] accent-oko-barn flex-shrink-0 cursor-pointer"
              />
              <div className="flex-1 min-w-0 flex items-start gap-1.5">
                <span className="font-inter text-[13px] sm:text-[13.5px] text-oko-char-soft dark:text-oko-ondark leading-snug line-clamp-2">
                  {index === 0 && (
                    <span className="font-semibold uppercase tracking-[0.04em] text-oko-char dark:text-oko-cream">
                      This item:{" "}
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
                    className="flex-shrink-0 mt-0.5 text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                    title="Open in new tab"
                    aria-label={`Open ${item.title || "product"} in new tab`}
                  >
                    <Icon icon="material-symbols:open-in-new" className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <span className="font-inter font-semibold text-[14px] text-oko-char dark:text-oko-cream flex-shrink-0 ml-2">
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
