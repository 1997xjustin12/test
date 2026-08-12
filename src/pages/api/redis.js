import { redis } from "app/lib/redis";
import { getAdminUser, isDevBypass } from "@/app/lib/admin-auth";

/**
 * Generic Redis access for the admin screens.
 *
 * This endpoint used to accept unauthenticated GET, POST, PUT and DELETE
 * against any key in the keyspace — the menu, store settings, Page SEO and
 * every brand's configuration, publicly readable, writable and deletable.
 * Gating /admin alone would not have fixed that: the admin UI is only one
 * client of this route, and an attacker has no reason to use the UI at all.
 *
 * Access now splits in two:
 *
 *   admin session   full read/write/delete, as the admin screens need
 *   everyone else   the abandoned-cart keys only, which the storefront
 *                   genuinely reads and writes from the browser
 *
 * The public carve-out is deliberately narrow. `abandoned:<cart_id>` is the
 * only key an ordinary visitor's browser touches (context/cart.js and
 * context/auth.js), it holds a timestamp, and the cart id is a UUID the caller
 * already possesses. Anything wider would re-open the hole this closes.
 */

/** Exactly `abandoned:<id>` — no wildcards, no separators, no key traversal. */
const PUBLIC_KEY_PATTERN = /^abandoned:[A-Za-z0-9_-]{1,128}$/;

const isPublicKey = (key) => typeof key === "string" && PUBLIC_KEY_PATTERN.test(key);

/**
 * Abandoned-cart records are a timestamp or null. Constraining the value keeps
 * the public path from being used as free storage.
 */
const isPublicValue = (value) =>
  value === null || (typeof value === "number" && Number.isFinite(value));

const denied = (res) => res.status(404).json({ error: "Not found" });

export default async function handler(req, res) {
  const isAdmin =
    isDevBypass(req.headers.host) || Boolean(await getAdminUser(req));

  if (req.method === "POST") {
    // Post for writing value in redis
    try {
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: `Key and Value are required` });
      }
      if (!isAdmin && !(isPublicKey(key) && isPublicValue(value))) {
        return denied(res);
      }
      await redis.set(key, JSON.stringify(value)); // Store as JSON
      return res.status(200).json({ success: true, message: `Saved successfully` });
    } catch (error) {
      // The request body was echoed into this message, which put whatever was
      // posted — headers included — into the response and the logs.
      console.error("Redis write error:", error);
      return res.status(500).json({ error: `failed to write data to redis.` });
    }
  } else if (req.method === "PUT") {
    // PUT for writing multiple values in redis. Admin only: no storefront path
    // writes in bulk.
    if (!isAdmin) return denied(res);
    try {
      const data = req.body;

      // Convert nulls to empty strings
      const sanitizedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value ?? ""])
      );

      await redis.mset(sanitizedData);

      // Read back to verify
      const storedValues = await redis.mget(...Object.keys(sanitizedData));

      return res.json({
        success: true,
        message: "Saved successfully",
        saved: storedValues,
        params: sanitizedData,
      });
    } catch (error) {
      console.error("Redis Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { key } = req.query;

      if (!key) return res.status(400).json({ error: "Key is required" });

      const mkey = key.split(",");
      if (!isAdmin && !mkey.every(isPublicKey)) return denied(res);

      // if key is an array use mget to get multiple values
      const data = mkey.length > 1 ? await redis.mget(mkey) : await redis.get(key);

      return res.status(200).json(data);
    } catch (error) {
      console.error("Redis read error:", error);
      return res.status(500).json({ error: "failed to read data from redis." });
    }
  } else if (req.method === "DELETE") {
    if (!isAdmin) return denied(res);
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: "Key is required" });
      await redis.del(key);
      return res
        .status(200)
        .json({ success: true, message: `Delete successfully key:${key}` });
    } catch (error) {
      console.error("Redis delete error:", error);
      return res.status(500).json({ error: "failed to delete data from redis." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
