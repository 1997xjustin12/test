"use client";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * A GA4 event for the comparison feature: compare_add, compare_remove,
 * compare_view. Sent only where Google Analytics is on the page (the market
 * layout loads it when NEXT_PUBLIC_GA_ID is set); otherwise nothing happens.
 * Browser-only, so kept out of lib/compare.js, which server code imports.
 */
export default function trackCompare(event, params = {}) {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;
  try {
    sendGAEvent("event", event, params);
  } catch {
    // Analytics must never break the feature.
  }
}
