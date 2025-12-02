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
      let fbw_products = null; // frequently bought with products
      const response = await fetch(API_URL, fetchConfig);

      const data = await response.json();
      // elasticsearch result restructured to bigcommerce response object
      const product = data?.hits?.hits.map((i) => i._source);

      const accentuate_data = product[0].accentuate_data || null;
      if (product?.[0] && accentuate_data) {
        // console.log("accentuate_data", accentuate_data);
        const keys = [
          "bbq.related_product",
          "bbq.configuration_product",
          "bbq.hinge_related_product",
          "bbq.option_related_product",
          "bbq.openbox_related_product",
          "bbq.shopnew_related_product",
          "bbq.selection_related_product",
          "bbq.product_option_related_product",
          "frequently.fbi_related_product",
        ];

        // Flatten all handles from the accentuate_data fields
        const mergedProducts = mergeRelatedProducts(accentuate_data, keys);
        // console.log("mergedProducts", mergedProducts);

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

        const relative_products = (product_options_json?.hits?.hits || []).map(
          (i) => ({ ...i._source })
        );

        const fbw =
          product[0]?.accentuate_data?.["frequently.fbi_related_product"] || [];
        const has_fbw = Array.isArray(fbw) && fbw.length > 0;

        if (has_fbw) {
          fbw_products = relative_products.filter((item) =>
            fbw.includes(item?.handle)
          );
        }

        product_options = relative_products.filter(
          (item) => !fbw.includes(item?.handle)
        );
      }

      if (product.length > 0) {
        product[0]["sp_product_options"] = product_options;
        product[0]["fbw_products"] = fbw_products;
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
    // 1. Get the value for the current key
    const rawValue = data[key];
    let value = [];

    // 2. Check the raw value's type before proceeding
    if (rawValue === null || rawValue === undefined) {
      // If null or undefined, skip or set to empty array
      value = [];
    } else if (Array.isArray(rawValue)) {
      // If it's already an array, use it directly
      value = rawValue;
    } else if (typeof rawValue === "string") {
      // If it's a string, attempt to parse it
      try {
        value = JSON.parse(rawValue);
      } catch (e) {
        console.error(`Error parsing JSON for key "${key}":`, e);
        // On error, treat as empty or handle as required
        value = [];
      }
    } else {
      // For any other non-string, non-null, non-array value (e.g., number or object)
      // This is defensive coding; assuming related products should be an array.
      value = [];
    }

    // 3. Ensure the final result is an array before spreading
    if (Array.isArray(value)) {
      merged.push(...value);
    }
  });

  // 4. Optionally, you might want to deduplicate the results
  return [...new Set(merged)];
}
