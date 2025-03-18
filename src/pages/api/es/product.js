//  this hook is used for searching products
export default async function handler(req, res) {
  const ESURL = "http://164.92.65.4:9200";
  const ESShard = "bigcommerce_products";
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
    const product_url = body?.product_url;

    const new_body = {
      size: 1,
      query: {
        term: {
          "custom_url.url.keyword": `${product_url}`,
        },
      },
    };

    fetchConfig["body"] = JSON.stringify(new_body);

    try {
      const response = await fetch(API_URL, fetchConfig);

      // if (!response.ok) {
      //   throw new Error(`Error fetching products: ${response}`);
      // }
      const data = await response.json();
      // elasticsearch result restructured to bigcommerce response object
      const product = data?.hits?.hits.map((i) => i._source)
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
