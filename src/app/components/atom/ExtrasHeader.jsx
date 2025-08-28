import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
function ExtrasHeader() {
    const extrasLinks = [
        // {name: "Promotions", url:`https://outdoorkitchenoutlet.com/collections/eloquence-1`},
        {name: "Promotions", url:`${BASE_URL}/brand/eloquence`},
        // {name: "Learning Center", url:" https://outdoorkitchenoutlet.com/blogs/general-information"},
        {name: "Learning Center", url:`${BASE_URL}/blogs`},
        {name: "Professional Program", url:`${BASE_URL}/professional-program`},
        // https://outdoorkitchenoutlet.com/pages/contractor-program
        {name: "Support", url:`${BASE_URL}/contact`},
        // {name: "Why Buy From The Expert In Fire?", url:""},
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
                    href={`${item?.url}`}>{item?.name}</Link>)
            }
        </div>
      </div>
    </div>
  );
}

export default ExtrasHeader;
