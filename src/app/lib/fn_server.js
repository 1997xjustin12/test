"use server";
import {
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
  };

  const extracted = subs[createSlug(category)];

  const uniqueSub = [
    ...new Set(
      extracted.flatMap((item) => item.split("/").map((s) => s.trim())),
    ),
  ];
  return uniqueSub;
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
          slug: slug,
          image: `/images/categories/${slug}.webp`, // insert images which are named base on slug
          type: getCategoryType(b.key),
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

// {
//     "id": "8ohr6y5oc",
//     "menu_id": "8ohr6y5oc",
//     "parent_id": "",
//     "key": "Freestanding Grills",
//     "name": "Freestanding Grills",
//     "url": "freestanding-grills",
//     "slug": "freestanding-grills",
//     "origin_name": "Freestanding Grills",
//     "children": [
//         {
//             "id": "hcnzcpay2",
//             "menu_id": "hcnzcpay2",
//             "parent_id": "",
//             "key": "Shop Blaze Freestanding Grills",
//             "name": "Shop Blaze Freestanding Grills",
//             "url": "shop-blaze-freestanding-grills",
//             "slug": "shop-blaze-freestanding-grills",
//             "origin_name": "Shop Blaze Freestanding Grills",
//             "children": [],
//             "price_visibility": "hide",
//             "meta_title": "",
//             "meta_description": "",
//             "banner": {
//                 "img": {
//                     "src": "/images/banner/shop-blaze-freestanding-grills.webp",
//                     "alt": "Banner Image"
//                 },
//                 "title": "",
//                 "tag_line": ""
//             },
//             "page_contact_number": null,
//             "searchable": true,
//             "nav_visibility": true,
//             "nav_type": "custom_page",
//             "order": 0,
//             "parentId": "8ohr6y5oc",
//             "depth": 1,
//             "index": 0,
//             "isLast": false,
//             "parent": null,
//             "collection_display": {
//                 "id": 955,
//                 "name": "Blaze Freestanding Grills",
//                 "slug": "blaze-freestanding-grills",
//                 "image": null,
//                 "description": "",
//                 "is_active": true,
//                 "categories": [],
//                 "brands": [],
//                 "tags": [],
//                 "created_at": "2025-10-09T07:55:27.727884Z",
//                 "updated_at": "2025-10-09T07:55:27.727920Z"
//             },
//             "filter_type": "freestanding-grills-x-brands",
//             "feature_image": "/images/feature/blaze-freestanding-grills.webp"
//         },
//         {
//             "id": "6t1evg64s",
//             "menu_id": "6t1evg64s",
//             "parent_id": "",
//             "key": "Shop Bull Freestanding Grills",
//             "name": "Shop Bull Freestanding Grills",
//             "url": "shop-bull-freestanding-grills",
//             "slug": "shop-bull-freestanding-grills",
//             "origin_name": "Shop Bull Freestanding Grills",
//             "children": [],
//             "price_visibility": "hide",
//             "meta_title": "",
//             "meta_description": "",
//             "banner": {
//                 "img": {
//                     "src": "/images/banner/shop-bull-freestanding-grills.webp",
//                     "alt": "Banner Image"
//                 },
//                 "title": "",
//                 "tag_line": ""
//             },
//             "page_contact_number": null,
//             "searchable": true,
//             "nav_visibility": true,
//             "nav_type": "custom_page",
//             "order": 1,
//             "parentId": "8ohr6y5oc",
//             "depth": 1,
//             "index": 1,
//             "isLast": false,
//             "parent": null,
//             "feature_image": "/images/feature/bull-freestanding-grills.webp",
//             "collection_display": {
//                 "id": 957,
//                 "name": "Bull Freestanding Grills",
//                 "slug": "bull-freestanding-grills",
//                 "image": null,
//                 "description": "",
//                 "is_active": true,
//                 "categories": [],
//                 "brands": [],
//                 "tags": [],
//                 "created_at": "2025-10-09T08:05:04.881608Z",
//                 "updated_at": "2025-10-09T08:05:04.881626Z"
//             },
//             "filter_type": "freestanding-grills-x-brands"
//         },
//         {
//             "id": "j8wbs51n0",
//             "menu_id": "j8wbs51n0",
//             "parent_id": "",
//             "key": "Shop Twin Eagles Freestanding Grills",
//             "name": "Shop Twin Eagles Freestanding Grills",
//             "url": "shop-twin-eagles-freestanding-grills",
//             "slug": "shop-twin-eagles-freestanding-grills",
//             "origin_name": "Shop Twin Eagles Freestanding Grills",
//             "children": [],
//             "price_visibility": "hide",
//             "meta_title": "",
//             "meta_description": "",
//             "banner": {
//                 "img": {
//                     "src": "/images/banner/shop-twin-eagles-freestanding-grills.webp",
//                     "alt": "Banner Image"
//                 },
//                 "title": "",
//                 "tag_line": ""
//             },
//             "page_contact_number": null,
//             "searchable": true,
//             "nav_visibility": true,
//             "nav_type": "custom_page",
//             "order": 2,
//             "parentId": "8ohr6y5oc",
//             "depth": 1,
//             "index": 2,
//             "isLast": false,
//             "parent": null,
//             "collection_display": {
//                 "id": 959,
//                 "name": "Twin Eagles Freestanding Grills",
//                 "slug": "twin-eagles-freestanding-grills",
//                 "image": null,
//                 "description": "",
//                 "is_active": true,
//                 "categories": [],
//                 "brands": [],
//                 "tags": [],
//                 "created_at": "2025-10-09T08:53:09.258639Z",
//                 "updated_at": "2025-10-09T08:53:09.258657Z"
//             },
//             "filter_type": "freestanding-grills-x-brands",
//             "feature_image": "/images/feature/twin-eagles-freestanding-grills.webp"
//         },
//         {
//             "id": "zvnxn2g3c",
//             "menu_id": "zvnxn2g3c",
//             "parent_id": "",
//             "key": "Shop All Freestanding Grills",
//             "name": "Shop All Freestanding Grills",
//             "url": "shop-all-freestanding-grills",
//             "slug": "shop-all-freestanding-grills",
//             "origin_name": "Shop All Freestanding Grills",
//             "children": [],
//             "price_visibility": "hide",
//             "meta_title": "",
//             "meta_description": "",
//             "banner": {
//                 "img": {
//                     "src": "/images/banner/shop-all-freestanding-grills.webp",
//                     "alt": "Banner Image"
//                 },
//                 "title": "",
//                 "tag_line": ""
//             },
//             "page_contact_number": null,
//             "searchable": true,
//             "nav_visibility": true,
//             "nav_type": "custom_page",
//             "order": 3,
//             "parentId": "8ohr6y5oc",
//             "depth": 1,
//             "index": 3,
//             "isLast": true,
//             "parent": null,
//             "collection_display": {
//                 "id": 962,
//                 "name": "Shop All Freestanding Grills",
//                 "slug": "shop-all-freestanding-grills",
//                 "image": null,
//                 "description": "",
//                 "is_active": true,
//                 "categories": [],
//                 "brands": [],
//                 "tags": [
//                     "Freestanding Charcoal Grills",
//                     "Freestanding Electric Grills",
//                     "Freestanding Gas Grills",
//                     "Freestanding Kamado Grills",
//                     "Freestanding Pellet Grills",
//                     "Shop All Freestanding Grills"
//                 ],
//                 "created_at": "2025-10-28T07:37:00.932340Z",
//                 "updated_at": "2025-10-28T07:41:40.649518Z"
//             },
//             "filter_type": "freestanding-grills",
//             "feature_image": "/images/feature/freestanding-grills.webp"
//         }
//     ],
//     "price_visibility": "hide",
//     "meta_title": "",
//     "meta_description": "",
//     "banner": {
//         "img": {
//             "src": null,
//             "alt": ""
//         },
//         "title": "",
//         "tag_line": ""
//     },
//     "page_contact_number": null,
//     "searchable": true,
//     "nav_visibility": true,
//     "nav_type": "custom_page",
//     "order": 4,
//     "parentId": null,
//     "depth": 0,
//     "index": 4,
//     "isLast": false,
//     "parent": null,
//     "collapsed": true,
//     "filter_type": "freestanding-grills",
//     "is_base_nav": true
// }
