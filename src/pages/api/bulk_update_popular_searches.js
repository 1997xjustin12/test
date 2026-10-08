import { redis } from "../../app/lib/redis";
import { getAdminUser, isDevBypass } from "@/app/lib/admin-auth";

/**
 * Seeds the popular-searches list in bulk. An operator tool.
 *
 * Admin-only as of 8 October 2026. It had no authentication at all, took the
 * increment from the request body and defaulted it to 50 — so one
 * unauthenticated POST could set what the storefront suggests to every
 * visitor, and the example payload in its own 400 response spelled out the
 * shape to send.
 *
 * Nothing in the app calls this; it is run by hand when the list needs
 * seeding, which is why requiring an admin session costs nothing. The
 * storefront's own write path is add_popular_searches — open, because the
 * browser has no credential to offer, but fixed at +1 and rate-limited.
 *
 * A 404 rather than a 401, matching the rest of the admin surface: a 401 tells
 * a prober the endpoint is real and worth coming back to.
 */
export default async function handler(req, res) {
  const isAdmin = isDevBypass(req.headers.host) || Boolean(await getAdminUser(req));
  if (!isAdmin) {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { keywords, incrementBy = 50 } = req.body;

    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        error: "keywords array required",
        example: {
          keywords: [
            "Bull Open Box",
            "Bull Built-In Grills",
            "Bull Freestanding Grills",
            "Bull Side Burners",
            "Bull Storage",
            "Bull Refrigeration",
            "Bull Accessories",
            "Blaze Open Box",
            "Blaze Built-In Grills",
            "Blaze Freestanding Grills",
            "Blaze Side Burners",
            "Blaze Storage",
            "Blaze Refrigeration",
            "Blaze Accessories",
            "Twin Eagles Open Box",
            "Twin Eagles Built-In Grills",
            "Twin Eagles Freestanding Grills",
            "Twin Eagles Side Burners",
            "Twin Eagles Storage",
            "Twin Eagles Refrigeration",
            "Twin Eagles Accessories",
            "Eloquence Open Box",
            "Eloquence Built-In Grills",
            "Eloquence Freestanding Grills",
            "Eloquence Side Burners",
            "Eloquence Storage",
            "Eloquence Refrigeration",
            "Eloquence Accessories",
          ],
          incrementBy: 50, // optional, default 50
        },
      });
    }

    const results = [];

    // Update each keyword's score
    for (const keyword of keywords) {
      const term = keyword.toLowerCase().trim();
      if (!term) continue;

      // Increment the score by the specified amount
      const newScore = await redis.zincrby(
        "popular:searches",
        incrementBy,
        term
      );
      results.push({ term, newScore: parseFloat(newScore) });
    }

    return res.status(200).json({
      success: true,
      updated: results.length,
      results,
    });
  } catch (err) {
    console.error("Error updating popular searches:", err);
    return res.status(500).json({ error: err.message });
  }
}
