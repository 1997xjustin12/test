"use server";
import {
  BASE_URL,
  ES_INDEX,
  exclude_brands,
  exclude_collections,
  createSlug,
} from "@/app/lib/helpers";

function getCategoryType(category = "") {
  // used for displaying categories in categories page
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
  const subs = {
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
    "deals": [
      "Clearance Sale",
      "Package Deals",
      "Open Box"
    ],
  };

  const extracted = subs[createSlug(category)];

  const uniqueSub = [
    ...new Set(
      extracted.flatMap((item) => item.split("/").map((s) => s.trim())),
    ),
  ];
  return uniqueSub;
}

function getCategoryDescription(category = "") {
  const desc = {
    "grills-and-smokers": "Premium gas, charcoal, and wood-pellet grills designed for professional-grade backyard searing and smoking.",
    "heating-and-fire": "Enhance your outdoor ambiance with high-efficiency fireplaces, fire pits, and patio heaters for year-round warmth.",
    "outdoor-refrigeration": "Keep beverages chilled and ingredients fresh with weather-resistant outdoor refrigerators, kegerators, and wine coolers.",
    "installation-and-parts": "Essential mounting kits, gas lines, and structural components to ensure a safe and seamless outdoor kitchen setup.",
    "outdoor-kitchen-components": "Durable stainless steel storage drawers, access doors, and built-in islands to complete your custom outdoor space.",
    accessories: "Must-have BBQ tools, protective covers, and specialized cookware to maximize your outdoor cooking experience.",
    "replacement-parts": "OEM burners, igniters, and grates to maintain your equipment and extend the lifespan of your favorite outdoor appliances.",
    "deals": "Exclusive savings on top-tier outdoor appliances and essential gear to help you build your dream kitchen for less."
  };

  return desc[createSlug(category)] || "";
}

export async function fetchUniqueCategories() {
  try {
    const ESURL = process.env.NEXT_ES_URL;
    const ESShard = ES_INDEX;
    const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

    const queryBody = {
      size: 0,
      query: {
        bool: {
          must: [{ term: { published: true } }],
          must_not: [
            { terms: { "brand.keyword": exclude_brands } },
            { terms: { "collections.name.keyword": exclude_collections } },
          ],
        },
      },
      aggs: {
        unique_categories: {
          terms: {
            field: "accentuate_data.category",
            size: 15, // Senior Tip: Keep this reasonable for UI performance
          },
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
      body: JSON.stringify(queryBody),
    };

    const res = await fetch(`${ESURL}/${ESShard}/_search`, fetchConfig);

    const data = await res.json();
    return (
      data?.aggregations?.unique_categories?.buckets?.map((b) => {
        const slug = createSlug(b.key);
        return {
          name: b.key,
          count: b.doc_count,
          slug: slug,
          image: `/images/categories/${slug}.webp`, // insert images which are named base on slug
          type: getCategoryType(b.key),
          description: getCategoryDescription(b.key),
          sub: (getCategorySubs(b.key) || []).join(" · "),
          nav_type: "category1",
        };
      }) || []
    );
  } catch (error) {
    console.error("ES Fetch Error:", error);
    return [];
  }
}

export async function fetchBrands() {
  try {
    const ESURL = process.env.NEXT_ES_URL;
    const ESShard = ES_INDEX;
    const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

    const queryBody = {
      size: 0,
      query: {
        bool: {
          must: [{ term: { published: true } }],
          must_not: [
            { terms: { "brand.keyword": exclude_brands } },
            { terms: { "collections.name.keyword": exclude_collections } },
          ],
        },
      },
      aggs: {
        unique_brands: {
          terms: {
            field: "brand.keyword", // Target the brand field
            size: 100, // Increased size to capture all/most brands
            order: { _key: "asc" }, // Alphabetical order
          },
        },
      },
    };

    const fetchConfig = {
      method: "POST",
      next: { revalidate: 3600 }, // Better than no-store for brand lists
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(queryBody),
    };

    const res = await fetch(`${ESURL}/${ESShard}/_search`, fetchConfig);
    const data = await res.json();

    // Map the buckets to your brand object structure
    return (
      data?.aggregations?.unique_brands?.buckets?.map((b) => {
        const brandSlug = createSlug(b.key);
        return {
          name: b.key,
          count: b.doc_count,
          slug: brandSlug,
        };
      }) || []
    );
  } catch (error) {
    console.error("ES Brand Fetch Error:", error);
    return [];
  }
}

export async function getCollectionProducts(id) {
  try {
    // 1. Fetch from your backend (external URL is safe during build)
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/collections/collection-products/${id}`;
    const key = `Api-Key ${process.env.NEXT_SOLANA_COLLECTIONS_KEY}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
        Authorization: key,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) throw new Error("Backend failed to respond");

    const raw_collection = await response.json();

    // 2. Fetch from Elasticsearch
    const ESURL = process.env.NEXT_ES_URL;
    const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

    const es_query = {
      query: {
        bool: {
          filter: [
            {
              terms: {
                "handle.keyword": raw_collection.map((item) => item?.handle),
              },
            },
            {
              term: { published: true },
            },
          ],
        },
      },
    };

    const esResponse = await fetch(`${ESURL}/${ES_INDEX}/_search`, {
      method: "POST",
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(es_query),
      next: { revalidate: 3600 }
    });

    const data = await esResponse.json();

    // 3. RETURN the data directly (Don't use res.status)
    return data?.hits?.hits?.map((item) => item?._source) || [];

  } catch (error) {
    console.error("Data Fetch Error:", error);
    // Return empty array so the UI doesn't crash if the search fails
    return []; 
  }
}