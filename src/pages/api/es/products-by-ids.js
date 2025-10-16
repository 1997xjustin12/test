import { areAllKeysEmpty, ES_INDEX } from "../../../app/lib/helpers";

//  this hook is used for searching products
export default async function handler(req, res) {
  const ESURL = "http://164.92.65.4:9200";
  const ESShard = ES_INDEX;
  const ESApiKey =
    "apiKey eHgtQWI1VUI0Nm1Xbl9IdGNfRG46bFZqUjQtMzJRN3kzdllmVjVDemNHdw==";

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
    let {product_ids} = req.query;

    if(!Array.isArray(product_ids)){
        product_ids = [product_ids];
    }

    const new_body = {
      size: 100,
      query: {
        terms: {
          "product_id": product_ids,
        },
      },
    };

    fetchConfig["body"] = JSON.stringify(new_body);

    try {
      const response = await fetch(API_URL, fetchConfig);
      const data = await response.json();
      const product = data?.hits?.hits.map((i) => i._source);

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
