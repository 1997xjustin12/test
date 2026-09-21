import { ES_INDEX } from "../../../app/lib/helpers";

//  this hook is used for searching products
export default async function handler(req, res) {
  const ESURL = process.env.NEXT_ES_URL;
  const ESShard = ES_INDEX;
  const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

  const fetchConfig = {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: ESApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const BASE_API_URL = `${ESURL}/${ESShard}/_search`;

  if (req.method === "GET") {
    const API_URL = `${BASE_API_URL}`;
    let { product_ids } = req.query;

    if (!Array.isArray(product_ids)) {
      product_ids = [product_ids];
    }

    const new_body = {
      size: 100,
      query: {
        terms: {
          product_id: product_ids,
        },
      },
    };

    fetchConfig["body"] = JSON.stringify(new_body);

    try {
      const response = await fetch(API_URL, fetchConfig);
      const data = await response.json();
      const product = data?.hits?.hits.map((i) => i._source);

      // Only the products. This used to return `requestConfig: fetchConfig`,
      // whose Authorization header carries the Elasticsearch API key — so the
      // endpoint published the key to anyone who called it. `response` (a
      // Response object) and `requestBody` were debug leftovers too.
      const bc_formated_data = { data: product };
      res.status(200).json(bc_formated_data);
    } catch (error) {
      console.error("products-by-ids.js: Elasticsearch request failed:", error?.message || error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
}
