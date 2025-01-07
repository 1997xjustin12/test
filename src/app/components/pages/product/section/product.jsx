"use client";
import ProductMetaTabs from "@/app/components/product/meta/Tabs";
import MediaGallery from "@/app/components/widget/MediaGallery";
import ProductToCart from "@/app/components/widget/ProductToCart";
import { useState, useEffect } from "react";

const ProductSection = ({ product, loading }) => {
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    console.log("ProdSec", product);
    if (product) {
      if (Object.keys(product).length > 0) {
        setMediaItems(product.images);
      }
    }
  }, [product]);

  return (
    <>
      <div className="p-4">
        <div className="container mx-auto flex flex-col sm:flex-row gap-[10px] py-[60px]">
          <div className="flex-1">
            <MediaGallery mediaItems={mediaItems} loading={loading} />
          </div>
          <div className="flex-1">
            <ProductToCart product={product} loading={loading} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="container mx-auto">
          <ProductMetaTabs product={product} />
        </div>
      </div>
      {/* <div className="p-4">
      <div className="container mx-auto">
        <RelatedProducts product={product}/>
      </div>
    </div> */}
    </>
  );
};

export default ProductSection;
