import { redis, keys } from "@/app/lib/redis";
import { DEFAULT_FAVICON } from "@/app/metadata";
const faviconKey = keys.favicon.value;

export default async function handler(req, res) {
  try {
    const favicon = await redis.get(faviconKey);

    if (!favicon) {
      // This brand's own default — it used to be Solana's icon on every brand.
      return res.status(200).json(DEFAULT_FAVICON);
    }

    // Check if stored as Base64 or URL
    if (favicon.startsWith("data:image")) {
      res.setHeader("Content-Type", "image/png"); // Adjust if using a different format
      const base64Data = favicon.split(",")[1]; // Remove metadata
      const buffer = Buffer.from(base64Data, "base64");
      return res.send(buffer);
    } else {
    //   res.headers.set("Access-Control-Allow-Origin", "*");
      return res.status(200).json(favicon); // Redirect to the stored URL
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
