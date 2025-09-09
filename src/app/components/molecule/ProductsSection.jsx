"use client";
import { useState, useEffect, useRef, use } from "react";
import { useSolanaCategories } from "@/app/context/category";
import { useSearch } from "@/app/context/search";
import SPProductCard from "@/app/components/atom/ProductCard";
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
} from "react-instantsearch";
import Client from "@searchkit/instantsearch-client";
import Link from "next/link";
import Image from "next/image";
import { BaseNavKeys, ES_INDEX } from "@/app/lib/helpers";

const es_index = ES_INDEX;

const filters = [
  {
    label: "brand",
    attribute: "brand",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills", "fireplaces", "firepits", "Search"],
  },
  {
    label: "configuration",
    attribute: "configuration_type",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "number of burners",
    attribute: "no_of_burners",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "price",
    attribute: "price",
    searchable: false,
    type: "RangeInput",
    filter_type: ["grills", "fireplaces", "firepits", "Search"],
  },
  {
    label: "lights",
    attribute: "grill_lights",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "size",
    attribute: "size",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Rear Infrared Burner",
    attribute: "rear_infrared_burner",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Cut-Out Width",
    attribute: "cut_out_width",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Cut-Out Depth",
    attribute: "cut_out_depth",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Cut-Out Height",
    attribute: "cut_out_height",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Made In USA",
    attribute: "made_in_usa",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills", "fireplaces", "firepits", "Search"],
  },
  {
    label: "Material",
    attribute: "material",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Thermometer",
    attribute: "thermometer",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Rotisserie Kit",
    attribute: "rotisserie_kit",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
  {
    label: "Gas Type",
    attribute: "gas_type",
    searchable: false,
    type: "RefinementList",
    filter_type: ["grills"],
  },
];

const searchClient = Client({
  url: `/api/es/searchkit/`,
});

const Panel = ({ header, children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="panel border border-gray-200 shadow p-2">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-[20px] justify-between"
      >
        <h5 className="uppercase font-semibold">{header}</h5>
        {expanded ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5v-2h14z"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
        )}
      </button>
      <div className={`${expanded ? "" : "hidden"}`}>{children}</div>
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

const InnerUI = ({ category, page_details, onDataLoaded }) => {
  const { status, results } = useInstantSearch();
  const { setSearchPageProductCount } = useSearch();
  const [loadHint, setLoadHint] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

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
    const result = ["loading"].includes(loadHint);
    setFirstLoad((prev) => {
      return result;
    });
    onDataLoaded(result);
  }, [loadHint]);

  useEffect(() => {
    const count = results?.nbHits || 0;
    setSearchPageProductCount(count);
  }, [results]);

  if (!firstLoad && results?.nbHits === 0) {
    return (
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h1 className="uppercase text-lg font-bold">{`${page_details?.name} ${
            results?.nbHits && `(${results?.nbHits})`
          }`}</h1>
        </div>
        <div className="pb-[100px] flex justify-center text-neutral-600 font-bold text-lg">
          No Results Found...
        </div>
      </div>
    );
  }

  if (!firstLoad) {
    return (
      <div className="container">
        <div className="flex items-center justify-between mb-5">
          <h1 className="uppercase text-lg font-bold">{`${page_details?.name} ${
            results?.nbHits && `(${results?.nbHits})`
          }`}</h1>
          <SortBy
            items={[
              { label: "Most Popular", value: `${es_index}_popular` },
              { label: "Newest", value: `${es_index}_newest` },
              { label: "Price: Low to High", value: `${es_index}_price_asc` },
              { label: "Price: High to Low", value: `${es_index}_price_desc` },
            ]}
          />
        </div>
        <div className="search-panel flex pb-[50px]">
          <div className="search-panel__filters  pfd-filter-section">
            {/* <FilterWrapper page_details={page_details} /> */}
            {page_details && page_details?.nav_type === "category" && (
              <DynamicWidgets facets={["*"]}>
                {filters
                  .filter((item) =>
                    item?.filter_type.includes(page_details?.filter_type)
                  )
                  .map((item) => (
                    <div
                      key={`filter-item-${item?.attribute}`}
                      className={`facet-wrapper my-1 facet_${item?.attribute}`}
                    >
                      <Panel header={item?.label}>
                        {item?.attribute && item?.attribute !== "price" ? (
                          <RefinementList
                            attribute={item?.attribute}
                            searchable={item?.searchable}
                          />
                        ) : (
                          <RangeInput attribute="price" />
                        )}
                      </Panel>
                    </div>
                  ))}
              </DynamicWidgets>
            )}

            {page_details && page_details?.nav_type === "brand" && (
              <DynamicWidgets facets={["*"]}>
                <div className="my-5">
                  <Panel header="Categories">
                    <RefinementList attribute="product_category" searchable />
                  </Panel>
                </div>
                <div className="my-5">
                  <Panel header="price">
                    <RangeInput attribute="price" />
                  </Panel>
                </div>
              </DynamicWidgets>
            )}

            {page_details &&
              page_details?.nav_type === "custom_page" &&
              page_details?.name !== "Search" && (
                <DynamicWidgets facets={["*"]}>
                  {filters
                    .filter((item) =>
                      item?.filter_type.includes(page_details?.filter_type)
                    )
                    .map((item) => (
                      <div
                        key={`filter-item-${item?.attribute}`}
                        className={`facet-wrapper my-1 facet_${item?.attribute}`}
                      >
                        <Panel header={item?.label}>
                          {item?.attribute && item?.attribute !== "price" ? (
                            <RefinementList
                              attribute={item?.attribute}
                              searchable={item?.searchable}
                            />
                          ) : (
                            <RangeInput attribute="price" />
                          )}
                        </Panel>
                      </div>
                    ))}
                </DynamicWidgets>
              )}

            {page_details &&
              page_details?.nav_type === "custom_page" &&
              page_details?.name === "Search" && (
                <DynamicWidgets facets={["*"]}>
                  {filters
                    .filter((item) => item?.filter_type.includes("Search"))
                    .map((item) => (
                      <div
                        key={`filter-item-${item?.attribute}`}
                        className={`my-1 facet_${item?.attribute}`}
                      >
                        <Panel header={item?.label}>
                          {item?.attribute && item?.attribute !== "price" ? (
                            <RefinementList
                              attribute={item?.attribute}
                              searchable={item?.searchable}
                            />
                          ) : (
                            <RangeInput attribute="price" />
                          )}
                        </Panel>
                      </div>
                    ))}
                </DynamicWidgets>
              )}

            <div className="relative lg:w-[240px] h-[360px]">
              <Link
                href={`tel:${page_details?.contact_number || "(888) 575-9720"}`}
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
          <div className="search-panel__results pfd-product-section">
            <CurrentRefinements />
            <QueryRulesBanner />

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
    <div className="container">
      <div className="flex items-center justify-between mb-5">
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
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={`product-loader-card-${index}`}
                className="bg-neutral-100 w-full h-[400px] rounded"
              />
            ))}
          </div>
          <div className="flex gap-[20px] mt-[20px]">
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
  useEffect(() => {
    setUiState((prev) => {
      const new_state = prev;
      new_state[es_index]["query"] = search;
      return new_state;
    });
    refresh();
  }, [search]);
  return null;
};

function ProductsSection({ category, search = "" }) {
  // search is assigned only on search page
  const [searchState, setSearchState] = useState({});
  const { flatCategories } = useSolanaCategories();
  const [pageDetails, setPageDetails] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    if (category) {
      const details = flatCategories.find(({ url }) => url === category);
      if (details) {
        setPageDetails(details);
        setFilterString((prev) => {
          let result = "";
          if (details?.nav_type === "category") {
            result = `page_category:${details?.origin_name}`;
          } else if (details?.nav_type === "brand") {
            result = `page_brand:${details?.origin_name}`;
          } else if (details?.nav_type === "custom_page") {
            // result = `custom_page:${details?.origin_name}`;
            if (details?.name === "Search") {
              result = `custom_page:Search`;
            } else {
              const page_name = details?.name;
              // TEMPORARY: extend value assignment
              if (BaseNavKeys.includes(page_name)) {
                result = `custom_page:${page_name}`;
              } else {
                result = `custom_page:${
                  details?.collection_display?.name || "NA"
                }`;
              }
            }
          }
          return result;
        });
      } else {
        setPageDetails(null);
        setFilterString("");
      }
    }
  }, [category, flatCategories]);

  return (
    <>
      <div className={`container mx-auto ${firstLoad ? "" : "hidden"}`}>
        <div className="mt-5">
          <SkeletonLoader />
        </div>
      </div>
      <div className="container mx-auto">
        <div className="mt-5">
          <InstantSearch
            indexName={es_index}
            searchClient={searchClient}
            searchState={searchState}
          >
            <SearchBox className="hidden-main-search-input hidden" />
            <Refresh search={search} />
            {/* <HitsPerPage /> */}
            {filterString ? (
              <Configure hitsPerPage={15} filter={filterString} />
            ) : (
              <Configure hitsPerPage={15} />
            )}
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
