"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
// import Carousel from "@/app/components/atom/Carousel";
const Carousel = dynamic(() => import("@/app/components/atom/Carousel"), {
  ssr: false,
});
import SectionHeader from "../atom/SectionHeader";
import { Rating } from "@smastrom/react-rating";
import ItemPrice from "@/app/components/atom/openBoxItemPrice";
import Image from "next/image";
import { BASE_URL, createSlug } from "@/app/lib/helpers";
import { useQuickView } from "@/app/context/quickview";
import ProductCard from "@/app/components/atom/ProductCard";
// const products = [
//   {
//     img: "/images/home/open-box/open-boxes-image-1.webp",
//     name: "Open Box Blaze Premium - LTE 32-Inch 4-Burner Built-In Grill",
//     brand: "Blaze Outdoor Products",
//     sale_price: 1849,
//     original_price: 2874.99,
//     free_shipping: true,
//     ratings: 5,
//     reviews: 2,
//   },
//   {
//     img: "/images/home/open-box/open-boxes-image-2.webp",
//     name: "Blaze Infraorange Sear Burner BLZ-IR (New)",
//     brand: "Blaze Outdoor Products",
//     sale_price: 99.99,
//     original_price: 109.99,
//     free_shipping: true,
//     ratings: 0,
//     reviews: 0,
//   },
//   {
//     img: "/images/home/open-box/open-boxes-image-3.webp",
//     name: "Blaze Double Side Burner Model BLZ-SB2LTE-OB (Open Box)",
//     brand: "Blaze Outdoor Products",
//     sale_price: 699.99,
//     original_price: 999.99,
//     free_shipping: true,
//     ratings: 0,
//     reviews: 0,
//   },
//   {
//     img: "/images/home/open-box/open-boxes-image-4.webp",
//     name: "Frame Only BLZ-AD32 Open Box (New)",
//     brand: "Blaze Outdoor Products",
//     sale_price: 69.99,
//     original_price: 69.99,
//     free_shipping: false,
//     ratings: 0,
//     reviews: 0,
//   },
//   {
//     img: "/images/home/open-box/open-boxes-image-5.webp",
//     name: "Blaze IR Burner BLZ-IR Open Box",
//     brand: "Blaze Outdoor Products",
//     sale_price: 79.99,
//     original_price: 109.99,
//     free_shipping: true,
//     ratings: 0,
//     reviews: 0,
//   },
// ];
const carousel_breakpoints = [
  { minWidth: 0, value: 1 },
  { minWidth: 768, value: 2 },
  { minWidth: 1024, value: 3 },
  { minWidth: 1280, value: 4 },
  { minWidth: 1536, value: 5 },
];

export default function HomePageShopOpenBox() {
  const [products, setProducts] = useState(null);
  const { viewItem } = useQuickView();

  const shopAllOpenBoxUrl = `${BASE_URL}/shop-all-open-box`;
  const productCategory = "outdoor-grill";

  const handleQuickViewClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    viewItem(item, productCategory);
  };

  // fetch data
  useEffect(() => {
    // const rawQuery = {
    //   size: 10,
    //   query: {
    //     match_phrase: {
    //       tags: "Blaze Open Box",
    //     },
    //   },
    // };

    const rawQuery = {
      size: 10,
      query: {
        bool: {
          must: {
            match_phrase: {
              tags: "Blaze Open Box",
            },
          },
          must_not: {
            term: {
              product_id: 1099,
            },
          },
        },
      },
    };

    fetch("/api/es/shopify/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawQuery),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("response data:", data);

        const products = data?.hits?.hits;

        setProducts(products);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <SectionHeader text="Shop All Open Box" />
        <div className="text-xl md:text-4xl underline italic font-semibold font-bell"></div>
        <div className="flex flex-col md:flex-row gap-[10px] mt-5 min-h-[511px]">
          <Carousel breakpoints={carousel_breakpoints}>
            {products &&
              products.map(({ _source }, idx) => (
                <div key={`open-box-product-${idx}`} className="w-full">
                  <ProductCard hit={_source} />
                </div>
              ))}
          </Carousel>
        </div>
        <div className="mt-5 text-center">
          <Link
            prefetch={false}
            href={shopAllOpenBoxUrl}
            className="text-sm md:text-base py-[4px] px-[10px] md:py-[7px] md:px-[25px] gap-[5px] md:gap-[10px] rounded-md bg-theme-600 hover:bg-theme-500 text-white font-bold cursor-pointer"
          >
            Shop All Open Box
          </Link>
        </div>
      </div>
    </div>
  );
}
