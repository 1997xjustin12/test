import { redis } from "../../app/lib/redis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { term } = req.body; 

  if (!term) {
    return res.status(400).json({ error: "term is required" });
  }

  await redis.zincrby("popular:searches", 1, term.toLowerCase());

  return res.status(200).json({ message: "Search term added", term });
}