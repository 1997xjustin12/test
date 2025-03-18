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
import { solana_categories, solana_brands, flatCategories, bc_categories } from "@/app/lib/category-helpers";
import { useRouter } from "next/navigation";
import { getCategoryIds } from "@/app/lib/helpers";
// useful console that logs keywords for all main categories
// console.log("solanaCategories", solana_categories.flatMap(i=> i.key_words))
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;


const SearchContext = createContext();
export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mainIsActive, setMainIsActive] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const oldSearchResults = useRef([
    {
      total:0,
      prop: "recent",
      label: "Recent",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      total:0,
      prop: "product",
      label: "Product",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      total:0,
      prop: "category",
      label: "Category",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      total:0,
      prop: "brand",
      label: "Brand",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
  ]);
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
    return solana_categories
      .filter((i) => i.searchable === true)
      .map((i) => ({ name: i.name, url: i.menu.href }));
  });
  const [brandResults, setBrandResults] = useState(solana_brands);

  const {
    products: productResults,
    loading,
    pagination:productPagination,
    refetch: refetchProducts,
  } = useESFetchProducts({sort:"name.keyword:asc"});

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
    const categoryIds = getCategoryIds(
      "search",
      flatCategories,
      bc_categories
    ).join(",");
    refetchProducts((prev) => {
      if (search_string === "") {
        return {sort:"name.keyword:asc", categories: categoryIds};
      } else {
        return { q: search_string, sort:"name.keyword:asc", categories: categoryIds};
      }
    });
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
        return solana_categories
          .filter((i) => i.searchable === true)
          .map((i) => ({ name: i.name, url: i.menu.href }))
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
      } else {
        const all_categories = [
          ...flatCategories,
        ].map((i) => ({ name: i.name, url: i.url ?? "#" }));
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
        return solana_brands.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      } else {
        return solana_brands.filter((i) => i.name.toLowerCase().includes(query)).sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });;
      }
    });
  };

  const redirectToSearchPage = () => {
    router.push(`${BASE_URL}/search?query=${searchQuery}`)
  }

  const searchResults = useMemo(() => {
    if (!loading) {
      const newSearchResults = [
        {
          total:recentResults.length,
          prop: "recent",
          label: "Recent",
          visible: true,
          data: recentResults,
          showExpand: recentResults.length > 3,
        },
        {
          total:productPagination?.total ?? 0,
          prop: "product",
          label: "Product",
          visible: true,
          data: productResults,
          showExpand: productResults.length > 0,
        },
        {
          total:categoryResults.length,
          prop: "category",
          label: "Category",
          visible: true,
          data: categoryResults,
          showExpand: categoryResults.length > 0,
        },
        {
          total:brandResults.length,
          prop: "brand",
          label: "Brand",
          visible: true,
          data: brandResults,
          showExpand: brandResults.length > 0,
        },
      ];
      oldSearchResults.current = newSearchResults;
      setNoResults(prev=>{
        return productResults.length === 0 && categoryResults.length === 0 &&  brandResults.length === 0;
      })
      return newSearchResults;
    } else {
      setNoResults(prev=>{
        return productResults.length === 0 && categoryResults.length === 0 &&  brandResults.length === 0;
      })
      return oldSearchResults.current;
    }
  }, [recentResults, productResults, categoryResults, brandResults, loading]);
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        loading,
        mainIsActive,
        searchResults,
        noResults,
        setSearch,
        setMainIsActive,
        redirectToSearchPage
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
