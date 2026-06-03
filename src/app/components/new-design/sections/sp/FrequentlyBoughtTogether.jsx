"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import SectionHeading from "@/app/components/new-design/sections/sp/SectionHeading";
import { Icon } from "@iconify/react";
import { formatProduct, formatPrice } from "@/app/lib/helpers";
import { useCart } from "@/app/context/cart";

function FrequentlyBoughtTogether({ product }) {
  const fbt_bundle = useMemo(() => {
    if (!(product?.fbt_bundle || []).length) return [];
    return [product, ...product.fbt_bundle].map((item) =>
      formatProduct(item, "fbt_bundle"),
    );
  }, [product]);

  const [selected, setSelected] = useState(
    () => new Set(fbt_bundle.map((item) => item.id)),
  );

  const { addItemsToCart } = useCart();

  if (!fbt_bundle.length) return null;

  const selectedItems = fbt_bundle.filter((item) => selected.has(item.id));
  const total = selectedItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0),
    0,
  );

  const toggleItem = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddToCart = () => {
    addItemsToCart(selectedItems.map((item) => ({ ...item, quantity: 1 })));
  };

  return (
    <section className="mb-14">
      <SectionHeading>Frequently Bought Together</SectionHeading>

      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">

        {/* Images row + Total panel */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 sm:p-6">

          {/* Thumbnails */}
          <div className="flex items-center flex-wrap gap-y-3 overflow-x-auto pb-1">
            {fbt_bundle.map((item, index) => (
              <React.Fragment key={`fbt-img-${item.id}-${index}`}>
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`relative w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] flex-shrink-0 rounded-lg border-2 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all duration-150 ${
                    selected.has(item.id)
                      ? "border-orange-400 opacity-100"
                      : "border-gray-200 dark:border-gray-700 opacity-45"
                  }`}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || "Product"}
                      fill
                      className="object-contain p-2"
                      sizes="120px"
                      priority={false}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 p-2 text-center leading-tight">
                      {item.title}
                    </span>
                  )}
                </button>

                {index < fbt_bundle.length - 1 && (
                  <span className="flex items-center justify-center w-8 flex-shrink-0 text-gray-400 dark:text-gray-500 font-bold text-base">
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Vertical divider */}
          <div className="hidden sm:block w-px self-stretch bg-gray-100 dark:bg-gray-800 flex-shrink-0" />

          {/* Total + CTA */}
          <div className="flex flex-col gap-2 sm:min-w-[210px]">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${formatPrice(total)}
            </p>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedItems.length === 0}
              className="mt-1 flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add {selectedItems.length} selected item
              {selectedItems.length !== 1 ? "s" : ""} to cart
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Item list */}
        <div>
          {fbt_bundle.map((item, index) => (
            <label
              key={`fbt-list-${item.id}-${index}`}
              className={`flex items-center gap-3 px-4 sm:px-6 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                index < fbt_bundle.length - 1
                  ? "border-b border-gray-100 dark:border-gray-800"
                  : ""
              } ${index % 2 !== 0 ? "bg-gray-50/70 dark:bg-gray-800/20" : ""}`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 rounded accent-orange-500 flex-shrink-0 cursor-pointer"
              />

              {/* Title */}
              <div className="flex-1 min-w-0 flex items-start gap-1.5">
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-snug line-clamp-2">
                  {index === 0 && (
                    <span className="font-bold text-gray-900 dark:text-white">
                      This Item:{" "}
                    </span>
                  )}
                  {item.title}
                </span>
                {
                  index !== 0 &&
                <a
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-orange-500 transition-colors"
                  title="Open in new tab"
                >
                  <Icon icon="material-symbols:open-in-new" className="w-3.5 h-3.5" />
                </a>
                }
              </div>

              {/* Price */}
              <span className="text-sm font-bold text-orange-500 flex-shrink-0 ml-2">
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
