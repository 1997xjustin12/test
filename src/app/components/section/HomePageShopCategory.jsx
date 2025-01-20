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

const fireplacesStovePlaceHolder = [0, 0, 0, 0, 0, 0];

const fireplacesStoves1 = [
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
];

const fireplacesStoves2 = [
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
      <div className="container mx-auto p-[10px] md:p-[0px]">
        {/* md desktop visible -- hides on lower screens */}
        <div className="hidden lg:block">
          <div className="text-4xl underline italic font-semibold  font-bell">
            Shop Fireplaces
          </div>
          <div className="flex-col md:flex-row flex gap-[10px] mt-5">
            <div className="w-[25%]  flex flex-col gap-5">
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
            <div className="border-l w-[85%]  p-[20px]">
              <div className="text-3xl italic font-semibold font-bell">
                Fireplaces & Stove
              </div>
              <div className="flex flex-col gap-[30px] mt-5">
                <div className=" w-full flex flex-col md:flex-row gap-5">
                  {fireplacesStoves1.map((i, idx) => (
                    <div
                      key={`fireplace-stoves-1-${idx}`}
                      className="border p-4 w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                      <div className="aspect-1 bg-stone-100 border">
                        <img src={i.img} alt={i.name} className="object-fill" />
                      </div>
                      <div className="h-[49px]">
                        <div className="font-bold">{i.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className=" w-full flex flex-col md:flex-row gap-5">
                  {fireplacesStoves2.map((i, idx) => (
                    <div
                      key={`fireplace-stoves-2-${idx}`}
                      className="border p-4 w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                      <div className="aspect-1 bg-stone-100 border">
                        <img src={i.img} alt={i.name} className="object-fill" />
                      </div>
                      <div className="h-[49px]">
                        <div className="font-bold">{i.name}</div>
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
          <div className="text-xl md:text-4xl underline italic font-semibold  font-bell">
            Shop Fireplaces & Stoves
          </div>

          <div className="flex flex-col gap-[30px] mt-5">
            <div className=" w-full flex flex-wrap gap-5">
              {fireplacesStoves1.map((i, idx) => (
                <div
                  key={`fireplace-stoves-1-${idx}`}
                  className="w-[calc(50%-10px)] border p-4 lg:w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-1 bg-stone-100 border">
                    <img src={i.img} alt={i.name} className="object-fill" />
                  </div>
                  <div className="h-[49px]">
                    <div className="font-bold">{i.name}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className=" w-full flex flex-wrap gap-5">
              {fireplacesStoves2.map((i, idx) => (
                <div
                  key={`fireplace-stoves-2-${idx}`}
                  className="w-[calc(50%-10px)] border p-4 lg:w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300">
                  <div className="aspect-1 bg-stone-100 border">
                    <img src={i.img} alt={i.name} className="object-fill" />
                  </div>
                  <div className="h-[49px]">
                    <div className="font-bold">{i.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
