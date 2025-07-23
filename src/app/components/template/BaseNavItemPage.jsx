import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
function BaseNavItemPage({ page_details }) {
  if (!page_details) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-3">
      <div className="my-3">
        <Link prefetch={false} href={BASE_URL} className="hover:underline">
          Home
        </Link>
      </div>
      <h1>{page_details?.name}</h1>
      <div className="flex my-[30px]">
        {/* side bar with category list */}
        <div className="w-[250px] pr-3 flex flex-col gap-[20px]">
          {page_details &&
            page_details?.children &&
            Array.isArray(page_details?.children) &&
            page_details.children.length > 0 &&
            page_details.children.map((item, index) => (
                <div key={`sidebar-category-link-${item?.slug}`} className="flex flex-col gap-[5px]">
                    <Link
                        prefetch={false}
                        href={`${BASE_URL}/${item?.url}`}
                        className="text-lg font-semibold hover:underline hover:text-theme-800"
                    >
                        {item?.name}
                    </Link>
                    {
                        item
                        && item?.children
                        && Array.isArray(item?.children)
                        && item?.children?.length > 0
                        && item?.children.map((sub,index2) =>
                        <Link key={`sidebar-sub-category-link-${index}-${index2}-${item?.slug}`}
                        prefetch={false}
                        href={`${BASE_URL}/${sub?.url}`}
                        className="hover:underline hover:text-theme-800">
                            {sub?.name}
                        </Link>)
                    }
                </div>
            ))}
        </div>
        {/* content with category image and list */}
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-[calc(100%-250px)] px-2">
          {page_details &&
            page_details?.children &&
            Array.isArray(page_details?.children) &&
            page_details.children.length > 0 &&
            page_details.children.map((item, index) => (
              <Link
                key={`category-link-${item?.slug}`}
                prefetch={false}
                href={`${BASE_URL}/${item?.url}`}
                className="w-full flex flex-col items-center gap-[15px]"
              >
                <div className="w-full aspect-1 bg-neutral-200"></div>
                <h4 className="text-center font-semibold text-sm">{item?.name}</h4>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default BaseNavItemPage;
