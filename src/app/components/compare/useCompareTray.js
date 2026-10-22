"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCompareProducts } from "@/app/context/compare_product";

/**
 * Everything the compare tray does, without how it looks. Each brand's
 * ui/CompareTray.jsx draws it; a behaviour change belongs here, never in one
 * brand's file. See docs/product-compare.md.
 */

/** Pages where the tray stays out of the way. */
const HIDDEN_ON = ["/compare", "/cart", "/checkout"];

export default function useCompareTray() {
  const compare = useCompareProducts();
  const pathname = usePathname() || "";
  const [collapsed, setCollapsed] = useState(false);

  // Expand again whenever a product is added, so the shopper sees it land.
  const count = compare?.count ?? 0;
  useEffect(() => {
    if (count > 0) setCollapsed(false);
  }, [count]);

  const hiddenHere = HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const visible = !!compare?.ready && count > 0 && !hiddenHere;

  return {
    visible,
    collapsed,
    toggleCollapsed: () => setCollapsed((value) => !value),
    items: compare?.items ?? [],
    count,
    limit: compare?.limit ?? 0,
    // Empty slots to draw after the products, so the tray always shows the limit.
    emptySlots: Math.max(0, (compare?.limit ?? 0) - count),
    canCompare: !!compare?.canCompare,
    // "Add 1 more to compare" while only one is picked.
    needed: Math.max(0, 2 - count),
    compareUrl: compare?.compareUrl || "",
    remove: compare?.remove ?? (() => {}),
    clear: compare?.clear ?? (() => {}),
  };
}
