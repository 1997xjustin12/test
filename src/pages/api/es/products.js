import {
  filter_price_range,
} from "@/app/lib/helpers";

//  this hook is used for searching products
export default async function handler(req, res) {
  console.log(filter_price_range)
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
      query: {
        bool: {
          filter: [
            {
              nested: {
                path: "categories",
                query: {
                  bool: {
                    should: categories.map((i) => ({
                      match: { "categories.id": i },
                    })),
                    minimum_should_match: 1,
                  },
                },
              },
            },
          ],
        },
      },
      aggs: {
        free_shipping: {
          filter: {
            term: { is_free_shipping: true },
          },
        },
        brand: {
          composite: {
            size: 1000,
            sources: [
              {
                brand_key: {
                  terms: { script: "return 'brand:' + doc['brand.id'].value" },
                },
              },
              { brand_label: { terms: { field: "brand.name.keyword" } } },
            ],
          },
        },
        price: {
          range: {
            field: "sale_price",
            ranges: 
            filter_price_range.map(i=>({key: `price:${i.min}-${i.max}`, from: parseFloat(i.min).toFixed(2), to: (parseFloat(i.max) + 0.99) }))
          },
        },
      },
    };

    // QUERY INSERTIONS
    if(body?.is_free_shipping && body?.is_free_shipping===1){
      new_body.query.bool.filter.push({ term: { is_free_shipping: true } })
    }

    if(body?.["brand_id:in"]){
      const brands = body["brand_id:in"].split(",");
      const brandFilter = Array.isArray(brands) ? brands : [brands];
      console.log("brandFilter", brandFilter);
      new_body.query.bool.filter.push({
        terms: { "brand.id": brandFilter.map(Number) },
      });
    }

    if(body?.["price"]){
      // validate prices
      const [min, max] = body.price.split("-");
      new_body.query.bool.filter.push({
        range: {
          sale_price: {
            gte: min ? parseFloat(min).toFixed(2) : 0,
            lte: max ? parseFloat(max).toFixed(2) : 1000000
          }
        }
      });
    }

    // insert sort property
    if (body?.sort) {
      new_body.sort = body.sort.split(",").map((i) => {
        const [key, order] = i.split(":");
        return { [key]: {order: order} };
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
        filters: data?.aggregations,
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
        response: data,
      };
      res.status(200).json(bc_formated_data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products", error });
    }
  }
}
