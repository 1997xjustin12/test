import { areAllKeysEmpty, ES_INDEX } from "../../../app/lib/helpers";

//  this hook is used for searching products
export default async function handler(req, res) {
  const ESURL = "http://164.92.65.4:9200";
  const ESShard = ES_INDEX;
  const ESApiKey =
    "apiKey eHgtQWI1VUI0Nm1Xbl9IdGNfRG46bFZqUjQtMzJRN3kzdllmVjVDemNHdw==";

  const fetchConfig = {
    method: req.method,
    cache: "no-store",
    headers: {
      Authorization: ESApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const BASE_API_URL = `${ESURL}/${ESShard}/_search`;

  if (req.method === "POST") {
    const API_URL = `${BASE_API_URL}`;
    const body = JSON.parse(req.body);
    const handle = body?.handle;

    const new_body = {
      size: 1,
      query: {
        term: {
          "handle.keyword": {
            value: `${handle}`,
          },
        },
      },
    };

    fetchConfig["body"] = JSON.stringify(new_body);

    try {
      let product_options = null;
      let similar_products = null;
      const response = await fetch(API_URL, fetchConfig);

      const data = await response.json();
      // elasticsearch result restructured to bigcommerce response object
      const product = data?.hits?.hits.map((i) => i._source);


      if (product?.[0] && product[0].accentuate_data?.[0]) {
        // send request to get product options data
        const accentuate_data = product[0].accentuate_data[0];
        // console.log("accentuate_data",accentuate_data)
        const keys = [
          "bbq.related_product",
          "bbq.configuration_product",
          "bbq.hinge_related_product",
          "bbq.option_related_product",
          "bbq.option_related_product",
          "bbq.openbox_related_product",
          "bbq.shopnew_related_product",
          "bbq.selection_related_product",
          "frequently.fbi_related_product",
          "bbq.product_option_related_product",
          "bbq.configuration_product",
        ];

        // Flatten all handles from the accentuate_data fields
        const mergedProducts = mergeRelatedProducts(accentuate_data, keys);

        const secondFetchConfig = {
          ...fetchConfig,
          body: JSON.stringify({
            size: 100,
            query: {
              terms: {
                "handle.keyword": mergedProducts,
              },
            },
          }),
        };

        const product_options_response = await fetch(
          API_URL,
          secondFetchConfig
        );
        const product_options_json = await product_options_response.json();
        product_options = product_options_json?.hits?.hits.map(
          (i) => i._source
        );

        // send request to get similar options data
        // compare table keys
        const table_keys = [
          "bbq.seo_meta_brand",
          "bbq.seo_meta_series",
          "bbq.seo_meta_material",
          "bbq.seo_meta_fuel_type",
          "bbq.seo_meta_made_in_usa",
          "bbq.seo_meta_manufacturer",
          "bbq.seo_meta_total_grill_area",
          "bbq.seo_meta_main_grilling_area",
          "bbq.seo_meta_cook_grid_dimensions",
          "bbq.seo_meta_secondary_grilling_area",
          "bbq.seo_meta_manufacturer",
        ];

        const has_possible_similars = !areAllKeysEmpty(
          accentuate_data,
          table_keys
        );

        if (has_possible_similars) {
          const comparable_tags = [
            "27-33 Inches",
            "304 Stainless Steel",
            "4 Burners",
            "Analog",
            // "BLZ4BICV",
            "Built In",
            "Built In Gas Grills",
            "Depth 0-26 Inches",
            // "Free Accessories",
            // "Gas Grills",
            "Height 0-26 Inches",
            "Internal and External Lights",
            "Internal Lights",
            "Liquid Propane Gas",
            "Optional Rotisserie",
            // "Top Deals",
            "Width 27-33 Inches",
            "With Rear Infrared Burner",
            "Basic Package (2-3 items)",
          ];

          const product_tags_string = product?.[0]?.tags || ""; // e.g., "Built In,Gas Grills,Random Tag"
          const product_tags = product_tags_string
            .split(",")
            .map((tag) => tag.trim());

          // Get matching tags
          const matching_tags = product_tags.filter((tag) =>
            comparable_tags.includes(tag)
          );

          if (matching_tags && matching_tags.length > 0) {
            const similarProductFetchConfig = {
              ...fetchConfig,
              body: JSON.stringify({
                query: {
                  bool: {
                    must: matching_tags.map((item) => ({
                      match_phrase: { tags: item },
                    })),
                  },
                },
              }),
            };
            const similar_products_response = await fetch(
              API_URL,
              similarProductFetchConfig
            );
            const similar_products_json =
              await similar_products_response.json();
            similar_products = similar_products_json?.hits?.hits.map(
              (i) => i._source
            );
          }
        }
      }

      if (product.length > 0) {
        product[0]["sp_product_options"] = product_options;
        product[0]["sp_similar_products"] = similar_products;
      }

      const bc_formated_data = {
        data: product,
        requestConfig: fetchConfig,
        requestBody: req.body,
        response: response,
      };
      res.status(200).json(bc_formated_data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products", error });
    }
  }
}

function mergeRelatedProducts(data, keys) {
  const merged = [];

  keys.forEach((key) => {
    // Use lodash-style get or implement your own to handle nested keys like "bbq.related_product"
    const value = data[key] ? JSON.parse(data[key]) : [];
    if (Array.isArray(value)) {
      merged.push(...value);
    }
  });

  return merged;
}
