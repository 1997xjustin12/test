"use client";
import Link from "next/link";
// import ProductsSection from "@/app/components/section/Products";
import ProductsSection from "@/app/components/molecule/ProductsSection";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import { useState, useEffect, use } from "react";
import { useSearch } from "@/app/context/search";
import NoSearchResultFound from "@/app/components/template/NoSearchResultFound"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function SearchPage(props) {
  const searchParams = use(props.searchParams);
  const [tab, setTab] = useState("product");
  const { query } = searchParams;
  const { searchQuery, setSearch, searchResults, noResults } = useSearch();
  useEffect(()=>{
    if(query){
      setSearch(query);
    }
  },[])
  const handleTabChange= (tab) => {
    setTab(tab);
  }

  if(!query || noResults){
    return <NoSearchResultFound query={query}/>
  }
    
  return (
    <div className="min-h-screen">
      <MobileLoader />
      <div className="container mx-auto px-2 sm:px-4 pt-4 flex items-center justify-between">
        <div className="flex flex-col gap-[10px] w-full pb-[100px]">
          <div>
            Results found for{" "}
            <span className="font-bold text-theme-600">{searchQuery}</span>
          </div>
          {/* tabs */}
          <div className="flex items-center justify-evenly w-full my-[10px]">
            {searchResults &&
              searchResults.length > 0 &&
              searchResults
                .filter((i) => i.label !== "Recent")
                .map((i, idx) => (
                  <button onClick={()=>handleTabChange(i.prop)} key={`search-page-tab-${i.prop}`} className={`text-xs p-1 sm:text-base font-medium border-b-4 w-full ${tab===i.prop?"border-theme-600":"text-stone-500"}`}>
                    {i.label} ({i.total})
                  </button>
                ))}
          </div>

          {/* tab display contents*/}

          {
            // tab === "product" && <ProductsSection category={"search"} keyword={searchQuery} />
            tab === "product" && <ProductsSection category={"search"} search={searchQuery} />
          }
          
          
          {
            tab === "category" && <>
              {
              searchResults && searchResults.find(({prop})=> prop==="category") && <>
                {
                  searchResults.find(({prop})=> prop==="category").data.length > 0 ?
                  searchResults.find(({prop})=> prop==="category").data.map(i=> 
                    <Link key={`search-page-category-item-${i.url}`} href={`${BASE_URL}/${i.url}`}>
                      <div className="hover:text-theme-600">{i.name}</div>
                    </Link>
                  )
                  :
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-lg md:text-2xl font-bold text-stone-500">Nothing to display</div>
                  </div>
                  
                }
              </>
              }
            </>
          }

          {
            tab === "brand" && <>
              {
              searchResults && searchResults.find(({prop})=> prop==="brand") && <>
                {
                  searchResults.find(({prop})=> prop==="brand").data.length > 0 ?
                  searchResults.find(({prop})=> prop==="brand").data.map(i=> 
                    <Link key={`search-page-category-item-${i.url}`} href={`${BASE_URL}/${i.url}`}>
                      <div className="hover:text-theme-600">{i.name}</div>
                    </Link>)
                  :
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-lg md:text-2xl font-bold text-stone-500">Nothing to display</div>
                  </div>
                  
                }
              </>
              }
            </>
          }
        </div>
      </div>
    </div>
  );
}
