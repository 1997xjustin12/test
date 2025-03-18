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

  if (req.method === "GET") {
    const params = new URLSearchParams(req.query);
    const page = params.get("page") || 1;
    const limit = params.get("limit") || 10;
    params.delete("page");
    params.delete("limit");
    params.delete("categories");

    const from = (page - 1) * limit;
    const size = limit;

    params.set("from", from);
    params.set("size", size);

    const API_URL = `${BASE_API_URL}?${params.toString()}`;

    try {
      // res.status(200).json(fetchConfig);
      const response = await fetch(API_URL, fetchConfig);
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response}`);
      }
      const data = await response.json();
      const bc_formated_data = {
        data: data?.hits?.hits.map((i) => i._source),
        meta: {
          pagination: {
            total: data?.hits?.total?.value,
            count: data?.hits?.hits?.length,
            per_page: size,
            current_page: Math.floor(parseInt(from) / parseInt(size)) + 1,
            total_pages: Math.ceil(
              parseInt(data?.hits?.total?.value) / parseInt(size)
            ),
          },
        },
        requestConfig: fetchConfig,
        requestQuery: req.query,
        response: response,
      };
      res.status(200).json(bc_formated_data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products", error });
    }
  }

  if (req.method === "POST") {
    const API_URL = `${BASE_API_URL}`;
    const body = JSON.parse(req.body);
    const page = body?.page || 1;
    const limit = body?.limit || 10;
    const from = (page - 1) * limit;
    const size = limit;
    const categories =
      typeof body.categories === "string"
        ? body.categories.split(",").map(Number)
        : body.categories;

    const new_body = {
      "query": {
        "bool": {
          "filter": [
            {
              "nested": {
                "path": "categories",
                "query": {
                  "bool": {
                    "should": categories.map((i) => ({
                      match: { "categories.id": i },
                    })),
                    "minimum_should_match": 1
                  }
                }
              }
            }
          ]
        }
      },
      "aggs": {
        "unique_brands": {
          "terms": {
            "field": "brand.name.keyword",  
            "size": 1000
          }
        },
        "price_ranges": {
          "range": {
            "field": "price",
            "ranges": [
              { "key": "Under $99", "from": 1, "to": 99 },
              { "key": "$100 - $499", "from": 100, "to": 499 },
              { "key": "$500 - $999", "from": 500, "to": 999 },
              { "key": "$1,000 - $,2400", "from": 1000, "to": 2499 },
              { "key": "$2500 - $4999", "from": 2500, "to": 4999 },
              { "key": "$5000 - $200,000", "from": 5000, "to": 200000 }
            ]
          }
        }
      },
    };
    // insert sort property
    if (body?.sort) {
      new_body.sort = body.sort.split(",").map((i) => {
        const _sort = i.split(":");
        return { [_sort[0]]: _sort[1] };
      });
    }
    // insert from and size property
    new_body.from = from;
    new_body.size = size;
    if (body?.q) {
      const qArray = body.q.trim().split(" ");
      const qString = qArray.map((word) => `*${word}*`).join(" AND ");
      new_body.query.bool.must = {
        query_string: {
          query: qString,
          fields: ["name"],
          default_operator: "AND",
        },
      };
    }

    fetchConfig["body"] = JSON.stringify(new_body);

    try {
      const response = await fetch(API_URL, fetchConfig);

      // if (!response.ok) {
      //   throw new Error(`Error fetching products: ${response}`);
      // }
      const data = await response.json();
      // elasticsearch result restructured to bigcommerce response object
      const bc_formated_data = {
        data: data?.hits?.hits.map((i) => i._source),
        meta: {
          pagination: {
            total: data?.hits?.total?.value,
            count: data?.hits?.hits?.length,
            per_page: size,
            current_page: Math.floor(parseInt(from) / parseInt(size)) + 1,
            total_pages: Math.ceil(
              parseInt(data?.hits?.total?.value) / parseInt(size)
            ),
          },
        },
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
