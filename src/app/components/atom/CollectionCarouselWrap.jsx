import { BASE_URL } from "@/app/lib/helpers";
import CollectionCarousel from "@/app/components/atom/CollectionCarousel";
import ProductCard from "@/app/components/atom/ProductCard";
import React from "react";

export async function getCollectionProducts(id) {
  const res = await fetch(
    `${BASE_URL}/api/collections/collection-products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch collection products");
  }

  return res.json();
}
async function CollectionCarouselWrap({ data }) {
  const collection = await getCollectionProducts(data?.id);

  const items_per_break_point = [
    { minWidth: 0, value: 1 },
    { minWidth: 640, value: 2 },
    { minWidth: 768, value: 3 },
    { minWidth: 1280, value: 4 },
    { minWidth: 1550, value: 5 },
  ];

  return (
    <div>
      <h4 className="font-bold text-2xl mb-3">{data?.mb_label}</h4>
      <CollectionCarousel breakpoints={items_per_break_point}>
        {collection &&
          Array.isArray(collection) &&
          collection.map((product) => (
            <div key={`collection-${data?.mb_uid}-list-item-product-${product.product_id}`}>
              <ProductCard hit={product} />
            </div>
          ))}
      </CollectionCarousel>
    </div>
  );
}

export default CollectionCarouselWrap;
