import { redis } from "../../app/lib/redis";

export default async function handler(req, res) {
  // Fetch top 10 search terms, highest score first
  const results = await redis.zrange("popular_searches", -10, -1, {
    byScore: false,
    rev: true,
    withScores: true
  });

  // Convert from array format to objects
  const formatted = [];
  for (let i = 0; i < results.length; i += 2) {
    formatted.push({
      term: results[i],
      score: parseInt(results[i + 1])
    });
  }

  res.status(200).json(formatted);
}