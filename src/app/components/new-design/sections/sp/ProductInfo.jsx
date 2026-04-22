"use client";
// import { useState } from "react";
import Link from "next/link";
// COMPONENTS
import StarRating from "@/app/components/new-design/sections/sp/StarRating";
import Badge from "@/app/components/new-design/sections/sp/Badge";
// HELPERS
import { STORE_CONTACT } from "@/app/lib/store_constants"


const ProductInfo = ({ product }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Brand + SKU */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <Link
          href="#"
          className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-2.5 py-1 rounded-full uppercase tracking-widest hover:bg-orange-100 transition-colors"
        >
          {product?.brand}
        </Link>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          SKU: {product?.sku}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
        {product?.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 flex-wrap pb-4 border-b border-gray-100 dark:border-gray-800">
        <StarRating
          rating={product?.rating}
          showCount
          count={product?.reviewCount}
        />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {product?.rating} out of 5
        </span>
        <span className="text-gray-200 dark:text-gray-700">·</span>
        {/* <Link
          href="#reviews"
          className="text-xs font-semibold text-orange-500 hover:underline"
        >
          Write a Review
        </Link> */}
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-4xl font-black text-gray-900 dark:text-white">
          ${product?.price}
        </span>
        {product?.savePct > 0 && (
          <div className="flex flex-col pb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                ${product?.was}
              </span>
              <Badge variant="green">SAVE {product?.savePct}%</Badge>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              You save ${product?.saveAmt}{product?.is_freeshipping && ` · Free Shipping`}
            </span>
          </div>
        )}
      </div>

      {/* Ships */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg
          className="w-4 h-4 text-green-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{product?.ships}</span>
      </div>

      {/* Discounts */}
      <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center text-xs flex-shrink-0">
            🔥
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Discounts & Savings Available
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {product?.badges.map((b) => (
            <div
              key={b}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
            >
              <span className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-2 h-2 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Qty + CTA */}
      <div className="flex items-stretch gap-3 flex-wrap">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            // onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
          >
            −
          </button>
          <span className="w-9 text-center text-sm font-bold text-gray-900 dark:text-white">
            {1}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
          >
            +
          </button>
        </div>
        <button
          // onClick={handleCart}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 active:scale-[.98]}`}
        >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>{" "}
              Add to Cart
        </button>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-sm font-bold hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors whitespace-nowrap"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Expert
        </Link>
      </div>
    </div>
  );
};

export default ProductInfo;