"use client";
import Image from "next/image";
import Link from "next/link";
export default function HomePageShopAllClearance() {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
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
    <div className="w-full mt-5">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <div className="w-full flex flex-col md:flex-row gap-[50px]">
          {contents.map((item, index) => (
            <div
              key={`shop-all-content-${index}`}
              className="w-full flex flex-col gap-[10px]">
              <div className="w-full aspect-2">
                <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-[25px] relative">
                  {
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      className="w-full h-full object-cover"
                      width={640}
                      height={0}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"

                      // loading="eager"
                      // priority={false}
                    />
                  }
                </div>
              </div>
              <div className="text-center text-xl md:text-3xl font-semibold font-bell">
                {item.title}
              </div>
              <div className="text-center font-bell px-[10px] md:text-lg">
                {item.content}
              </div>
              <div className="text-center">
                <Link href={item.button.url}>
                  <button className="border px-[20px] py-[8px] rounded-xl font-bell bg-orange-400 text-white shadow-md text-lg curor-pointer hover:bg-orange-500">
                    {item.button.label}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
