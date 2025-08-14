import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../atom/SectionHeader";
import { BASE_URL } from "@/app/lib/helpers";

const menu = [
  {
    name: "Fireplaces",
    child: [
      // { name: "Shop All Fireplaces" },
      // { name: "Shop Fireplace Savings" },
      // { name: "Electric Fireplace Inserts" },
      // { name: "Gas Fireplace Inserts" },
      // { name: "Wood-Burning Fireplace Inserts" },
      // { name: "Propane Fireplaces" },
      // { name: "Ventless Gas Fireplaces" },
      // { name: "Corner Electric Fireplaces" },
      { name: "Gas Fireplaces", url: "gas-fireplaces" },
      { name: "Wood Fireplaces", url: "wood-fireplaces" },
      { name: "Electric Fireplaces", url: "electric-fireplaces" },
      { name: "Outdoor Fireplaces", url: "outdoor-fireplaces" },
      { name: "Chimney", url: "chimney" },
    ],
  },
  {
    name: "Fireplaces & Stove Accessories",
    child: [
      // { name: "Bulk Savings on Fire Glass" },
      // { name: "Bulk Savings on Fire Starters" },
      // { name: "Firewood" },
      { name: "Fireplace Doors", url: "fireplace-doors" },
      { name: "Firewood Racks", url: "firewood-racks" },
      { name: "Fireplace Screens", url: "fireplace-screens" },
      { name: "Fireplace Grates", url: "fireplace-grates" },
      {
        name: "Fireplace Heaters & Blowers",
        url: "fireplace-heaters-and-blowers",
      },
      { name: "Fireplace Tools", url: "fireplace-tools" },
      { name: "Fireplace Mantels", url: "fireplace-mantels" },
      { name: "Wood Stoves", url: "wood-stoves" },
      { name: "Gas Burning Stoves", url: "gas-burning-stoves" },
      { name: "Wood Stove Accessories", url: "wood-stove-accessories" },
    ],
  },
  {
    name: "Outdoor Heating",
    child: [
      { name: "Outdoor Fireplaces", url: "outdoor-fireplaces" },
      { name: "Fire Pits", url: "fire-pits" },
      { name: "Fire Pit Tables", url: "fire-pit-tables" },
      { name: "Patio Heaters", url: "patio-heaters" },
    ],
  },
];


const fireplacesStoves = [
  {
    name: "Gas Fireplaces",
    url: "gas-fireplaces",
    img: "/images/feature/fire-pits-2.avif",
  },
  {
    name: "Wood Fireplaces",
    url: "wood-fireplaces",
    img: "/images/feature/outdoor-fireplaces.avif",
  },
  {
    name: "Electric Fireplaces",
    url: "electric-fireplaces",
    img: "/images/feature/featured-collection-freestanding-electric-fireplaces.webp",
  },
  {
    name: "Outdoor Fireplaces",
    url: "outdoor-fireplaces",
    img: "/images/feature/outdoor-fireplaces-3.webp",
  },
  {
    name: "Fireplace Inserts",
    url: "fireplace-inserts",
    img: "/images/feature/fireplace-inserts.webp",
  },
  {
    name: "Fireplace Accessories",
    url: "fireplace-accessories",
    img: "/images/feature/fireplace-accessories.webp",
  },
  {
    name: "Chimney",
    url: "chimney",
    img: "/images/feature/chimney.webp",
  },
  {
    name: "Stoves and Furnaces",
    url: "stoves-and-furnaces",
    img: "/images/feature/fireplaces-stoves-and-furnaces.webp",
  },
];

export default function HomePageShopCategory() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <div className="hidden lg:block">
          <SectionHeader text="Shop Fireplaces" />
          <div className="flex-col md:flex-row flex gap-[10px] mt-5">
            <div className="w-[25%] min-w-[250px] flex flex-col gap-5">
              {menu.map((i, idx) => (
                <div key={`menu-item-${idx}`} className="">
                  <div className="font-bold">{i.name}</div>
                  <div className="mt-3 flex flex-col gap-[3px]">
                    {i.child.map((i2, idx2) => (
                      <Link
                        prefetch={false}
                        href={`${BASE_URL}/${i2?.url}`}
                        key={`menu-sub-item-${idx}-${idx2}`}
                      >
                        {i2.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-l w-[calc(100%-250px)]  pl-[20px]">
              <div className="text-3xl italic font-semibold __className_b1512a">
                Fireplaces & Stove
              </div>
              <div className="flex flex-col gap-[30px] mt-5">
                <div className=" w-full flex flex-col md:flex-row md:flex-wrap gap-[4px]">
                  {fireplacesStoves.map((i, idx) => (
                    <Link
                      prefetch={false}
                      href={`${BASE_URL}/${i?.url}`}
                      key={`fireplace-stoves-1-${idx}`}
                      className="border p-4 w-full lg:w-[calc(25%-4px)] xl:w-[calc(25%-4px)] flex flex-col gap-[10px] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-1 bg-stone-100 border">
                        {
                          <Image
                            src={i.img}
                            alt={`${i.name}-image`}
                            className="w-full h-full object-cover"
                            // width={100}
                            // height={100}
                            fill
                            sizes="100vw"
                            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                            // loading="eager"
                            // priority={false}
                          />
                        }
                      </div>
                      <div className="h-[72px] flex justify-center items-center">
                        <div className="font-medium text-sm md:text-base text-center">
                          {i.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <SectionHeader text="Shop Fireplaces & Stoves" />
          <div className="flex flex-col gap-[30px] mt-5">
            <div className=" w-full flex flex-wrap gap-5">
              {fireplacesStoves.slice(0, 6).map((i, idx) => (
                <Link
                prefetch={false}
                href={`${BASE_URL}/${i?.url}`}
                  key={`fireplace-stoves-1-${idx}`}
                  className="w-[calc(50%-10px)] border p-4 lg:w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-1 bg-stone-100 border">
                    {
                      <Image
                        src={i.img}
                        alt={`${i.name}-image`}
                        className="w-full h-full object-contain"
                        fill
                        sizes="100vw"
                      />
                    }
                  </div>
                  <div className="h-[49px]">
                    <div className="font-bold text-sm text-center">
                      {i.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link prefetch={false} href={`${BASE_URL}/fireplaces`} className="text-sm md:text-base font-bold bg-theme-600 hover:bg-theme-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md">
                Shop Fireplaces & Stoves
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
