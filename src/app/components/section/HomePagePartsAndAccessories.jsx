import Image from "next/image";

const partsandaccessories = [
  { name: "Firewood", img: "/images/home/parts_and_accessories/firewood.webp" },
  {
    name: "Fireplace Mantels",
    img: "/images/home/parts_and_accessories/fireplace-mantels.webp",
  },
  {
    name: "Fireplace Tools",
    img: "/images/home/parts_and_accessories/fireplace-tools.webp",
  },
  {
    name: "Fireplace Doors",
    img: "/images/home/parts_and_accessories/fireplace-doors.webp",
  },
  {
    name: "Fireplace Grates",
    img: "/images/home/parts_and_accessories/fireplace-grates.webp",
  },
  {
    name: "Fireplace Screens",
    img: "/images/home/parts_and_accessories/fireplace-screens.webp",
  },

  {
    name: "Fireplace Logs",
    img: "/images/home/parts_and_accessories/fireplace-logs.webp",
  },
  {
    name: "Firewood Racks",
    img: "/images/home/parts_and_accessories/firewood-racks.webp",
  },
  {
    name: "Fireplace Starters",
    img: "/images/home/parts_and_accessories/fireplace-starters.webp",
  },
  {
    name: "Chimney Pipes",
    img: "/images/home/parts_and_accessories/chimney-pipes.webp",
  },
  {
    name: "Shop All Parts",
    img: "/images/home/parts_and_accessories/shop-all-parts.webp",
  },
  {
    name: "Shop All Accessories",
    img: "/images/home/parts_and_accessories/shop-all-accessories.webp",
  },
];

const partsandaccessories1 = [
  { name: "Firewood", img: "/images/home/parts_and_accessories/firewood.webp" },
  {
    name: "Fireplace Mantels",
    img: "/images/home/parts_and_accessories/fireplace-mantels.webp",
  },
  {
    name: "Fireplace Tools",
    img: "/images/home/parts_and_accessories/fireplace-tools.webp",
  },
  {
    name: "Fireplace Doors",
    img: "/images/home/parts_and_accessories/fireplace-doors.webp",
  },
  {
    name: "Fireplace Grates",
    img: "/images/home/parts_and_accessories/fireplace-grates.webp",
  },
  {
    name: "Fireplace Screens",
    img: "/images/home/parts_and_accessories/fireplace-screens.webp",
  },
];

const partsandaccessories2 = [
  {
    name: "Fireplace Logs",
    img: "/images/home/parts_and_accessories/fireplace-logs.webp",
  },
  {
    name: "Firewood Racks",
    img: "/images/home/parts_and_accessories/firewood-racks.webp",
  },
  {
    name: "Fireplace Starters",
    img: "/images/home/parts_and_accessories/fireplace-starters.webp",
  },
  {
    name: "Chimney Pipes",
    img: "/images/home/parts_and_accessories/chimney-pipes.webp",
  },
  {
    name: "Shop All Parts",
    img: "/images/home/parts_and_accessories/shop-all-parts.webp",
  },
  {
    name: "Shop All Accessories",
    img: "/images/home/parts_and_accessories/shop-all-accessories.webp",
  },
];

export default function HomePagePartsAndAccessories() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <div className="text-xl md:text-4xl font-semibold underline italic font-bell">
          Fireplace Parts & Accessories
        </div>
        {/* update */}
        <div className="flex md:hidden flex-col gap-[10px] mt-5">
          <div className=" w-full flex flex-wrap md:flex-row gap-[10px] justify-center">
            {partsandaccessories.slice(0, 4).map((i, idx) => (
              <div
                key={`fireplace-stoves-${idx}`}
                className="w-[calc(50%-10px)] sm:w-[calc(25%-10px)] border p-4 flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-1 bg-stone-100 flex">
                  {
                    <Image
                      src={i.img}
                      alt={i.name}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      // loading="eager"
                      // priority={false}
                    />
                  }
                </div>
                <div className="h-[49px]">
                  <div className="font-medium text-sm md:text-base text-center">
                    {i.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-[10px] mt-5">
          <div className=" w-full flex flex-wrap md:flex-row gap-[10px] justify-center">
            {partsandaccessories.map((i, idx) => (
              <div
                key={`fireplace-stoves-${idx}`}
                className="lg:w-[calc(16.6%-10px)] border p-4 w-[120px] flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-1 bg-stone-100 flex">
                  {
                    <Image
                      src={i.img}
                      alt={i.name}
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      // loading="eager"
                      // priority={false}
                    />
                  }
                </div>
                <div className="h-[49px]">
                  <div className="font-medium text-sm md:text-base text-center">
                    {i.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-[20px] flex items-center justify-center md:hidden">
          <button className="text-sm md:text-base font-medium bg-orange-400 hover:bg-orange-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md">
            Shop All Parts and Accessories
          </button>
        </div>
      </div>
    </div>
  );
}
