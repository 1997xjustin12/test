"use client";
import { SearchIcon } from "../icons/lib";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import cat_json from "../../data/category.json";
import useFetchProducts from "@/app/hooks/useFetchProducts";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

// create an array of all category, sub_categories and links
const main_categories = cat_json
  .filter((i) => i.searchable === true)
  .map((i) => ({ ...i, name: i.name, url: i.menu.href }));
// console.log("mainCat", main_categories);
const sub_categories = main_categories
  .reduce((acc, cur) => [...acc, ...cur.links], [])
  .reduce((acc, cur) => [...acc, ...cur], []);
// console.log("subCat", sub_categories);
const children_categories = sub_categories.flatMap((i) => i.children);
// console.log("childCat", children_categories);
const brands = sub_categories
  .filter((i) => i.name.toLowerCase().includes("brand"))
  .flatMap((i) => i.children)
  .sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
// console.log("brands", brands);
const HomeSearch = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [recentResults, setRecentResults] = useState([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRecentResults((prev) => {
        const recentLS = localStorage.getItem("recent_searches");
        if (recentLS) {
          return Array.isArray(JSON.parse(recentLS))
            ? JSON.parse(recentLS)
            : [];
        } else {
          return [];
        }
      });
    }
  }, []);
  const [categoryResults, setCategoryResults] = useState(() => {
    return cat_json
      .filter((i) => i.searchable === true)
      .map((i) => ({ name: i.name, url: i.menu.href }));
  });
  const [productResults, setProductResults] = useState([]);
  const [popularSearchesResults, setPopularSearchesResults] = useState([]);
  const [brandResults, setBrandResults] = useState(brands);
  const {
    products,
    loading,
    pagination,
    refetch: refetchProducts,
  } = useFetchProducts({
    is_featured: true,
  });

  useEffect(() => {
    // if (products.length > 0) {
    setProductResults(products);
    // }
  }, [products]);

  useEffect(() => {
    refetchProducts((prev) => {
      if (search === "") {
        return { is_featured: true, include: "images" };
      } else {
        return { keyword: search, include: "images" };
      }
    });
    getSearchResults(search);
  }, [search]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const getSearchResults = (query) => {
    setRecentResults(() => {
      const recentLS = localStorage.getItem("recent_searches");
      const recent = recentLS
        ? Array.isArray(JSON.parse(recentLS))
          ? JSON.parse(recentLS)
          : []
        : [];
      if (query === "") {
        return recent;
      } else {
        return recent
          .filter((i) => i.includes(query))
          .sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
          });
      }
    });
    setCategoryResults((prev) => {
      if (query === "") {
        // return base categories only
        return cat_json
          .filter((i) => i.searchable === true)
          .map((i) => ({ name: i.name, url: i.menu.href }))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
      } else {
        const all_categories = [
          ...main_categories,
          ...sub_categories,
          ...children_categories,
        ].map((i) => ({ name: i.name, url: i.url ?? "#" }));
        // console.log("mainCat", main_categories);
        console.log(
          "subCat",
          sub_categories.filter((i) => i.name.toLowerCase().includes("brand"))
        );
        return all_categories
          .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
      }
    });
    setBrandResults((prev) => {
      if (query === "") {
        return brands;
      } else {
        return brands.filter((i) => i.name.toLowerCase().includes(query));
      }
    });
  };

  const handleOptionClick = (e) => {
    // store search value inside a local storage array
    // e.preventDefault();
    const recentLS = localStorage.getItem("recent_searches");
    console.log("recentLS", recentLS ? "YES" : "NO");
    if (recentLS) {
      const recentArray = JSON.parse(recentLS);
      if (Array.isArray(recentArray)) {
        if (search !== "") {
          const new_recent = [...new Set([...recentArray, search])];
          localStorage.setItem("recent_searches", JSON.stringify(new_recent));
        }
      } else {
        if (search !== "") {
          localStorage.setItem("recent_searches", JSON.stringify([search]));
        }
      }
    } else {
      localStorage.setItem("recent_searches", JSON.stringify([search]));
    }
    setSearch("");
    setOpenSearch(false);
  };

  return (
    <div className="flex w-full">
      <input
        type="search"
        placeholder="Search..."
        className="w-full text-sm font-normal px-[20px] py-[10px] border border-orange-400 rounded-tl-full rounded-bl-full"
        onClick={() => setOpenSearch(true)}
        value={search}
        onChange={handleSearch}
      />
      <button
        className="rounded-tr-full rounded-br-full bg-pallete-orange text-white font-normal text-sm px-[20px] py-[10px]"
        onClick={() => setOpenSearch(true)}>
        {/* <Icon icon="iconamoon:search-bold" className="text-lg" /> */}
        <SearchIcon color="white" />
      </button>

      <Dialog
        open={openSearch}
        onClose={setOpenSearch}
        className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div className="">
                <div className="flex items-center p-2">
                  {/* <Icon
                    icon="pajamas:search"
                    width="25"
                    height="25"
                    className="text-stone-500 mr-2"
                  /> */}
                  <div className="mr-[10px]">
                    <SearchIcon color="gray" />
                  </div>
                  <input
                    value={search}
                    onChange={handleSearch}
                    type="text"
                    placeholder="Search"
                    className="w-full text-stone-500 font-light outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    className="ml-2 text-[10px] border rounded-md p-[4px] border-stone-300 hover:border-stone-400"
                    onClick={() => setOpenSearch(false)}>
                    ESC
                  </button>
                </div>
                <div className="h-[320px] flex flex-col gap-[10px] py-4 overflow-y-auto border-t p-2">
                  {recentResults.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-stone-500">
                        Recent
                      </div>
                      <div className="py-1">
                        {recentResults.map((i, index) => (
                          <div
                            key={`recent-search-${index}`}
                            className="group hover:bg-stone-200 px-2 py-[5px]"
                            onClick={() => setSearch(i)}>
                            <div className="text-[14px] group-hover:text-orange-600">
                              {i}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {categoryResults.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-stone-500">
                        Categories
                      </div>
                      <div className="py-1">
                        {categoryResults.map((i, index) => (
                          <Link
                            key={`cat-result-${index}`}
                            href={`${BASE_URL}/${i.url}`}
                            onClick={handleOptionClick}
                            onContextMenu={handleOptionClick}>
                            <div className="group hover:bg-stone-200 px-2 py-[5px]">
                              <div className="text-[14px] group-hover:text-orange-600">
                                {i.name}
                              </div>
                              <div className="text-[10px] text-gray-500 font-normal">
                                Category
                                {/* &bull; {i.url} */}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {productResults.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-stone-500">
                        Products
                      </div>
                      <div className="py-1">
                        {productResults.map((i, index) => (
                          <Link
                            onClick={handleOptionClick}
                            onContextMenu={handleOptionClick}
                            key={`product-result-${index}`}
                            href={`${BASE_URL}/product/${i.custom_url.url}`}>
                            <div className="flex items-center group hover:bg-stone-200 px-2 py-[5px]">
                              <div className="w-[75px] h-[75px] overflow-hidden bg-white mr-[10px] flex items-center rounded">
                                <img
                                  src={
                                    i.images.find(
                                      ({ is_thumbnail }) => is_thumbnail
                                    )?.url_thumbnail
                                  }
                                  alt={`product:${i.name}`}
                                  className="object-fit w-full"
                                />
                              </div>
                              <div className="w-full">
                                <div className="text-[14px] group-hover:text-orange-600">
                                  {i.name}
                                </div>
                                <div className="text-[10px] text-gray-500 font-normal">
                                  Product
                                  {/* &bull; {i.name} */}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {popularSearchesResults.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-stone-500">
                        Popular
                      </div>
                      <div className="py-1">
                        {popularSearchesResults.map((i, index) => (
                          <div
                            key={`popular-search-${index}`}
                            className="group hover:bg-stone-200 px-2 py-[5px]"
                            onClick={() => setSearch(i)}>
                            <div className="text-[14px] group-hover:text-orange-600">
                              {i}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {brandResults.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-stone-500">
                        Brand
                      </div>
                      <div className="py-1">
                        {brandResults.map((i, index) => (
                          <Link
                            onClick={handleOptionClick}
                            onContextMenu={handleOptionClick}
                            key={`brand-result-${index}`}
                            href={`#`}>
                            <div className="w-full group hover:bg-stone-200 px-2 py-[5px]">
                              <div className="text-[14px] group-hover:text-orange-600">
                                {i.name}
                              </div>
                              <div className="text-[10px] text-gray-500 font-normal">
                                Brand
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HomeSearch;
