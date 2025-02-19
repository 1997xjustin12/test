import { redis } from "app/lib/redis";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  let params = new URLSearchParams(req.query);
  const id = req.query.id;
  params.delete("id");
  params = params.toString();
  const API_URL = `${process.env.NEXT_PUBLIC_BC_STORE_API}/catalog/products/${id}/?${params}`;
  const API_TOKEN = process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN; // Replace with your BigCommerce API token

  // redis
  const cacheKey = `bigcommerce:${CryptoJS.SHA256(API_URL).toString(
    CryptoJS.enc.Hex
  )}`;

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    cachedData["redisKey"] = cacheKey;
    cachedData["fromRedis"] = true;
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "X-Auth-Token": API_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }
    const data = await response.json();

    // save to redis
    await redis.set(cacheKey, data, { ex: 3600 });
    data["redisKey"] = cacheKey;
    data["fromRedis"] = false;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: `Failed to fetch product ${API_URL}` });
  }
}
