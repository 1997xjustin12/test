import { isProductOnSale } from "@/app/lib/helpers";
export default function SingleProductOnsaleTag({ categories }) {
  if (isProductOnSale(categories)) {
    return (
      <div className="py-[2px] px-[10px] text-white bg-theme-500 w-fit rounded-r-full text-xs md:text-base font-semibold">
        ON SALE
      </div>
    );
  }
}
