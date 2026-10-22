"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { COMPARE_LIMIT, compareSnapshot, compareUrl } from "@/app/lib/compare";

/**
 * The compare list: the products a shopper has ticked "Compare" on, shared by
 * every product card, the tray and the /compare link. See
 * docs/product-compare.md.
 *
 * Kept in localStorage, so it survives page changes and reloads, and synced
 * across tabs over a BroadcastChannel, as the cart is. Each brand is its own
 * domain, so each keeps its own list. Storage that is blocked or full (private
 * windows, cleared site data) falls back to memory for the visit.
 *
 * Replaces an earlier version that held the list in memory only and drew a
 * thumbnail widget linking to /compare/<sku>__<sku>, a page that never
 * existed. Nothing called it.
 *
 * Products are identified by handle, because /compare looks them up by handle.
 * Only a small snapshot is kept (compareSnapshot); the page fetches the rest.
 */

const STORAGE_KEY = "compare_products";
const CHANNEL = "compare_channel";

const CompareProducts = createContext(null);

function readStored() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item?.handle).slice(0, COMPARE_LIMIT) : [];
  } catch {
    return [];
  }
}

function writeStored(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage blocked or full: the list still works for this visit.
  }
}

const handleOf = (product) => (product?.handle ? String(product.handle) : null);

export function CompareProductsProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const channel = useRef(null);

  // Load after mount: localStorage does not exist during server rendering, and
  // reading it in the initial state would make the first client render differ
  // from the server's.
  useEffect(() => {
    setItems(readStored());
    setReady(true);

    if (typeof BroadcastChannel === "undefined") return;
    channel.current = new BroadcastChannel(CHANNEL);
    channel.current.onmessage = () => setItems(readStored());
    return () => channel.current?.close();
  }, []);

  // One place writes and tells the other tabs, for every kind of change.
  const commit = useCallback((next) => {
    writeStored(next);
    channel.current?.postMessage("changed");
    return next;
  }, []);

  const isInCompare = useCallback(
    (product) => {
      const handle = typeof product === "string" ? product : handleOf(product);
      return !!handle && items.some((item) => item.handle === handle);
    },
    [items],
  );

  /** Adds or removes. Returns { ok, reason } — reason "full" when at the limit. */
  const toggle = useCallback(
    (product) => {
      const handle = handleOf(product);
      if (!handle) return { ok: false, reason: "invalid" };
      if (items.some((item) => item.handle === handle)) {
        setItems(commit(items.filter((item) => item.handle !== handle)));
        return { ok: true, added: false };
      }
      if (items.length >= COMPARE_LIMIT) return { ok: false, reason: "full" };
      const snapshot = compareSnapshot(product);
      if (!snapshot) return { ok: false, reason: "invalid" };
      setItems(commit([...items, snapshot]));
      return { ok: true, added: true };
    },
    [items, commit],
  );

  const remove = useCallback(
    (handle) => setItems(commit(items.filter((item) => item.handle !== handle))),
    [items, commit],
  );

  const clear = useCallback(() => setItems(commit([])), [commit]);

  const value = useMemo(
    () => ({
      items,
      ready,
      limit: COMPARE_LIMIT,
      count: items.length,
      isFull: items.length >= COMPARE_LIMIT,
      canCompare: items.length >= 2,
      compareUrl: compareUrl(items.map((item) => item.handle)),
      isInCompare,
      toggle,
      remove,
      clear,
    }),
    [items, ready, isInCompare, toggle, remove, clear],
  );

  // The tray is drawn by each brand (components/compare/CompareTray.jsx, phase
  // 2 of docs/product-compare.md). Until then the list works with no tray.
  return <CompareProducts.Provider value={value}>{children}</CompareProducts.Provider>;
}

/** The compare list. Null outside the provider (e.g. the checkout layout). */
export function useCompareProducts() {
  return useContext(CompareProducts);
}
