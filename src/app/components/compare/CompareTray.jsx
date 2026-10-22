"use client";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewCompareTray from "@/app/components/new-design/ui/CompareTray";

/**
 * The compare tray in this brand's design, drawn once by the (market) layout.
 * See docs/product-compare.md.
 *
 * BBQ and OKO get theirs in phase 3; until then they show nothing.
 */
export default function CompareTray() {
  if (ISOKO || ISBBQ) return null;
  return <NewCompareTray />;
}
