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

// Constants
const RECENT_SEARCH_KEY = "recent_searches";
const SEARCH_RESULT_SIZE = 15;
const MIN_SUGGESTION_LENGTH = 2;
const DEBOUNCE_DELAY = 300; // milliseconds

const SearchContext = createContext();
export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
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
  const oldSearchResults = useRef([]);
  const updateUrlTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  const [recentResults, setRecentResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);
  const [brandResults, setBrandResults] = useState([]);

  const [popularSearches, setPopularSearches] = useState([]);
  const [popularResults, setPopularResults] = useState([]);

  const updateURL = (query) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", query);
    const newUrl = `/search?${params.toString()}`;
    // console.log("newUrl", newUrl);
    window.history.pushState(null, "", newUrl);
  };

  const addPopularSearches = async (query) => {
    try {
      const res = await fetch("/api/add_popular_searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ term: query }),
      });

      await res.json();
    } catch (err) {
      console.error("[ERROR] Add Popular Searches:", err);
    }
  };

  // Elasticsearch query builder
  const buildSearchQuery = (trimmedQuery) => {
    if (!trimmedQuery) {
      return {
        query: { match_all: {} },
        size: SEARCH_RESULT_SIZE,
      };
    }

    return {
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
                          query: trimmedQuery,
                          fields: ["title^3", "brand^2", "description"],
                          fuzziness: "AUTO:4,8",
                        },
                      },
                      {
                        multi_match: {
                          query: trimmedQuery,
                          fields: ["title^1.5", "brand^1", "description"],
                          type: "bool_prefix",
                        },
                      },
                    ],
                  },
                },
                {
                  multi_match: {
                    query: trimmedQuery,
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
      size: SEARCH_RESULT_SIZE,
      suggest: {
        did_you_mean: {
          text: trimmedQuery,
          phrase: {
            field: "tags.text",
            size: 1,
            confidence: 0.5,
            max_errors: 5.0,
            real_word_error_likelihood: 0.4,
            smoothing: {
              stupid_backoff: {
                discount_threshold: 0.1,
              },
            },
            direct_generator: [
              {
                field: "tags.text",
                suggest_mode: "always",
                min_word_length: 2,
              },
            ],
            collate: {
              // 5. **Collation to confirm substring match**
              query: {
                source: {
                  multi_match: {
                    query: "{{suggestion}}",
                    type: "phrase", // Match the suggestion as a single phrase
                    fields: [
                      "tags.text", // Search the full, standard-analyzed title field
                    ],
                  },
                },
              },
              prune: true,
            },
            highlight: {
              pre_tag: "!",
              post_tag: "!",
            },
          },
        },
      },
    };
  };

  const fetchProducts = async (query_string) => {
    try {
      // Cancel previous fetch if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this fetch
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const trim_query = query_string.trim();
      const rawQuery = buildSearchQuery(trim_query);
      const res = await fetch("/api/es/shopify/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rawQuery),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error(`[SHOPIFY SEARCH] Failed: ${res.status}`);

      const data = await res.json();
      const formatted_results = data?.hits?.hits?.map(({ _source }) => _source);
      const result_total_count = data?.hits?.total?.value;
      const dym = data?.suggest?.did_you_mean?.[0];
      const suggest_options = dym?.options;

      setProductResult(formatted_results);
      setSuggestionResults(
        trim_query.length > MIN_SUGGESTION_LENGTH ? suggest_options : []
      );
      setProductResultsCount(result_total_count);
      return data;
    } catch (err) {
      // Don't log abort errors as they're expected when canceling
      if (err.name === "AbortError") {
        return null;
      }
      console.error("[SHOPIFY SEARCH] Failed to fetch products:", err);
      return null;
    }
  };

  // Helper function to sort items alphabetically
  const sortAlphabetically = (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };

  // Helper function to filter and format navigation items (categories/brands)
  const filterNavigationItems = (navType, query = "") => {
    const items = flatCategories
      .filter(({ name }) => !["Search", "Home"].includes(name))
      .filter((item) => {
        if (navType === "custom_page") {
          return item?.nav_type === navType && item?.collection_display;
        } else if (navType === "brand") {
          return (
            item?.nav_type === navType && !exclude_brands.includes(item?.name)
          );
        } else {
          return item?.nav_type === navType;
        }
      })
      .map((i) => ({
        name: i?.name || i?.title,
        url: i?.menu?.href || i?.url,
      }));

    if (query === "") {
      return items.sort(sortAlphabetically);
    }

    return items
      .filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
      .sort(sortAlphabetically);
  };

  const handleQuery = (search_string) => {
    // Update search query immediately for responsive UI
    setSearchQuery(search_string);

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the fetch calls to prevent excessive API calls
    debounceTimeoutRef.current = setTimeout(() => {
      fetchProducts(search_string);
      getSearchResults(search_string);
    }, DEBOUNCE_DELAY);
  };

  const setSearch = (search_string, shouldUpdateUrl = true) => {
    if (pathname === "/search" && shouldUpdateUrl) {
      updateURL(search_string);
    }

    handleQuery(search_string);
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
      const category_searches = filterNavigationItems("custom_page", query);
      const brand_searches = filterNavigationItems("brand", query);
      setRecentResults(results);
      setPopularResults(popular_searches);
      setCategoryResults(category_searches);
      setBrandResults(brand_searches);
      return {
        recent: results,
        popular: popular_searches,
        category: category_searches,
        brand: brand_searches,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const redirectToSearchPage = async () => {
    const recent = await getRecentSearch();
    await setRecentSearch([
      { term: searchQuery, timestamp: Date.now() },
      ...recent,
    ]);
    await addPopularSearches(searchQuery);
    router.push(`${BASE_URL}/search?query=${searchQuery}`);
  };

  const getRecentSearch = async () => {
    try {
      if (!lForage) return [];
      return (await lForage.getItem(RECENT_SEARCH_KEY)) || [];
    } catch (error) {
      console.error("[LocalForage] getRecentSearch error:", error);
      return [];
    }
  };

  const setRecentSearch = async (value) => {
    try {
      if (!lForage) return;
      const new_value = dedupeRecents(value);
      await lForage.setItem(
        RECENT_SEARCH_KEY,
        new_value.map((item) => ({ ...item, term: item?.term?.toLowerCase() }))
      );
    } catch (error) {
      console.error("[LocalForage] setRecentSearch error:", error);
    }
  };

  const dedupeRecents = (data) => {
    // Safety check: ensure data is an array
    if (!Array.isArray(data)) {
      return [];
    }

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
          const recentLS = await module.getItem(RECENT_SEARCH_KEY);
          setRecentResults(Array.isArray(recentLS) ? recentLS : []);
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
    if (pathname === "/search" && urlQuery && urlQuery !== searchQuery) {
      // Update state and fetch data without updating URL
      // (since we're already responding to a URL change)
      setSearch(urlQuery, false);
    }
  }, [pathname, searchParams]);

  // Cleanup timeouts and abort ongoing fetch on unmount
  useEffect(() => {
    return () => {
      if (updateUrlTimeoutRef.current) {
        clearTimeout(updateUrlTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Update noResults state when results change
  useEffect(() => {
    const hasNoResults =
      productResults?.length === 0 &&
      categoryResults.length === 0 &&
      brandResults.length === 0;
    setNoResults(hasNoResults);
  }, [productResults, categoryResults, brandResults]);

  const searchResults = useMemo(() => {
    const newSearchResults = [
      {
        total: suggestionResults.length,
        prop: "suggestion",
        label: "Did you mean",
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

    if (!loading) {
      oldSearchResults.current = newSearchResults;
    }

    return loading ? oldSearchResults.current : newSearchResults;
  }, [
    recentResults,
    productResults,
    popularResults,
    categoryResults,
    brandResults,
    suggestionResults,
    loading,
    searchPageProductCount,
    productResultsCount,
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
        recentSearchKey: RECENT_SEARCH_KEY,
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
