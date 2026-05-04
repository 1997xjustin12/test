"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { formatProduct } from "@/app/lib/helpers";

const ProductGrid = dynamic(
  () => import("@/app/components/new-design/sections/sp/ProductGrid"),
);

function RecentViews({ product_id }) {
  console.log("PRODUCT_ID", product_id);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const getProducts = async (recents) => {
      const raw = await fetch(
        `/api/es/products-by-ids?${recents
          .map((item) => `product_ids=${item}`)
          .join("&")}`,
      );

      const response = await raw.json();

      if (response?.data) {
        const render_products = (response?.data || [])
          .map((i) => formatProduct(i, "card"))
          .slice(0, 4);
        setProducts(
          render_products.sort((a, b) => {
            return (
              recents.indexOf(a.product_id) - recents.indexOf(b.product_id)
            );
          }),
        );
      }
    };

    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      const recent_products = (await module.getItem("recentProducts")) || [];
      module.setItem("recentProducts", [
        ...new Set([product_id, ...recent_products]),
      ]);
      getProducts(recent_products.filter((i) => product_id !== i));
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Array.isArray(products) || products.length === 0) return null;

  return <ProductGrid title="Recently Viewed" items={products} />;
}

export default RecentViews;
