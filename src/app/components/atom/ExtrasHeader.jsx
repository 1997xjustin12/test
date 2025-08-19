import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
function ExtrasHeader() {
    const extrasLinks = [
        {name: "Promotions", url:"promotions"},
        {name: "Learning Center", url:""},
        {name: "Professional Program", url:""},
        {name: "Order Status", url:""},
        {name: "Why Buy From The Expert In Fire?", url:""},
    ]
  return (
    <div className="hidden lg:block bg-orange-500 py-[8px] px-[30px] text-white">
      <div className="container mx-auto  flex items-center justify-between">
        <div className="flex justify-between w-full">
            {
                extrasLinks.map((item,index) => <Link
                    key={`extras-links-${item?.url}-${index}`}
                    className="font-light text-xs"
                    prefetch={false}
                    href={`${BASE_URL}/${item?.url}`}>{item?.name}</Link>)
            }
        </div>
      </div>
    </div>
  );
}

export default ExtrasHeader;
