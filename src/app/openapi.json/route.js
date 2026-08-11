import { STORE_NAME } from "@/app/lib/store_constants";
import { BASE_URL } from "@/app/lib/helpers";

/**
 * GET /openapi.json — machine-readable description of the catalogue API.
 *
 * Requirement 3 of the client brief asks for this at
 * /.well-known/openapi.json. That path is not a registered well-known URI and
 * nothing discovers it automatically, so the spec is served here at the
 * conventional path and mirrored there for compatibility. Real discovery comes
 * from /llms.txt linking to it explicitly.
 */
export const revalidate = 86400;

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${STORE_NAME} Catalogue API`,
      version: "1.0.0",
      description:
        "Read-only catalogue access for AI agents and assistants. Search the " +
        "product catalogue and resolve a handle to full product detail, " +
        "without scraping rendered pages. Rate limited; responses carry " +
        "RateLimit-* headers and answer 429 with Retry-After when exhausted.",
    },
    servers: [{ url: BASE_URL || "/" }],
    paths: {
      "/api/catalog/search": {
        get: {
          operationId: "searchProducts",
          summary: "Search the product catalogue",
          description:
            "Free-text search with optional brand, category and price filters. " +
            "Returns a compact result set suitable for shortlisting.",
          parameters: [
            { name: "q", in: "query", schema: { type: "string", maxLength: 200 },
              description: "Free-text query over title, brand, SKU and product type." },
            { name: "brand", in: "query", schema: { type: "string" },
              description: "Exact brand name, e.g. \"Blaze Outdoor Products\"." },
            { name: "category", in: "query", schema: { type: "string" },
              description: "Exact category name, e.g. \"Grills & Smokers\"." },
            { name: "min_price", in: "query", schema: { type: "number", minimum: 0 } },
            { name: "max_price", in: "query", schema: { type: "number", minimum: 0 } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50, default: 20 } },
            { name: "offset", in: "query", schema: { type: "integer", minimum: 0, maximum: 1000, default: 0 } },
          ],
          responses: {
            200: {
              description: "Matching products",
              content: { "application/json": { schema: { $ref: "#/components/schemas/SearchResponse" } } },
            },
            400: { $ref: "#/components/responses/BadRequest" },
            429: { $ref: "#/components/responses/RateLimited" },
            502: { $ref: "#/components/responses/Upstream" },
          },
        },
      },
      "/api/catalog/product/{handle}": {
        get: {
          operationId: "getProduct",
          summary: "Get one product by handle",
          description:
            "Full detail for a single product, including itemised " +
            "specifications. Handles come from searchProducts.",
          parameters: [
            { name: "handle", in: "path", required: true, schema: { type: "string", maxLength: 200 } },
          ],
          responses: {
            200: {
              description: "The product",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ProductResponse" } } },
            },
            404: { $ref: "#/components/responses/NotFound" },
            429: { $ref: "#/components/responses/RateLimited" },
            502: { $ref: "#/components/responses/Upstream" },
          },
        },
      },
    },
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            retryAfter: { type: "integer", description: "Seconds; present on 429 only." },
          },
          required: ["error", "message"],
        },
        Store: {
          type: "object",
          properties: { id: { type: "string" }, name: { type: "string" } },
        },
        ProductSummary: {
          type: "object",
          properties: {
            title: { type: "string" },
            handle: { type: "string", description: "Pass to getProduct for full detail." },
            brand: { type: ["string", "null"] },
            category: { type: ["string", "null"] },
            type: { type: ["string", "null"] },
            sku: { type: ["string", "null"] },
            price: { type: ["number", "string", "null"] },
            currency: { type: "string", examples: ["USD"] },
            availability: { type: "string", enum: ["InStock", "OutOfStock"],
              description: "Derived from the published flag, not a live warehouse feed." },
            image: { type: ["string", "null"] },
            url: { type: ["string", "null"] },
          },
        },
        SearchResponse: {
          type: "object",
          properties: {
            store: { $ref: "#/components/schemas/Store" },
            query: { type: "object" },
            total: { type: "integer" },
            count: { type: "integer" },
            results: { type: "array", items: { $ref: "#/components/schemas/ProductSummary" } },
          },
        },
        ProductResponse: {
          type: "object",
          properties: {
            store: { $ref: "#/components/schemas/Store" },
            product: {
              allOf: [
                { $ref: "#/components/schemas/ProductSummary" },
                {
                  type: "object",
                  properties: {
                    description: { type: ["string", "null"] },
                    gtin: { type: ["string", "null"] },
                    compare_at_price: { type: ["number", "string", "null"] },
                    rating: { type: ["number", "null"] },
                    review_count: { type: ["integer", "null"] },
                    specifications: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: { name: { type: "string" }, value: { type: "string" } },
                      },
                    },
                    images: { type: "array", items: { type: "string" } },
                  },
                },
              ],
            },
          },
        },
      },
      responses: {
        BadRequest: { description: "Invalid parameters",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        NotFound: { description: "No such product",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        RateLimited: { description: "Rate limit exceeded; see Retry-After",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        Upstream: { description: "Catalogue backend unavailable",
          content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  };

  return Response.json(spec, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
