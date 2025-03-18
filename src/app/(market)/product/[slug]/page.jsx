"use client";
import ProductSection from "@/app/components/pages/product/section/product";
import React, { useState, useEffect } from "react";
// import useFetchProducts from "@/app/hooks/useFetchProducts";
import useESFetchProduct from "@/app/hooks/useESFetchProduct";
import { notFound } from "next/navigation";
import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder"
export default function Product({ params }) {
  const { slug } = React.use(params);
  // const { products, loading, error } = useFetchProducts({
  //   keyword: slug,
  //   include: "images",
  // });
  const [product, setProduct] = useState(null);
  const { product:fetchedProduct, loading, error } = useESFetchProduct({
    product_url: slug,
  });

  useEffect(() => {
    if (error) {
      notFound();
    }

    if (!loading && fetchedProduct === null) {
      notFound();
    }

    if(fetchedProduct && fetchedProduct.length > 0){
      setProduct(fetchedProduct[0])
    }
  }, [loading, fetchedProduct, error]);

  if(!product && loading){
    return <ProductPlaceholder />
  }

  return <div className="min-h-screen">
    {
      product && <ProductSection product={product} loading={loading} />
    }
  </div>;
}
