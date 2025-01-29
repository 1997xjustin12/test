import {
  onsale_category_ids,
  filter_price_range,
  formatPrice,
} from "../../src/app/lib/helpers";
import { brands } from "../../src/app/lib/category-helpers";

export default async function handler(req, res) {
  const params = new URLSearchParams(req.query);
  const CategoriesIn = params.get("categories:in")
    ? params
        .get("categories:in")
        .split(",")
        .map((i) => parseInt(i))
    : [];
  const API_URL = `${
    process.env.NEXT_PUBLIC_BC_STORE_API
  }/catalog/products?${params.toString()}`;
  const API_TOKEN = process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN; // Replace with your BigCommerce API token

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
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products", err_obj: error });
  }
}
