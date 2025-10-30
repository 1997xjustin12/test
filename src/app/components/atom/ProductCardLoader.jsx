"use client";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Legacy wrapper - forwards to the new ProductCardSkeleton
const ProductCardLoader = () => {
  return <ProductCardSkeleton />;
};

export default ProductCardLoader;
