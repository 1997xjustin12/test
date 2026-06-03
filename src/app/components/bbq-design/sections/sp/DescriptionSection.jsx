"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DescriptionSection = ({ brand, brandDescription, brandHref = "#", brandImage, description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* Description */}
        <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-grate dark:border-white/10">
            <span className="w-8 h-8 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-theme-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash">
              Product Description
            </h3>
          </div>
          <div className="p-5 pdp-description-wrapper">
            {description ? (
              <div className={`overflow-hidden transition-all duration-500 ${expanded ? "" : "max-h-56"}`}>
                <div className="text-sm text-char/60 dark:text-ash/50 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            ) : (
              <p className="text-sm text-char/50 dark:text-ash/40 leading-relaxed">No description available.</p>
            )}
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-3 font-oswald text-xs font-semibold text-theme-600 hover:text-theme-500 flex items-center gap-1.5 transition-colors uppercase tracking-wide"
            >
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          </div>
        </div>

        {/* Brand card — intentionally dark as a contrast accent panel */}
        <div>
          <div className="bg-char border border-white/10 rounded-sm p-5 flex flex-col justify-between gap-4 sticky top-[145px]">
            <div>
              <div className="w-9 h-9 bg-theme-600/20 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-theme-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <p className="font-oswald text-sm font-semibold uppercase tracking-wide text-ash mb-2">About {brand}</p>
              <p className="text-xs text-ash/40 leading-relaxed">{brandDescription}</p>
            </div>
            <div className="w-full aspect-1 bg-white rounded-sm relative">
              {brandImage && (
                <Image src={brandImage} alt="Brand Image" fill sizes="280px" className="object-contain object-center" />
              )}
            </div>
            <Link href={brandHref} className="font-oswald inline-flex items-center gap-1.5 text-xs font-semibold text-theme-500 hover:text-theme-400 transition-colors uppercase tracking-wide">
              Visit Brand Page →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;
