import { isProductOnSale } from "@/app/lib/helpers";
export default function SingleProductOnsaleTag({ categories }) {
  if (isProductOnSale(categories)) {
    return (
      <div className="py-[10px] px-[20px] text-white bg-pallete-orange inline rounded-r-full text-[1.5em] font-semibold">
        ON SALE
      </div>
    );
  }
}
