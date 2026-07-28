"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DescriptionSection = ({ brand, brandDescription, brandHref = "#", brandImage, description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Description */}
        <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-oko-stone-line dark:border-oko-line-dark">
            <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-oko-barn dark:text-oko-barn-light" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h3 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">
              Product description
            </h3>
          </div>
          <div className="p-5 pdp-description-wrapper">
            {description ? (
              <div className={`overflow-hidden transition-all duration-500 ${expanded ? "" : "max-h-56"}`}>
                <div className="font-inter text-[14px] text-oko-char-soft dark:text-oko-ondark leading-[1.55]" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            ) : (
              <p className="font-inter text-[14px] text-oko-stone leading-[1.55]">No description available.</p>
            )}
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-3 font-inter text-[13px] font-semibold text-oko-sage dark:text-oko-sage-light hover:text-oko-barn dark:hover:text-oko-barn-light border-b border-oko-sage dark:border-oko-sage-light hover:border-oko-barn transition-colors"
            >
              {expanded ? "Show less ↑" : "Read more →"}
            </button>
          </div>
        </div>

        {/* Brand card — the page's single char-soft focal break (spec §2) */}
        <div>
          <div className="bg-oko-char-soft border border-oko-line-dark rounded-[2px] p-5 flex flex-col justify-between gap-4 sticky top-[145px]">
            <div>
              <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn-light mb-2">
                About {brand}
              </span>
              <p className="font-inter text-[13px] text-oko-ondark-muted leading-[1.55]">{brandDescription}</p>
            </div>
            <div className="w-full aspect-1 bg-white rounded-[2px] relative">
              {brandImage && (
                <Image src={brandImage} alt="Brand Image" fill sizes="280px" className="object-contain object-center p-3" />
              )}
            </div>
            <Link href={brandHref} className="font-inter inline-flex items-center gap-1.5 text-[13px] font-semibold text-oko-barn-light hover:text-white transition-colors">
              Visit brand page →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DescriptionSection;
