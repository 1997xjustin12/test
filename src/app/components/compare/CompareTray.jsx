"use client";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewCompareTray from "@/app/components/new-design/ui/CompareTray";
import BBQCompareTray from "@/app/components/bbq-design/ui/CompareTray";
import OKOCompareTray from "@/app/components/oko-design/ui/CompareTray";

/**
 * The compare tray in this brand's design, drawn once by the (market) layout.
 * See docs/product-compare.md.
 */
export default function CompareTray() {
  if (ISOKO) return <OKOCompareTray />;
  if (ISBBQ) return <BBQCompareTray />;
  return <NewCompareTray />;
}
