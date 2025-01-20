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
      <div className="container mx-auto p-[10px] md:p-[0px]">
        <div className="text-xl md:text-4xl font-semibold underline italic font-bell">
          Fireplace Parts & Accessories
        </div>
        <div className="flex flex-col gap-[10px] mt-5">
          <div className=" w-full flex flex-wrap md:flex-nowrap md:flex-row gap-5 justify-center">
            {partsandaccessories1.map((i, idx) => (
              <div
                key={`fireplace-stoves-2-${idx}`}
                className="md:w-1/6 border p-4 w-[120px] flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                <div className="aspect-1 bg-stone-100 flex">
                  <img
                    src={i.img}
                    alt={i.name}
                    className="object-contain w-full"
                  />
                </div>
                <div className="h-[49px]">
                  <div className="font-bold text-base md:text-lg">{i.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden w-full md:flex flex-wrap md:flex-nowrap md:flex-row gap-5 justify-center">
            {partsandaccessories2.map((i, idx) => (
              <div
                key={`fireplace-stoves-2-${idx}`}
                className="md:min-w-1/6 border p-4  flex flex-col hover:shadow-lg transition-all duration-300">
                <div className="aspect-1 bg-stone-100 flex w-full">
                  <img
                    src={i.img}
                    alt={i.name}
                    className="object-contain w-full"
                  />
                </div>
                <div className="h-[49px]">
                  <div className="font-bold text-base md:text-lg">{i.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[20px] flex items-center justify-center md:hidden">
            <button className="text-sm md:tex-base text-white bg-red-600 px-[25px] py-[7px] rounded-lg cursor-pointer font-bold">
              Shop All Parts and Accessories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
