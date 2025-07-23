"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import Carousel from "@/app/components/atom/Carousel";
const Carousel = dynamic(() => import("@/app/components/atom/Carousel"), {
  ssr: false,
});
import SectionHeader from "../atom/SectionHeader";
import { Rating } from "@smastrom/react-rating";
import ItemPrice from "@/app/components/atom/openBoxItemPrice";
import Image from "next/image";
import { createSlug } from "@/app/lib/helpers";
import { useQuickView } from "@/app/context/quickview";
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
  const {viewItem} = useQuickView();

  const productCategory = "outdoor-grill";
  
  const handleQuickViewClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    viewItem(item,productCategory);
  };

  // fetch data
  useEffect(() => {
    const rawQuery = {
      size: 5,
      query: {
        match_phrase: {
          tags: "Blaze Open Box",
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
        <SectionHeader text="Shop Open Box Blaze Products" />
        <div className="text-xl md:text-4xl underline italic font-semibold font-bell"></div>
        <div className="flex flex-col md:flex-row gap-[10px] mt-5 min-h-[511px]">
          <Carousel breakpoints={carousel_breakpoints}>
            {products &&
              products.map(({_source}, idx) => (
                <div
                  key={`open-box-product-${idx}`}
                  className="aspect-1 border w-full bg-[#f8f8f8]"
                >
                  <div className="relative">
                    <div className="text-white bg-theme-600 absolute left-0 rounded-sm px-[15px] py-[5px] z-[1] font-medium">
                      {"Open Box"}
                    </div>
                    <div
                      className={`${
                        _source?.variants?.[0].price <
                        (_source?.variants?.[0]?.compare_at_price ||
                          _source?.variants?.[0]?.price)
                          ? "visible"
                          : "invisible"
                      } text-white bg-theme-600 absolute left-[10px] bottom-[3px] rounded-sm px-[15px] py-[5px] z-[1] font-medium`}
                    >
                      {"SALE"}
                    </div>
                    <div className="relative aspect-1 flex justify-center">
                      {
                        // <img src={i.img} alt={i.name} />
                        _source?.images && _source?.images?.length > 0 && 
                        <Image
                          src={_source.images.find((img) => img.position === 1)?.src}
                          alt={`${createSlug(_source?.title)}-image`}
                          className="w-full h-full object-contain"
                          width={500}
                          height={500}
                          // loading="eager"
                          priority={false}
                        />
                      }
                    </div>
                  </div>
                  <div className="flex items-center justify-center py-[10px]">
                    <button
                      onClick={(e) => handleQuickViewClick(e, _source)}
                      className="rounded-full border-[2px] border-theme-500 px-[15px] py-[3px] text-theme-700 font-bold cursor-pointer"
                    >
                      Quickview
                    </button>
                  </div>
                  <div className="flex flex-col gap-[5px] p-[10px]">
                    <div className="h-[45px]">
                      <div className="line-clamp-2 font-bold">{_source?.title}</div>
                    </div>
                    <div
                      className={`text-theme-700 text-sm font-bold ${
                        _source?.free_shipping ? "visible" : "invisible"
                      }`}
                    >
                      Free Shipping
                    </div>
                    <div className="text-stone-700 underline text-sm">
                      {_source?.brand}
                    </div>
                    <div className="text-sm">
                      <ItemPrice
                        sale_price={_source?.variants?.[0]?.price}
                        original_price={
                          _source?.variants?.[0]?.compare_at_price ||
                          _source?.variants?.[0]?.price
                        }
                      />
                    </div>
                    <div
                      className={`flex items-center gap-[3px] ${
                        (parseInt(
                          String(_source?.ratings?.rating_count || "").replace(
                            /^'+|'+$/g,
                            ""
                          )
                        ) || 0) !== 0
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      <Rating
                        readOnly
                        value={(parseInt(
                          String(_source?.ratings?.rating_count || "").replace(
                            /^'+|'+$/g,
                            ""
                          )
                        ) || 0)}
                        fractions={2}
                        style={{ maxWidth: 80 }}
                      ></Rating>
                      {/* <div className={``}>{i.reviews} Reviews</div> */}
                    </div>
                  </div>
                </div>
              ))}
          </Carousel>
        </div>
        <div className="mt-5 text-center">
          <button className="text-sm md:text-base py-[4px] px-[10px] md:py-[7px] md:px-[25px] gap-[5px] md:gap-[10px] rounded-md bg-theme-600 hover:bg-theme-500 text-white font-bold cursor-pointer">
            Shop All Open Box Blaze Products
          </button>
        </div>
      </div>
    </div>
  );
}
