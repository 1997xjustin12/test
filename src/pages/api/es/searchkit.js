// pages/api/es/searchkit.js
import API from "@searchkit/api";

const apiClient = API({
  connection: {
    host: "https://solanafireplaces.com/es",
    apiKey: "eHgtQWI1VUI0Nm1Xbl9IdGNfRG46bFZqUjQtMzJRN3kzdllmVjVDemNHdw==",
  },
  search_settings: {
    highlight_attributes: ["name"],
    snippet_attributes: ["description:200"],
    search_attributes: [
      { field: "name", weight: 3 },
      { field: "categories", weight: 2 },
      { field: "brand", weight: 2 },
      "description",
    ],
    result_attributes: [
      "id",
      "name",
      "type",
      "sku",
      "description",
      "weight",
      "width",
      "depth",
      "height",
      "price",
      "cost_price",
      "retail_price",
      "sale_price",
      "map_price",
      "tax_class_id",
      "product_tax_code",
      "calculated_price",
      "categories",
      "option_set_id",
      "option_set_display",
      "inventory_level",
      "inventory_warning_level",
      "inventory_tracking",
      "reviews_rating_sum",
      "reviews_count",
      "total_sold",
      "fixed_cost_shipping_price",
      "is_free_shipping",
      "is_visible",
      "is_featured",
      "related_products",
      "warranty",
      "bin_picking_number",
      "layout_file",
      "upc",
      "mpn",
      "gtin",
      "date_last_imported",
      "search_keywords",
      "availability",
      "availability_description",
      "gift_wrapping_options_type",
      "gift_wrapping_options_list",
      "sort_order",
      "condition",
      "is_condition_shown",
      "order_quantity_minimum",
      "order_quantity_maximum",
      "page_title",
      "meta_keywords",
      "meta_description",
      "date_created",
      "date_modified",
      "view_count",
      "preorder_release_date",
      "preorder_message",
      "is_preorder_only",
      "is_price_hidden",
      "price_hidden_label",
      "custom_url",
      "base_variant_id",
      "open_graph_type",
      "open_graph_title",
      "open_graph_description",
      "open_graph_use_meta_description",
      "open_graph_use_product_name",
      "open_graph_use_image",
      "variants",
      "images",
    ],
    facet_attributes: [
      { attribute: "brand", field: "brand.name.keyword", type: "string" },
      // { attribute: 'categories', field: 'categories.name.keyword', type: 'string' },
      { attribute: "price", field: "price", type: "numeric" },
    ],
    filter_attributes: [
      // {
      //   attribute: "category_page",
      //   field: "categories.id",
      //   type: "string",
      //   filterQuery: (field, value) => {
      //     const values = value.split(" OR ");
      //     return {
      //       nested: {
      //         path: "categories",
      //         query: {
      //           bool: {
      //             should: [{ term: { "categories.id": "148" } }],
      //             minimum_should_match: 1
      //           }
      //         }
      //       }
      //     };
      //   },
      // },
      {
        attribute: 'category_page',
        field: 'categories.id',
        type: 'string',
        filterQuery: (field, value) => {
          const values = value.split(' OR ');
          return {
            nested: {
              path: 'categories',
              query: {
                bool: {
                  should: values.map((v) => ({
                    match: { [field]: v }
                  })),
                  minimum_should_match: 1
                }
              }
            }
          };
        }
      }
    ],
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const data = req.body;
    console.log("data", data);
    const results = await apiClient.handleRequest(data, {
      getBaseFilters: () => {
        return [
          {
            bool: {
              must_not: [
                {
                  term: {
                    "categories.id": 32,
                  },
                },
              ],
            },
          },
        ];
      },
    });
    res.status(200).json(results);
  } catch (err) {
    console.error("Searchkit Error:", err);
    res.status(500).json({ error: "Searchkit failed", details: err.message });
  }
}
