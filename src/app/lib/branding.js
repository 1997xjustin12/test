import { unstable_cache } from "next/cache";
import { redis, keys } from "@/app/lib/redis";

/**
 * This brand's logo URL and theme colour name, as [logo, color].
 *
 * Cached for a day under "layout-data" — the tag the Favicon & Logo and Theme
 * admin screens and the admin Cache screen already clear — so a page render
 * costs no Redis request. The (checkout) layout is force-dynamic and used to
 * read both keys from Redis on every checkout view.
 */
export const getLogoAndTheme = unstable_cache(
  async () => redis.mget([keys.logo.value, keys.theme.value]),
  ["branding", keys.logo.value, keys.theme.value],
  { revalidate: 86400, tags: ["layout-data"] },
);
