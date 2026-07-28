"use client";

import React, { useState } from "react";

const Pagination = ({ total_count, results_per_page, onChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(total_count / results_per_page);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, start + 2);
      if (currentPage <= 2) end = 4;
      if (currentPage >= totalPages - 1) start = totalPages - 3;
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  const rangeStart = (currentPage - 1) * results_per_page + 1;
  const rangeEnd = Math.min(currentPage * results_per_page, total_count);

  const btnBase =
    "h-9 flex items-center justify-center font-oswald font-semibold text-xs uppercase tracking-wide border transition-all duration-150 rounded-sm";
  const btnActive = "bg-theme-600 border-theme-600 text-white";
  const btnIdle =
    "bg-paper dark:bg-smoke border-grate dark:border-white/10 text-char/60 dark:text-ash/40 hover:border-theme-600 hover:text-theme-600 dark:hover:text-theme-500 disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="pt-5">
      {/* Count line */}
      <p className="font-oswald text-[10px] uppercase tracking-widest text-char/40 dark:text-ash/30 mb-3">
        Showing {rangeStart}–{rangeEnd} of {total_count} reviews
      </p>

      {/* Mobile: Prev / Page X of Y / Next */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${btnIdle} px-4`}
        >
          ← Prev
        </button>
        <span className="font-oswald text-xs text-char/50 dark:text-ash/40 uppercase tracking-wide">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${btnIdle} px-4`}
        >
          Next →
        </button>
      </div>

      {/* Desktop: full page row */}
      <div className="hidden sm:flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${btnIdle} w-9`}
          aria-label="Previous page"
        >
          ←
        </button>

        {/* First page + ellipsis */}
        {getPageNumbers()[0] > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className={`${btnBase} ${btnIdle} w-9`}>
              1
            </button>
            {getPageNumbers()[0] > 2 && (
              <span className="font-oswald text-xs text-char/30 dark:text-ash/20 px-1">…</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`${btnBase} w-9 ${currentPage === page ? btnActive : btnIdle}`}
          >
            {page}
          </button>
        ))}

        {/* Last page + ellipsis */}
        {getPageNumbers().at(-1) < totalPages && (
          <>
            {getPageNumbers().at(-1) < totalPages - 1 && (
              <span className="font-oswald text-xs text-char/30 dark:text-ash/20 px-1">…</span>
            )}
            <button onClick={() => handlePageChange(totalPages)} className={`${btnBase} ${btnIdle} w-9`}>
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${btnIdle} w-9`}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
