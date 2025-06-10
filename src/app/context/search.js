"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
// import useFetchProducts from "@/app/hooks/useFetchProducts";
import useESFetchProducts from "@/app/hooks/useESFetchProducts";
// import {
//   solana_brands,
//   flatCategories,
//   bc_categories,
// } from "@/app/lib/category-helpers";
import { useRouter } from "next/navigation";
import { getCategoryIds } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
// useful console that logs keywords for all main categories
// console.log("solanaCategories", solana_categories.flatMap(i=> i.key_words))
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const exclude_brands = ["Bull Outdoor Products"];

const SearchContext = createContext();
export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const { solana_categories, flatCategories } = useSolanaCategories();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mainIsActive, setMainIsActive] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productResults, setProductResult] = useState([]);
  const [productResultsCount, setProductResultsCount] = useState(0);

  const [searchPageProductCount, setSearchPageProductCount] = useState(0);

  const oldSearchResults = useRef([
    {
      total: 0,
      prop: "recent",
      label: "Recent",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      total: 0,
      prop: "product",
      label: "Product",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      total: 0,
      prop: "category",
      label: "Category",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      total: 0,
      prop: "brand",
      label: "Brand",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
  ]);
  const [recentResults, setRecentResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);
  const [brandResults, setBrandResults] = useState([]);

  // new fetch function

  const fetchProducts = async (query_string) => {
    try {
      const trim_query = query_string.trim();
      const rawQuery = trim_query
        ? {
            query: {
              bool: {
                filter: [],
                must: {
                  bool: {
                    should: [
                      {
                        bool: {
                          should: [
                            {
                              multi_match: {
                                query: trim_query,
                                fields: ["title^3", "brand^2", "description"],
                                fuzziness: "AUTO:4,8",
                              },
                            },
                            {
                              multi_match: {
                                query: trim_query,
                                fields: ["title^1.5", "brand^1", "description"],
                                type: "bool_prefix",
                              },
                            },
                          ],
                        },
                      },
                      {
                        multi_match: {
                          query: trim_query,
                          type: "phrase",
                          fields: ["title^6", "brand^4", "description"],
                        },
                      },
                    ],
                  },
                },
                must_not: [
                  {
                    terms: {
                      "brand.keyword": exclude_brands,
                    },
                  },
                ],
              },
            },
            size: 15,
          }
        : {
            query: {
              match_all: {},
            },
            size: 15,
          };
      const res = await fetch("/api/es/shopify/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawQuery),
      });

      if (!res.ok) throw new Error(`[SHOPIFY SEARCH] Failed: ${res.status}`);

      const data = await res.json();
      const formatted_results = data?.hits?.hits?.map(({ _source }) => _source);
      const result_total_count = data?.hits?.total?.value;
      // console.log("[MANUALQUERYRESULTCOUNT] ", result_total_count);
      setProductResult(formatted_results);
      setProductResultsCount(result_total_count);
      return data;
    } catch (err) {
      console.error("[SHOPIFY SEARCH] Failed to fetch products:", err);
      return null;
    }
  };

  // const {
  //   products: productResults,
  //   // loading,
  //   pagination: productPagination,
  //   refetch: refetchProducts,
  // } = useESFetchProducts({ sort: "name.keyword:asc" });

  const getSectionData = (section) => {
    switch (section) {
      case "recent":
        return recentResults;
      case "product":
        return productResults;
      case "category":
        return categoryResults;
      case "brand":
        return brandResults;
    }
  };

  const setSearch = (search_string) => {
    setSearchQuery(search_string);
    fetchProducts(search_string);
    // const categoryIds = getCategoryIds(
    //   "search",
    //   flatCategories,
    //   bc_categories
    // ).join(",");
    // refetchProducts((prev) => {
    //   if (search_string === "") {
    //     return { sort: "name.keyword:asc", categories: categoryIds };
    //   } else {
    //     return {
    //       q: search_string,
    //       sort: "name.keyword:asc",
    //       categories: categoryIds,
    //     };
    //   }
    // });
    getSearchResults(search_string);
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
        return flatCategories
          .filter(({ nav_type }) => nav_type === "category")
          .map((i) => ({
            name: i?.name || i?.title,
            url: i?.menu?.href || i?.url,
          }))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
      } else {
        return flatCategories
          .filter(({ nav_type }) => nav_type === "category")
          .map((i) => ({
            name: i?.name || i?.title,
            url: i?.menu?.href || i?.url,
          }))
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
        return flatCategories
          .filter(({ nav_type }) => nav_type === "brand")
          .map((i) => ({
            name: i?.name || i?.title,
            url: i?.menu?.href || i?.url,
          }))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
      } else {
        return flatCategories
          .filter(({ nav_type }) => nav_type === "brand")
          .map((i) => ({
            name: i?.name || i?.title,
            url: i?.menu?.href || i?.url,
          }))
          .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
      }
    });
  };

  const redirectToSearchPage = () => {
    router.push(`${BASE_URL}/search?query=${searchQuery}`);
  };

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

  const searchResults = useMemo(() => {
    if (!loading) {
      const newSearchResults = [
        {
          total: recentResults.length,
          prop: "recent",
          label: "Recent",
          visible: true,
          data: recentResults,
          showExpand: recentResults.length > 3,
        },
        {
          total: searchPageProductCount || (productResultsCount ?? 0),
          prop: "product",
          label: "Product",
          visible: true,
          data: productResults || [],
          showExpand: productResults?.length > 0,
        },
        {
          total: categoryResults.length,
          prop: "category",
          label: "Category",
          visible: true,
          data: categoryResults,
          showExpand: categoryResults.length > 0,
        },
        {
          total: brandResults.length,
          prop: "brand",
          label: "Brand",
          visible: true,
          data: brandResults,
          showExpand: brandResults.length > 0,
        },
      ];
      oldSearchResults.current = newSearchResults;
      setNoResults((prev) => {
        return (
          productResults?.length === 0 &&
          categoryResults.length === 0 &&
          brandResults.length === 0
        );
      });
      // console.log("searchResults",newSearchResults)
      return newSearchResults;
    } else {
      setNoResults((prev) => {
        return (
          productResults?.length === 0 &&
          categoryResults.length === 0 &&
          brandResults.length === 0
        );
      });
      // console.log("searchResults old",oldSearchResults.current)
      return oldSearchResults.current;
    }
  }, [
    recentResults,
    productResults,
    categoryResults,
    brandResults,
    loading,
    searchPageProductCount,
  ]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        loading,
        mainIsActive,
        searchResults,
        noResults,
        searchPageProductCount,
        setSearch,
        setSearchPageProductCount,
        setMainIsActive,
        redirectToSearchPage,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
