import Link from "next/link";
import { DeliveryTruckSpeedIcon } from "@/app/components/icons/lib";
export default function FreeShippingBanner() {
  const contact = "(888) 575-9720";
  return (
    <div className="bg-[#4C4C53] flex items-center justify-center py-[8px] gap-[20px]">
      <div className="text-white text-sm w-[calc(100%-50px)] md:w-[auto] pl-[10px] md:pl-[0px]">
        Enjoy Free Shipping on Selected Orders. <span><Link className="underline italic" prefetch={false} href={`tel:${contact}`}>Call now for details</Link></span>
      </div>
      <DeliveryTruckSpeedIcon width="28" height="28" color="white" />
    </div>
  );
}
