import { unstable_cache } from "next/cache";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { redis, keys } from "@/app/lib/redis";
import { STORE_NAME } from "@/app/lib/store_constants";

// Default metadata per brand. Grouped per theme rather than chained
// (ISBBQ || ISOKO) ternaries so one brand's title, description and fallback
// favicon stay together and can't drift apart. OKO previously piggybacked on
// BBQ's entry and inherited outlet/open-box wording that doesn't describe it.
const SOLANA = {
  title: `${STORE_NAME} | Stylish Indoor & Outdoor Heating`,
  description: `Transform your home with ${STORE_NAME}! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!`,
  favicon: "/logo-s1.webp",
};

// Echoes the BBQ hero ("Premium Grills. Outlet Prices.") but leads the title
// with the product terms people actually search, and folds the announcement
// bar's shipping threshold and price-match promise into the description.
const BBQ = {
  title: `${STORE_NAME} | Gas Grills & Built-Ins at Outlet Prices`,
  description: `Top-brand gas grills, built-ins and outdoor kitchens — including inspected open-box units up to 35% off retail. Price-match guarantee and free shipping on selected items.`,
  favicon: "/favicon.ico",
};

// Mirrors the OKO storefront's own voice — the competitor price-match promise
// from the announcement bar and the phone-only discounts from the hero. The
// title says "Islands" rather than "Outdoor Kitchens" so it doesn't repeat the
// words already in the brand name.
const OKO = {
  title: `${STORE_NAME} | Built-In BBQ Grills & Islands`,
  description: `Built-in BBQ grills, outdoor kitchen islands and accessories, price matched against every competitor including Amazon. Free shipping on selected items and phone-only deals.`,
  favicon: "/favicon.ico",
};

const BRAND = ISOKO ? OKO : ISBBQ ? BBQ : SOLANA;

/** This brand's favicon when none is set in admin. Also used by /api/favicon. */
export const DEFAULT_FAVICON = BRAND.favicon;

// Read straight from this brand's key, cached under "layout-data" so the
// Favicon & Logo admin can clear it on save. This used to fetch our own
// /api/favicon over HTTP from a module-level `await` in each layout — run once
// when the server started, so an admin change never showed until a redeploy,
// and at build time the request had no server to reach and fell back anyway.
const getFavicon = unstable_cache(
  async () => redis.get(keys.favicon.value),
  ["brand-favicon", keys.favicon.value],
  { revalidate: 86400, tags: ["layout-data"] },
);

export async function generateMetadata() {
  let icon = DEFAULT_FAVICON;
  try {
    const saved = await getFavicon();
    if (typeof saved === "string" && saved) icon = saved;
  } catch (error) {
    console.error("Failed to read favicon, using default:", error);
  }

  return {
    title: BRAND.title,
    description: BRAND.description,
    icons: { icon },
    other: {
      "google-site-verification":
        "h2rOGIJQRMPLIaE7T0hRzFUK313zZjb-QoztYvHW90Q",
    },
  };
}
