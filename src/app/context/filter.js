"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { filter_price_range } from "@/app/lib/helpers";
import brands_json from "@/app/data/filters/brands.json";
import products_json from "@/app/data/filters/products.json";

const brands = brands_json;
const products = products_json;
const price_ranges = filter_price_range;
const FilterContext = createContext();
// const filters = {
//   onsale: {
//     label: "On Sale",
//     prop: "onsale",
//     count: 0,
//     is_checked: false,
//     options: [],
//   },
//   free_shipping: {
//     label: "Free Shipping",
//     prop: "free_shipping",
//     count: 0,
//     is_checked: active_is_free_shipping ? true : false,
//     options: [],
//   },
//   brand: {
//     label: "Brands",
//     prop: "brand",
//     count: 0,
//     is_checked: false,
//     multi: true,
//     options: brandsList
//       .filter((brand) => availableBrandIds.includes(brand.id))
//       .map((i) => ({
//         ...i,
//         label: i.name,
//         prop: `brand:${i.id}`,
//         count: productsList.filter((i2) => i2.brand_id === i.id).length,
//         is_checked: active_brands ? active_brands.includes(i.id) : false,
//       }))
//       .sort((a, b) => {
//         return a.name.localeCompare(b.name);
//       }),
//   },
//   price: {
//     label: "Price",
//     prop: "price",
//     count: 0,
//     is_checked: false,
//     multi: false,
//     options: [
//       {
//         label: "$1.00 - $99.00",
//         prop: "price:1-99",
//         count: productsList.filter((i) => i.price > 0 && i.price < 100)
//           .length,
//         is_checked: active_price_range === "price:1-99",
//       },
//       {
//         label: "$100.00 - $499.00",
//         prop: "price:100-499",
//         count: productsList.filter((i) => i.price > 99 && i.price < 500)
//           .length,
//         is_checked: active_price_range === "price:100-499",
//       },
//       {
//         label: "$500.00 - $999.00",
//         prop: "price:500-999",
//         count: productsList.filter((i) => i.price > 499 && i.price < 1000)
//           .length,
//         is_checked: active_price_range === "price:500-999",
//       },
//       {
//         label: "$1,000.00 - $2,499.00",
//         prop: "price:1000-2499",
//         count: productsList.filter((i) => i.price > 999 && i.price < 2500)
//           .length,
//         is_checked: active_price_range === "price:1000-2499",
//       },
//       {
//         label: "$2,500.00 - $4,999.00",
//         prop: "price:2500-4999",
//         count: productsList.filter((i) => i.price > 2499 && i.price < 5000)
//           .length,
//         is_checked: active_price_range === "price:2500-4999",
//       },
//       {
//         label: "$5,000.00 and UP",
//         prop: "price:5000-100000",
//         count: productsList.filter((i) => i.price > 4999 && i.price < 200000)
//           .length,
//         is_checked: active_price_range === "price:5000-100000",
//       },
//     ],
//   },
// };

export function FilterProvider({ children }) {
  // USESTATES --------------------------------------------------------------------
  const [baseQuery, setBaseQuery] = useState({});
  const [baseProducts, setBaseProducts] = useState([]);
  const [baseBrands, setBaseBrands] = useState([]);
  const [filters, setFilters] = useState([]);
  const [filterOrder, setFilterOrder] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  // FUNCTIONS --------------------------------------------------------------------
  const hasCommonValue = (array1, array2) => {
    return array1.some((value) => array2.includes(value));
  };

  // const testHasCommonValue = () => {
  //   const a1 = [1,2,3];
  //   const a2 = [6,4,5];
  //   console.log("hasCommonValue TEST START");
  //   console.log(`params: array1=${a1}, array2=${a2}`);
  //   console.log("hasCommonValue(a1,a2): ", hasCommonValue(a1,a2))
  //   console.log("hasCommonValue TEST END");
  // }

  // testHasCommonValue();

  // Add a filter if it doesn't exist already.
  const addFilter = (filter, single = false) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        return prev;
      }
      if(single){
        // price group falls here
        const group = filter.split(":")[0];
        const newFilter = prev.filter(i=> !i.includes(`${group}:`));// remove same values that falls on same group
        return [...newFilter, filter];
      }
      return [...prev, filter];
    });
  };

  // Optionally, add functions to remove or clear filters.
  const removeFilter = (filter) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  const createFiltersObject = (_filterOrder = []) => {
    // console.log("createFilterObject_filterOrder", _filterOrder);
    const defaultFilterOrder = ["free_shipping", "brand", "price"];
    const filledFilterOrder = [...new Set([..._filterOrder, ...defaultFilterOrder])];
    // console.log("filledFilterOrder", filledFilterOrder)
    let _baseProducts = baseProducts;
    let _filters = {
      free_shipping: {
        label: "Free Shipping",
        prop: "free_shipping",
        count: 0,
        is_checked: false,
        multi: false,
        options: [],
      },
      brand: {
        label: "Brands",
        prop: "brand",
        count: 0,
        is_checked: false,
        multi: true,
        options:[],
        // options: brandsList
        //   .filter((brand) => availableBrandIds.includes(brand.id))
        //   .map((i) => ({
        //     ...i,
        //     label: i.name,
        //     prop: `brand:${i.id}`,
        //     count: productsList.filter((i2) => i2.brand_id === i.id).length,
        //     is_checked: active_brands ? active_brands.includes(i.id) : false,
        //   }))
        //   .sort((a, b) => {
        //     return a.name.localeCompare(b.name);
        //   }),
      },
      price: {
        label: "Price",
        prop: "price",
        count: 0,
        is_checked: false,
        multi: false,
        options: [
          // {
          //   label: "$1.00 - $99.00",
          //   prop: "price:1-99",
          //   count: productsList.filter((i) => i.price > 0 && i.price < 100)
          //     .length,
          //   is_checked: active_price_range === "price:1-99",
          // },
          // {
          //   label: "$100.00 - $499.00",
          //   prop: "price:100-499",
          //   count: productsList.filter((i) => i.price > 99 && i.price < 500)
          //     .length,
          //   is_checked: active_price_range === "price:100-499",
          // },
          // {
          //   label: "$500.00 - $999.00",
          //   prop: "price:500-999",
          //   count: productsList.filter((i) => i.price > 499 && i.price < 1000)
          //     .length,
          //   is_checked: active_price_range === "price:500-999",
          // },
          // {
          //   label: "$1,000.00 - $2,499.00",
          //   prop: "price:1000-2499",
          //   count: productsList.filter((i) => i.price > 999 && i.price < 2500)
          //     .length,
          //   is_checked: active_price_range === "price:1000-2499",
          // },
          // {
          //   label: "$2,500.00 - $4,999.00",
          //   prop: "price:2500-4999",
          //   count: productsList.filter((i) => i.price > 2499 && i.price < 5000)
          //     .length,
          //   is_checked: active_price_range === "price:2500-4999",
          // },
          // {
          //   label: "$5,000.00 and UP",
          //   prop: "price:5000-100000",
          //   count: productsList.filter((i) => i.price > 4999 && i.price < 200000)
          //     .length,
          //   is_checked: active_price_range === "price:5000-100000",
          // },
        ],
      },
    };
    
    const activeBrands = activeFilters.filter(i=> i.includes("brand:")).map(i=> parseInt(i.split(":")[1]));
    const activePriceRange = activeFilters.filter(i=> i.includes("price:"));
    //  loop through filter order
    filledFilterOrder.forEach((item,index)=>{
      if(item==="brand"){
        // console.log("baseBrands", baseBrands);
        // console.log("brands", brands.filter((brand) => baseBrands.map(i=> parseInt(i.id)).includes(brand.id)))
        _filters["brand"]["options"] = brands
        .filter((brand) => baseBrands.map(i=> parseInt(i.id)).includes(brand.id))
        .map((i) => ({
          label: i.name,
          prop: `brand:${i.id}`,
          count: _baseProducts.filter((i2) => i2.brand_id === i.id).length,
          is_checked: activeBrands ? activeBrands.includes(i.id) : false,
        }))
        .sort((a, b) => {
          return a.label.localeCompare(b.label);
        });        
        if(activeBrands.length > 0){
          _baseProducts = _baseProducts.filter(i=> activeBrands.includes(i.brand_id));
        }else{
          _baseProducts = _baseProducts;
        }
        // console.log("_filters",_filters);
      }
      if(item==="price"){
        if(activePriceRange.length > 0){
          const range = activePriceRange[0].split(":")[1];
          const min = range.split("-")[0];
          const max = range.split("-")[1];
          _baseProducts = _baseProducts.filter(i=> i.price >= min && i.price <= max); 
        }else{
          _baseProducts = _baseProducts;
        }
      }

      // console.log(`item:${item}:`, _baseProducts);
    });

  }

  // USEEFFECTS -------------------------------------------------------------------

  // console checker only
  useEffect(() => {
  }, [baseQuery]);
  useEffect(() => {
    // get all brands related to this query
    if (Object.keys(baseQuery).length > 0) {
      // set a variable for base products based on categories value
      const baseCategories = baseQuery?.["categories"]
        .split(",")
        .map((value) => parseInt(value, 10)); // make sure this array has interger values
      const _baseProducts = products_json.filter((i) =>
        hasCommonValue(i.categories, baseCategories)
      );
      // console.log("_baseProducts", _baseProducts);
      setBaseProducts(_baseProducts);
      // set a variable for base brands based on _baseProducts
      const brandsList = [
        ...new Set(_baseProducts.map((product) => product.brand_id)),
      ];
      const _baseBrands = brands.filter((brand) =>
        brandsList.includes(brand.id)
      );
      // console.log("_baseBrands", _baseBrands);
      setBaseBrands(_baseBrands);
    }

    setFilterOrder((prev) => {
      const _filterOrder = prev;
      // add filter order item
      const afOrder = activeFilters.map((i) => {
        if (i.includes("brand:")) return "brand";
        if (i.includes("price:")) return "price";
        return i;
      });
      const mergedOrder = [...new Set([..._filterOrder, ...afOrder])];
      // remove filter order item
      let removeValues = [];
      if (activeFilters.filter((i) => i.includes("price:")).length === 0)
        removeValues.push("price");
      if (activeFilters.filter((i) => i.includes("brand:")).length === 0)
        removeValues.push("brand");
      if (
        activeFilters.filter((i) => i.includes("free_shipping")).length === 0
      )
        removeValues.push("free_shipping");
      const newOrder = mergedOrder.filter((i) => !removeValues.includes(i));
      createFiltersObject(newOrder)
      // console.log("newOrder", newOrder);
      return newOrder;
    });
  }, [activeFilters,baseQuery]);

  // USEMEMOS -------------------------------------------------------------------------
  // const fitlerGroupOrder = useMemo(()=>{
  //   const _filterGroupOrder = [...new Set(activeFilters.map(i => {
  //     if(i.includes("brand:")) return "brand";
  //     if(i.includes("price:")) return "price";
  //     return i;
  //   }))];
  //   console.log("_filterGroupOrder",_filterGroupOrder)
  //   return _filterGroupOrder;
  // },[activeFilters])

  return (
    <FilterContext.Provider
      value={{ addFilter, removeFilter, clearFilters, setBaseQuery }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Custom hook for easy usage of the FilterContext.
export function useFilter() {
  return useContext(FilterContext);
}
