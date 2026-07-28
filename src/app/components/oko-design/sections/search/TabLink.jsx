"use client";
import React from "react";
import Link from "next/link";
// §8.3 nav treatment — uppercase 12.5px/600, 2px transparent bottom border
// that becomes barn on active/hover. Barn is action-only.
function TabLink({ active = "product", tab, children }) {
  return (
    <Link
      prefetch={false}
      href={`#`}
      className={`px-4 py-3.5 whitespace-nowrap border-b-2 transition-colors font-inter font-semibold text-[12.5px] uppercase tracking-[0.05em] ${
        active === tab
          ? "border-oko-barn dark:border-oko-barn-light text-oko-barn dark:text-oko-barn-light"
          : "border-transparent text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light hover:border-oko-barn dark:hover:border-oko-barn-light"
      }`}
    >
      {children}
    </Link>
  );
}

export default TabLink;
