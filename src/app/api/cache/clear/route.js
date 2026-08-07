import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { redis, keys } from "@/app/lib/redis";
import {
  CACHE_GROUPS,
  UNREACHABLE_CACHES,
  CACHE_STORE_ID,
  getGroups,
} from "@/app/lib/cache-registry";

/**
 * Single cache-clear entry point, driven by lib/cache-registry.js.
 *
 *   POST /api/cache/clear                 -> every group
 *   POST /api/cache/clear?groups=pdp,plp  -> just those groups
 *   POST /api/cache/clear?warm=0          -> skip the homepage pre-warm
 *   GET  /api/cache/clear                 -> registry + last run, for the admin UI
 *
 * Auth mirrors the rest of the admin API surface: a same-origin call (the admin
 * screen) or an explicit ?secret= matching REVALIDATE_SECRET for external
 * callers such as the Django admin. Note that an Origin header is client-
 * supplied and therefore not a real authorization boundary — if this needs to
 * be genuinely locked down, add /api/cache/:path* to the proxy.js matcher and
 * gate it the same way /admin is gated.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorize(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret && secret === process.env.REVALIDATE_SECRET) return null;

  const origin = request.headers.get("origin");
  if (!origin || origin === request.nextUrl.origin) return null;

  return NextResponse.json(
    { status: "error", error: "Invalid secret" },
    { status: 401 },
  );
}

/**
 * Deletes every key matching a glob. SCAN rather than KEYS so a large keyspace
 * cannot block Redis, and batched DELs so we do not issue one round trip per
 * key — searchkit:* can run to thousands of entries.
 */
async function deleteByPattern(pattern) {
  let cursor = "0";
  let deleted = 0;

  do {
    const [next, batch] = await redis.scan(cursor, {
      match: pattern,
      count: 500,
    });
    cursor = String(next);
    if (batch?.length) {
      await redis.del(...batch);
      deleted += batch.length;
    }
  } while (cursor !== "0");

  return deleted;
}

export async function POST(request) {
  const denied = authorize(request);
  if (denied) return denied;

  const requested = (request.nextUrl.searchParams.get("groups") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const groups = getGroups(requested);
  const unknown = requested.filter(
    (id) => !CACHE_GROUPS.some((g) => g.id === id),
  );

  if (unknown.length) {
    return NextResponse.json(
      { status: "error", error: `Unknown cache group(s): ${unknown.join(", ")}` },
      { status: 400 },
    );
  }

  const startedAt = Date.now();
  const cleared = { tags: [], paths: [], redisKeys: 0, redisPatterns: [] };
  const errors = [];

  for (const group of groups) {
    for (const tag of group.tags) {
      try {
        revalidateTag(tag);
        cleared.tags.push(tag);
      } catch (error) {
        errors.push(`tag ${tag}: ${error?.message || error}`);
      }
    }

    for (const [path, type] of group.paths) {
      try {
        revalidatePath(path, type);
        cleared.paths.push(path);
      } catch (error) {
        errors.push(`path ${path}: ${error?.message || error}`);
      }
    }

    for (const pattern of group.redis) {
      try {
        cleared.redisKeys += await deleteByPattern(pattern);
        cleared.redisPatterns.push(pattern);
      } catch (error) {
        errors.push(`redis ${pattern}: ${error?.message || error}`);
      }
    }
  }

  // Pre-warm the homepage so the first real visitor after a clear does not pay
  // for the full SSR round trip (Solana backend + Elasticsearch). Deliberately
  // awaited, unlike the fire-and-forget in the old /api/revalidate-all: on
  // serverless the function can be frozen the moment it returns, which kills an
  // unawaited fetch and leaves nothing warmed.
  let warmed = null;
  if (request.nextUrl.searchParams.get("warm") !== "0") {
    try {
      const res = await fetch(`${request.nextUrl.origin}/`, {
        cache: "no-store",
      });
      warmed = { ok: res.ok, status: res.status };
    } catch (error) {
      warmed = { ok: false, status: null, error: error?.message || String(error) };
    }
  }

  const result = {
    status: errors.length ? "partial" : "ok",
    store: CACHE_STORE_ID,
    groups: groups.map((g) => g.id),
    tags: cleared.tags,
    paths: cleared.paths,
    redisPatterns: cleared.redisPatterns,
    redisKeysDeleted: cleared.redisKeys,
    warmed,
    durationMs: Date.now() - startedAt,
    clearedAt: new Date().toISOString(),
    errors,
  };

  try {
    await redis.set(keys.cache_status.value, result);
  } catch (error) {
    console.error("cache/clear: failed to record status:", error);
  }

  return NextResponse.json(result, {
    status: result.status === "ok" ? 200 : 207,
  });
}

export async function GET() {
  let last = null;
  try {
    last = (await redis.get(keys.cache_status.value)) || null;
  } catch (error) {
    console.error("cache/clear: failed to read status:", error);
  }

  return NextResponse.json({
    store: CACHE_STORE_ID,
    groups: CACHE_GROUPS,
    unreachable: UNREACHABLE_CACHES,
    last,
  });
}
