"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import useFetchProducts from "@/app/hooks/useFetchProducts";
import { solana_categories } from "../lib/category-helpers";

const main_categories = solana_categories
  .filter((i) => i.searchable === true)
  .map((i) => ({ ...i, name: i.name, url: i.menu.href }));
const sub_categories = main_categories
  .reduce((acc, cur) => [...acc, ...cur.links], [])
  .reduce((acc, cur) => [...acc, ...cur], []);
const children_categories = sub_categories.flatMap((i) => i.children);
const brands = solana_categories
  .filter((i) => i.name.toLowerCase() === "brands")
  .map((i) => ({ ...i, name: i.name, url: i.menu.href }))
  .reduce((acc, cur) => [...acc, ...cur.links], [])
  .reduce((acc, cur) => [...acc, ...cur], [])
  .flatMap((i) => i.children)
  .sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  console.log("brands", brands);

const SearchContext = createContext();
export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mainIsActive, setMainIsActive] = useState(false);
  const oldSearchResults = useRef([
    {
      prop: "recent",
      label: "Recent",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      prop: "product",
      label: "Product",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
      prop: "category",
      label: "Catagory",
      visible: true,
      data: [],
      showExpand: false,
      expanded: false,
    },
    {
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
  const [brandResults, setBrandResults] = useState(brands);
  const {
    products: productResults,
    loading,
    refetch: refetchProducts,
  } = useFetchProducts({
    include: "images",
  });

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
    console.log("setSearchFromContext", search_string);
    setSearchQuery(search_string);
    refetchProducts((prev) => {
      if (search_string === "") {
        return { include: "images" };
      } else {
        return { keyword: search_string, include: "images" };
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
          ...main_categories,
          ...sub_categories,
          ...children_categories,
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
        return brands;
      } else {
        return brands.filter((i) => i.name.toLowerCase().includes(query));
      }
    });
  };

  const searchResults = useMemo(() => {
    if (!loading) {
      const newSearchResults = [
        {
          prop: "recent",
          label: "Recent",
          visible: true,
          data: recentResults,
          showExpand: recentResults.length > 3,
        },
        {
          prop: "product",
          label: "Product",
          visible: true,
          data: productResults,
          showExpand: productResults.length > 0,
        },
        {
          prop: "category",
          label: "Catagory",
          visible: true,
          data: categoryResults,
          showExpand: categoryResults.length > 0,
        },
        {
          prop: "brand",
          label: "Brand",
          visible: true,
          data: brandResults,
          showExpand: brandResults.length > 0,
        },
      ];
      oldSearchResults.current = newSearchResults;
      return newSearchResults;
    } else {
      return oldSearchResults.current;
    }
  }, [recentResults, productResults, categoryResults, brandResults, loading]);
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearch,
        loading,
        mainIsActive,
        searchResults,
        setMainIsActive,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
