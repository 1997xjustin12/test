'use client'
import React from "react";
import dynamic from "next/dynamic";
import ProductCard from "@/app/components/brand/ProductCard";
const Carousel = dynamic(() => import("@/app/components/atom/Carousel"), {
  ssr: false,
});

const products = [
  {
    id: 1,
    img: "",
    name: "Grandeur Essential 32-inch Built-In 4 Burner Stainless Steel Bbq Grill with Interior Lights - 32BBQEssential",
    price: 2638.8,
    sale_price: 2199.0,
    url: "#",
  },
  {
    id: 2,
    img: "",
    name: "Grandeur Essential 32-inch Built-In 4 Burner Stainless Steel Bbq Grill with Interior Lights - 32BBQEssential",
    price: 2638.8,
    sale_price: 2638.8,
    url: "#",
  },
  {
    id: 3,
    img: "",
    name: "Grandeur Essential 32-inch Built-In 4 Burner Stainless Steel Bbq Grill with Interior Lights - 32BBQEssential",
    price: 2638.8,
    sale_price: 2199.0,
    url: "#",
  },
  {
    id: 4,
    img: "",
    name: "Grandeur Essential 32-inch Built-In 4 Burner Stainless Steel Bbq Grill with Interior Lights - 32BBQEssential",
    price: 2638.8,
    sale_price: 2199.0,
    url: "#",
  },
];
const items_per_break_point = [
  { minWidth: 0, value: 1 },
  { minWidth: 640, value: 2 },
  { minWidth: 768, value: 2 },
  { minWidth: 1024, value: 3 },
  { minWidth: 1280, value: 4 },
];


function TopSelling() {
  return (
    <section>
      <div className="container mx-auto py-[20px]">
        <div className="text-center font-bold text-2xl">Top Selling</div>
        <div className="w-full mt-5">
          <Carousel breakpoints={items_per_break_point}>
            {products &&
              Array.isArray(products) &&
              products.map((product) => (
                <div
                  key={`list-item-product-${product.id}`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default TopSelling;
