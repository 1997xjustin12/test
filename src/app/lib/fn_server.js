"use server";
import {
  ES_INDEX,
  exclude_brands,
  exclude_collections,
  createSlug,
  mapCategoryResults,
  formatProduct
} from "@/app/lib/helpers";

// ─── Private: Elasticsearch ──────────────────────────────────────────────────

function getESCredentials() {
  const url = process.env.NEXT_ES_URL;
  const key = process.env.NEXT_ES_API_KEY;
  if (!url || !key) throw new Error("Missing Elasticsearch configuration");
  return { url, apiKey: `apiKey ${key}` };
}

async function esSearch(body, cacheOptions = {}) {
  const { url, apiKey } = getESCredentials();
  const res = await fetch(`${url}/${ES_INDEX}/_search`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    ...cacheOptions,
  });
  if (!res.ok) throw new Error(`Elasticsearch responded ${res.status}`);
  return res.json();
}

// Shared filter used by all catalogue aggregation queries
const publishedQuery = {
  bool: {
    must: [{ term: { published: true } }],
    must_not: [
      { terms: { "brand.keyword": exclude_brands } },
      { terms: { "collections.name.keyword": exclude_collections } },
    ],
  },
};

// ─── Private: Category metadata ──────────────────────────────────────────────

const CATEGORY_SUBS = {
  "grills-and-smokers": [
    "Gas Grill",
    "Kamado Grill",
    "Charcoal Grill",
    "Flat Top Grill",
    "Pizza Oven",
    "Electric Grill",
    "Wood Grill",
    "Pellet Grill",
    "Pellet Grill/Smoker",
  ],
  "heating-and-fire": [
    "Patio Heater",
    "Fireplace",
    "Firebowl",
    "Fire Pit Table",
    "Firebox",
    "Log Sets",
    "Screens",
  ],
  "outdoor-refrigeration": [
    "Compact Refrigerator",
    "Beverage Cooler",
    "Drawer Refrigerator",
    "Ice Maker",
    "Kegerator",
    "Ice Bin Cooler",
    "Wine Cooler",
    "Freezer",
    "Beverage Center",
    "Outdoor Refrigerator",
    "Beverage Refrigerator",
    "Convertible Refrigerator",
    "Wine Cellar + Kegerator",
  ],
  "installation-and-parts": [
    "Refrigerator Door Sleeve",
    "Trim Kit",
    "Insulating Liner",
    "Insulated Sleeve",
    "Insulated Jacket",
    "Insulating Jacket",
    "Insulation Liner",
    "Zero Clearance Liner",
    "Clearance Liner",
    "Insulated Liner",
    "Liner",
    "Grill Liner",
    "Trim or Surround",
    "Kamado Sleeve",
    "Recess Kit",
    "Mounting Bracket",
    "Tube Suspension Kit",
    "Recess Kit/Replacement Part",
    "Controller/Recess Kit",
    "Vent Cap",
    "Protector Plate",
    "Conversion Kits",
  ],
  "outdoor-kitchen-components": [
    "Grill Center",
    "Modano Island",
    "Storage Drawers",
    "Propane Tank Bin",
    "Storage Drawer",
    "Trash Bin",
    "Paper Towel Dispenser",
    "Access Door",
    "Ice Bin",
    "Door & Drawer Combo",
    "Storage Pantry",
    "Ice Bin and Storage",
    "Ice Bin And Storage",
    "Spice Rack",
    "Outdoor Kitchen Cabinet & Storage",
    "Warming Drawer",
    "Cabinet",
    "Storage Package",
    "Trash Chute",
    "Tank Tables",
  ],
  accessories: [
    "Kegerator Tap Kit",
    "Adaptor",
    "Wind Guard",
    "Accessory",
    "Cart",
    "Grill Handle",
    "Steel Grid Cover",
    "Cart Bracket",
    "Bar Accessory",
    "Extension Hose",
    "GFRC Cover",
    "Fire Bowl Cover",
    "Fire Urn Cover",
  ],
  "replacement-parts": [
    "Ice Maker Water Filter",
    "Water Filtration System",
    "Drain Pump",
    "Replacement Door",
    "Replacement Part",
    "Replacement Part/Controller",
    "Replacement Part/Mesh",
    "Replacement Part/Gas Valve",
    "Replacement Part/Manifold Assembly",
    "Controller",
    "Mesh/Replacement Part",
    "Gas Valve",
    "Gas Valves",
    "Mesh",
    "Manifold Assembly",
    "Tube Element",
    "Control Valve",
    "Pilot Assembly",
  ],
  deals: ["Clearance Sale", "Package Deals", "Open Box"],
};

const CATEGORY_DESCRIPTIONS = {
  "grills-and-smokers":
    "Premium gas, charcoal, and wood-pellet grills designed for professional-grade backyard searing and smoking.",
  "heating-and-fire":
    "Enhance your outdoor ambiance with high-efficiency fireplaces, fire pits, and patio heaters for year-round warmth.",
  "outdoor-refrigeration":
    "Keep beverages chilled and ingredients fresh with weather-resistant outdoor refrigerators, kegerators, and wine coolers.",
  "installation-and-parts":
    "Essential mounting kits, gas lines, and structural components to ensure a safe and seamless outdoor kitchen setup.",
  "outdoor-kitchen-components":
    "Durable stainless steel storage drawers, access doors, and built-in islands to complete your custom outdoor space.",
  accessories:
    "Must-have BBQ tools, protective covers, and specialized cookware to maximize your outdoor cooking experience.",
  "replacement-parts":
    "OEM burners, igniters, and grates to maintain your equipment and extend the lifespan of your favorite outdoor appliances.",
  deals:
    "Exclusive savings on top-tier outdoor appliances and essential gear to help you build your dream kitchen for less.",
};

function getCategoryType(category = "") {
  switch (category) {
    case "Grills & Smokers":
    case "Heating & Fire":
    case "Outdoor Kitchen Components":
    case "Outdoor Refrigeration":
      return "outdoor";
    case "Installation & Parts":
    case "Replacement Parts":
      return "technical";
    default:
      return "general";
  }
}

function getCategorySubs(category = "") {
  const raw = CATEGORY_SUBS[createSlug(category)];
  if (!raw) return [];
  return [...new Set(raw.flatMap((item) => item.split("/").map((s) => s.trim())))];
}

function getCategoryDescription(category = "") {
  return CATEGORY_DESCRIPTIONS[createSlug(category)] || "";
}

// ─── Exported server actions ──────────────────────────────────────────────────

export async function fetchUniqueCategories() {
  try {
    const data = await esSearch(
      {
        size: 0,
        query: publishedQuery,
        aggs: {
          unique_categories: {
            terms: { field: "accentuate_data.category", size: 15 },
          },
        },
      },
      { next: { revalidate: 3600 } },
    );
    return data?.aggregations?.unique_categories?.buckets?.map(mapCategoryResults) || [];
  } catch (error) {
    console.error("fetchUniqueCategories:", error);
    return [];
  }
}

export async function fetchBrands() {
  try {
    const data = await esSearch(
      {
        size: 0,
        query: publishedQuery,
        aggs: {
          unique_brands: {
            terms: { field: "brand.keyword", size: 100, order: { _key: "asc" } },
          },
        },
      },
      { next: { revalidate: 3600 } },
    );
    return (
      data?.aggregations?.unique_brands?.buckets?.map((b) => ({
        name: b.key,
        count: b.doc_count,
        slug: createSlug(b.key),
      })) || []
    );
  } catch (error) {
    console.error("fetchBrands:", error);
    return [];
  }
}

export async function getCollectionProducts(id) {
  try {
    // 1. Fetch collection handles from backend
    const response = await fetch(
      `${process.env.NEXT_SOLANA_BACKEND_URL}/api/collections/collection-products/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
          Authorization: `Api-Key ${process.env.NEXT_SOLANA_COLLECTIONS_KEY}`,
        },
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) throw new Error("Backend failed to respond");
    const raw_collection = await response.json();

    // 2. Enrich with full product data from Elasticsearch
    const data = await esSearch(
      {
        query: {
          bool: {
            filter: [
              { terms: { "handle.keyword": raw_collection.map((item) => item?.handle) } },
              { term: { published: true } },
            ],
          },
        },
      },
      { next: { revalidate: 3600 } },
    );
    return data?.hits?.hits?.map((item) => item?._source) || [];
  } catch (error) {
    console.error("getCollectionProducts:", error);
    return [];
  }
}

export async function fetchProduct(product_path) {
  try {
    const data = await esSearch(
      {
        size: 1,
        query: { term: { "handle.keyword": { value: product_path } } },
      },
      { cache: "no-store" },
    );
    const product = formatProduct(data?.hits?.hits?.map((i) => i._source)?.[0]);
    return  product;
  } catch (error) {
    console.error("fetchProduct:", error);
    return null;
  }
}


export async function getReviewsByProductId(product_id) {
  try {
    // 1. Guard clause for missing ID
    if (!product_id) return [];

    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/reviews/list?product_id=${product_id}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN || "",
      },
    });

    // 2. Check for HTTP errors (404, 500, etc.)
    if (!response.ok) {
      console.error(`Fetch error: ${response.status} ${response.statusText}`);
      return [];
    }

    // 3. Safe JSON parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return [];
    }

    const data = await response.json();
    
    // 4. Return the data directly (assuming the API returns { reviews: [] } or just [])
    return data?.reviews || data || [];

  } catch (error) {
    console.error("Proxy Error:", error);
    return [];
  }
}