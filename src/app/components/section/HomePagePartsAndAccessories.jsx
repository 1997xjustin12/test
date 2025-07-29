import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../atom/SectionHeader";
import { BASE_URL } from "@/app/lib/helpers";

const partsandaccessories = [
  {
    name: "Fireplace Doors",
    url: "fireplace-doors",
    img: "/images/feature/fireplace-doors.webp",
  },
  {
    name: "Firewood Racks",
    url: "firewood-racks",
    img: "/images/feature/firewood-racks.webp",
  },
  {
    name: "Fireplace Screens",
    url: "fireplace-screens",
    img: "/images/feature/fireplace-screens.webp",
  },
  {
    name: "Fireplace Grates",
    url: "fireplace-grates",
    img: "/images/feature/fireplace-grates.webp",
  },
  {
    name: "Fireplace Heaters & Blowers",
    url: "fireplace-heaters-and-blowers",
    img: "/images/feature/fireplace-heater-blowers.webp",
  },
  {
    name: "Fireplace Tools",
    url: "fireplace-tools",
    img: "/images/feature/fireplace-tools-1.webp",
  },
  {
    name: "Fireplace Mantels",
    url: "fireplace-mantels",
    img: "/images/feature/fireplace-mantels.webp",
  },
  {
    name: "Chimney & Stove Pipe",
    url: "chimney-and-stove-pipe",
    img: "/images/feature/chimney-pipes.webp",
  },
  {
    name: "Chimney Caps",
    url: "chimney-caps",
    img: "/images/feature/chimney-cap.webp",
  },
  {
    name: "Chimney Fans",
    url: "chimney-fans",
    img: "/images/feature/chimney-fan.webp",
  },
  {
    name: "Chimney Liners",
    url: "chimney-liners",
    img: "/images/feature/chimney-liners.webp",
  },
  {
    name: "Shop All Accessories",
    url: "fireplace-accessories",
    img: "/images/feature/fireplace-accessories.webp",
  },
];

// [
//   { name: "Firewood", img: "/images/home/parts_and_accessories/firewood.webp" },
//   {
//     name: "Fireplace Mantels",
//     img: "/images/home/parts_and_accessories/fireplace-mantels.webp",
//   },
//   {
//     name: "Fireplace Tools",
//     img: "/images/home/parts_and_accessories/fireplace-tools.webp",
//   },
//   {
//     name: "Fireplace Doors",
//     img: "/images/home/parts_and_accessories/fireplace-doors.webp",
//   },
//   {
//     name: "Fireplace Grates",
//     img: "/images/home/parts_and_accessories/fireplace-grates.webp",
//   },
//   {
//     name: "Fireplace Screens",
//     img: "/images/home/parts_and_accessories/fireplace-screens.webp",
//   },

//   {
//     name: "Fireplace Logs",
//     img: "/images/home/parts_and_accessories/fireplace-logs.webp",
//   },
//   {
//     name: "Firewood Racks",
//     img: "/images/home/parts_and_accessories/firewood-racks.webp",
//   },
//   {
//     name: "Fireplace Starters",
//     img: "/images/home/parts_and_accessories/fireplace-starters.webp",
//   },
//   {
//     name: "Chimney Pipes",
//     img: "/images/home/parts_and_accessories/chimney-pipes.webp",
//   },
//   {
//     name: "Shop All Parts",
//     img: "/images/home/parts_and_accessories/shop-all-parts.webp",
//   },
//   {
//     name: "Shop All Accessories",
//     img: "/images/home/parts_and_accessories/shop-all-accessories.webp",
//   },
// ];

export default function HomePagePartsAndAccessories() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <SectionHeader text="Fireplace Parts & Accessories" />
        {/* update */}
        <div className="flex md:hidden flex-col gap-[10px] mt-5">
          <div className=" w-full flex flex-wrap md:flex-row gap-[10px] justify-center">
            {partsandaccessories.slice(0, 4).map((i, idx) => (
              <Link
                prefetch={false}
                href={`${BASE_URL}/${i?.url}`}
                key={`fireplace-stoves-${idx}`}
                className="w-[calc(50%-10px)] sm:w-[calc(25%-10px)] border p-4 flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-1 bg-stone-100 flex">
                  {
                    <Image
                      src={i.img}
                      alt={i.name}
                      className="w-full h-full object-cover"
                      width={50}
                      height={50}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                    />
                  }
                </div>
                <div className="h-[49px]">
                  <div className="font-medium text-sm md:text-base text-center">
                    {i.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-[10px] mt-5">
          <div className=" w-full flex flex-wrap md:flex-row gap-[10px] justify-center">
            {partsandaccessories.map((i, idx) => (
              <Link
                prefetch={false}
                href={`${BASE_URL}/${i?.url}`}
                key={`fireplace-stoves-${idx}`}
                className="lg:w-[calc(16.6%-10px)] border p-4 w-[120px] flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-1 bg-stone-100 flex">
                  {
                    <Image
                      src={i.img}
                      alt={i.name}
                      className="w-full h-full object-cover"
                      width={50}
                      height={50}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                    />
                  }
                </div>
                <div className="h-[49px]">
                  <div className="font-medium text-sm md:text-base text-center">
                    {i.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-[20px] flex items-center justify-center md:hidden">
          <Link prefetch={false} href={`${BASE_URL}/fireplace-accessories`} className="font-bold text-sm md:text-base bg-theme-600 hover:bg-theme-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md">
            Shop All Parts and Accessories
          </Link>
        </div>
      </div>
    </div>
  );
}
