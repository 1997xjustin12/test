import { STAR_FILTERS } from "@/app/lib/helpers";
import COLLECTIONS_BY_CATEGORY from "@/app/data/collections_by_category";
import { storageFilters, storageFilterTypes } from "./filter-storage";
import { refFilters, refFilterTypes } from "./filter-refrigerators";
import { fireplacesFilters, fireplacesFilterTypes } from "./filter-fireplaces";
import {
  patioHeaterFilters,
  patioHeatersFilterTypes,
} from "./filter-patio-heaters";
import { grillsFilters, grillsFilterTypes } from "./filter-grills";

export const priceBuckets = {
  "Under $500": { gte: 0, lt: 500 },
  "$500 - $1,000": { gte: 500, lt: 1000 },
  "$1,000 - $1,500": { gte: 1000, lt: 1500 },
  "$1,500 - $2,000": { gte: 1500, lt: 2000 },
  "$2,000 - $2,500": { gte: 2000, lt: 2500 },
  "$2,500 - $5,000": { gte: 2500, lt: 5000 },
  "5000 And Up": { gte: 5000 },
};

export const priceBucketKeys = Object.keys(priceBuckets);
// used in ProductsSection Component
export const filters = [
  // GENERAL FILTERS
  {
    label: "Ways to Shop",
    attribute: "ways_to_shop",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "ways_to_shop",
      type: "string",
      facetQuery: () => ({
        filters: {
          filters: {
            "Top Rated": {
              terms: { "ratings.rating_count.keyword": ["3", "4", "5"] },
            },
            "Clearance/Open Box": {
              bool: {
                should: [
                  {
                    wildcard: {
                      "collections.name.keyword": {
                        value: "*clearance*",
                        case_insensitive: true, // Added this
                      },
                    },
                  },
                  {
                    wildcard: {
                      "collections.name.keyword": {
                        value: "*open box*",
                        case_insensitive: true, // Added this
                      },
                    },
                  },
                ],
              },
            },
            "Package Deals": {
              wildcard: {
                "collections.name.keyword": {
                  value: "*package deal*",
                  case_insensitive: true, // Added this
                },
              },
            },
            Promotions: {
              wildcard: {
                "collections.name.keyword": {
                  value: "*promotion*",
                  case_insensitive: true, // Added this
                },
              },
            },
            "New Arrivals": {
              terms: {
                tags: ["New Arrivals"],
              },
            },
            "Free Shipping": {
              terms: {
                tags: ["Free Shipping"],
              },
            },
            "In Stock & Quick Shipping": {
              terms: {
                tags: ["In Stock & Quick Shipping"],
              },
            },
          },
        },
      }),
      facetResponse: (aggregation) => {
        const buckets = aggregation.buckets || {};
        // Sort logic: Ensure they always appear in a specific order
        const order = [
          "Top Rated",
          "Clearance/Open Box",
          "Package Deals",
          "Promotions",
          "New Arrivals",
          "Free Shipping",
          "In Stock & Quick Shipping",
        ];
        return order.reduce((acc, key) => {
          const count = buckets[key]?.doc_count ?? 0;
          if (count > 0) {
            acc[key] = count;
          }
          return acc;
        }, {});
      },
      filterQuery: (field, value) => {
        const queries = {
          "Top Rated": {
            terms: { "ratings.rating_count.keyword": ["3", "4", "5"] },
          },
          "Clearance/Open Box": {
            bool: {
              should: [
                {
                  wildcard: {
                    "collections.name.keyword": {
                      value: "*clearance*",
                      case_insensitive: true,
                    },
                  },
                },
                {
                  wildcard: {
                    "collections.name.keyword": {
                      value: "*open box*",
                      case_insensitive: true,
                    },
                  },
                },
              ],
            },
          },
          "Package Deals": {
            wildcard: {
              "collections.name.keyword": {
                value: "*package deal*",
                case_insensitive: true,
              },
            },
          },
          Promotions: {
            wildcard: {
              "collections.name.keyword": {
                value: "*promotion*",
                case_insensitive: true,
              },
            },
          },
          "New Arrivals": {
            terms: {
              tags: ["New Arrivals"],
            },
          },
          "Free Shipping": {
            terms: {
              tags: ["Free Shipping"],
            },
          },
          "In Stock & Quick Shipping": {
            terms: {
              tags: ["In Stock & Quick Shipping"],
            },
          },
        };
        return queries[value] || {};
      },
    },
    collapse: false,
  },
  {
    label: "Ratings",
    attribute: "ratings",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "ratings",
      field: "ratings.rating_count.keyword",
      type: "string",

      facetQuery: () => ({
        filters: {
          filters: {
            [STAR_FILTERS[0]]: {
              term: { "ratings.rating_count.keyword": "0" },
            },
            [STAR_FILTERS[1]]: {
              term: { "ratings.rating_count.keyword": "1" },
            },
            [STAR_FILTERS[2]]: {
              term: { "ratings.rating_count.keyword": "2" },
            },
            [STAR_FILTERS[3]]: {
              term: { "ratings.rating_count.keyword": "3" },
            },
            [STAR_FILTERS[4]]: {
              term: { "ratings.rating_count.keyword": "4" },
            },
            [STAR_FILTERS[5]]: {
              term: { "ratings.rating_count.keyword": "5" },
            },
          },
        },
      }),

      facetResponse: (aggregation) => {
        const buckets = aggregation.buckets || {};
        return Object.keys(buckets).reduce((acc, key) => {
          const count = buckets[key]?.doc_count ?? 0;
          if (count > 0) {
            acc[key] = count;
          }
          return acc;
        }, {});
      },

      filterQuery: (field, value) => {
        // 'value' is the star string (e.g., "★★★★★")
        // We find the numeric key ("5") that matches that string
        const esValue = Object.keys(STAR_FILTERS).find(
          (key) => STAR_FILTERS[key] === value,
        );

        if (esValue !== undefined) {
          return {
            term: {
              [field]: esValue,
            },
          };
        }

        return {};
      },
    },
    collapse: false,
  },
  {
    label: "Brand",
    attribute: "brands",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "brands",
      field: "brand.keyword",
      type: "string",
    },
    collapse: true,
  },
  {
    label: "Category",
    attribute: "product_category",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "product_category",
      type: "string",

      facetQuery: () => {
        const dynamicFilters = {};
        COLLECTIONS_BY_CATEGORY.forEach((item) => {
          // Build the filter object dynamically for each category
          dynamicFilters[item.category_name] = {
            terms: { "collections.name.keyword": item.collections },
          };
        });
        return {
          filters: {
            filters: dynamicFilters,
          },
        };
      },

      facetResponse: (aggregation) => {
        const buckets = aggregation.buckets || {};
        const navData = COLLECTIONS_BY_CATEGORY || [];

        // Use the order from your dynamic array
        return navData.reduce((acc, item) => {
          const key = item.category_name;
          const count = buckets[key]?.doc_count ?? 0;
          if (count > 0) acc[key] = count;
          return acc;
        }, {});
      },

      filterQuery: (field, value) => {
        const navData = COLLECTIONS_BY_CATEGORY || [];
        const selectedCategory = navData.find(
          (item) => item.category_name === value,
        );

        if (selectedCategory) {
          return {
            terms: {
              "collections.name.keyword": selectedCategory.collections,
            },
          };
        }
        return {};
      },
    },
    collapse: true,
  },
  {
    label: "Price Groups",
    attribute: "price_groups", //
    searchable: false,
    type: "RefinementList",
    transform: function (items) {
      return [...items].sort((a, b) => {
        const indexA = priceBucketKeys.indexOf(a.value);
        const indexB = priceBucketKeys.indexOf(b.value);

        return indexA - indexB;
      });
    },
    runtime_mapping: null,
    facet_attribute: {
      attribute: "price_groups",
      field: "variants.price",
      type: "numeric",
      facetQuery: () => ({
        filters: {
          filters: {
            // Dynamically generate the range filters from your priceBuckets object
            ...Object.fromEntries(
              Object.entries(priceBuckets).map(([label, range]) => [
                label,
                { range: { "variants.price": range } },
              ]),
            ),
          },
        },
      }),
      facetResponse: (aggregation) => {
        const buckets = aggregation.buckets || {};
        // Sort logic: Ensure they always appear in a specific order
        const order = Object.keys(priceBuckets);
        const result = order.reduce((acc, key) => {
          const count = buckets[key]?.doc_count ?? 0;
          if (count > 0) {
            acc[key] = count;
          }
          return acc;
        }, {});
        return result;
      },
      filterQuery: (field, value) => {
        // 1. Dynamically build the queries object from your priceBuckets
        const priceQueries = Object.fromEntries(
          Object.entries(priceBuckets).map(([label, range]) => [
            label,
            { range: { "variants.price": range } },
          ]),
        );
        const allQueries = { ...priceQueries };
        return allQueries[value] || null;
      },
    },
    collapse: false,
  },
  {
    label: "Price",
    attribute: "price",
    searchable: false,
    type: "RangeInput",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "price",
      field: "variants.price",
      type: "numeric",
    },
    collapse: false,
  },
  {
    label: "External Material",
    attribute: "material",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "material",
      field: "accentuate_data.bbq.seo_meta_material",
      type: "string",
    },
    collapse: false,
  },
  // REFRIGERATOR RELATED FILTERS
  ...refFilters,
  ...fireplacesFilters,
  ...patioHeaterFilters,
  ...grillsFilters,
  ...storageFilters,
];

/**
 * filter_types
 * Defines the inclusion and display order of filter facets.
 * NOTE: The array order is strictly preserved; facets will appear on
 * the UI in the exact sequence defined below.
 */
export const filter_types = {
  ...refFilterTypes,
  ...fireplacesFilterTypes,
  ...patioHeatersFilterTypes,
  ...grillsFilterTypes,
  ...storageFilterTypes,
  default: [
    "ways_to_shop",
    "brands",
    "product_category",
    "price_groups",
    "price",
  ],
};

export const getActiveFacets = (type) => {
  const useType = Object.keys(filter_types).includes(type) ? type : "default";
  const typeFacets = filter_types[useType];
  const finalFacets = typeFacets
    .map((attr) => filters.find((item) => item.attribute === attr))
    .filter(Boolean);
  return finalFacets;
};

export const getActiveRuntimeMappings = (type) => {
  const facets = getActiveFacets(type);
  const runtimeMappings = facets
    .map(({ runtime_mapping }) => runtime_mapping)
    .filter(Boolean)
    .reduce((acc, current) => {
      return { ...acc, ...current };
    }, {});

  return runtimeMappings;
};

export const accentuateSpecLabels = Array.from(
  filters
    .reduce((map, item) => {
      const key = item?.accentuate_prop || "NA";
      // Only add to the map if it's not "NA" and hasn't been added yet
      if (key !== "NA" && !map.has(key)) {
        map.set(key, {
          label: item?.label,
          key: key,
          type: item.cluster,
          transform: item.transformSpecs,
        });
      }
      return map;
    }, new Map())
    .values(),
).sort((a, b) => a.label.localeCompare(b.label));

// console.log("accentuateSpecLabels (ALL): ", accentuateSpecLabels);
// console.log(
//   "accentuateSpecLabels (REFRIGERATORS): ",
//   accentuateSpecLabels.filter(({ type }) => type === "refrigerators"),
// );
// console.log(
//   "accentuateSpecLabels (FIREPLACES): ",
//   accentuateSpecLabels.filter(({ type }) => type === "fireplaces"),
// );
// console.log(
//   "accentuateSpecLabels (PATIO HEATERS): ",
//   accentuateSpecLabels.filter(({ type }) => type === "patio heaters"),
// );
// console.log(
//   "accentuateSpecLabels (GRILLS): ",
//   accentuateSpecLabels.filter(({ type }) => type === "grills"),
// );
// console.log(
//   "accentuateSpecLabels STORAGE): ",
//   accentuateSpecLabels.filter(({ type }) => type === "storage"),
// );

// const refinementListHtml = filters.filter(item=> item.attribute !== "price").map(item=> `<RefinementList attribute="${item?.attribute}" className="hidden" />`).join("");
// console.log("TO PASTE IN PRODUCTSSECTION", refinementListHtml)
