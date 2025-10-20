import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.NEXT_UPSTASH_REDIS_REST_URL,
  token: process.env.NEXT_UPSTASH_REDIS_REST_TOKEN,
});


export const keys = {
  menu_lists:{
    description: "used to retreive list of menu keys for bigcommerce.",
    value: "solana_menu_list",
  },
  menu_list_shopify:{
    description: "used to retreive list of menu keys for shopify structure.",
    value: "solana_shopify_menu_list",
  },
  default_menu:{
    description:"default menu for bigcommerce product",
    value:"menu-vwmuqu8jz",
  },
  default_shopify_menu:{
    description:"default menu for shopify product",
    value:"menu-7pajm2g8w",
  },
  dev_shopify_menu:{
    description:"menu for development environment",
    value: "menu-5q8vn2rcy",
  },
  dev_shopify_menu_v2:{
    description:"menu for development environment v2",
    value:"menu-2r175z2fj",
  },
  active_menu:{
    description: "used to retreive the key of the active or currently used menu (bigcommerce).",
    value: "solana_active_menu",
  },
  active_shopify_menu:{
    description: "used to retreive the key of the active or currently used menu (shopify).",
    value: "solana_shopify_active_menu",
  },
  logo:{
    description: "used to retreive image_url of the logo",
    value: "admin_solana_market_logo"
  },
  favicon:{
    description: "used to retreive image_url of the favicon",
    value: "solana_favicon"
  },
  theme:{
    description: "used to retreive theme color",
    value: "solana_theme"
  },
  faqs_about_solana:{
    description: "section faqs about solana on single product page",
    value: "solana_faqs_about_solana"
  },
  faqs_shipping_policy:{
    description: "section faqs shipping policy on single product page",
    value: "solana_faqs_shipping_policy"
  },
  faqs_return_policy:{
    description: "section faqs return policy on single product page",
    value: "solana_faqs_return_policy"
  },
  faqs_warranty:{
    description: "section faqs warranty on single product page",
    value: "solana_faqs_warranty"
  }
}


// ✅ Safe server-side access
export const redisGet = async (key) => {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
};

export const redisSet = async (key, value) => {
  try {
    return await redis.set(key, value);
  } catch (error) {
    console.error("Redis SET error:", error);
    return null;
  }
};

export const redisMultiSet = async (obj) => {
  try {
    const pipeline = redis.pipeline();
    Object.entries(obj).forEach(([key, value]) => {
      pipeline.set(key, value);
    });
    return await pipeline.exec();
  } catch (error) {
    console.error("Redis MULTI SET error:", error);
    return null;
  }
};

export const updatePopularSearches = async(req, res) => {
  if (req.method === "POST") {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Search term required" });

    // Increment score for this term in sorted set
    await redis.zincrby("popular_searches", 1, term.toLowerCase());

    return res.status(200).json({ message: "Search recorded" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}