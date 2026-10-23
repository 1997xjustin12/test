// The Elasticsearch query behind POST /api/es/searchkit (app/api/es/searchkit/
// route.js), which owns the caching. This file only turns a Searchkit request
// body into results.
//
// It used to be the Pages Router handler itself, and cached each response in
// Upstash Redis under searchkit:<hash>. A response is 200–280 KB (30 full
// product documents plus facets), and Upstash bills bandwidth both ways: a hit
// downloaded it, a miss uploaded it. Every category page view, filter click
// and page turn — crawlers walking ?page=1…170 included — moved a full
// response through Redis, which is what exhausted the plan's bandwidth.
import API from "@searchkit/api";

import {
  BaseNavObj,
  ES_INDEX,
  main_products,
  shouldApplyMainProductSort,
} from "@/app/lib/helpers";
import { getCatalogExclusions } from "@/app/lib/catalog-exclusions";
import { getPinnedForPage, pinnedScriptSort } from "@/app/lib/pinned-products";

import COLLECTIONS_BY_CATEGORY from "@/app/data/collections_by_category";
import {
  getActiveFacets,
  getActiveRuntimeMappings,
} from "@/app/lib/filter-helper";
import { exactMatchClauses } from "@/app/lib/search-exact-match";

/** Data-cache tag on every cached Searchkit response. See the route. */
export const SEARCHKIT_TAG = "searchkit";

const priceBuckets = {
  "Under $1,000": { gte: 0, lt: 1000 },
  "$1,000 - $2,000": { gte: 1000, lt: 2000 },
  "$2,000 - $3,000": { gte: 2000, lt: 3000 },
  "Over $3,000": { gte: 3000 },
};

const mainItemsScriptSort = {
  _script: {
    type: "number",
    script: {
      source: `
                // Access the main products list passed via params
                def main_collections = params.main_products;
                // Access the product's collections. IMPORTANT: Use the correct keyword field
                def product_collections = doc['collections.name.keyword'];

                // If the product document has any of the main collections, return 0
                for (collection in product_collections) {
                    if (main_collections.contains(collection)) {
                        return 0; // Top Priority
                    }
                }
                return 1; // Lower Priority
            `,
      params: {
        main_products: main_products, // Pass the JS array here
      },
    },
    order: "asc", // Sort ascending so 0 (main items) comes first
  },
};

/**
 * Runs one Searchkit request against this brand's index.
 * Throws on failure, so a caller's cache never stores an error.
 */
export async function runSearchkit(body) {
  {
    const check_filter = body?.[0]?.params?.filter;
    let filter_key = null;
    let filter_value = null;
    let filter_option = null;
    let filter_type = null;
    // Suppressed brands and collections, from Redis via /admin/catalog-exclusions.
    const { brands: excludedBrands, collections: excludedCollections } =
      await getCatalogExclusions();
    let filter_query = [
      {
        bool: {
          must_not: [
            {
              terms: {
                "brand.keyword": excludedBrands,
              },
            },
            {
              terms: {
                "collections.name.keyword": excludedCollections,
              },
            },
          ],
        },
      },
      {
        exists: {
          field: "brand.keyword",
        },
      },
      {
        term: {
          published: true,
        },
      },
    ];

    // The listing page's menu address, the filter's fourth part
    // (page_category:Fireplaces:fireplaces:built-in-grills). It picks the
    // page's pinned products; see docs/pinned-products.md.
    let pin_page = null;
    if (check_filter) {
      filter_key = check_filter.split(":")[0];
      filter_value = check_filter.split(":")[1];
      filter_type = check_filter.split(":")[2];
      pin_page = check_filter.split(":")[3] || null;
    }
    const pinned = await getPinnedForPage(pin_page);

    if (filter_key === "page_category1") {
      filter_query.push({
        term: {
          "accentuate_data.category": filter_value,
        },
      });
    }

    if (filter_key === "page_category") {
      filter_query.push({
        term: {
          "product_category.category_name.keyword": filter_value,
        },
      });
    }

    if (filter_key === "page_brand") {
      filter_query.push({
        term: {
          "brand.keyword": filter_value,
        },
      });
    }

    if (filter_key === "custom_page" && filter_value === "New Arrivals") {
      filter_query.push({
        range: {
          created_at: {
            gte: "now-30d/d", // You can customize this value as needed
          },
        },
      });
    }

    if (filter_key === "custom_page" && filter_value === "On Sale") {
      const tmp_query = [
        {
          exists: {
            field: "variants.compare_at_price",
          },
        },
        {
          range: {
            "variants.compare_at_price": {
              gt: 0,
            },
          },
        },
        {
          script: {
            script: {
              source:
                "doc['variants.compare_at_price'].size() > 0 && doc['variants.price'].size() > 0 && doc['variants.compare_at_price'].value > doc['variants.price'].value",
              lang: "painless",
            },
          },
        },
      ];

      filter_query.push(...tmp_query);
    }
    // This will display no products for category links that are not known.
    if (
      filter_key === "custom_page" &&
      !["On Sale", "New Arrivals", "undefined", "Search"].includes(filter_value)
    ) {
      const value_array = BaseNavObj?.[filter_value] || null;

      if (value_array) {
        filter_query.push({
          terms: {
            "collections.name.keyword": value_array,
          },
        });
      } else {
        filter_query.push({
          term: {
            "collections.name.keyword": filter_value,
          },
        });
      }
    }

    const data = body;
    let results = null;

    const facetAttributes = (getActiveFacets(filter_type) || []).map(
      ({ facet_attribute }) => facet_attribute,
    );

    const runtimeMappings = getActiveRuntimeMappings(filter_type);

    const apiClient = API({
      connection: {
        host: process.env.NEXT_ES_URL,
        apiKey: process.env.NEXT_ES_API_KEY,
        index: ES_INDEX,
      },
      search_settings: {
        hitsPerPage: 30,
        search_attributes: ["title"],
        // Only what grid consumers read from a hit: the brand cards, quick
        // view, compare, add to cart and the listing JSON-LD (traced
        // 2026-10-23). body_html (quick view only, now fetched when it opens,
        // see hooks/useProductDescription), accentuate_data, seo, features,
        // custom_metafields, recommendations, google_shopping, region_pricing,
        // status and uploaded_at made up ~95% of each hit: a listing's first
        // page was 536 KB of results inlined in <head> on BBQ. Filters, facets
        // and sorts read the index directly, so they don't need these here.
        // product_category, tags and collections must stay: they decide
        // whether a price is shown and the sale/new/bestseller/open-box and
        // free-shipping badges.
        result_attributes: [
          "product_id",
          "handle",
          "title",
          "brand",
          "product_category",
          "product_type",
          "tags",
          "published",
          "options",
          "variants",
          "images",
          "ratings",
          "collections",
          "created_at",
          "updated_at",
        ],
        runtime_mappings: runtimeMappings,
        facet_attributes: facetAttributes,
        filter_attributes: [
          {
            attribute: "page_category",
            field: "product_category.category_name.keyword",
            type: "string",
          },
        ],
        sorting: {
          _popular: {
            field: "_score",
            order: "asc",
          },
          _newest: {
            field: "created_at",
            order: "desc",
          },
          _price_desc: {
            field: "variants.price",
            order: "desc",
          },
          _price_asc: {
            field: "variants.price",
            order: "asc",
          },
        },
        defaultSorting: "popular", // 👈 applies default sorting
      },
    });

    if (filter_query.length > 0) {
      // create the filter option
      filter_option = {
        hooks: {
          beforeSearch: async (searchRequests) => {
            return searchRequests.map((sr) => {
              const sort = sr.body.sort;
              const isPopular = !!sort?.["_score"];
              // A listing in its default state sends no sort at all (Most
              // popular is selected by default but only an explicit choice
              // sends one), so "no sort" counts as Most popular for pins.
              const noSort = !sort || (Array.isArray(sort) && sort.length === 0);
              const query = sr.body.query;

              // Extract search query from Searchkit's structure
              let searchQuery = "";

              // Helper function to recursively search for query in nested structures
              const extractQuery = (obj) => {
                if (!obj || typeof obj !== "object") return null;

                // Check if current object has multi_match.query
                if (obj.multi_match?.query) {
                  return obj.multi_match.query;
                }

                // Recursively search in arrays
                if (Array.isArray(obj)) {
                  for (const item of obj) {
                    const found = extractQuery(item);
                    if (found) return found;
                  }
                }

                // Recursively search in objects
                for (const key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    const found = extractQuery(obj[key]);
                    if (found) return found;
                  }
                }

                return null;
              };

              searchQuery = extractQuery(sr.body.query) || "";

              // Also check for query string in the params
              if (!searchQuery && sr.params?.query) {
                searchQuery = sr.params.query;
              }

              // Check if main product sorting should be applied
              const applyMainProductSort =
                shouldApplyMainProductSort(searchQuery);

              // Replace the default query with our custom search logic to match context/search.js
              let customQuery = query;
              if (searchQuery) {
                customQuery = {
                  bool: {
                    ...query.bool,
                    must: {
                      bool: {
                        should: [
                          ...exactMatchClauses(searchQuery),
                          {
                            multi_match: {
                              query: searchQuery,
                              fields: ["variants.sku^10"],
                              type: "phrase",
                            },
                          },
                          {
                            bool: {
                              should: [
                                {
                                  multi_match: {
                                    query: searchQuery,
                                    fields: ["title"],
                                    fuzziness: "AUTO:4,8",
                                  },
                                },
                                {
                                  multi_match: {
                                    query: searchQuery,
                                    fields: ["title"],
                                    type: "bool_prefix",
                                  },
                                },
                              ],
                            },
                          },
                          {
                            multi_match: {
                              query: searchQuery,
                              type: "phrase",
                              fields: ["title"],
                            },
                          },
                        ],
                      },
                    },
                  },
                };
              }

              return {
                ...sr,
                body: {
                  ...sr.body,
                  query: customQuery,
                  // Pinned products first, in the admin's order, on a listing
                  // sorted by Most popular (or not sorted at all) with nothing
                  // typed — a typed search ranks by relevance instead. After
                  // the pins, the order each case already had: Elasticsearch's
                  // default (_score) when unsorted, _score then newest when
                  // Most popular was chosen. Unpinned pages are unchanged.
                  sort: pinned.length && !searchQuery && (noSort || isPopular)
                    ? [pinnedScriptSort(pinned), "_score", ...(isPopular ? [{ updated_at: "desc" }] : [])]
                    : isPopular
                    ? applyMainProductSort
                      ? [
                          // Apply main product priority when keyword matches
                          mainItemsScriptSort,
                          { updated_at: "desc" },
                          "_score",
                        ]
                      : [
                          // Regular relevance sorting for other searches
                          "_score",
                          { updated_at: "desc" },
                        ]
                    : sort,
                },
              };
            });
          },
        },
        getBaseFilters: () => filter_query,
      };
      // 💡 Pass the transformer function in the options object
      results = await apiClient.handleRequest(data, filter_option);
    } else {
      results = await apiClient.handleRequest(data);
    }

    return results;
  }
}
