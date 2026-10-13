import { redis } from "../../app/lib/redis";
import { withRateLimit } from "@/app/lib/rate-limit";
import { getExcludedTermTest } from "@/app/lib/catalog-exclusions";

/**
 * Records that someone searched for a term.
 *
 * Called from the browser on every search (context/search.js), so it has to
 * stay open to anonymous callers — there is no credential a storefront visitor
 * could present. What it must not be is a way to decide what the whole site
 * suggests: the scores it writes drive the popular-searches list every visitor
 * sees, and before this the endpoint accepted any string, any number of times,
 * from anyone.
 *
 * Three constraints, none of which a real search can trip:
 *
 *   shape      a plausible search term, not a payload
 *   increment  always 1, and never caller-supplied
 *   rate       the `write` bucket, well above human searching
 *
 * The increment was already fixed at 1 here; it is restated in the comment
 * because the sibling endpoint took it from the request body and defaulted to
 * 50, which is how this list would actually be rewritten.
 */

/** Long enough for "outdoor kitchen island with refrigerator", short enough to bound the key. */
const MAX_LENGTH = 64;

/**
 * Letters, digits, spaces and the handful of marks that appear in product
 * names. Deliberately a whitelist: anything outside it is not a search anyone
 * typed, and a stored term is rendered back to every visitor.
 */
const TERM = /^[\p{L}\p{N} '&.,+/()-]+$/u;

const clean = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const term = clean(req.body?.term);
  if (!term) {
    return res.status(400).json({ error: "term is required" });
  }
  if (term.length > MAX_LENGTH || !TERM.test(term)) {
    // Deliberately vague, and a 400 rather than a 422: the exact rule is of no
    // use to the storefront and of some use to anyone probing it.
    return res.status(400).json({ error: "term is not a valid search" });
  }

  // A search for an excluded brand is not recorded. The read side filters
  // these out anyway, so this changes nothing a visitor sees — what it stops is
  // the scores climbing all the while a brand is hidden, so that re-including
  // it does not promote the brand straight to the top of the suggestions on the
  // strength of searches nobody was ever shown a result for.
  //
  // Answers 200, not an error. The caller is the search box recording what
  // someone typed; whether we keep it is our business, not a failure of theirs.
  const isExcludedTerm = await getExcludedTermTest();
  if (isExcludedTerm(term)) {
    return res.status(200).json({ message: "Search term ignored", term });
  }

  await redis.zincrby("popular:searches", 1, term.toLowerCase());
  return res.status(200).json({ message: "Search term added", term });
}

export default withRateLimit(handler, "write");
