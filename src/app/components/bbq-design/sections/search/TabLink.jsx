"use client";
import React from "react";
import Link from "next/link";
function TabLink({ active="product", tab, children }) {
    return (
    <Link
      prefetch={false}
      href={`#`}
      className={`px-6 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${active === tab ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"}`}
    >
      {children}
    </Link>
  );
}

export default TabLink;
