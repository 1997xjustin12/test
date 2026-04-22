"use client";

import { useState } from "react";
import SectionHeading from "@/app/components/new-design/sections/sp/SectionHeading";
import GrillMockSVG from "@/app/components/new-design/sections/sp/GrillMockSVG";

const tabs = ["All", "Built-In", "Freestanding", "Inserts"];

const CollectionStrip = () => {
  const [tab, setTab] = useState(0);

  return (
    <section className="mb-14">
      <SectionHeading
        action={
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === i
                    ? "bg-white dark:bg-gray-700 text-orange-500 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      >
        Shop This Collection
      </SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="group border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="h-28 bg-gray-50 dark:bg-gray-800 overflow-hidden">
              <GrillMockSVG slot={i} />
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Blaze LTE {i + 1}-Burner
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ${(1199 + i * 400).toLocaleString()}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionStrip;
