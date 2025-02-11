"use client";
import dynamic from "next/dynamic";
import Carousel from "@/app/components/atom/Carousel";
// const Carousel = dynamic(() => import("@/app/components/atom/Carousel"), {
//   ssr: false,
// });
import Image from "next/image";
import Link from "next/link";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const items = [
  {
    label: "Fireplaces",
    img: "/images/home/categories/Fireplace.webp",
    url: `${BASE_URL}/fireplaces`,
  },
  {
    label: "Fire Pits",
    img: "/images/home/categories/firepits.webp",
    url: `${BASE_URL}/fire-pits`,
  },
  {
    label: "BBQ Grills",
    img: "/images/home/categories/bbq_grills.webp",
    url: `${BASE_URL}/bbq-grills-and-smokers`,
  },
  {
    label: "Outdoor Kitchen & Islands",
    img: "/images/home/categories/outdoor_kitchen.webp",
    url: `${BASE_URL}/outdoor-kitchen`,
  },
  {
    label: "Chimney",
    img: "/images/home/categories/chimney.webp",
    url: `${BASE_URL}/`,
  },
  {
    label: "Gas Logs",
    img: "/images/home/categories/gas_logs.webp",
    url: `${BASE_URL}/gas-logs`,
  },
  {
    label: "Clearance",
    img: "/images/home/categories/clearance.webp",
    url: `${BASE_URL}/sale-open-box-clearance-sale`,
  },
];

const items_per_break_point = [
  { minWidth: 0, value: 1 },
  { minWidth: 640, value: 2 },
  { minWidth: 768, value: 4 },
  { minWidth: 1024, value: 6 },
  { minWidth: 1280, value: 7 },
];

export default function HomePageFeatureCategories() {
  return (
    <div className="container mx-auto overflow-hidden min-h-[220px]">
      <Carousel breakpoints={items_per_break_point}>
        {items.map((v, idx) => (
          <Link
            href={v.url}
            key={`feature-category-item-${idx}`}
            className={`min-w-[140px] w-[140px] flex flex-col gap-[8px] group relative`}>
            <div
              className={`relative w-full h-[130px] flex items-center justify-center group-hover:border group-hover:bg-stone-100 rounded-md overflow-hidden transition-all duration-500`}>
              <Image
                src={v.img}
                alt={`${v.label} Image`}
                className="w-full h-full object-contain"
                width={500}
                height={500}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
              />
            </div>
            <div
              className={`flex items-center justify-center w-full h-[60px] overflow-hidden`}>
              <div className="break-words text-center">{v.label}</div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
}
