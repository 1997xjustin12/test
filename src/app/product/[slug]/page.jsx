"use client";
import ProductSection from "@/app/components/pages/product/section/product";
import React, { useState, useEffect } from "react";
import useFetchProducts from "@/app/hooks/useFetchProducts";
import { notFound } from "next/navigation";
export default function Product({ params }) {
  const [product, setProduct] = useState(null);
  const { slug } = React.use(params);
  const { products, loading, error } = useFetchProducts({
    keyword: slug,
    include: "images",
  });

  useEffect(() => {
    if (error) {
      notFound();
    }

    if (!loading && products.length === 0) {
      notFound();
    } else {
      setProduct(products[0]);
    }
  }, [loading, products, error]);

  return (
    <div>
      <ProductSection product={product} loading={loading} />
    </div>
  );
}
