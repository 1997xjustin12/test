"use client";

import { useEffect, useState } from "react";
import { stripHtmlTags } from "@/app/lib/helpers";

/**
 * A product's description as plain text, for the quick view.
 *
 * Search results (the product grids) no longer carry body_html: it was the
 * largest field in every listing page and every page/filter request, and the
 * quick view was its only reader. So when the product has no body_html, the
 * description is fetched when the quick view opens, from the catalog API
 * (which reads the cached product). The first, server-rendered page of a grid
 * never had it, so its quick view used to show "undefined".
 *
 * @returns {{ text: string, loading: boolean }}
 */
export default function useProductDescription(product) {
  const handle = product?.handle;
  const inline = product?.body_html;
  const [state, setState] = useState({ handle: null, text: "", loading: false });

  useEffect(() => {
    if (!handle || inline) return undefined;
    const controller = new AbortController();
    setState({ handle, text: "", loading: true });
    fetch(`/api/catalog/product/${encodeURIComponent(handle)}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setState({ handle, text: data?.product?.description || "", loading: false }))
      .catch((error) => {
        if (error?.name !== "AbortError") setState({ handle, text: "", loading: false });
      });
    return () => controller.abort();
  }, [handle, inline]);

  if (!product) return { text: "", loading: false };
  if (inline) return { text: stripHtmlTags(inline), loading: false };
  if (state.handle !== handle) return { text: "", loading: true };
  return { text: state.text, loading: state.loading };
}
