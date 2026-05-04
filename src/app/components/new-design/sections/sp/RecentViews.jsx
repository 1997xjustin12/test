"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { formatProduct } from "@/app/lib/helpers";

const ProductGrid = dynamic(
  () => import("@/app/components/new-design/sections/sp/ProductGrid"),
);

function RecentViews() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    const getProducts = async (recents) => {
      const raw = await fetch(
        `/api/es/products-by-ids?${recents
          .map((item) => `product_ids=${item}`)
          .join("&")}`,
      );

      const response = await raw.json();

      console.log("response", response)
      if (response?.data) {
        setProducts((response?.data || []).map(i=> formatProduct(i, "card")));
      }
    };

    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      const recent_products = (await module.getItem("recentProducts")) || [];
      getProducts(recent_products);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Array.isArray(products) || products.length === 0)
    return null;

  return <ProductGrid title="Recently Viewed" items={products} />;
}

export default RecentViews;
