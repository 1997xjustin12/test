"use client";
import React, { useState, useEffect, useMemo } from "react";
import { notFound } from "next/navigation";
import useESFetchProductShopify from "@/app/hooks/useESFetchProductShopify";
import {
  calculateRatingSummary,
  UIV2
} from "@/app/lib/helpers";
import {
  getReviewsByProductId,
} from "@/app/lib/api";


import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder";
import OldSingleProductPage from "@/app/components/pages/SingleProductPage"
import NewSingleProductPage from "@/app/components/new-design/page/SingleProductPage"


export default function ProductClient({ params }) {
  const { slug, product_path } = React.use(params);
  const [product, setProduct] = useState(null);
  const [forage, setForage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviews, setReviews] = useState(null);
  const {
    product: fetchedProduct,
    loading,
    error,
  } = useESFetchProductShopify({
    handle: product_path,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      setForage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (error) {
      notFound();
    }

    if (!loading && fetchedProduct === null) {
      notFound();
    }

    if (fetchedProduct && fetchedProduct.length > 0) {
      setProduct(fetchedProduct[0]);
      console.log("[product]", fetchedProduct[0]);

      if (fetchedProduct[0]?.published) {
        const new_recents = [
          ...new Set([fetchedProduct[0]?.product_id, ...recentlyViewed]),
        ];
        forage.setItem("recentProducts", new_recents.slice(0, 5));
      }
    }
  }, [loading, fetchedProduct, error]);

  useEffect(() => {
    if (!product || !product?.product_id) return;
    const product_id = product.product_id;
    // load reviews
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByProductId(product_id);
        if (!response?.ok) {
          setReviews(null);
          return;
        }
        const data = await response.json();
        const reviewStats = calculateRatingSummary(data);
        const reviews = { ...data, ...reviewStats };
        console.log(reviews);
        setReviews(reviews);
      } catch (err) {
        console.warn("[fetchReviews]", err);
      }
    };
    fetchReviews();
  }, [product]);

  if (!product && loading) {
    return <ProductPlaceholder />;
  }

  if(UIV2) return (<NewSingleProductPage  product={product} slug={slug} loading={loading} brandName={product?.brand} reviews={reviews} reventlyViewed={recentlyViewed}/>)

  return (
    <OldSingleProductPage product={product} slug={slug} loading={loading} reviews={reviews} reventlyViewed={recentlyViewed}/>
  );
}