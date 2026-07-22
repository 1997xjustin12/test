import { BASE_URL, ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";
export async function generateMetadata() {
  const title = ISBBQ
    ? `${STORE_NAME} | Premium Grills at Outlet Prices`
    : `${STORE_NAME} | Stylish Indoor & Outdoor Heating`;
  const description = ISBBQ
    ? `Shop ${STORE_NAME} for top-brand gas grills, built-ins, and outdoor kitchens — including inspected open-box deals at up to 35% off retail.`
    : `Transform your home with ${STORE_NAME}! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!`;
  const defaultFavicon = ISBBQ ? "/favicon.ico" : "/logo-s1.webp";
  try {
    const res = await fetch(`${BASE_URL}/api/favicon`); // Fetch from API
    const data = await res.json();
    const faviconUrl = data; // Use default if API fails

    return {
      title: title,
      description: description,
      icons: {
        icon: faviconUrl,
      },
      other: {
        "google-site-verification":
          "h2rOGIJQRMPLIaE7T0hRzFUK313zZjb-QoztYvHW90Q",
      },
    };
  } catch (error) {
    console.error("Failed to fetch favicon, using default:", error);
    return {
      title: title,
      description: description,
      icons: {
        icon: defaultFavicon, // Default favicon from public/
      },
    };
  }
}
