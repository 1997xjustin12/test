"use client";
import { useState } from "react";

// FAQ accordion (spec §8/§9) — rows separated by stone-line, stroke chevron.
const FAQSection = ({ faqs }) => {
  const [open, setOpen] = useState(null);

  return (
    <section className="mb-12">
      <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-oko-stone-line dark:border-oko-line-dark">
          <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-oko-barn dark:text-oko-barn-light" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h3 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">
              Frequently asked questions
            </h3>
            <p className="font-inter text-[11px] text-oko-stone">Everything you need to know</p>
          </div>
        </div>
        <div>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-oko-stone-line dark:border-oko-line-dark last:border-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 transition-colors"
                >
                  <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center font-oko-mono text-[12px] font-medium rounded-[2px] transition-colors duration-200 ${
                    isOpen ? "bg-oko-barn text-white" : "bg-oko-cream-dim dark:bg-oko-night-3 text-oko-stone"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 font-inter text-[14px] font-medium text-oko-char dark:text-oko-cream text-left">
                    {f.q}
                  </span>
                  <svg
                    className={`w-4 h-4 text-oko-stone flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-16">
                    <div className="font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark leading-[1.55]" dangerouslySetInnerHTML={{ __html: f.a }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
