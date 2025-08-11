import { ES_INDEX } from "../../../../app/lib/helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const key = `Api-Key ${process.env.NEXT_SOLANA_COLLECTIONS_KEY}`;
  const {
    query: { id },
  } = req;

  try {
    const response = await fetch(
      `https://admin.solanabbqgrills.com/api/collections/collection-products/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: key,
        },
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text(); // fallback
      return res
        .status(500)
        .json({ message: "Invalid JSON response", raw: text });
    }

    // fetch raw collection
    const raw_collection = await response.json();
    // return res.status(response.status).json(data);

    // fetch collection data
    const ESURL = "http://164.92.65.4:9200";
    const ESShard = ES_INDEX;
    const ESApiKey =
      "apiKey eHgtQWI1VUI0Nm1Xbl9IdGNfRG46bFZqUjQtMzJRN3kzdllmVjVDemNHdw==";

    const es_query = {
        query: {
          terms: {
            "handle.keyword": raw_collection.map(item=> item?.handle),
          },
        },
      };
    const fetchConfig = {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(es_query),
    };

    try {
      const response = await fetch(`${ESURL}/${ESShard}/_search`, fetchConfig);
      const data = await response.json();
      // res.status(200).json({query: es_query, data:data}); for dev check
      res.status(200).json(data?.hits?.hits?.map(item=> item?._source));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch products", error: error.message });
    }
  } catch (error) {
    console.error("Proxy Error:", error);
    return res
      .status(500)
      .json({ message: "Proxy request failed", error: error.message });
  }
}
