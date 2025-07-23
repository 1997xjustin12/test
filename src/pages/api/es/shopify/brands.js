export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ESURL = "http://164.92.65.4:9200";
  const ESShard = "solana_products";
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
    body: JSON.stringify({
      size: 0,
      aggs: {
        brands: {
          terms: {
            field: "brand.keyword",
            size: 1000,
          },
        },
      },
    }),
  };

  try {
    const response = await fetch(`${ESURL}/${ESShard}/_search`, fetchConfig);
    const data = await response.json();
    res.status(200).json(data?.aggregations?.brands?.buckets?.map(item => ({...item, nav_type:"brand"})));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
}
