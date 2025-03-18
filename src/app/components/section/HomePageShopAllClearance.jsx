"use client";
import Image from "next/image";
import Link from "next/link";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function HomePageShopAllClearance() {
  const contents = [
    {
      image: {
        src: "/images/home/elevate-your-fireplace.webp",
        alt: "Modern-Fireplace-Designs-Img",
      },
      title: "Modern Fireplace Designs",
      content:
        "A modern fireplace can elevate your home, providing both warmth and a stylish focal point for family gatherings or quiet evenings. We offer a wide selection of fireplaces including wood-burning, gas, and electric.",
      button: {
        label: "Shop All Fireplaces",
        url: `${BASE_URL}/fireplaces`,
      },
    },
    {
      image: {
        src: "/images/home/clearance.webp",
        alt: "Outdoor-Kitchen-Deals-Img",
      },
      title: "Outdoor Kitchen Deals",
      content:
        "Create your dream backyard kitchen with top-of-the-line grills, BBQ islands, and all the essential accessories, all while taking advantage of great deals and savings.",
      button: {
        label: "Shop All Outdoor Kitchen Deals",
        url: `${BASE_URL}/outdoor-kitchen`,
      },
    },
  ];
  return (
    <div className="container mx-auto px-[10px] lg:px-[20px] mt-5">
      {/* font-bell */}
      <div className="w-full flex flex-col md:flex-row gap-[50px]">
        {contents.map((item, index) => (
          <div
            key={`shop-all-content-${index}`}
            className="w-full flex flex-col gap-[10px] min-h-[420px]">
            <div className="w-full aspect-2 min-h-[200px] flex items-center justify-center overflow-hidden rounded-[25px] relative">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                className="w-full h-full min-h-[200px] object-cover"
                fill
                sizes="100vw"
              />
            </div>
            <div className="text-center text-xl md:text-3xl font-semibold">
              {item.title}
            </div>
            <div className="text-center px-[10px] md:text-lg">
              {item.content}
            </div>
            <div className="text-center">
              <Link href={item.button.url} prefetch={false}>
                <button className="font-medium border px-[20px] py-[8px] rounded-xl bg-theme-600 text-white shadow-md text-lg curor-pointer hover:bg-theme-500">
                  {item.button.label}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
