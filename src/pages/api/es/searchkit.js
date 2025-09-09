// pages/api/es/searchkit.js
import API from "@searchkit/api";
import { BaseNavKeys, BaseNavObj, burnerBuckets, ES_INDEX } from "../../../app/lib/helpers";

// const exclude_brands = ["Bull Outdoor Products"];
const exclude_brands = [];
const apiClient = API(
  {
    connection: {
      host: "https://solanafireplaces.com/es",
      apiKey: "eHgtQWI1VUI0Nm1Xbl9IdGNfRG46bFZqUjQtMzJRN3kzdllmVjVDemNHdw==",
      index: ES_INDEX,
    },
    search_settings: {
      highlight_attributes: ["title"],
      snippet_attributes: ["description:200"],
      search_attributes: [
        { field: "title", weight: 3 },
        { field: "tags", weight: 2 },
        { field: "brand", weight: 2 },
        { field: "handle", weight: 1 },
        { field: "description", weight: 1 },
      ],
      result_attributes: [
        "product_id",
        "handle",
        "title",
        "body_html",
        "brand",
        "product_category",
        "product_type",
        "tags",
        "published",
        "options",
        "variants",
        "images",
        "seo",
        "google_shopping",
        "custom_metafields",
        "ratings",
        "features",
        "recommendations",
        "region_pricing",
        "accentuate_data",
        "status",
        "collections",
        "uploaded_at",
        "created_at",
        "updated_at",
      ],
      facet_attributes: [
        {
          attribute: "product_category",
          field: "product_category.category_name.keyword",
          type: "string",
        },
        { attribute: "brand", field: "brand.keyword", type: "string" },
        {
          attribute: "configuration_type",
          field: "accentuate_data.bbq.configuration_type", // informational only
          type: "string",

          facetQuery: () => ({
            // We don’t rely on ES aggregations here
            filters: {
              filters: {
                "Built-In": {
                  match_phrase: {
                    tags: "built in",
                  },
                },
                Freestanding: {
                  match_phrase: {
                    tags: "freestanding",
                  },
                },
              },
            },
          }),

          facetResponse: (aggregation) => {
            const buckets = aggregation.buckets || {};
            return Object.keys(buckets).reduce((acc, key) => {
              const count = buckets[key]?.doc_count ?? 0;
              if (count > 0) {
                acc[key] = count; // only include non-zero
              }
              return acc;
            }, {});
          },

          filterQuery: (field, value) => {
            if (value === "Built-In") {
              return {
                match_phrase: {
                  tags: "built in",
                },
              };
            }
            if (value === "Freestanding") {
              return {
                match_phrase: {
                  tags: "freestanding",
                },
              };
            }
            return {};
          },
        },

        {
          attribute: "no_of_burners",
          field: "accentuate_data.bbq.number_of_main_burners",
          type: "string",

          // Define normalized buckets
          facetQuery: () => {
            return {
              filters: {
                filters: Object.fromEntries(
                  Object.entries(burnerBuckets).map(([label, values]) => [
                    label,
                    {
                      terms: {
                        "accentuate_data.bbq.number_of_main_burners": values,
                      },
                    },
                  ])
                ),
              },
            };
          },

          // Map ES response to facet values & hide zero counts
          facetResponse: (aggregation) => {
            const buckets = aggregation.buckets || {};
            return Object.keys(buckets).reduce((acc, key) => {
              const count = buckets[key]?.doc_count ?? 0;
              if (count > 0) {
                acc[key] = count; // only include non-zero
              }
              return acc;
            }, {});
          },

          // Build filter query when user selects a value
          filterQuery: (field, value) => {

            return {
              terms: {
                "accentuate_data.bbq.number_of_main_burners":
                  burnerBuckets[value] || [],
              },
            };
          },
        },

        { attribute: "price", field: "variants.price", type: "numeric" },
        {
          attribute: "grill_lights",
          field: "accentuate_data.bbq.grill_lights",
          type: "string",
        },
        {
          attribute: "size",
          field: "accentuate_data.bbq.seo_meta_cooking_grid_dimensions",
          type: "string",
        },
        //

        {
          attribute: "rear_infrared_burner",
          field: "accentuate_data.bbq.rear_infrared_burner",
          type: "string",
        },

        {
          attribute: "cut_out_width",
          field: "accentuate_data.bbq.storage_specs_cutout_width",
          type: "string",
        },

        {
          attribute: "cut_out_depth",
          field: "accentuate_data.bbq.storage_specs_cutout_depth",
          type: "string",
        },

        {
          attribute: "cut_out_height",
          field: "accentuate_data.bbq.storage_specs_cutout_height",
          type: "string",
        },

        //
        {
          attribute: "made_in_usa",
          field: "accentuate_data.bbq.seo_meta_made_in_usa",
          type: "string",
        },
        {
          attribute: "material",
          field: "accentuate_data.bbq.seo_meta_material",
          type: "string",
        },
        {
          attribute: "thermometer",
          field: "accentuate_data.bbq.thermometer",
          type: "string",
        },
        {
          attribute: "rotisserie_kit",
          field: "accentuate_data.bbq.rotisserie_kit",
          type: "string",
        },
        {
          attribute: "gas_type",
          field: "accentuate_data.bbq.seo_meta_fuel_type",
          type: "string",
        },
      ],
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
          order: "desc",
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
  }
  // { debug: true }
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const check_filter = req.body?.[0]?.params?.filter;

    let filter_key = null;
    let filter_value = null;
    let filter_option = null;

    // filter out Bull Outdoor Products
    let filter_query = [
      {
        bool: {
          must_not: {
            terms: {
              "brand.keyword": exclude_brands,
            },
          },
        },
      },
      // adding the query below solves an issue when visiting the /brands page where an error occurs when toggling sort options.
      {
        exists: {
          field: "brand.keyword",
        },
      },
    ];

    if (check_filter) {
      filter_key = check_filter.split(":")[0];
      filter_value = check_filter.split(":")[1];
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
    console.log("[TEST NI] filter_value:", filter_value);

    // This will display no products for category links that are not known.
    if (
      filter_key === "custom_page" &&
      !["On Sale", "New Arrivals", "undefined", "Search"].includes(filter_value)
    ) {
      if (BaseNavKeys.includes(filter_value)) {
        const value_array = BaseNavObj?.[filter_value];
        console.log("[TEST NI]", value_array);
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

    const data = req.body;
    let results = null;

    if (filter_query.length > 0) {
      // create the filter option
      filter_option = {
        getBaseFilters: () => filter_query,
      };
      results = await apiClient.handleRequest(data, filter_option);
    } else {
      results = await apiClient.handleRequest(data);
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Searchkit Error:", err);
    res.status(500).json({ error: "Searchkit failed", details: err.message });
  }
}
