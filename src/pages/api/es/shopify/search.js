import { ES_INDEX } from "../../../../app/lib/helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ESURL = process.env.NEXT_ES_URL;
  const ESShard = ES_INDEX;
  const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

  const queryBody = req.body;

  const fetchConfig = {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: ESApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(queryBody),
  };

  try {
    const response = await fetch(`${ESURL}/${ESShard}/_search`, fetchConfig);
    const data = await response.json();

    const products = data?.hits?.hits || [];
    const mapped_data = {
      ...data,
      hits: {
        ...data?.hits,
        hits: products.map(({ _source }) => ({
          _source: {
            title: _source?.title,
            images: _source?.images,
            product_id: _source?.product_id,
            variants: _source?.variants,
            brand: _source?.brand,
            handle: _source?.handle,
            published: _source?.published,
            product_category: _source?.product_category,
            ratings: _source?.ratings,
          },
        })),
      },
    };
    res.status(200).json(mapped_data);
    // res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
}
