import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.NEXT_UPSTASH_REDIS_REST_URL,
  token: process.env.NEXT_UPSTASH_REDIS_REST_TOKEN,
});


export const keys = {
  menu_lists:{
    description: "used to retreive list of menu keys.",
    value: "solana_menu_list",
  },
  default_menu:{
    description:"default menu",
    value:"menu-vwmuqu8jz",
  },
  active_menu:{
    description: "used to retreive the key of the active or currently used menu.",
    value: "solana_active_menu",
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


export const redisSet = async(key, value) => {
  try{
    const response = await fetch("/api/redis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return await response.json();
  }catch(error){
    console.log(`RedisSetError: ${error}`);
  }
}

export const redisMultiSet = async(obj) => {
  try{
    const response = await fetch("/api/redis", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    return await response.json();
  }catch(error){
    console.log(`RedisMultiSetError: ${error}`);
  }
}

export const redisGet = async(key) =>{
  try {
    const params = new URLSearchParams({"key":key});
    const response = await fetch(`/api/redis?${params.toString()}`,{
      cache:"no-store",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`RedisGetError ${response.status}: ${errorData.error}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`RedisGetError: ${error}`);
  }
}