import { isProductOnSale } from "@/app/lib/helpers";
export default function productCardOnsaleTag({ categories }) {
  if (isProductOnSale(categories)) {
    return (
      <div className="absolute bottom-[60px] left-0 rounded-r-full bg-pallete-orange text-white text-[12px] font-bold py-[7px] px-[15px]">
        ONSALE
      </div>
    );
  }
}
