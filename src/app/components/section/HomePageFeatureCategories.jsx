const items = [
  { label: "Fireplace", img: "/images/home/categories/fireplace.webp" },
  { label: "Fire Pits", img: "/images/home/categories/firepits.webp" },
  { label: "BBQ Grills", img: "/images/home/categories/bbq_grills.webp" },
  {
    label: "Outdoor Kitchen & Islands",
    img: "/images/home/categories/outdoor_kitchen.webp",
  },
  { label: "Chimney", img: "/images/home/categories/chimney.webp" },
  { label: "Gas Logs", img: "/images/home/categories/gas_logs.webp" },
  { label: "Clearance", img: "/images/home/categories/clearance.webp" },
];
export default function HomePageFeatureCategories() {
  return (
    <div className="w-full mt-5">
      <div className="container mx-auto overflow-hidden">
        <div className="flex overflow-x-auto pb-5 gap-5 overflow-y-hidden justify-center">
          {items.map((v, idx) => (
            <div
              key={`feature-category-item-${idx}`}
              className={`min-w-[180px] w-[180px] flex flex-col gap-[8px] group`}>
              <div
                className={`w-full h-[150px] flex items-center justify-center group-hover:border group-hover:bg-stone-100 rounded-md overflow-hidden transition-all duration-500`}>
                {/* <div>image Here</div> */}
                <img src={v.img} alt="" className="object-contain h-[150px]" />
              </div>
              <div
                className={`flex items-center justify-center w-full h-[60px] overflow-hidden`}>
                <div className="break-words text-center">{v.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
