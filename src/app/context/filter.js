"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { filter_price_range, formatPrice } from "@/app/lib/helpers";

const price_ranges = filter_price_range;
const FilterContext = createContext();

export function FilterProvider({ children }) {
  // USESTATES --------------------------------------------------------------------
  const [baseQuery, setBaseQuery] = useState({});
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  // FUNCTIONS --------------------------------------------------------------------

  // Add a filter if it doesn't exist already.
  const addFilter = (filter, single = false) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        return prev;
      }
      if (single) {
        // price group falls here
        const group = filter.split(":")[0];
        const newFilter = prev.filter((i) => !i.includes(`${group}:`)); // remove same values that falls on same group
        return [...newFilter, filter];
      }
      return [...prev, filter];
    });
  };

  // Optionally, add functions to remove or clear filters.
  const removeFilter = (filter) => {
    setActiveFilters((prev) => {
      return prev.filter((f) => f !== filter);
    });
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const initFilters = (filters, query) => {
    if (!filters || !query) {
      return;
    }

    if (Object.keys(filters).length > 0) {
      setFilters((prev) => {
        if (!prev) {
          return {};
        }

        const free_shipping_filters = filters?.free_shipping;
        const brand_filters = filters?.brand;
        const price_filters = filters?.price;

        const free_shipping_query =
          query?.["is_free_shipping"] && query["is_free_shipping"] === 1;
        const brand_query = query?.["brand_id:in"]
          ? query["brand_id:in"].split(",").map(Number)
          : [];
        const price_query = query?.["price"] ? query["price"] : null;

        const brand_options = brand_filters?.buckets
          ? brand_filters?.buckets.map((brand) => {
              const [prop, brand_id] = brand.key.brand_key.split(":");
              const brand_is_checked = brand_query.includes(parseInt(brand_id));
              return {
                label: brand.key.brand_label,
                prop: brand.key.brand_key,
                count: brand.doc_count,
                is_checked: brand_is_checked ?? false,
              };
            }).sort((a, b) => a.label.localeCompare(b.label))
          : [];

        const price_options = price_filters?.buckets
          ? price_filters?.buckets.map((price, index) => {
              const [prop, range] = price?.key.split(":");
              const [min, max] = range.split("-");
              const price_is_checked = price_query
                ? price_query === range
                : false;
              return {
                label: index=== (price_filters.buckets.length -1) ? `$${formatPrice(min)} and UP`:`$${formatPrice(min)} - $${formatPrice(max)}`,
                prop: price?.key,
                count: price?.doc_count,
                is_checked: price_is_checked || false,
              };
            })
          : [];

        if (Object.keys(prev).length === 0) {
          return {
            free_shipping: {
              freeze: free_shipping_query ?? false,
              is_checked: free_shipping_query ?? false,
              label: "Free Shipping",
              prop: "free_shipping",
              count: free_shipping_filters?.doc_count ?? 0,
              multi: false,
              options: [],
            },
            brand: {
              freeze: brand_query.length > 0,
              is_checked: false,
              label: "Brands",
              prop: "brand",
              count: 0,
              multi: true,
              options: brand_options,
            },
            price: {
              freeze: price_query,
              is_checked: false,
              label: "Price",
              prop: "price",
              count: 0,
              multi: false,
              options: price_options,
            },
          };
        } else {
          if (!prev.free_shipping.freeze) {
            prev.free_shipping = {
              freeze: free_shipping_query ?? false,
              is_checked: free_shipping_query ?? false,
              label: "Free Shipping",
              prop: "free_shipping",
              count: free_shipping_filters?.doc_count ?? 0,
              multi: false,
              options: [],
            };
          }

          if (!prev.brand.freeze) {
            prev.brand = {
              freeze: brand_query.length > 0,
              is_checked: false,
              label: "Brands",
              prop: "brand",
              count: 0,
              multi: true,
              options: brand_options,
            };
          }

          if (!prev.price.freeze) {
            prev.price = {
              freeze: price_query,
              is_checked: false,
              label: "Price",
              prop: "price",
              count: 0,
              multi: false,
              options: price_options,
            };
          }
          return prev;
        }
      });
    }
  };

  useEffect(() => {
    // setting freeze state base on active filter changes
    const free_shipping = activeFilters.filter(i=> i.includes("free_shipping"));
    const brand = activeFilters.filter(i=> i.includes("brand:"));
    const price = activeFilters.filter(i=> i.includes("price:"));
    setFilters(prev=>{
      if(prev && Object.keys(prev).length > 0){
        prev.free_shipping.freeze = free_shipping.length > 0;
        prev.brand.freeze = brand.length > 0;
        prev.price.freeze = price.length > 0;
      }
      return prev;
    })
  }, [activeFilters]);
  return (
    <FilterContext.Provider
      value={{
        filters,
        addFilter,
        removeFilter,
        clearFilters,
        setBaseQuery,
        initFilters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook for easy usage of the FilterContext.
export function useFilter() {
  return useContext(FilterContext);
}
