"use client";

import { useState } from "react";

const FAQSection = ({ faqs }) => {
  const [open, setOpen] = useState(null);

  return (
    <section className="mb-6">
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
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Everything you need to know</p>
          </div>
        </div>
        <div className="pdp-faq-accordion-container">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    open === i
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">{f.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 pl-16">
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: f.a }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
