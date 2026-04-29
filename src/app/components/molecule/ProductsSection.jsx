"use client";
import "@/app/search.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSolanaCategories } from "@/app/context/category";
import { useSearch } from "@/app/context/search";
import { usePathname } from "next/navigation";
// import SPProductCard from "@/app/components/atom/ProductCard"; // old product card
import SPProductCard from "@/app/components/new-design/ui/ProductCard"; // new product card
import ProductsSectionLoader from "@/app/components/new-design/sections/gallery/ProductsSectionLoader";

import {
  InstantSearch,
  Hits,
  RefinementList,
  Pagination,
  CurrentRefinements,
  Configure,
  DynamicWidgets,
  RangeInput,
  useQueryRules,
  SortBy,
  useInstantSearch,
  SearchBox,
  useStats,
  usePagination,
} from "react-instantsearch";
import Client from "@searchkit/instantsearch-client";
import Link from "next/link";
import Image from "next/image";
import {
  BaseNavKeys,
  ES_INDEX,
  getInitialUiStateFromUrl,
} from "@/app/lib/helpers";
import { priceBucketKeys, getActiveFacets } from "@/app/lib/filter-helper";

import { STORE_CONTACT } from "@/app/lib/store_constants";

const es_index = ES_INDEX;

const hitsPerPage = 30;

const searchClient = Client({
  url: `/api/es/searchkit`,
});

const sortPriceItems = (items) => {
  return [...items].sort(
    (a, b) =>
      priceBucketKeys.indexOf(a.value) - priceBucketKeys.indexOf(b.value),
  );
};

function DisplayedItems() {
  const { nbHits } = useStats();
  const { currentRefinement, nbPages } = usePagination();

  const perPage = hitsPerPage ?? 30;

  const start = nbHits === 0 ? 0 : currentRefinement * perPage + 1;
  const end = Math.min((currentRefinement + 1) * perPage, nbHits);

  if (nbHits === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No products found for this search.
      </p>
    );
  }

  return (
    <p className="text-sm text-neutral-500 dark:text-neutral-400">
      Showing{" "}
      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
        {start}–{end}
      </span>{" "}
      of{" "}
      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
        {nbHits.toLocaleString()} products
      </span>
    </p>
  );
}

const Panel = ({ header, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="panel p-2">
      <div className={`${expanded ? "" : "hidden"}`}>{children}</div>
    </div>
  );
};

const FilterGroup = ({ header, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    // border-gray-200 shadow border
    <div className="panel">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-[20px] justify-between px-4 py-2 border-t"
      >
        <h5 className=" font-semibold text-[13px] text-stone-800">{header}</h5>
        {expanded ? (
          // boxicons:chevron-up-filled
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="text-[#6e6e6e]"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m7.71 15.71l4.29-4.3l4.29 4.3l1.42-1.42L12 8.59l-5.71 5.7z"
            />
          </svg>
        ) : (
          // boxicons:chevron-down-filled
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className="text-[#6e6e6e]"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 15.41l5.71-5.7l-1.42-1.42l-4.29 4.3l-4.29-4.3l-1.42 1.42z"
            />
          </svg>
        )}
      </button>
      <div className={`pl-4 py-1 ${expanded ? "" : "hidden"}`}>{children}</div>
    </div>
  );
};

const QueryRulesBanner = () => {
  const { items } = useQueryRules({});
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="query-rules">
      {items.map((item, index) => (
        <div
          key={`query-rules-${index}-${item.objectID}`}
          className="query-rules__item"
        >
          <a href={item.url}>
            <b className="query-rules__item-title">{item.title}</b>
            <span className="query-rules__item-description">{item.body}</span>
          </a>
        </div>
      ))}
    </div>
  );
};

// Separate component to isolate product count updates from re-render cycles
const ProductCountUpdater = () => {
  const { results } = useInstantSearch();
  const { setSearchPageProductCount } = useSearch();
  const prevCountRef = useRef(null);
  const updateCountRef = useRef(0);

  useEffect(() => {
    const count = results?.nbHits || 0;
    updateCountRef.current++;

    // console.log(
    //   "[ProductCountUpdater] Update #",
    //   updateCountRef.current,
    //   "Count:",
    //   count,
    //   "Prev:",
    //   prevCountRef.current
    // );

    // Only update if count actually changed
    if (prevCountRef.current !== count) {
      prevCountRef.current = count;
      // console.log("[ProductCountUpdater] Setting count to:", count);
      setSearchPageProductCount(count);
    }

    // Alert if too many updates
    if (updateCountRef.current > 50) {
      console.error(
        "[ProductCountUpdater] TOO MANY UPDATES! Something is causing a loop.",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results?.nbHits]); // setSearchPageProductCount is stable from context

  return null;
};

const ScrollOnPaginate = ({ targetRef }) => {
  const { currentRefinement } = usePagination();
  const isReady = useRef(false);
  const currentRef = useRef(currentRefinement);
  const prevRefinement = useRef(null);

  // Track latest value on every render so the timeout can read the settled state
  currentRef.current = currentRefinement;

  // Wait 300ms after mount before enabling scroll, syncing to the settled value
  useEffect(() => {
    const id = setTimeout(() => {
      isReady.current = true;
      prevRefinement.current = currentRef.current;
    }, 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isReady.current || prevRefinement.current === null) return;
    const prev = prevRefinement.current;
    prevRefinement.current = currentRefinement;
    if (prev === currentRefinement) return;
    if (targetRef?.current) {
      const y =
        targetRef.current.getBoundingClientRect().top + window.scrollY - 105;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentRefinement]);

  return null;
};

const InnerUI = ({ category, page_details, onDataLoaded }) => {
  const { status, results } = useInstantSearch();
  const [loadHint, setLoadHint] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const hasLoadedResults = useRef(false);
  const productSectionRef = useRef(null);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  useEffect(() => {
    setLoadHint((prev) => {
      let result = prev;
      if (prev === "" && status === "loading") {
        result = "loading";
      }
      if (prev === "loading" && status === "idle") {
        result = "loading-idle";
      }
      return result;
    });
  }, [status]);

  useEffect(() => {
    if (loadHint === "") return; // no cycle started yet — don't prematurely hide skeleton
    const result = ["loading"].includes(loadHint);
    setFirstLoad(result);
    onDataLoaded(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadHint]); // onDataLoaded is stable from parent

  // Track when we've actually received results
  useEffect(() => {
    if (results && results.nbHits !== undefined) {
      hasLoadedResults.current = true;
    }
  }, [results]);

  const filters = getActiveFacets(page_details?.filter_type);

  // Only show "No Results" after a full search cycle (loading → idle) has completed
  const shouldShowNoResults =
    loadHint === "loading-idle" &&
    results?.nbHits === 0 &&
    status !== "loading";

  if (shouldShowNoResults) {
    return (
      <div className="container">
        <div className="pb-[100px] flex justify-center text-neutral-600 font-bold text-lg">
          No Results Found...
        </div>
      </div>
    );
  }

  if (!firstLoad) {
    return (
      <div className="container">
        <div className="search-panel flex pb-[50px] gap-[20px]">
          <div className="search-panel__filters  pfd-filter-section relative">
            <div className="border rounded-xl bg-white">
              <div className="text-sm font-semibold p-4">Filters</div>
              <CurrentRefinements />
              <DynamicWidgets facets={["*"]}>
                {filters
                  .filter(
                    (item) =>
                      !["price", "price_groups"].includes(item?.attribute),
                  )
                  .map((item) => (
                    <div
                      key={`filter-item-${item?.attribute}`}
                      className={`facet-wrapper facet_${item?.attribute}`}
                    >
                      <FilterGroup header={item?.label}>
                        {item?.attribute && (
                          <>
                            {item?.attribute !== "ratings" ? (
                              <RefinementList
                                attribute={item?.attribute}
                                searchable={item?.searchable}
                                {...(item?.transform
                                  ? { transformItems: item.transform }
                                  : {})}
                                showMore={item?.collapse ?? true}
                              />
                            ) : (
                              <RefinementList
                                attribute={item?.attribute}
                                searchable={item?.searchable}
                                classNames={{ labelText: "stars" }}
                                showMore={item?.collapse || false}
                              />
                            )}
                          </>
                        )}
                      </FilterGroup>
                    </div>
                  ))}

                <div>
                  <FilterGroup header={"Price"}>
                    <RefinementList
                      attribute={"price_groups"}
                      searchable={false}
                      showMore={false}
                      transformItems={sortPriceItems}
                    />
                  </FilterGroup>
                </div>
                <div>
                  <Panel>
                    <RangeInput attribute="price" />
                  </Panel>
                </div>
              </DynamicWidgets>
            </div>
            <div className="relative w-full aspect-w-3 aspect-h-4 mt-2">
              <Link
                href={`tel:${page_details?.contact_number || STORE_CONTACT}`}
                prefetch={false}
                className=""
              >
                <Image
                  src="/images/banner/sub-banner-image.webp"
                  alt={`Sub Banner Image`}
                  className="object-contain"
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  sizes="100vw"
                />
              </Link>
            </div>
          </div>
          <div
            ref={productSectionRef}
            className="search-panel__results pfd-product-section"
          >
            <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between mb-5">
              {!!isSearchPage && <DisplayedItems />}
              <SortBy
                items={[
                  { label: "Most Popular", value: `${es_index}_popular` },
                  { label: "Newest", value: `${es_index}_newest` },
                  {
                    label: "Price: Low to High",
                    value: `${es_index}_price_asc`,
                  },
                  {
                    label: "Price: High to Low",
                    value: `${es_index}_price_desc`,
                  },
                ]}
              />
            </div>
            <QueryRulesBanner />

            <ScrollOnPaginate targetRef={productSectionRef} />
            <Hits
              hitComponent={(props) => (
                <SPProductCard {...props} page_details={page_details} />
              )}
            />
            <Pagination />
          </div>
        </div>
      </div>
    );
  }
};

// desktop skeleton loader
const SkeletonLoader = () => {
  return (
    <div className="container mx-auto">
      <div className="w-full flex items-center justify-between mb-5">
        <div className="h-[28px] w-[150px] rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
        <div className="h-[28px] w-[200px] rounded  bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
      </div>
      <div className="search-panel flex pb-[50px]">
        <div className="search-panel__filters  pfd-filter-section pr-[10px]">
          <div className="my-5">
            <div className="my-3 h-[23px] w-[130px] rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
            <div className="h-[35px] w-full rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
            <div className="mt-[3px]">
              <ul className="flex flex-col gap-[2px]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <li
                    key={`checkbox-loader-list-${index}`}
                    className="border-b border-neutral-200 w-full h-[25px] flex items-center"
                  >
                    <div className="w-[16px] h-[16px] bg-neutral-200"></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="my-3 h-[23px] w-[130px] bg-neutral-200 rounded  bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
            <div className="flex justify-between">
              <div className="h-[23px] w-[75px] bg-neutral-200 rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
              <div className="h-[23px] w-[75px] bg-neutral-200 rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
              <div className="h-[23px] w-[30px] bg-neutral-200 rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="search-panel__results pfd-product-section">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 30 }).map((_, index) => (
              <div
                key={`product-loader-card-${index}`}
                className="bg-neutral-100 w-full h-[400px] rounded"
              />
            ))}
          </div>
          <div className="w-full flex gap-[20px] mt-[20px]">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`pagination-loader-btn-${index}`}
                className="bg-neutral-200 w-[40px] h-[30px] rounded bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Refresh = ({ search }) => {
  const { refresh, setUiState } = useInstantSearch();
  const prevSearchRef = useRef(null); // Start with null to allow initial load
  const hasInitialized = useRef(false);

  useEffect(() => {
    // On initial mount, always set the query (handles URL params on page load)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (search) {
        console.log("[Refresh] Initial load with query:", search);
        prevSearchRef.current = search;
        setUiState((prev) => ({
          ...prev,
          [es_index]: {
            ...prev[es_index],
            query: search,
          },
        }));
        refresh();
      }
      return;
    }

    // After initial mount, only update if search actually changed
    if (prevSearchRef.current === search) return;

    // console.log(
    //   "[Refresh] Search changed from",
    //   prevSearchRef.current,
    //   "to",
    //   search,
    // );
    prevSearchRef.current = search;

    setUiState((prev) => ({
      ...prev,
      [es_index]: {
        ...prev[es_index],
        query: search,
      },
    }));
    refresh();
  }, [search, setUiState, refresh]);

  return null;
};

export function URLHandler() {
  const { results, indexUiState, setUiState } = useInstantSearch();
  const isSearchPage =
    typeof window !== "undefined" && window.location.pathname === "/search";

  function deleteParamsWithPrefix(prefix, params) {
    const keysToDelete = [];
    for (const [key] of params.entries()) {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => params.delete(key));
    return params;
  }

  function setParams(type, value, params) {
    if (type === "filter") {
      const keys = Object.keys(value);
      params = deleteParamsWithPrefix("filter:", params);
      keys.forEach((v, i) => {
        params.set(`filter:${v}`, value?.[v]);
      });
    }

    if (type === "range") {
      const keys = Object.keys(value);
      params = deleteParamsWithPrefix("range:", params);
      keys.forEach((v, i) => {
        params.set(`range:${v}`, value?.[v]);
      });
    }

    if (type === "sort" && value) {
      const sort_val = value.replace(`${es_index}_`, "");
      params.set(`sort`, sort_val);
    }

    if (type === "page" && value) {
      params.set("page", value);
    }

    return params;
  }

  useEffect(() => {
    if (results) {
      let url = new URL(window.location.href);
      const { refinementList, sortBy, range, page } = indexUiState;
      let params = url.searchParams;

      if (refinementList) {
        params = setParams("filter", refinementList, params);
      } else {
        params = deleteParamsWithPrefix("filter:", params);
      }

      if (range) {
        params = setParams("range", range, params);
      } else {
        params = deleteParamsWithPrefix("range:", params);
      }

      if (sortBy) {
        params = setParams("sort", sortBy, params);
      } else {
        params = deleteParamsWithPrefix("sort", params);
      }

      if (page) {
        params = setParams("page", page, params);
      } else {
        params = deleteParamsWithPrefix("page", params);
      }

      const stringParams = params.toString();
      const newUrl = `${url.origin}${url.pathname}${
        stringParams ? `?${stringParams}` : ""
      }`;
      // console.log("[URLHandler] Updating URL:", newUrl);
      window.history.replaceState({}, "", newUrl);
    }
  }, [indexUiState, results, isSearchPage]);

  return null;
}

function ProductsSection({ category, search = "" }) {
  // search is assigned only on search page
  const url = typeof window !== "undefined" ? window.location.href : null;
  const { categories, flatCategories } = useSolanaCategories();
  const [pageDetails, setPageDetails] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [filterString, setFilterString] = useState("");

  function getCategory1Deails(category) {
    const cat = categories.find(({ slug }) => slug === category);
    console.log("category", category);
    console.log("categories", categories);
    console.log("cat", cat);
    return cat;
  }

  useEffect(() => {
    if (category) {
      const details = flatCategories.find(({ url }) => url === category);
      const use_details = details || getCategory1Deails(category);

      if (use_details) {
        setPageDetails(use_details);

        // Calculate filter string
        let result = "";
        if (use_details?.nav_type === "category") {
          result = `page_category:${use_details?.origin_name}${":" + use_details.filter_type}`;
        } else if (use_details?.nav_type === "brand") {
          result = `page_brand:${use_details?.origin_name}${":" + use_details.filter_type}`;
        } else if (use_details?.nav_type === "custom_page") {
          if (use_details?.name === "Search") {
            result = `custom_page:Search:Search`;
          } else {
            const page_name = use_details?.name;
            if (BaseNavKeys.includes(page_name)) {
              result = `custom_page:${page_name}:${use_details.filter_type}`;
            } else {
              result = `custom_page:${
                use_details?.collection_display?.name || "NA"
              }:${use_details.filter_type}`;
            }
          }
        } else if (use_details?.nav_type === "category1") {
          result = `page_category1:${use_details?.name}${":" + use_details.filter_type}`;
        }

        // console.log("filterString", result);
        // console.log(
        //   "page collection",
        //   details?.collection_display?.name || "NA",
        // );

        // Only update if value changed (prevents unnecessary re-renders)
        setFilterString((prev) => (prev !== result ? result : prev));
      } else {
        setPageDetails(null);
        setFilterString((prev) => (prev !== "" ? "" : prev));
      }
    }
  }, [category, flatCategories]);

  const initialUiState = getInitialUiStateFromUrl(url);

  return (
    <>
      <div
        className={`${firstLoad ? "w-full" : "hidden"}`}
      >
        <ProductsSectionLoader />
      </div>

      <div
        className={`${!firstLoad ? "max-w-7xl mx-auto w-full px-4 sm:px-6" : "hidden"}`}
      >
        <div className="mt-5">
          <InstantSearch
            indexName={es_index}
            searchClient={searchClient}
            initialUiState={initialUiState}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <URLHandler />
            <ProductCountUpdater />
            <SearchBox className="hidden-main-search-input hidden" />
            <Refresh search={search} />
            {/* <HitsPerPage /> */}
            {filterString ? (
              <Configure hitsPerPage={hitsPerPage} filter={filterString} />
            ) : (
              <Configure hitsPerPage={hitsPerPage} />
            )}
            {/*  hack to make initialUiState work*/}
            <Pagination className="hidden" />

            <SortBy
              className="hidden"
              items={[
                { label: "Most Popular", value: `${es_index}_popular` },
                { label: "Newest", value: `${es_index}_newest` },
                { label: "Price: Low to High", value: `${es_index}_price_asc` },
                {
                  label: "Price: High to Low",
                  value: `${es_index}_price_desc`,
                },
              ]}
            />
            <RangeInput attribute="price" className="hidden" />
            {/* Refinement List Hack for URL-Based Filter */}
            <RefinementList attribute="ways_to_shop" className="hidden" />
            <RefinementList attribute="ratings" className="hidden" />
            <RefinementList attribute="brands" className="hidden" />
            <RefinementList attribute="product_category" className="hidden" />
            <RefinementList attribute="price_groups" className="hidden" />
            <RefinementList attribute="material" className="hidden" />
            <RefinementList attribute="ref_is_commercial" className="hidden" />
            <RefinementList attribute="ref_color" className="hidden" />
            <RefinementList attribute="ref_class" className="hidden" />
            <RefinementList attribute="ref_depth" className="hidden" />
            <RefinementList attribute="ref_depth_group_1" className="hidden" />
            <RefinementList attribute="ref_height" className="hidden" />
            <RefinementList attribute="ref_height_group_1" className="hidden" />
            <RefinementList attribute="ref_height_group_2" className="hidden" />
            <RefinementList attribute="ref_width_tmp" className="hidden" />
            <RefinementList attribute="ref_width" className="hidden" />
            <RefinementList attribute="ref_width_group_1" className="hidden" />
            <RefinementList attribute="ref_door_type" className="hidden" />
            <RefinementList attribute="ref_drain_type" className="hidden" />
            <RefinementList attribute="ref_hinge" className="hidden" />
            <RefinementList attribute="ref_ice_cube_type" className="hidden" />
            <RefinementList
              attribute="ref_ice_daily_output"
              className="hidden"
            />
            <RefinementList
              attribute="ref_ice_daily_output_group_1"
              className="hidden"
            />
            <RefinementList
              attribute="ref_ice_storage_capacity_raw"
              className="hidden"
            />
            <RefinementList
              attribute="ref_ice_storage_capacity"
              className="hidden"
            />
            <RefinementList attribute="ref_glass_door" className="hidden" />
            <RefinementList attribute="ref_max_keg_size" className="hidden" />
            <RefinementList attribute="ref_mounting_type" className="hidden" />
            <RefinementList attribute="ref_no_of_taps" className="hidden" />
            <RefinementList
              attribute="ref_outdoor_certification"
              className="hidden"
            />
            <RefinementList attribute="ref_capacity" className="hidden" />
            <RefinementList
              attribute="ref_capacity_group_1"
              className="hidden"
            />
            <RefinementList attribute="ref_vent" className="hidden" />
            <RefinementList
              attribute="ref_wine_bottle_capacity"
              className="hidden"
            />
            <RefinementList attribute="ref_with_lock" className="hidden" />
            <RefinementList attribute="ref_no_of_zones" className="hidden" />
            <RefinementList attribute="ref_outdoor_rated" className="hidden" />
            <RefinementList attribute="ref_type" className="hidden" />
            <RefinementList attribute="frplc_mount_type" className="hidden" />
            <RefinementList attribute="frplc_fuel_type" className="hidden" />
            <RefinementList attribute="frplc_vent_type" className="hidden" />
            <RefinementList attribute="frplc_view_type" className="hidden" />
            <RefinementList
              attribute="frplc_firebox_width"
              className="hidden"
            />
            <RefinementList
              attribute="frplc_adj_thermostat"
              className="hidden"
            />
            <RefinementList attribute="frplc_style" className="hidden" />
            <RefinementList attribute="frplc_color" className="hidden" />
            <RefinementList attribute="frplc_view_area" className="hidden" />
            <RefinementList
              attribute="frplc_ember_bed_depth"
              className="hidden"
            />
            <RefinementList
              attribute="frplc_frame_dimension"
              className="hidden"
            />
            <RefinementList
              attribute="frplc_sur_dimension"
              className="hidden"
            />
            <RefinementList
              attribute="frplc_sur_width_range"
              className="hidden"
            />
            <RefinementList attribute="frplc_size" className="hidden" />
            <RefinementList attribute="frplc_size_range" className="hidden" />
            <RefinementList attribute="frplc_btus" className="hidden" />
            <RefinementList attribute="frplc_btu_range" className="hidden" />
            <RefinementList attribute="frplc_heating_area" className="hidden" />
            <RefinementList attribute="frplc_type" className="hidden" />
            <RefinementList attribute="frplc_color" className="hidden" />
            <RefinementList attribute="frplc_material" className="hidden" />
            <RefinementList attribute="frplc_line_loc" className="hidden" />
            <RefinementList
              attribute="frplc_recess_option"
              className="hidden"
            />
            <RefinementList attribute="frplc_model" className="hidden" />
            <RefinementList attribute="frplc_voltage" className="hidden" />
            <RefinementList attribute="heater_fuel_type" className="hidden" />
            <RefinementList attribute="heater_mount_type" className="hidden" />
            <RefinementList attribute="heater_series" className="hidden" />
            <RefinementList attribute="heater_decor" className="hidden" />
            <RefinementList attribute="heater_finish" className="hidden" />
            <RefinementList attribute="heater_watts" className="hidden" />
            <RefinementList attribute="heater_grade" className="hidden" />
            <RefinementList
              attribute="heater_marine_grade"
              className="hidden"
            />
            <RefinementList attribute="heater_features" className="hidden" />
            <RefinementList attribute="heater_btu" className="hidden" />
            <RefinementList attribute="heater_btu_range" className="hidden" />
            <RefinementList attribute="heater_heat_area" className="hidden" />
            <RefinementList attribute="heater_voltage" className="hidden" />
            <RefinementList attribute="heater_size" className="hidden" />
            <RefinementList attribute="heater_type" className="hidden" />
            <RefinementList attribute="heater_elements" className="hidden" />
            <RefinementList
              attribute="grill_overall_dimensions"
              className="hidden"
            />
            <RefinementList
              attribute="grill_cutout_dimensions"
              className="hidden"
            />
            <RefinementList
              attribute="grill_cooking_grid_dimensions"
              className="hidden"
            />
            <RefinementList
              attribute="grill_shipping_dimensions"
              className="hidden"
            />
            <RefinementList
              attribute="grill_shipping_weight"
              className="hidden"
            />
            <RefinementList
              attribute="grill_product_weight"
              className="hidden"
            />
            <RefinementList
              attribute="grill_main_grill_area"
              className="hidden"
            />
            <RefinementList
              attribute="grill_second_grill_area"
              className="hidden"
            />
            <RefinementList
              attribute="grill_total_grill_area"
              className="hidden"
            />
            <RefinementList attribute="grill_main_burner" className="hidden" />
            <RefinementList
              attribute="grill_total_surface_btu"
              className="hidden"
            />
            <RefinementList
              attribute="grill_single_burner_btus"
              className="hidden"
            />
            <RefinementList
              attribute="grill_storage_no_of_doors"
              className="hidden"
            />
            <RefinementList
              attribute="grill_storage_cutout_width"
              className="hidden"
            />
            <RefinementList
              attribute="grill_storage_cutout_depth"
              className="hidden"
            />
            <RefinementList
              attribute="grill_storage_cutout_height"
              className="hidden"
            />
            <RefinementList
              attribute="grill_sideburner_burners"
              className="hidden"
            />
            <RefinementList
              attribute="grill_storage_drawers"
              className="hidden"
            />
            <RefinementList attribute="grill_material" className="hidden" />
            <RefinementList attribute="grill_fuel_type" className="hidden" />
            <RefinementList attribute="grill_series" className="hidden" />
            <RefinementList
              attribute="grill_storage_config"
              className="hidden"
            />
            <RefinementList attribute="grill_lights" className="hidden" />
            <RefinementList
              attribute="grill_rear_infra_burner"
              className="hidden"
            />
            <RefinementList
              attribute="grill_rear_infra_burner_btu"
              className="hidden"
            />
            <RefinementList
              attribute="grill_rotisserie_kit"
              className="hidden"
            />
            <RefinementList attribute="grill_thermometer" className="hidden" />
            <RefinementList attribute="grill_storage_type" className="hidden" />
            <RefinementList
              attribute="grill_storage_orientation"
              className="hidden"
            />
            <RefinementList
              attribute="grill_sideburner_type"
              className="hidden"
            />
            <RefinementList
              attribute="grill_sideburner_config"
              className="hidden"
            />
            <RefinementList
              attribute="grill_sideburner_fuel_type"
              className="hidden"
            />
            <RefinementList attribute="grill_size" className="hidden" />
            <RefinementList attribute="grill_size_range" className="hidden" />
            <RefinementList attribute="grill_item_type" className="hidden" />
            <RefinementList attribute="grill_class" className="hidden" />
            <RefinementList attribute="grill_controller" className="hidden" />
            <RefinementList attribute="grill_width" className="hidden" />
            <RefinementList attribute="grill_height" className="hidden" />
            <RefinementList attribute="grill_depth" className="hidden" />
            <RefinementList attribute="grill_kamado_width" className="hidden" />
            <RefinementList attribute="grill_side_shelve" className="hidden" />
            <RefinementList
              attribute="grill_configuration"
              className="hidden"
            />
            <RefinementList
              attribute="grill_primary_color"
              className="hidden"
            />
            <RefinementList attribute="grill_on_wheel" className="hidden" />
            <RefinementList attribute="grill_no_of_racks" className="hidden" />
            <RefinementList attribute="storage_type" className="hidden" />
            <RefinementList
              attribute="storage_no_of_doors"
              className="hidden"
            />
            <RefinementList
              attribute="storage_no_of_drawers"
              className="hidden"
            />
            <RefinementList
              attribute="storage_mounting_type"
              className="hidden"
            />
            <RefinementList
              attribute="storage_orientation"
              className="hidden"
            />
            <RefinementList attribute="storage_material" className="hidden" />
            <RefinementList attribute="storage_series" className="hidden" />
            <RefinementList
              attribute="storage_sink_center_type"
              className="hidden"
            />
            <RefinementList
              attribute="storage_sink_center_configuration"
              className="hidden"
            />
            <RefinementList
              attribute="storage_cutout_width"
              className="hidden"
            />
            <RefinementList
              attribute="storage_cutout_width_range"
              className="hidden"
            />
            <RefinementList
              attribute="storage_cutout_height"
              className="hidden"
            />
            <RefinementList
              attribute="storage_cutout_height_range"
              className="hidden"
            />
            <RefinementList
              attribute="storage_cutout_depth"
              className="hidden"
            />
            <RefinementList
              attribute="storage_cutout_depth_range"
              className="hidden"
            />
            <RefinementList attribute="storage_class" className="hidden" />
            <RefinementList attribute="storage_hinge_type" className="hidden" />
            <RefinementList attribute="storage_width" className="hidden" />
            <RefinementList
              attribute="storage_configuration"
              className="hidden"
            />
            <RefinementList attribute="storage_collection" className="hidden" />
            <RefinementList
              attribute="storage_door_drawer_combo"
              className="hidden"
            />
            <RefinementList
              attribute="storage_includes_paper_towel_holder"
              className="hidden"
            />
            <RefinementList
              attribute="storage_includes_tank_holder"
              className="hidden"
            />
            <RefinementList
              attribute="storage_includes_trash_bin"
              className="hidden"
            />
            <RefinementList attribute="storage_color" className="hidden" />
            <RefinementList attribute="storage_style" className="hidden" />
            <RefinementList
              attribute="storage_extra_features"
              className="hidden"
            />
            <InnerUI
              category={category}
              page_details={pageDetails}
              onDataLoaded={setFirstLoad}
            />
          </InstantSearch>
        </div>
      </div>
    </>
  );
}

export default ProductsSection;
