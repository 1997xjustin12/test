"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { compareUrl } from "@/app/lib/compare";
import { useCompareProducts } from "@/app/context/compare_product";
import trackCompare from "@/app/components/compare/trackCompare";

/**
 * Everything the /compare page does in the browser, without how it looks.
 * Each brand's page/Compare.jsx and sections/compare/* draw it. See
 * docs/product-compare.md.
 *
 * @param handles  the handles the page is showing, in order
 * @param groups   buildCompareRows() output, to filter by "only differences"
 */
export default function useComparePage({ handles = [], groups = [] } = {}) {
  const router = useRouter();
  const compare = useCompareProducts();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(true);
  const [headerStuck, setHeaderStuck] = useState(false);
  const headerSentinel = useRef(null);

  // One compare_view per set of products shown (not per re-render).
  const viewKey = handles.join(",");
  useEffect(() => {
    if (viewKey) trackCompare("compare_view", { item_ids: viewKey, item_count: viewKey.split(",").length });
  }, [viewKey]);

  // The rows to draw. With "only differences" on, rows where every product
  // agrees are hidden, and so is any group left empty.
  const visibleGroups = useMemo(() => {
    if (!onlyDifferences) return groups;
    return groups
      .map((group) => ({ ...group, rows: group.rows.filter((row) => !row.same) }))
      .filter((group) => group.rows.length > 0);
  }, [groups, onlyDifferences]);

  // The page is built from its address, so removing a product means a new
  // address. It also leaves the compare list, so the tray agrees with the page.
  const removeProduct = useCallback(
    (handle) => {
      compare?.remove(handle);
      const next = compareUrl(handles.filter((h) => h !== handle));
      router.replace(next || "/compare", { scroll: false });
    },
    [compare, handles, router],
  );

  // The shrunk header appears once the full product row scrolls out of view.
  // Put `headerSentinel` on an element just below the full header.
  useEffect(() => {
    const node = headerSentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    // Stuck only once it has gone off the top — not while still below the fold.
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return {
    visibleGroups,
    onlyDifferences,
    setOnlyDifferences,
    highlightDifferences,
    setHighlightDifferences,
    headerStuck,
    headerSentinel,
    removeProduct,
    canAddMore: handles.length < (compare?.limit ?? 4),
    differenceCount: groups.reduce((total, group) => total + group.rows.filter((row) => !row.same).length, 0),
  };
}
