"use client";

import { useState } from "react";
import Badge from "@/app/components/new-design/sections/sp/Badge";

const SpecsShipping = ({ specs, shipping }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? specs : specs.slice(0, 4);

  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Specs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Specifications</h3>
            </div>
            <Badge variant="gray">{specs.length} attributes</Badge>
          </div>
          <table className="w-full">
            <tbody>
              {visible.map((s, i) => (
                <tr
                  key={s.label}
                  className={i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/40" : "bg-white dark:bg-gray-900"}
                >
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium w-2/5 border-b border-gray-100 dark:border-gray-800">
                    {s.label}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800">
                    {s.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
            >
              {showAll ? "Show fewer ↑" : `Show all ${specs.length} specs ↓`}
            </button>
          </div>
        </div>

        {/* Shipping */}
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
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M7 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Shipping Info</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-orange-700 dark:text-orange-300">Free Shipping Included</p>
                <p className="text-[10px] text-orange-500/70 dark:text-orange-400/70">No additional shipping cost</p>
              </div>
            </div>
            {shipping.map((s, i) => (
              <div
                key={s.label}
                className={`flex justify-between items-center py-3 ${i < shipping.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">{s.label}</span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">{s.value}</span>
              </div>
            ))}
            {[
              ["Est. Delivery", "5–7 Business Days"],
              ["Carrier", "Freight / LTL"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between items-center py-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400">{l}</span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecsShipping;
