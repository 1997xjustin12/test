"use client";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewCompareToggle from "@/app/components/new-design/ui/CompareToggle";
import BBQCompareToggle from "@/app/components/bbq-design/ui/CompareToggle";
import OKOCompareToggle from "@/app/components/oko-design/ui/CompareToggle";

/**
 * The Compare checkbox in this brand's design. Cards import this, never a
 * brand's file, so every card shows the right brand's toggle. See
 * docs/product-compare.md.
 */
export default function CompareToggle(props) {
  if (ISOKO) return <OKOCompareToggle {...props} />;
  if (ISBBQ) return <BBQCompareToggle {...props} />;
  return <NewCompareToggle {...props} />;
}
