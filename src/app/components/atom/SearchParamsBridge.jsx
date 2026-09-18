"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reads the URL query string and reports it upward. Nothing else.
 *
 * useSearchParams() opts every ancestor into a Suspense boundary. The search
 * box needs the current query (to preserve filters when submitting on
 * /search), and it sits in the navbar — so the whole header had to live inside
 * `<Suspense fallback={null}>` in the market layout. React streams suspended
 * content in and moves it into place on hydration, so the header arrived late
 * and pushed the page down: one 0.176 layout shift, the site's entire CLS on
 * mobile, and worse than Google's 0.1 threshold on its own.
 *
 * Isolating the read here keeps the boundary a leaf: the header renders as
 * ordinary server HTML and nothing moves. Same pattern as SearchParamsBridge
 * in context/search.js, which fixed the same problem for the whole storefront.
 *
 * `onChange` should be referentially stable — a useState setter is.
 */
export default function SearchParamsBridge({ onChange }) {
  const searchParams = useSearchParams();
  const value = searchParams.toString();

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return null;
}
