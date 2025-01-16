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
      <div className="container mx-auto">
        <div className="text-4xl font-semibold underline italic font-bell">
          Fireplace Parts & Accessories
        </div>
        <div className="flex flex-col gap-[10px] mt-5">
          <div className=" w-full flex gap-5">
            {partsandaccessories1.map((i, idx) => (
              <div
                key={`fireplace-stoves-2-${idx}`}
                className="border p-4 w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                <div className="aspect-1 bg-stone-100">
                  <img src={i.img} alt={i.name} />
                </div>
                <div className="h-[49px]">
                  <div className="font-bold text-lg">{i.name}</div>
                </div>
              </div>
            ))}
          </div>
          <div className=" w-full flex gap-5">
            {partsandaccessories2.map((i, idx) => (
              <div
                key={`fireplace-stoves-2-${idx}`}
                className="border p-4 w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                <div className="aspect-1 bg-stone-100">
                  <img src={i.img} alt={i.name} />
                </div>
                <div className="h-[49px]">
                  <div className="font-bold text-lg">{i.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
