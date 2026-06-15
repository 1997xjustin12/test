"use client";
import { useState, Children } from "react";

const MOBILE_INITIAL = 4;

export default function MobileCategoryGrid({ children, gridClassName }) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  const hiddenCount = items.length - MOBILE_INITIAL;

  return (
    <>
      <div className={gridClassName}>
        {items.map((item, i) => (
          <div
            key={i}
            className={i >= MOBILE_INITIAL && !expanded ? "hidden sm:block" : "block w-full"}
          >
            {item}
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="sm:hidden mt-4 w-full py-2.5 text-sm font-semibold border border-grate dark:border-white/20 rounded hover:opacity-75 transition-opacity text-char dark:text-ash"
        >
          {expanded ? "See less" : `See ${hiddenCount} more`}
        </button>
      )}
    </>
  );
}
