import { DeliveryTruckSpeedIcon } from "@/app/components/icons/lib";
export default function FreeShippingBanner() {
  return (
    <div className="bg-[#4C4C53] flex items-center justify-center py-[8px] gap-[20px]">
      <div className="text-white text-sm w-[calc(100%-50px)] md:w-[auto] pl-[10px] md:pl-[0px]">
        Enjoy Free Shipping on All Orders Over $99 – Shop Now and Save!
      </div>
      <DeliveryTruckSpeedIcon width="28" height="28" color="white" />
    </div>
  );
}
