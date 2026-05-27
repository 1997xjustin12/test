"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createSlug } from "@/app/lib/helpers";

const DescriptionSection = ({
  brand,
  brandDescription,
  brandHref = "#",
  brandImage,
  description,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Description */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Product Description
            </h3>
          </div>
          <div className="p-5 pdp-description-wrapper">
            {description ? (
              <div
                className={`overflow-hidden transition-all duration-500 ${expanded ? "" : "max-h-56"}`}
              >
                <div
                  className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                No description available.
              </p>
            )}
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          </div>
        </div>

        {/* Brand card */}
        <div>
          <div className="bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between gap-4 sticky top-[145px]">
            <div>
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-white mb-2">About {brand}</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {brandDescription}
              </p>
            </div>
            <div className="w-full aspect-1 bg-white rounded-md relative">
              {brandImage && (
                <Image
                  src={brandImage}
                  alt="Brand Image"
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-contain object-center transition-opacity duration-300"
                />
              )}
            </div>
            <Link
              href={brandHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              Visit Brand Page{" "}
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;
