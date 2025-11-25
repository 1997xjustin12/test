import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";
export async function generateMetadata() {
  const title = `${STORE_NAME} | Stylish Indoor & Outdoor Heating`;
  const description = `Transform your home with ${STORE_NAME}! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!`;
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
        icon: "/logo-s1.webp", // Default favicon from public/
      },
    };
  }
}
