"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSolanaCategories } from "@/app/context/category";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const exclude_brands = ["Bull Outdoor Products"];

const SearchContext = createContext();
export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const recentSearchKey = "recent_searches";
  const { flatCategories } = useSolanaCategories();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [mainIsActive, setMainIsActive] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const [productResults, setProductResult] = useState([]);
  const [productResultsCount, setProductResultsCount] = useState(0);

  const [searchPageProductCount, setSearchPageProductCount] = useState(0);

  const [lForage, setLForage] = useState(null);

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
    getSearchResults(search_string);
  };

  const getSearchResults = async (query) => {
    try {
      const recentLS = await getRecentSearch();
      const recent = recentLS && Array.isArray(recentLS) ? recentLS : [];

      const results =
        query === ""
          ? recent
          : recent
              .filter((i) => i.includes(query))
              .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

      setRecentResults(results);

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
    } catch (error) {
      console.error(error);
    }
  };

  const redirectToSearchPage = () => {
    router.push(`${BASE_URL}/search?query=${searchQuery}`);
  };

  const getRecentSearch = async () => {
    try {
      return await lForage.getItem(recentSearchKey);
    } catch (error) {
      console.log("[LocalForage] getRecentSearch error:", error);
      return null;
    }
  };

  const setRecentSearch = async (value) => {
    try {
      await lForage.setItem(recentSearchKey, value);
    } catch (error) {
      console.log("[LocalForage] setRecentSearch error:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/app/lib/localForage")
        .then((module) => {
          setLForage(module);
          // set initial recent serach value
          setRecentResults((prev) => {
            const recentLS = module.getItem(recentSearchKey);
            if (recentLS) {
              return Array.isArray(recentLS) ? recentLS : [];
            } else {
              return [];
            }
          });
        })
        .catch((error) => {
          console.error("Error loading localForage module:", error);
        });
    }
  }, []);

  // set url query string on the input if location =/search
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (pathname === "/search" && urlQuery) {
        setSearch(urlQuery);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    console.log("recentResults: ", recentResults);
  }, [recentResults]);

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
        recentSearchKey,
        setSearch,
        setSearchPageProductCount,
        setMainIsActive,
        redirectToSearchPage,
        getRecentSearch,
        setRecentSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
