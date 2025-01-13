"use client";

import { useState, useEffect } from "react";
import useFetchProducts from "../../hooks/useFetchProducts";
import TuiFilterSort from "../template/tui_filter_sort";
import { getCategoryIds } from "@/app/lib/helpers";
import cat_json from "../../data/category.json";
import bccat_json from "../../data/bc_categories_20241213.json";
import { useMediaQuery } from "react-responsive";
import { flatCategories } from "@/app/lib/category-helpers";
const ProductsSection = ({ category }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const onloadParams = {
    include: "images",
    page: 1,
    limit: isMobile ? 4 : 10,
    "categories:in": getCategoryIds(category, flatCategories, bccat_json).join(
      ","
    ),
    sort: "total_sold",
    direction: "desc",
  };
  const [productsParams, setProductsParams] = useState(onloadParams);
  const {
    products,
    loading: products_loading,
    pagination,
    filters,
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
    // console.log("products loading: ",products_loading);
  }, [products_loading]);

  useEffect(() => {
    console.log("triggerProductFetching");
    productsRefetch(productsParams);
  }, [productsParams]);

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
    const filtersArray = transformObjectToArray(e);
    const selectedFiltersArray = filtersArray.filter((i) => i.is_checked);
    const filterObjParams = {};

    selectedFiltersArray.forEach((v, i) => {
      const tmp = v.prop.split(":");
      if (tmp.length > 1) {
        if (tmp[0] === "price") {
          const range = tmp[1].split("-");
          filterObjParams["price:min"] = range[0];
          filterObjParams["price:max"] = range[1];
        }
      } else {
        // if root filter checkbox
      }
    });
    setProductsParams((prev) => ({ ...prev, ...filterObjParams }));
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
