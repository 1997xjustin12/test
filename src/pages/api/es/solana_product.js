//  this hook is used for searching products
export default async function handler(req, res) {
  const ESURL = "http://164.92.65.4:9200";
  const ESShard = "solana_products";
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
      const response = await fetch(API_URL, fetchConfig);

      // if (!response.ok) {
      //   throw new Error(`Error fetching products: ${response}`);
      // }
      const data = await response.json();
      // elasticsearch result restructured to bigcommerce response object
      const product = data?.hits?.hits.map((i) => i._source);

      if (product?.[0] && product[0].accentuate_data?.[0]) {
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

        console.log("Merged Handles:", mergedProducts);

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
      }

      if(product.length > 0){
        product[0]["sp_product_options"] = product_options;
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
