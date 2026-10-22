"use client";
import { useState } from "react";
import { useCompareProducts } from "@/app/context/compare_product";

/**
 * Everything the Compare checkbox does, without how it looks. Each brand's
 * ui/CompareToggle.jsx draws it. See docs/product-compare.md.
 *
 * @param product  a raw or formatProduct() product (needs a handle)
 */
export default function useCompareToggle(product) {
  const compare = useCompareProducts();
  // Read out by screen readers through an aria-live region in the toggle.
  const [announcement, setAnnouncement] = useState("");

  // Outside the compare provider (e.g. the checkout layout) or without a
  // handle there is nothing to compare: the toggle draws nothing.
  const available = !!compare && !!product?.handle;
  const checked = available && compare.isInCompare(product);
  const disabled = available && !checked && compare.isFull;
  const limit = compare?.limit ?? 0;

  const toggle = () => {
    if (!available) return;
    const result = compare.toggle(product);
    if (result.ok && result.added) setAnnouncement(`Added to compare (${compare.count + 1} of ${limit})`);
    else if (result.ok) setAnnouncement("Removed from compare");
    else if (result.reason === "full") setAnnouncement(`You can compare up to ${limit} products`);
  };

  return {
    available,
    checked,
    disabled,
    toggle,
    label: checked ? "Added to compare" : "Compare",
    fullMessage: `Compare up to ${limit} products. Remove one to add another.`,
    announcement,
  };
}
