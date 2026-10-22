"use client";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewCompareToggle from "@/app/components/new-design/ui/CompareToggle";

/**
 * The Compare checkbox in this brand's design. Cards import this, never a
 * brand's file, so every card shows the right brand's toggle. See
 * docs/product-compare.md.
 *
 * BBQ and OKO get theirs in phase 3; until then they show nothing.
 */
export default function CompareToggle(props) {
  if (ISOKO || ISBBQ) return null;
  return <NewCompareToggle {...props} />;
}
