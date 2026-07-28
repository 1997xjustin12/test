"use client";
import { useState } from "react";

const FAQSection = ({ faqs }) => {
  const [open, setOpen] = useState(null);

  return (
    <section className="mb-6">
      <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-grate dark:border-white/10">
          <span className="w-8 h-8 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-theme-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash">
              Frequently Asked Questions
            </h3>
            <p className="text-[10px] text-char/40 dark:text-ash/30">Everything you need to know</p>
          </div>
        </div>
        <div>
          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-grate dark:border-white/10 last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-ash dark:hover:bg-white/5 transition-colors"
              >
                <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-200 rounded-sm ${
                  open === i ? "bg-theme-600 text-white" : "bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40"
                }`}>
                  {i + 1}
                </span>
                <span className="flex-1 font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash/80 text-left">
                  {f.q}
                </span>
                <svg
                  className={`w-4 h-4 text-char/30 dark:text-ash/30 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}
                  fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 pl-16">
                  <div className="text-sm text-char/60 dark:text-ash/50 leading-relaxed" dangerouslySetInnerHTML={{ __html: f.a }} />
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
