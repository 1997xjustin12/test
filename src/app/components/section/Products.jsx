"use client";

import { useState, useEffect } from "react";
import useFetchProducts from "../../hooks/useFetchProducts";
import TuiFilterSort from "../template/tui_filter_sort";
import {
  getCategoryIds,
  getCategoryFilters,
  filter_price_range,
} from "@/app/lib/helpers";
import { bc_categories, flatCategories } from "@/app/lib/category-helpers";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "next/navigation";
const bccat_json = bc_categories;
const ProductsSection = ({ category }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const searchParams = useSearchParams();
  const [onloadParams, setOnloadParams] = useState(() => {
    const params = {
      include: "images",
      page: 1,
      limit: isMobile ? 4 : 10,
      "categories:in": getCategoryIds(
        category,
        flatCategories,
        bccat_json
      ).join(","),
      sort: "total_sold",
      direction: "desc",
    };
    // handle params for price range
    const priceParams = searchParams.get("price");
    if (priceParams && priceParams.split("-").length === 2) {
      // check if price range values are valid
      const tmp = priceParams.split("-");
      if (
        filter_price_range.filter(
          (i) => i.min === parseInt(tmp[0]) && i.max === parseInt(tmp[1])
        ).length > 0
      ) {
        params["price:min"] = tmp[0];
        params["price:max"] = tmp[1];
      }
    }

    return params;
  });

  const [filters, setFilters] = useState(getCategoryFilters(onloadParams));

  const [productsParams, setProductsParams] = useState(onloadParams);

  const {
    products,
    loading: products_loading,
    pagination,
    // filters,
    noResult,
    error: products_error,
    refetch: productsRefetch,
  } = useFetchProducts(productsParams);

  useEffect(() => {
    const limit = isMobile ? 4 : 10;
    setProductsParams((prev) => {
      const updateParams = {
        ...prev,
        limit: limit,
      };
      return updateParams;
    });
  }, [isMobile]);

  useEffect(() => {
    productsRefetch(productsParams);
  }, [productsParams, productsRefetch]);

  const handleSortChange = (option) => {
    setProductsParams((prev) => {
      const updateParams = {
        ...prev,
        sort: option.sort,
        direction: option.direction,
        page: 1,
      };
      return updateParams;
    });
  };

  const handlePageChange = (page) => {
    setProductsParams((prev) => {
      const updateParams = {
        ...prev,
        page: page,
      };
      return updateParams;
    });
  };

  const handleFilterChange = (e) => {
    // console.log("handleFilterChange", e);
    setProductsParams((prev) => {
      // insert root filter on filterArray
      const filtersArray = [
        e.onsale,
        e.free_shipping,
        ...transformObjectToArray(e),
      ];
      // console.log("onFilterChanges", filtersArray);
      const filterObjParams = prev;
      // -----------------------------------------------------------------
      // free shipping filtering
      const free_shipping_filter = filtersArray.find(
        ({ prop, is_checked }) => prop === "free_shipping" && is_checked
      );
      if (free_shipping_filter) {
        filterObjParams["is_free_shipping"] = 1;
      } else {
        delete filterObjParams["is_free_shipping"];
      }
      // -----------------------------------------------------------------
      // price filtering
      const price_filters = filtersArray.filter(({ prop }) =>
        prop.includes("price:")
      );
      if (price_filters.filter(({ is_checked }) => is_checked).length > 0) {
        // insert price and value to query
        const filtered = price_filters.find(({ is_checked }) => is_checked); // single select only
        const tmp = filtered.prop.split(":");
        // console.log("filtered_price", filtered);
        const range = tmp[1].split("-");
        filterObjParams["price:min"] = range[0];
        filterObjParams["price:max"] = range[1];
      } else {
        // remove price from query
        // console.log("remove price from request");
        delete filterObjParams["price:min"];
        delete filterObjParams["price:max"];
      }
      // -----------------------------------------------------------------
      // brand filtering
      const brand_filters = filtersArray.filter(({ prop }) =>
        prop.includes("brand:")
      );
      if (brand_filters.filter(({ is_checked }) => is_checked).length > 0) {
        // insert brand and value to query
        const filtered = brand_filters.filter(({ is_checked }) => is_checked); // multiselect
        filterObjParams["brand_id:in"] = filtered
          .map(({ prop }) => prop.split(":").pop())
          .join(",");
      } else {
        // remove brand from query
        // console.log("remove brand from request");
        delete filterObjParams["brand_id:in"];
      }
      // -----------------------------------------------------------------

      // console.log("newParams", filterObjParams);
      setFilters(getCategoryFilters(filterObjParams));
      return { ...filterObjParams };
    });
  };

  const transformObjectToArray = (obj) => {
    return Object.values(obj).flatMap((item) => {
      if (item.options) {
        return item.options;
      }
      return item;
    });
  };
  return (
    <div className="w-full">
      <div className="container mx-auto">
        {products && (
          <TuiFilterSort
            category={category}
            products={products}
            loading={products_loading}
            filters={filters}
            noResult={noResult}
            pagination={pagination}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsSection;
