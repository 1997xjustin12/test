"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COMPARE_PARAM, compareUrl } from "@/app/lib/compare";
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

  // Sharing. The link is this comparison's own address, rebuilt from the
  // products actually shown (a handle that failed to load is not passed on),
  // on whichever brand's domain the shopper is on. Touch devices get the
  // native share sheet; elsewhere the link is copied — a desktop share dialog
  // is more in the way than a copy. shareState: idle | copied | shared | error.
  const [shareState, setShareState] = useState("idle");
  const shareTimer = useRef(null);
  useEffect(() => () => clearTimeout(shareTimer.current), []);

  const settle = useCallback((state) => {
    setShareState(state);
    clearTimeout(shareTimer.current);
    shareTimer.current = setTimeout(() => setShareState("idle"), 2500);
  }, []);

  const share = useCallback(async () => {
    if (!handles.length || typeof window === "undefined") return;
    const url = `${window.location.origin}/compare?${COMPARE_PARAM}=${handles.join(",")}`;

    const touch = window.matchMedia?.("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: document.title, text: `Comparing ${handles.length} products`, url });
        trackCompare("compare_share", { method: "share_sheet", item_count: handles.length });
        settle("shared");
      } catch (error) {
        // Closing the share sheet is not a failure.
        if (error?.name !== "AbortError") settle("error");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // No clipboard API (older browsers, non-secure origins): the old way.
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      if (!copied) return settle("error");
    }
    trackCompare("compare_share", { method: "copy_link", item_count: handles.length });
    settle("copied");
  }, [handles, settle]);

  const shareLabel = {
    idle: "Share",
    copied: "Link copied",
    shared: "Shared",
    error: "Copy the address bar instead",
  }[shareState];

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
    share,
    shareState,
    shareLabel,
    canAddMore: handles.length < (compare?.limit ?? 4),
    differenceCount: groups.reduce((total, group) => total + group.rows.filter((row) => !row.same).length, 0),
  };
}
