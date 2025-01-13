import { DeliveryTruckSpeedIcon } from "@/app/components/icons/lib";
export default function FreeShippingBanner() {
  return (
    <div className="bg-[#4C4C53] flex items-center justify-center py-[8px]">
      <div className="text-white mr-[10px] text-[16px]">
        Free shipping on orders over $99
      </div>
      <DeliveryTruckSpeedIcon width="28" height="28" color="white" />
    </div>
  );
}
