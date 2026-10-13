import { redis } from "../../app/lib/redis";
import { withRateLimit } from "@/app/lib/rate-limit";
import { getExcludedTermTest } from "@/app/lib/catalog-exclusions";

async function popularSearches(req, res) {
  const { query, limit: limitParam } = req.query;
  const limit = parseInt(limitParam) || 10;
  const maxFetch = 100; // Maximum results to fetch from Redis

  // Always over-fetch. Two filters run below — the caller's query and the
  // exclusion test — so asking Redis for exactly `limit` rows would return
  // fewer than asked for whenever an excluded brand sits near the top, which is
  // precisely when it matters. The set is a few hundred entries; reading 100 of
  // them costs nothing.
  const fetchLimit = maxFetch - 1;
  const results = await redis.zrange("popular:searches", 0, fetchLimit, {
    withScores: true,
    rev: true, // Get highest scores first
  });

  // Terms belonging to an excluded brand are dropped here rather than deleted
  // from Redis. Filtering at read time means re-including a brand brings its
  // searches back with it, and the scores — which took real traffic to build —
  // are not thrown away on a decision that may be reversed next week.
  const isExcludedTerm = await getExcludedTermTest();

  // Convert from array format to objects
  const formatted = [];
  for (let i = 0; i < results.length; i += 2) {
    if (isExcludedTerm(results[i])) continue;
    formatted.push({
      term: results[i],
      score: parseInt(results[i + 1]),
    });
  }

  // Filter by query if provided
  let filtered = formatted;
  if (query && query.trim()) {
    const searchQuery = query.toLowerCase().trim();
    filtered = formatted.filter((item) =>
      item.term.toLowerCase().includes(searchQuery)
    );
  }

  const finalResults = filtered.slice(0, limit);

  // Popular searches change slowly — safe to cache for 5 min, serve stale for 10 more
  res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  res.status(200).json(finalResults);
}

// Public read endpoint: throttled with 429 + Retry-After so agents can
// back off gracefully. See lib/rate-limit.js.
export default withRateLimit(popularSearches, "light");
