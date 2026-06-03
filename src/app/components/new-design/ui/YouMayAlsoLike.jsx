"use client";
import { useState, useEffect } from "react";
import { exclude_brands, exclude_collections, formatProduct } from "@/app/lib/helpers";
import ProductGrid from "@/app/components/new-design/sections/sp/ProductGrid";

export default function YouMayAlsoLike({ displayItems = 4 }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const query = {
          size: displayItems,
          query: {
            function_score: {
              query: {
                bool: {
                  must: [{ match_all: {} }, { term: { published: true } }],
                  must_not: [
                    { terms: { "brand.keyword": exclude_brands } },
                    { terms: { "collections.name.keyword": exclude_collections } },
                  ],
                },
              },
              random_score: { seed: Date.now(), field: "title.keyword" },
            },
          },
        };
        const res = await fetch("/api/es/shopify/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });
        if (!res.ok) return;
        const data = await res.json();
        setProducts(
          data?.hits?.hits?.map(({ _source }) => ({ ...formatProduct(_source, "card"), quantity: 1 }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchRandomProducts();
  }, []);

  return <ProductGrid title="You May Also Like" items={products} />;
}
