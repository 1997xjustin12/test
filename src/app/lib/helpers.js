import brands_json from "@/app/data/filters/brands.json";
import products_json from "@/app/data/filters/products.json";



export function getSum(array, prop) {
  return array.reduce((sum, item) => sum + item?.[prop], 0);
}

export const onsale_category_ids = [294, 360, 361, 362, 363, 364, 365];
export const filter_price_range = [
  // { label: "Request A Quote", min: 0, max: 0 },
  { label: "$1 - $99", min: 1, max: 99 },
  { label: "$100 - $499", min: 100, max: 499 },
  { label: "$500 - $999", min: 500, max: 999 },
  { label: "$1000 - $2499", min: 1000, max: 2499 },
  { label: "$2500 - $4999", min: 2500, max: 4999 },
  { label: "$5000 and UP", min: 5000, max: 100000 },
];

export function createSlug(string, separator = "-") {
  return string
    .toString() // Ensure the input is a string
    .normalize("NFD") // Normalize the string (handles accents/diacritics)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-z0-9]+/g, separator) // Replace non-alphanumeric characters with the separator
    .replace(new RegExp(`\\${separator}+`, "g"), separator); // Collapse multiple separators into one
}

export function getFirstPathSegment(pathname) {
  // Remove leading slash , split by "/", and return the first segment
  return pathname.replace(/^\/+/, "").split("/")[0] || "";
}

export function getCategoryIds(category_slug, categories, bc_categories) {
  const category_keywords = categories.find(
    (i) => i.url === (category_slug === "all-products" ? "" : category_slug)
  )?.key_words;
  if (Array.isArray(category_keywords)) {
    const ids =
      category_keywords.length > 0
        ? bc_categories
            .filter((i) =>
              category_keywords.some((keyword) =>
                i?.url?.path.includes(keyword)
              )
            )
            .map((i) => i.category_id)
        : [];
    return ids;
  } else {
    // console.log(
    //   "lib/helpers.js fn(getCategoryIds):ERROR -> Make sure that key_words property and value are provided in app/data/category.json"
    // );
    return [];
  }
}

function hasEqualValue(array1, array2) {
  return array1.some((value) => array2.includes(value));
}

export function getCategoryFilters(active_filters = {}) {
  const active_categories = active_filters?.["categories:in"]
    ? active_filters["categories:in"]
        .split(",")
        .map((value) => parseInt(value, 10))
    : [];

  let productsList = products_json.filter((i) =>
    hasEqualValue(i.categories, active_categories)
  );

  const active_is_free_shipping = active_filters?.["is_free_shipping"];

  const active_brands = active_filters?.["brand_id:in"]
    ? active_filters?.["brand_id:in"]
        .split(",")
        .map((value) => parseInt(value, 10))
    : null;

  const active_price_range =
    active_filters?.["price:min"] && active_filters?.["price:min"]
      ? `price:${active_filters["price:min"]}-${active_filters["price:max"]}`
      : null;

  const brandsList = brands_json;
  // console.log("brands.length", brandsList.length);
  // Step 1: Extract all unique brand IDs from productsList
  const availableBrandIds = [
    ...new Set(productsList.map((product) => product.brand_id)),
  ];

  if (active_brands !== null) {
    productsList = productsList.filter((i) =>
      active_brands.includes(i.brand_id)
    );
  }

  if (active_price_range !== null) {
    productsList = productsList.filter((i) => {
      const tmp = active_price_range.split(":");
      const price = tmp[1].split("-");
      return i.price >= price[0] && i.price <= price[1];
    });
  }
  // test if no active filter return all info
  const filters = {
    onsale: {
      label: "On Sale",
      prop: "onsale",
      count: 0,
      is_checked: false,
      multi: false,
      options: [],
    },
    free_shipping: {
      label: "Free Shipping",
      prop: "free_shipping",
      count: 0,
      is_checked: active_is_free_shipping ? true : false,
      multi: false,
      options: [],
    },
    brand: {
      label: "Brands",
      prop: "brand",
      count: 0,
      is_checked: false,
      multi: true,
      options: brandsList
        .filter((brand) => availableBrandIds.includes(brand.id))
        .map((i) => ({
          ...i,
          label: i.name,
          prop: `brand:${i.id}`,
          count: productsList.filter((i2) => i2.brand_id === i.id).length,
          is_checked: active_brands ? active_brands.includes(i.id) : false,
        }))
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        }),
    },
    price: {
      label: "Price",
      prop: "price",
      count: 0,
      is_checked: false,
      multi: false,
      options: [
        {
          label: "$1.00 - $99.00",
          prop: "price:1-99",
          count: productsList.filter((i) => i.price > 0 && i.price < 100)
            .length,
          is_checked: active_price_range === "price:1-99",
        },
        {
          label: "$100.00 - $499.00",
          prop: "price:100-499",
          count: productsList.filter((i) => i.price > 99 && i.price < 500)
            .length,
          is_checked: active_price_range === "price:100-499",
        },
        {
          label: "$500.00 - $999.00",
          prop: "price:500-999",
          count: productsList.filter((i) => i.price > 499 && i.price < 1000)
            .length,
          is_checked: active_price_range === "price:500-999",
        },
        {
          label: "$1,000.00 - $2,499.00",
          prop: "price:1000-2499",
          count: productsList.filter((i) => i.price > 999 && i.price < 2500)
            .length,
          is_checked: active_price_range === "price:1000-2499",
        },
        {
          label: "$2,500.00 - $4,999.00",
          prop: "price:2500-4999",
          count: productsList.filter((i) => i.price > 2499 && i.price < 5000)
            .length,
          is_checked: active_price_range === "price:2500-4999",
        },
        {
          label: "$5,000.00 and UP",
          prop: "price:5000-100000",
          count: productsList.filter((i) => i.price > 4999 && i.price < 200000)
            .length,
          is_checked: active_price_range === "price:5000-100000",
        },
      ],
    },
  };

  return filters;
}

export function getCategoryNameById(id, bc_categories) {
  return bc_categories.find(({ category_id }) => category_id === id)?.name;
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal", // Use 'currency' for currency formatting
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function getPageData(pathname, categories) {
  // console.log("lib/helper.js fn(getPageData):params->pathname", pathname);
  // console.log("lib/helper.js fn(getPageData):params->categories", categories);
  return categories.find(({ url }) => url === pathname);
}

export function findParentByUrl(categories, url) {
  // console.log("categories", categories);
  // console.log("url", url);
  // Helper function to recursively search children up to the 3rd level
  function search(children, parent, level = 1) {
    if (level > 3) return null; // Stop searching beyond the 3rd level

    for (const child of children) {
      if (child.url === url) {
        return parent; // Return the parent if a match is found
      }
      if (child.children && child.children.length > 0) {
        const result = search(child.children, child, level + 1);
        if (result) {
          return result; // If a match is found deeper, return it
        }
      }
    }

    return null; // No match found
  }

  // Start searching from the top-level categories
  for (const category of categories) {
    const result = search(category.children || [], category, 1);
    if (result) {
      const result2 = categories.find(({ url }) => url === result.url);
      if (result2) {
        return result2;
      } else {
        return findParentByUrl(categories, result?.url);
      }
    }
  }

  return null; // Return null if no match is found
}

export function isProductOnSale(categories) {
  return categories.filter((i) => onsale_category_ids.includes(i)).length > 0;
}


export const generateId = () => {
  return Math.random().toString(36).substring(2, 11);
};

export const stripHtmlTags = (html) => {
  if (typeof document !== "undefined") {
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.innerText || tempDiv.textContent;
  }
  return html.replace(/<[^>]+>/g, ''); // Fallback for SSR
}
