import { withRateLimit } from "@/app/lib/rate-limit";
import { ES_INDEX } from "../../../../app/lib/helpers";

async function handler(req, res) {
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

/**
 * Throttled: see lib/rate-limit.js, "search" bucket.
 *
 * This route attaches the app's Elasticsearch credentials server-side and
 * forwards a query, which is the right place for them — but until 8 October
 * 2026 there was no bound on how often an anonymous caller could use them, so
 * one client could drive unlimited load at the cluster on our account.
 *
 * Every caller is the browser, fetching a relative URL, so nothing
 * server-rendered passes through here and there is no SSR traffic to exempt.
 * /api/es/searchkit is the one that does, and it identifies itself with
 * internalHeaders() for exactly that reason.
 */
export default withRateLimit(handler, "search");
