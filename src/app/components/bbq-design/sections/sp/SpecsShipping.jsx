"use client";
import { useState } from "react";
import Badge from "@/app/components/bbq-design/sections/sp/Badge";

const SpecsShipping = ({ specs, shipping, isFreeshipping }) => {
  const [showAll, setShowAll] = useState(false);
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* Specs */}
        <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-grate dark:border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-theme-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash">
                Specifications
              </h3>
            </div>
            <Badge variant="gray">{specs?.length} attributes</Badge>
          </div>
          <table className="w-full">
            <tbody>
              {specs.slice(0, showAll ? specs.length : 4).map((s, i) => (
                <tr key={`specs-${s?.label}-${i}`} className={i % 2 === 0 ? "bg-ash dark:bg-char/40" : "bg-paper dark:bg-smoke"}>
                  <td className="px-5 py-3 text-xs text-char/50 dark:text-ash/40 font-medium w-2/5 border-b border-grate/60 dark:border-white/5">
                    {s.label}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-char dark:text-ash border-b border-grate/60 dark:border-white/5">
                    {s.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="font-oswald text-xs font-semibold text-theme-600 hover:text-theme-500 flex items-center gap-1.5 transition-colors uppercase tracking-wide"
            >
              {showAll ? "Show fewer ↑" : `Show all ${specs?.length} specs ↓`}
            </button>
          </div>
        </div>

        {/* Shipping */}
        <div>
          <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden sticky top-[145px]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-grate dark:border-white/10">
              <span className="w-8 h-8 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-theme-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M7 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
                </svg>
              </span>
              <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash">
                Shipping Info
              </h3>
            </div>
            <div className="p-4">
              {isFreeshipping && (
                <div className="flex items-center gap-3 bg-bbq-green/10 border border-bbq-green/20 rounded-sm p-3 mb-4">
                  <div className="w-8 h-8 bg-bbq-green flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-bbq-green">Free Shipping Included</p>
                    <p className="text-[10px] text-bbq-green/60">No additional shipping cost</p>
                  </div>
                </div>
              )}
              {shipping.map((s, i) => (
                <div key={s.label} className={`flex justify-between items-center py-3 ${i < shipping.length - 1 ? "border-b border-grate dark:border-white/10" : ""}`}>
                  <span className="text-xs text-char/50 dark:text-ash/40">{s.label}</span>
                  <span className="text-xs font-bold text-char dark:text-ash">{s.value}</span>
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
