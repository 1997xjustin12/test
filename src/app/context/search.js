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
import {
  BASE_URL,
  exclude_brands,
  exclude_collections,
} from "@/app/lib/helpers";

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
  const [suggestionResults, setSuggestionResults] = useState([]);

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

  const [popularSearches, setPopularSearches] = useState([]);
  const [popularResults, setPopularResults] = useState([]);

  const addPopularSearches = async (query) => {
    try {
      const res = await fetch("/api/add_popular_searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ term: query }),
      });

      const data = await res.json();
      console.log("Response:", data);
    } catch (err) {
      console.log("[ERROR] Add Popular Searches");
    }
  };
  // original
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
                  {
                    terms: {
                      "collections.name.keyword": exclude_collections,
                    },
                  },
                ],
              },
            },
            size: 15,
            suggest: {
              did_you_mean: {
                text: trim_query,
                phrase: {
                  field: "title",
                  size: 1,
                  confidence: 0.9,
                  max_errors: 1.5,
                  real_word_error_likelihood: 0.95,
                  direct_generator: [
                    {
                      field: "title",
                      suggest_mode: "always",
                      min_word_length: 3,
                    },
                  ],
                  collate: {
                    query: {
                      source: {
                        multi_match: {
                          query: "{{suggestion}}",
                          fields: ["title", "brand", "collections.name"],
                        },
                      },
                    },
                  },
                },
              },
            },
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
      console.log("data", data);
      const formatted_results = data?.hits?.hits?.map(({ _source }) => _source);
      const result_total_count = data?.hits?.total?.value;
      const dym = data?.suggest?.did_you_mean?.[0];
      const suggest_options = dym?.options;
      console.log("suggest_options", suggest_options);
      setProductResult(formatted_results);
      setSuggestionResults(trim_query.length > 2? suggest_options:[]);
      setProductResultsCount(result_total_count);
      return data;
    } catch (err) {
      console.error("[SHOPIFY SEARCH] Failed to fetch products:", err);
      return null;
    }
  };

  // new
  // const fetchProducts = async (query_string) => {
  //   const trim_query = query_string.trim();

  //   // 1. Build the main Elasticsearch query object
  //   const rawQuery = trim_query
  //     ? {
  //         query: {
  //           bool: {
  //             filter: [],
  //             must: {
  //               bool: {
  //                 should: [
  //                   // ... Your existing multi_match queries here ...
  //                   {
  //                     bool: {
  //                       should: [
  //                         {
  //                           multi_match: {
  //                             query: trim_query,
  //                             fields: ["title^3", "brand^2", "description"],
  //                             fuzziness: "AUTO:4,8",
  //                           },
  //                         },
  //                         {
  //                           multi_match: {
  //                             query: trim_query,
  //                             fields: ["title^1.5", "brand^1", "description"],
  //                             type: "bool_prefix",
  //                           },
  //                         },
  //                       ],
  //                     },
  //                   },
  //                   {
  //                     multi_match: {
  //                       query: trim_query,
  //                       type: "phrase",
  //                       fields: ["title^6", "brand^4", "description"],
  //                     },
  //                   },
  //                 ],
  //               },
  //             },
  //             must_not: [
  //               { terms: { "brand.keyword": exclude_brands } },
  //               { terms: { "collections.name.keyword": exclude_collections } },
  //             ],
  //           },
  //         },
  //         size: 15,
  //       }
  //     : {
  //         query: { match_all: {} },
  //         size: 15,
  //       };

  //   // 2. 🛑 ADD THE SUGGESTER BLOCK HERE 🛑
  //   if (trim_query) {
  //     rawQuery.suggest = {
  //       did_you_mean: {
  //         // The key used to find the suggestion in the response
  //         text: trim_query,
  //         phrase: {
  //           field: "title.suggest", // IMPORTANT: Use the shingle-analyzed field
  //           size: 1,
  //           confidence: 1.0,
  //           collate: {
  //             query: {
  //               source: {
  //                 multi_match: {
  //                   query: "{{suggestion}}", // Template variable for the suggestion
  //                   fields: ["title", "brand", "description"],
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     };
  //   }
  //   // ------------------------------------

  //   try {
  //     const res = await fetch("/api/es/shopify/search", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(rawQuery),
  //     });

  //     if (!res.ok) throw new Error(`[SHOPIFY SEARCH] Failed: ${res.status}`);

  //     const data = await res.json();

  //     // 3. 🛑 EXTRACT AND LOG THE SUGGESTION DATA 🛑
  //     const suggestionData = data?.suggest?.did_you_mean?.[0]?.options?.[0];
  //     const correctedPhrase = suggestionData?.text;
  //     const totalHits = data?.hits?.total?.value;

  //     if (
  //       totalHits === 0 &&
  //       correctedPhrase &&
  //       correctedPhrase !== trim_query
  //     ) {
  //       console.log(
  //         `Suggestion found for "${trim_query}": Did you mean **${correctedPhrase}**?`
  //       );
  //     } else {
  //       console.log(`No correction needed or suggested for: ${trim_query}`);
  //     }
  //     // -----------------------------------------------

  //     const formatted_results = data?.hits?.hits?.map(({ _source }) => _source);
  //     // ... rest of your original success logic
  //     setProductResult(formatted_results);
  //     setProductResultsCount(totalHits);

  //     return { data, correctedPhrase }; // Return the corrected phrase to use in your UI
  //   } catch (err) {
  //     console.error("[SHOPIFY SEARCH] Failed to fetch products:", err);
  //     return null;
  //   }
  // };

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
              .filter((i) => i.term.toLowerCase().includes(query.toLowerCase()))
              .sort((a, b) => b.timestamp - a.timestamp);

      const popular_searches = popularSearches
        .filter((item) =>
          item?.term?.toLowerCase()?.includes(query?.toLowerCase())
        )
        .sort((a, b) => b.score - a.score)
        .map((item) => item?.term);

      setRecentResults(results);
      setPopularResults(popular_searches);

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

  const redirectToSearchPage = async () => {
    // set recentSearch and popularSearch
    const recent = await getRecentSearch();
    console.log("recent", recent);
    await setRecentSearch([
      { term: searchQuery, timestamp: Date.now() },
      ...recent,
    ]);
    await addPopularSearches(searchQuery);
    router.push(`${BASE_URL}/search?query=${searchQuery}`);
  };

  const getRecentSearch = async () => {
    try {
      return (await lForage.getItem(recentSearchKey)) || [];
    } catch (error) {
      console.log("[LocalForage] getRecentSearch error:", error);
      return null;
    }
  };

  const setRecentSearch = async (value) => {
    try {
      const new_value = dedupeRecents(value);
      await lForage.setItem(
        recentSearchKey,
        new_value.map((item) => ({ ...item, term: item?.term?.toLowerCase() }))
      );
    } catch (error) {
      console.log("[LocalForage] setRecentSearch error:", error);
    }
  };

  const dedupeRecents = (data) => {
    const map = new Map();

    data.forEach((item) => {
      const existing = map.get(item.term);
      if (!existing || item.timestamp > existing.timestamp) {
        map.set(item.term, item);
      }
    });

    return Array.from(map.values());
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/app/lib/localForage")
        .then(async (module) => {
          setLForage(module);
          // set initial recent serach value
          const recentLS = await module.getItem(recentSearchKey);
          // console.log("[recentLS]", recentLS);
          setRecentResults((prev) => {
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

    const fetchPopularSearches = async () => {
      fetch("/api/popular_searches")
        .then((res) => res.json())
        .then((data) => {
          setPopularSearches(data);
        })
        .catch((err) => console.error("Failed to fetch popular searches", err));
    };

    fetchPopularSearches();
  }, []);

  // set url query string on the input if location =/search
  useEffect(() => {
    const urlQuery = searchParams.get("query");
    if (pathname === "/search" && urlQuery) {
      setSearch(urlQuery);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // console.log("recentResults: ", recentResults);
  }, [recentResults]);

  const searchResults = useMemo(() => {
    if (!loading) {
      const newSearchResults = [
        {
          total: suggestionResults.length,
          prop: "suggestion",
          label: "Did you mean?",
          visible: true,
          data: suggestionResults,
          showExpand: suggestionResults.length > 3,
        },
        {
          total: recentResults.length,
          prop: "recent",
          label: "Recent",
          visible: true,
          data: recentResults,
          showExpand: recentResults.length > 3,
        },
        {
          total: popularResults?.length,
          prop: "popular",
          label: "Popular Searches",
          visible: true,
          data: popularResults || [],
          showExpand: popularResults?.length > 0,
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
    popularResults,
    categoryResults,
    brandResults,
    suggestionResults,
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
