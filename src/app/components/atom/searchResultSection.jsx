"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

function SearchResultSection({ section }) {
  const [sectionData, setSectionData] = useState([]);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    console.log("sectionComponennt:",section)
    if (section) {
      setSectionData(expanded ? section.data.slice(0,10):section.data.slice(0,3));
    }
  }, [section,expanded]);

  const handleSeeMoreClick = () => {
    setExpanded(prev => !prev);
  };
  const handleOptionClick = (e) => {
  };

  if(sectionData.length > 0){
    return (
      <div>
        <div className="bg-stone-200 font-bold text-sm py-1 px-3">
          {section.label}
        </div>
        <div>
          {section.prop === "recent" &&
            sectionData.map((recent, index) => (
              <div
                key={`recent-search-${index}`}
                className="group hover:bg-stone-50 px-2 py-[5px]"
                onClick={() => setSearch(recent)}
              >
                <div className="text-[14px] group-hover:text-orange-600">
                  {recent}
                </div>
              </div>
            ))}
  
          {section.prop === "product" &&
            sectionData.map((product, index) => (
              <Link
                // onClick={handleOptionClick}
                // onContextMenu={handleOptionClick}
                key={`product-result-${index}`}
                href={`${BASE_URL}/product${product.custom_url.url}`}
              >
                <div className="flex items-center group hover:bg-stone-50 px-2 py-[5px]">
                  <div className="w-[75px] h-[75px] overflow-hidden bg-white mr-[10px] flex items-center rounded relative">
                    {product?.images &&
                      product.images.find(({ is_thumbnail }) => is_thumbnail) && (
                        <Image
                          src={
                            product.images.find(
                              ({ is_thumbnail }) => is_thumbnail
                            )?.url_thumbnail
                          }
                          alt={`product:${product.name}`}
                          className="object-contain w-full"
                          fill
                        />
                      )}
                  </div>
                  <div className="w-full">
                    <div className="text-[14px] group-hover:text-orange-600">
                      {product.name}
                    </div>
                    <div className="text-[10px] text-gray-500 font-normal">
                      {section.label}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          {section.prop === "category" &&
            sectionData.map((category, index) => (
              <Link
                key={`cat-result-${index}`}
                href={`${BASE_URL}/${category.url}`}
                onClick={handleOptionClick}
                onContextMenu={handleOptionClick}
              >
                <div className="group hover:bg-stone-200 px-2 py-[5px]">
                  <div className="text-[14px] group-hover:text-orange-600">
                    {category.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-normal">
                    {section.label}
                  </div>
                </div>
              </Link>
            ))}
          {section.prop === "brand" &&
            sectionData.map((brand, index) => (
              <Link
                onClick={handleOptionClick}
                onContextMenu={handleOptionClick}
                key={`brand-result-${index}`}
                href={`#`}
              >
                <div className="w-full group hover:bg-stone-200 px-2 py-[5px]">
                  <div className="text-[14px] group-hover:text-orange-600">
                    {brand.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-normal">
                    {section.label}
                  </div>
                </div>
              </Link>
            ))}
        </div>
        {section.showExpand && (
          <div className={`flex justify-center p-1`}>
            <button
              onClick={() => handleSeeMoreClick(section)}
              className="border w-full text-sm p-2 font-semibold hover:bg-stone-300 hover:border-stone-500"
            >
              {expanded
                ? `See Lesser ${section.label}`
                : `See More ${section.label}`}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SearchResultSection;
