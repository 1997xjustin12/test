import { ES_INDEX } from "../../../../app/lib/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
    res.status(200).json(
      data?.aggregations?.brands?.buckets?.map((item) => ({
        ...item,
        nav_type: "brand",
      }))
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
}
