"use client";
import Link from "next/link";
import ProductsSection from "@/app/components/molecule/ProductsSection";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import { useState, use } from "react";
import { useSearch } from "@/app/context/search";
import NoSearchResultFound from "@/app/components/template/NoSearchResultFound";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function OldSearchPageClient({props}) {
  const searchParams = use(props.searchParams);
  const [tab, setTab] = useState("product");
  const { query } = searchParams;
  const { searchPageLoading, searchPageQuery, searchPageResults, noPageResults } = useSearch();

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  if (!query) return <NoSearchResultFound query={query} />;
  if (!searchPageLoading && noPageResults && searchPageQuery === query) return <NoSearchResultFound query={query} />;

  return (
    <div className="min-h-screen">
      <MobileLoader />
      <div className="container mx-auto px-2 sm:px-4 pt-4 flex items-center justify-between">
        <div className="flex flex-col gap-[10px] w-full pb-[100px]">
          {searchPageLoading ? (
            <div className="bg-neutral-200 w-full max-w-[200px] h-[24px] rounded"></div>
          ) : (
            <div>
              Results found for{" "}
              <span className="font-bold text-theme-600">{searchPageQuery}</span>
            </div>
          )}
          {/* tabs */}
          <div className="flex items-center justify-evenly w-full my-[10px]">
            {searchPageLoading ? (
              <>
                {[165, 180, 150].map((i, idx) => (
                  <div
                    key={`loader-tab-item-${idx}-${i}`}
                    className={`text-xs p-1 sm:text-base font-medium border-b-4 w-full flex justify-center items-center ${
                      idx === 0 ? "border-neutral-300" : ""
                    }`}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: `${i}px`,
                        height: "36px",
                      }}
                      className="bg-neutral-200 rounded h-[28px] md:h-[36px]"
                    ></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {searchPageResults &&
                  searchPageResults.length > 0 &&
                  searchPageResults
                    .filter((i) =>
                      ["product", "category", "brand"].includes(i.prop)
                    )
                    .map((i, idx) => (
                      <button
                        onClick={() => handleTabChange(i.prop)}
                        key={`search-page-tab-${i.prop}`}
                        className={`text-xs p-1 sm:text-base font-medium border-b-4 w-full ${
                          tab === i.prop ? "border-theme-600" : "text-stone-500"
                        }`}
                      >
                        {i.label} ({i.total})
                      </button>
                    ))}
              </>
            )}
          </div>

          {/* tab display contents*/}

          {tab === "product" && (
            <ProductsSection category={"search"} search={searchPageQuery} />
          )}

          {tab === "category" && (
            <>
              {searchPageResults &&
                searchPageResults.find(({ prop }) => prop === "category") && (
                  <>
                    {searchPageResults.find(({ prop }) => prop === "category").data
                      .length > 0 ? (
                      searchPageResults
                        .find(({ prop }) => prop === "category")
                        .data.map((i, index) => (
                          <Link
                            key={`search-page-category-item-${i.url}-${index}`}
                            href={`${BASE_URL}/${i.url}`}
                          >
                            <div className="hover:text-theme-600">{i.name}</div>
                          </Link>
                        ))
                    ) : (
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="text-lg md:text-2xl font-bold text-stone-500">
                          Nothing to display
                        </div>
                      </div>
                    )}
                  </>
                )}
            </>
          )}

          {tab === "brand" && (
            <>
              {searchPageResults &&
                searchPageResults.find(({ prop }) => prop === "brand") && (
                  <>
                    {searchPageResults.find(({ prop }) => prop === "brand").data
                      .length > 0 ? (
                      searchPageResults
                        .find(({ prop }) => prop === "brand")
                        .data.map((i, index) => (
                          <Link
                            key={`search-page-category-item-${i.url}-${index}`}
                            href={`${BASE_URL}/${i.url}`}
                          >
                            <div className="hover:text-theme-600">{i.name}</div>
                          </Link>
                        ))
                    ) : (
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="text-lg md:text-2xl font-bold text-stone-500">
                          Nothing to display
                        </div>
                      </div>
                    )}
                  </>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
