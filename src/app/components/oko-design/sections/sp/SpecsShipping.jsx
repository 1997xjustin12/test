"use client";
import { useState } from "react";
import Badge from "@/app/components/oko-design/sections/sp/Badge";

// Specs table (spec §9) — bordered, stone-line row dividers, stone uppercase
// labels in the left column. Shipping panel alongside; free-shipping is a sage
// success alert (§9 alerts).
const SpecsShipping = ({ specs, shipping, isFreeshipping }) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <section className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* Specs */}
        <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-oko-stone-line dark:border-oko-line-dark">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-oko-barn dark:text-oko-barn-light" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <h3 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">
                Specifications
              </h3>
            </div>
            <Badge variant="stone">{specs?.length} attributes</Badge>
          </div>
          <table className="w-full">
            <tbody>
              {specs.slice(0, showAll ? specs.length : 4).map((s, i) => (
                <tr key={`specs-${s?.label}-${i}`} className={i % 2 === 0 ? "bg-oko-cream-dim/40 dark:bg-oko-night-3/50" : "bg-white dark:bg-oko-night-2"}>
                  <td className="px-5 py-3 font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-oko-stone w-2/5 border-b border-oko-stone-line dark:border-oko-line-dark align-top">
                    {s.label}
                  </td>
                  <td className="px-5 py-3 font-inter text-[13px] font-medium text-oko-char dark:text-oko-cream border-b border-oko-stone-line dark:border-oko-line-dark">
                    {s.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="font-inter text-[13px] font-semibold text-oko-sage dark:text-oko-sage-light hover:text-oko-barn dark:hover:text-oko-barn-light border-b border-oko-sage dark:border-oko-sage-light hover:border-oko-barn transition-colors"
            >
              {showAll ? "Show fewer ↑" : `Show all ${specs?.length} specs →`}
            </button>
          </div>
        </div>

        {/* Shipping */}
        <div>
          <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden sticky top-[145px]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-oko-stone-line dark:border-oko-line-dark">
              <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-oko-barn dark:text-oko-barn-light" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M7 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
                </svg>
              </span>
              <h3 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">
                Shipping info
              </h3>
            </div>
            <div className="p-4">
              {isFreeshipping && (
                <div className="flex items-center gap-3 bg-oko-sage/10 border-l-4 border-oko-sage rounded-[2px] p-3 mb-4">
                  <svg className="w-5 h-5 text-oko-sage dark:text-oko-sage-light flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-inter text-[13px] font-semibold text-oko-sage dark:text-oko-sage-light">Free shipping included</p>
                    <p className="font-inter text-[11px] text-oko-stone">No additional shipping cost</p>
                  </div>
                </div>
              )}
              {shipping.map((s, i) => (
                <div key={s.label} className={`flex justify-between items-center gap-3 py-3 ${i < shipping.length - 1 ? "border-b border-oko-stone-line dark:border-oko-line-dark" : ""}`}>
                  <span className="font-inter text-[12.5px] text-oko-stone">{s.label}</span>
                  <span className="font-inter text-[12.5px] font-semibold text-oko-char dark:text-oko-cream text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecsShipping;
