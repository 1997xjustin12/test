import { Redis } from "@upstash/redis";
import { STORE_ID, storeKey } from "@/app/lib/store";

export const redis = new Redis({
  url: process.env.NEXT_UPSTASH_REDIS_REST_URL,
  token: process.env.NEXT_UPSTASH_REDIS_REST_TOKEN,
});


export const keys = {
  menu_lists: {
    description: "used to retreive list of menu keys for bigcommerce.",
    value: storeKey("menu_list"),
  },
  menu_list_shopify: {
    description: "used to retreive list of menu keys for shopify structure.",
    value: storeKey("shopify_menu_list"),
  },
  default_menu: {
    description: "default menu for bigcommerce product",
    value: "menu-vwmuqu8jz",
  },
  default_shopify_menu: {
    description: "default menu for shopify product",
    value: "menu-7pajm2g8w",
  },
  dev_shopify_menu: {
    description: "menu for development environment",
    value: "menu-5q8vn2rcy",
  },
  dev_shopify_menu_v2: {
    description: "menu for development environment v2",
    value: "menu-2r175z2fj",
  },
  active_menu: {
    description:
      "used to retreive the key of the active or currently used menu (bigcommerce).",
    value: storeKey("active_menu"),
  },
  active_shopify_menu: {
    description:
      "used to retreive the key of the active or currently used menu (shopify).",
    value: storeKey("shopify_active_menu"),
  },
  logo: {
    description: "used to retreive image_url of the logo",
    // Irregular shape (prefix in the middle) - kept verbatim so the existing
    // key keeps resolving. e.g. "admin_solana_market_logo"
    value: `admin_${STORE_ID}_market_logo`,
  },
  favicon: {
    description: "used to retreive image_url of the favicon",
    value: storeKey("favicon"),
  },
  theme: {
    description: "used to retreive theme color",
    value: storeKey("theme"),
  },
  feed_status: {
    description:
      "last merchant-feed generation result (mode, source, item count, duration, error). Store-scoped.",
    value: storeKey("feed_status"),
  },
  page_seo: {
    description:
      "per-route SEO overrides for the app's own pages (home, cart, legal, account...). Store-scoped, so each brand keeps its own copy.",
    value: storeKey("page_seo"),
  },
  cache_status: {
    description:
      "last cache-clear result (groups, tags, paths, Redis keys deleted, duration, error). Store-scoped.",
    value: storeKey("cache_status"),
  },
  faqs_about_brand: {
    description: "section faqs about brand on single product page",
    // Prefix appears twice by design. e.g. "solana_faqs_about_solana"
    value: `${STORE_ID}_faqs_about_${STORE_ID}`,
  },
  faqs_shipping_policy: {
    description: "section faqs shipping policy on single product page",
    value: storeKey("faqs_shipping_policy"),
  },
  faqs_return_policy: {
    description: "section faqs return policy on single product page",
    value: storeKey("faqs_return_policy"),
  },
  faqs_warranty: {
    description: "section faqs warranty on single product page",
    value: storeKey("faqs_warranty"),
  },
};

export const redisSet = async (key, value) => {
  try {
    const response = await fetch("/api/redis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return await response.json();
  } catch (error) {
    console.log(`RedisSetError: ${error}`);
  }
};

export const redisMultiSet = async (obj) => {
  try {
    const response = await fetch("/api/redis", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    return await response.json();
  } catch (error) {
    console.log(`RedisMultiSetError: ${error}`);
  }
};

export const redisGet = async (key) => {
  try {
    const params = new URLSearchParams({ key: key });
    const response = await fetch(`/api/redis?${params.toString()}`, {
      cache: "no-store",
    });
    if (!response?.ok) {
      const errorData = await response.json();
      throw new Error(`RedisGetError ${response.status}: ${errorData.error}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`RedisGetError: ${error}`);
  }
};

export const updatePopularSearches = async (req, res) => {
  if (req.method === "POST") {
    const { term } = req.body;
    if (!term) return res.status(400).json({ error: "Search term required" });

    // Increment score for this term in sorted set
    await redis.zincrby("popular_searches", 1, term.toLowerCase());

    return res.status(200).json({ message: "Search recorded" });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
