import Image from "next/image";
import SectionHeader from "../atom/SectionHeader";

const menu = [
  {
    name: "Fireplaces",
    child: [
      { name: "Shop All Fireplaces" },
      { name: "Shop Fireplace Savings" },
      { name: "Electric Fireplace Inserts" },
      { name: "Gas Fireplace Inserts" },
      { name: "Wood-Burning Fireplace Inserts" },
      { name: "Propane Fireplaces" },
      { name: "Ventless Gas Fireplaces" },
      { name: "Corner Electric Fireplaces" },
    ],
  },
  {
    name: "Fireplaces & Stove Accessories",
    child: [
      { name: "Bulk Savings on Fire Glass" },
      { name: "Bulk Savings on Fire Starters" },
      { name: "Firewood" },
      { name: "Fireplace Screens" },
      { name: "Firewood Racks" },
      { name: "Fireplace Doors" },
    ],
  },
  {
    name: "Outdoor Heating",
    child: [
      { name: "Outdoor Fireplaces" },
      { name: "Fire Pits" },
      { name: "Fire Pit Tables" },
      { name: "Patio Heaters" },
    ],
  },
];

const fireplacesStoves = [
  {
    name: "Electric Fireplaces",
    img: "/images/home/fireplaces_and_stoves/electric-fireplaces.webp",
  },
  {
    name: "Gas Fireplaces",
    img: "/images/home/fireplaces_and_stoves/gas-fireplaces.webp",
  },
  {
    name: "Fireplace TV Stands",
    img: "/images/home/fireplaces_and_stoves/fireplace-tv-stand.webp",
  },
  {
    name: "Wall-Mounted Fireplaces",
    img: "/images/home/fireplaces_and_stoves/wall-mounted-fireplace.webp",
  },
  {
    name: "Smart Fireplaces",
    img: "/images/home/fireplaces_and_stoves/smart-fireplace.webp",
  },
  {
    name: "Freestanding Fireplaces",
    img: "/images/home/fireplaces_and_stoves/freestanding-fireplace.webp",
  },
  {
    name: "Fireplace Inserts",
    img: "/images/home/fireplaces_and_stoves/fireplace-inserts.webp",
  },
  {
    name: "Electric Stove Heaters",
    img: "/images/home/fireplaces_and_stoves/electric-stove-heaters.webp",
  },
  {
    name: "Wood-Burning Stoves",
    img: "/images/home/fireplaces_and_stoves/wood-burning-stove.webp",
  },
  {
    name: "Freestanding Stoves",
    img: "/images/home/fireplaces_and_stoves/freestanding-stoves.webp",
  },
  {
    name: "Freestanding Gas Stoves",
    img: "/images/home/fireplaces_and_stoves/freestanding-gas-stoves.webp",
  },
  {
    name: "Pellet Stoves",
    img: "/images/home/fireplaces_and_stoves/pellet-stoves.webp",
  },
];

export default function HomePageShopCategory() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        {/* md desktop visible -- hides on lower screens */}
        <div className="hidden lg:block">
          <SectionHeader text="Shop Fireplaces" />
          <div className="flex-col md:flex-row flex gap-[10px] mt-5">
            <div className="w-[25%] min-w-[250px] flex flex-col gap-5">
              {menu.map((i, idx) => (
                <div key={`menu-item-${idx}`} className="">
                  <div className="font-bold">{i.name}</div>
                  <div className="mt-3">
                    {i.child.map((i2, idx2) => (
                      <div key={`menu-sub-item-${idx}-${idx2}`}>{i2.name}</div>
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
                    <div
                      key={`fireplace-stoves-1-${idx}`}
                      className="border p-4 w-full lg:w-[calc(25%-4px)] xl:w-[calc(16.6%-4px)] flex flex-col gap-[10px] hover:shadow-lg transition-all duration-300">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* visible on on lower screen */}
        <div className="lg:hidden">
          <SectionHeader text="Shop Fireplaces & Stoves" />
          <div className="flex flex-col gap-[30px] mt-5">
            <div className=" w-full flex flex-wrap gap-5">
              {fireplacesStoves.slice(0, 6).map((i, idx) => (
                <div
                  key={`fireplace-stoves-1-${idx}`}
                  className="w-[calc(50%-10px)] border p-4 lg:w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-1 bg-stone-100 border">
                    {
                      // <img src={i.img} alt={i.name} className="object-fill" />

                      <Image
                        src={i.img}
                        alt={`${i.name}-image`}
                        className="w-full h-full object-contain"
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
                  <div className="h-[49px]">
                    <div className="font-bold text-sm text-center">
                      {i.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <a href="">
                <button className="text-sm md:text-base font-bold bg-orange-600 hover:bg-orange-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md">
                  Shop Fireplaces & Stoves
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
