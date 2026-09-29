/**
 * Where a brand's configured homepage lives.
 *
 * One record per brand, under a store-scoped key — `solana_home_page`,
 * `bbq_home_page`, `oko_home_page` — so the three storefronts share this
 * codebase and the section library while each keeps its own page. That comes
 * free from storeKey(); see lib/store.js.
 *
 * The record:
 *   { enabled: boolean, sections: [ … ], updatedAt: ISO string }
 *
 * `enabled` is the switch between the configured page and the existing
 * hardcoded homepage, and it defaults to false. A brand with no record, or with
 * a record it has not finished, keeps the homepage it has today — which is what
 * makes this safe to build with while BBQ and OKO have no designs yet.
 */
import fs from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { storeKey } from "@/app/lib/store";
import { readOrDegrade } from "@/app/lib/upstream";
import { normalizeSection } from "./sections";

export const HOME_PAGE_KEY = storeKey("home_page");
export const HOME_PAGE_TAG = "home-page";

/** What a brand gets when nothing is stored: today's homepage, untouched. */
export const EMPTY_HOME_PAGE = { enabled: false, sections: [], updatedAt: null };

/** Cleans a stored record. Unknown or broken sections are dropped, not rendered. */
export function normalizeHomePage(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_HOME_PAGE };
  const sections = Array.isArray(raw.sections)
    ? raw.sections.map(normalizeSection).filter(Boolean)
    : [];
  return {
    enabled: raw.enabled === true,
    sections,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  };
}

/**
 * The cached read. Throws rather than swallowing a failure, so a bad moment at
 * Redis is never written into the cache for a day — see lib/upstream.js for why
 * that matters here.
 */
const readHomePage = unstable_cache(
  async () => {
    const stored = await redis.get(HOME_PAGE_KEY);
    return normalizeHomePage(typeof stored === "string" ? JSON.parse(stored) : stored);
  },
  ["home-page", HOME_PAGE_KEY],
  { revalidate: 86400, tags: [HOME_PAGE_TAG] },
);

/**
 * The homepage configuration for this brand.
 *
 * Degrades to "not configured" if Redis cannot be reached, which renders the
 * existing homepage — the safe direction, and the same page the brand had
 * before any of this existed.
 */
export const getHomePage = () =>
  readOrDegrade("home-page", readHomePage, { ...EMPTY_HOME_PAGE });

/** Writes the record. Callers bust HOME_PAGE_TAG; see the API route. */
export async function saveHomePage({ enabled, sections }) {
  const record = {
    enabled: enabled === true,
    sections: (Array.isArray(sections) ? sections : []).map(normalizeSection).filter(Boolean),
    updatedAt: new Date().toISOString(),
  };
  await redis.set(HOME_PAGE_KEY, JSON.stringify(record));
  return record;
}

/**
 * Images an admin can choose from — the same library the menu editor offers,
 * read the same way: the files in public/images/banner.
 *
 * There is no upload in the app. A new image is added to that folder and
 * deployed, or its address is pasted into the field.
 */
export function listBannerImages() {
  const dir = "public/images/banner";
  try {
    return fs
      .readdirSync(path.join(process.cwd(), dir))
      .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(file))
      .map((file) => `/${dir.replace(/^public\//, "")}/${file}`)
      .sort();
  } catch {
    return [];
  }
}
