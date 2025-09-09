import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
import CategoryCollectionCarouselWrap from "@/app/components/atom/CategoryCollectionCarouselWrap";
import ProductsSection from "@/app/components/molecule/ProductsSection";

async function BaseNavItemPage({ page_details }) {
  if (!page_details) {
    return notFound();
  }

  console.log("[TEST] page_details:", page_details);

  return (
    <div className="container mx-auto p-3">
      <div className="my-3">
        <Link prefetch={false} href={BASE_URL} className="hover:underline">
          Home
        </Link>
      </div>
      <h1>{page_details?.name}</h1>
      <div className="flex mt-[30px]">
        {/* side bar with category list */}
        <div className="w-[250px] pr-3 flex-col gap-[20px] hidden md:flex">
          {page_details &&
            page_details?.children &&
            Array.isArray(page_details?.children) &&
            page_details.children.length > 0 &&
            page_details.children.map((item, index) => (
              <div
                key={`sidebar-category-link-${item?.slug}`}
                className="flex flex-col gap-[5px]"
              >
                <Link
                  prefetch={false}
                  href={`${BASE_URL}/${item?.url}`}
                  className="text-sm font-semibold hover:underline hover:text-theme-800"
                >
                  {item?.name}
                </Link>
                {item &&
                  item?.children &&
                  Array.isArray(item?.children) &&
                  item?.children?.length > 0 &&
                  item?.children.map((sub, index2) => (
                    <Link
                      key={`sidebar-sub-category-link-${index}-${index2}-${item?.slug}`}
                      prefetch={false}
                      href={`${BASE_URL}/${sub?.url}`}
                      className="hover:underline hover:text-theme-800 text-xs"
                    >
                      {sub?.name}
                    </Link>
                  ))}
              </div>
            ))}
        </div>
        {/* content with category image and list */}
        <div className="w-full md:w-[calc(100%-250px)]">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full px-2">
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
                  <div
                    className={`w-full p-5 ${
                      item?.feature_image ? "bg-white" : "bg-neutral-200"
                    }`}
                  >
                    <div className="aspect-1 relative ">
                      {item?.feature_image && (
                        <Image
                          src={item?.feature_image}
                          alt={`feat-nav-image-${index}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      )}
                    </div>
                  </div>
                  <h4 className="text-center font-semibold text-sm">
                    {item?.name}
                  </h4>
                </Link>
              ))}
          </div>
          <div className="flex flex-col gap-10 my-10">
            {page_details?.cat_collections &&
              Array.isArray(page_details?.cat_collections) &&
              page_details.cat_collections.map((collection) => (
                <div
                  key={`cat-colleciton-display-${collection?.id}`}
                  className="flex flex-col gap-5"
                >
                  <h3 className="text-center">{collection?.label}</h3>
                  <CategoryCollectionCarouselWrap data={collection?.links} />
                </div>
              ))}
          </div>
        </div>
      </div>
      {page_details?.collections &&
        Array.isArray(page_details.collections) &&
        page_details.collections.length > 0 && (
          <div className="my-20">
            {page_details.collections.map((collection) => (
              <CollectionCarouselWrap
                key={`collection-carousel-${collection?.mb_uid}`}
                data={collection}
              />
            ))}
          </div>
        )}
      <hr className="border-gray-300" />
      <div className="my-[30px]">
        <ProductsSection category={page_details?.url} />
      </div>
    </div>
  );
}

export default BaseNavItemPage;
