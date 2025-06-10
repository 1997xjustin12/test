"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

import { useSearch } from "@/app/context/search";
import { useSolanaCategories } from "@/app/context/category";

function SearchResultSection({ section, onOptionSelect }) {
  const router = useRouter();
  const { setSearch } = useSearch();
  const { getProductUrl } = useSolanaCategories();
  const [sectionData, setSectionData] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handleSetSearch = (query) => {
    setSearch(query);
  };

  useEffect(() => {
    // console.log("sectionComponennt:", section);
    if (section) {
      setSectionData(
        expanded ? section.data.slice(0, 10) : section.data.slice(0, 3)
      );
    }
  }, [section, expanded]);

  const handleOptionClick = (e) => {
    e.preventDefault();
    const linkElement = e.target.closest("a");
    if(linkElement){
      const href = linkElement.getAttribute("href");
      // console.log("hrefs", href)
      onOptionSelect();
      router.push(href);
    }
  };

  if (sectionData && sectionData.length > 0) {
    return (
      <div>
        <div className="bg-stone-200 font-bold text-sm py-1 px-3">
          {section.label}
        </div>
        <div>
          { sectionData && section.prop === "recent" &&
            sectionData.map((recent, index) => (
              <div
                key={`recent-search-${index}`}
                className="group hover:bg-stone-50 px-2 py-[5px]"
                onClick={() => handleSetSearch(recent)}
              >
                <div className="text-[14px] group-hover:text-theme-600">
                  {recent}
                </div>
              </div>
            ))}

          { sectionData && section.prop === "product" &&
            sectionData.map((product, index) => (
              <Link 
                prefetch={false}
                onClick={handleOptionClick}
                key={`product-result-${product?.handle}`}
                href={`${getProductUrl(product)}`}
              >
                <div className="flex items-center group hover:bg-stone-50 px-2 py-[5px]">
                  <div className="w-[75px] h-[75px] overflow-hidden bg-white mr-[10px] flex items-center rounded relative">
                    {product && product?.images
                       && product.images.find(
                              ({ position }) => position === 1
                            )?.src &&(
                        <Image
                          src={
                            product.images.find(
                              ({ position }) => position === 1
                            ).src
                          }
                          alt={`product:${product.name}`}
                          className="object-contain w-full"
                          fill
                        />
                      )}
                  </div>
                  <div className="w-full">
                    <div className="text-[14px] group-hover:text-theme-600">
                      {product.title}
                    </div>
                    <div className="text-[10px] text-gray-500 font-normal">
                      {section.label}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          { sectionData && section.prop === "category" &&
            sectionData.map((category, index) => (
              <Link
                prefetch={false}
                onClick={handleOptionClick}
                key={`cat-result-${category.url}`}
                href={`${BASE_URL}/${category.url}`}
              >
                <div className="group hover:bg-stone-200 px-2 py-[5px]">
                  <div className="text-[14px] group-hover:text-theme-600">
                    {category.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-normal">
                    {section.label}
                  </div>
                </div>
              </Link>
            ))}
          { sectionData && section.prop === "brand" &&
            sectionData.map((brand, index) => (
              <Link
                prefetch={false}
                onClick={handleOptionClick}
                key={`brand-result-${brand.url}`}
                href={`${BASE_URL}/${brand.url}`}
              >
                <div className="w-full group hover:bg-stone-200 px-2 py-[5px]">
                  <div className="text-[14px] group-hover:text-theme-600">
                    {brand.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-normal">
                    {section.label}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }
}

export default SearchResultSection;
