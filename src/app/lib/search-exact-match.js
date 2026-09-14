/**
 * When the search box shows a "Top result".
 *
 * A top result is a claim that we know which product the shopper meant. That
 * claim is only honest when the query names exactly one product. These are the
 * ways to earn it, checked in order:
 *
 *   1. the query is a product's SKU                    "RBF24DLX", any case
 *   2. the SKU without its dashes, spaces or dots      "rbf24-dlx", "bmrus26b"
 *   3. the product's full title
 *   4. the title without the SKU it ends in            "Dimplex Revillusion 24-Inch
 *                                                        Built-In Electric Fireplace"
 *   5. the product's handle, or a pasted product link  ".../products/<handle>"
 *
 * The first check that matches anything decides, and it must match exactly ONE
 * live product. A match shared by several products gets no top result and does
 * not fall through to a later check: picking one of them would be a guess
 * dressed as certainty, and the shared ones in this catalogue are largely
 * duplicate listings — some of which disagree on price. They still appear at
 * the head of the product list; they just don't get the badge.
 *
 * WHAT IS DELIBERATELY NOT HERE (measured on 5,085 live products, Sept 2026)
 *
 *   - Partial or misspelt SKUs. "rbf24dlx" is the start of "rbf24dlxwc", and a
 *     single wrong character is often another real SKU (WD6024CP / WD6024CO). A
 *     confident wrong answer is worse than none.
 *   - Model numbers, barcodes, UPC or MPN. `features.model` is empty on every
 *     product and the others are not indexed.
 *   - Matching a variant. The 82 products with several SKUs all present a single
 *     "Default Title" option to shoppers; the extra SKUs are hidden, so there is
 *     no variant to open. The match is always the product.
 *   - "Elasticsearch is far more confident in #1 than #2." Score gaps shift
 *     with every catalogue change, and a guess is what caused the bug below.
 *
 * WHAT THIS REPLACED
 *
 * The old rule promoted any product whose last title word equalled any word in
 * the query, on the theory that titles end in their SKU. 89% of live titles do;
 * the rest do not, and a bare word defeats the theory entirely. Searching
 * "revillution 2" made "Sunpak Black Front Fascia Kit - 12020 2" the top result,
 * because its title ends in "2" — and hoisted it, from relevance rank 34, above
 * the Revillusion products that actually matched.
 *
 * PURE ON PURPOSE
 *
 * No imports. This module is shared by the client search context (a "use
 * client" file), the searchkit Pages API route, and the server-side search in
 * fn_server.js. Anything that reached for Redis or next/cache here would drag
 * the server into the browser bundle.
 */

// Below this, ignoring punctuation matches too much: "2-1" is not "21".
const MIN_LOOSE_SKU_LENGTH = 3;
// The longest live SKU is 18 characters without punctuation. The cap keeps the
// regexp small whatever gets pasted into the box.
const MAX_LOOSE_SKU_LENGTH = 40;
// Elasticsearch refuses regexps over 1,000 characters. At 200, a title stays
// under that even if every character has to be escaped.
const MAX_TITLE_PATTERN_LENGTH = 200;

/**
 * The comparison key for a SKU, a title or a query.
 *
 * Case, accents and runs of whitespace are not meaningful differences to a
 * shopper. The whitespace part is not hypothetical: 93 live titles contain a
 * doubled space ("Liquid Propane  - BMRUS2-6B"), which nobody retypes.
 */
export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/** Letters and digits only — a SKU as typed by someone skipping the punctuation. */
export function looseSearchKey(value) {
  return normalizeSearchText(value).replace(/[^a-z0-9]/g, "");
}

/** Every SKU on a product, across all variants — not just the first. */
const skusOf = (product) =>
  (product?.variants || []).map((variant) => variant?.sku).filter(Boolean);

const isLooseSkuLength = (key) =>
  key.length >= MIN_LOOSE_SKU_LENGTH && key.length <= MAX_LOOSE_SKU_LENGTH;

/**
 * The product handle a query points at.
 *
 * A pasted link ("https://…/products/<handle>?variant=1") is unambiguous about
 * what it is, so `fromLink` tells callers to match it as a handle and nothing
 * else. Any other single token is only a candidate: it is checked last, after
 * it has failed to be a SKU or a title. Most handles are dashed slugs
 * ("sunglo-standard-5-gallon-…"), but 34 live ones are one word ("sba3p") and
 * 64 keep a ® or ™.
 *
 * Handles are compared lowercased and nothing more. normalizeSearchText would
 * turn "™" into "tm", and the handle would stop matching itself.
 */
export function productHandleFromQuery(query) {
  const typed = String(query ?? "").trim();

  const link = typed.match(/\/products\/([^/?#\s]+)/i);
  if (link) {
    let handle = link[1];
    try {
      handle = decodeURIComponent(handle);
    } catch {
      // A malformed escape: keep it as typed, it simply won't match.
    }
    return { handle: handle.toLowerCase(), fromLink: true };
  }

  if (typed && !/[\s/?#]/.test(typed)) {
    return { handle: typed.toLowerCase(), fromLink: false };
  }
  return { handle: null, fromLink: false };
}

/**
 * A product's title with the SKU it ends in removed — the name a shopper types
 * or pastes. Null when the title does not end in one of the product's SKUs.
 *
 *   "Dimplex Revillusion … Electric Fireplace - RBF24DLX" → "dimplex revillusion … electric fireplace"
 *   "OCI … Holder Open Box- OCI-PTH-OB"                   → "oci … holder open box"
 */
export function titleWithoutSku(product) {
  const title = normalizeSearchText(product?.title);
  // Longest first, so "X-100-LP" is removed whole rather than as "LP".
  const skus = skusOf(product)
    .map(normalizeSearchText)
    .sort((a, b) => b.length - a.length);

  for (const sku of skus) {
    if (!title.endsWith(` ${sku}`)) continue;
    return title.slice(0, -sku.length).replace(/[\s-]+$/, "") || null;
  }
  return null;
}

/** Escape for a Lucene regexp. Backslash makes any character literal. */
const escapeRegexp = (text) => text.replace(/[^\p{L}\p{N} ]/gu, (char) => `\\${char}`);

/**
 * Elasticsearch clauses that bring every candidate for a top result into the
 * results, and rank it first, whatever the shopper's casing.
 *
 * Two jobs. Ranking: an exact SKU should lead the product list. Recall:
 * findExactMatch can only count candidates Elasticsearch returned, so each check
 * there has a clause here that is guaranteed to fetch its matches. Without one,
 * a product sharing a SKU could be missing and the other would look unique.
 *
 * Needed because `variants.sku` uses the keyword analyser, which is
 * case-sensitive: "RBF24DLX" scored 99.8 and "rbf24dlx" 20.5. `case_insensitive`
 * on the keyword fields fixes that without a reindex.
 *
 * Prepend to an existing `should` array; they add to relevance and never narrow
 * it, so every other search behaves as before. A pasted product link returns
 * only the handle clause — it is not a SKU or a title.
 */
export function exactMatchClauses(query) {
  const typed = String(query ?? "").trim();
  if (!typed) return [];

  const { handle, fromLink } = productHandleFromQuery(typed);
  const handleClauses = handle
    ? [{ term: { "handle.keyword": { value: handle, case_insensitive: true, boost: 900 } } }]
    : [];
  if (fromLink) return handleClauses;

  // Titles sometimes contain doubled spaces, so they are sent as typed and
  // collapsed. SKUs have none and only need the collapsed form.
  const collapsed = typed.replace(/\s+/g, " ");
  const titleValues = typed === collapsed ? [typed] : [typed, collapsed];

  const clauses = [
    {
      term: {
        "variants.sku.keyword": { value: collapsed, case_insensitive: true, boost: 1000 },
      },
    },
  ];

  // Any punctuation, or none, between and around the characters typed.
  const loose = looseSearchKey(typed);
  if (isLooseSkuLength(loose)) {
    const gap = "[^a-zA-Z0-9]*";
    clauses.push({
      regexp: {
        "variants.sku.keyword": {
          value: gap + [...loose].join(gap) + gap,
          case_insensitive: true,
          boost: 800,
        },
      },
    });
  }

  clauses.push(
    ...titleValues.map((value) => ({
      term: { "title.keyword": { value, case_insensitive: true, boost: 500 } },
    })),
  );

  // The typed name followed by "- <anything>", or by one more word: the shape
  // of a title ending in its SKU. Titles are always several words, and a
  // single word would boost every title that starts with it.
  const words = collapsed.split(" ");
  if (words.length >= 2 && collapsed.length <= MAX_TITLE_PATTERN_LENGTH) {
    const name = words.map(escapeRegexp).join(" +");
    clauses.push({
      regexp: {
        "title.keyword": {
          value: `${name}( *- +.+| +[^ \\-][^ ]*)`,
          case_insensitive: true,
          boost: 300,
        },
      },
    });
  }

  return [...clauses, ...handleClauses];
}

/**
 * The single product this query unambiguously names, or null.
 *
 * Returns { match, reason } so a caller can tell "no match" from "matched, but
 * shared" when diagnosing a search that feels wrong. `reason` is the check that
 * decided — "sku", "sku-loose", "title", "title-without-sku", "handle" — with
 * "-shared" appended when it matched several products, or "none".
 *
 * Checked against the results Elasticsearch returned. That is sound because
 * exactMatchClauses fetches every product each check could match, so the
 * uniqueness count is over the real candidates.
 */
export function findExactMatch(query, products = []) {
  const none = { match: null, reason: "none" };
  const key = normalizeSearchText(query);
  if (!key || !Array.isArray(products) || products.length === 0) return none;

  const { handle, fromLink } = productHandleFromQuery(query);
  const byHandle = [
    "handle",
    (product) => handle !== null && String(product?.handle ?? "").toLowerCase() === handle,
  ];

  const looseKey = looseSearchKey(query);
  const tryLoose = isLooseSkuLength(looseKey);

  const checks = fromLink
    ? [byHandle]
    : [
        ["sku", (product) => skusOf(product).some((sku) => normalizeSearchText(sku) === key)],
        [
          "sku-loose",
          (product) => tryLoose && skusOf(product).some((sku) => looseSearchKey(sku) === looseKey),
        ],
        ["title", (product) => normalizeSearchText(product?.title) === key],
        ["title-without-sku", (product) => titleWithoutSku(product) === key],
        byHandle,
      ];

  for (const [reason, matches] of checks) {
    const found = products.filter(matches);
    if (found.length === 1) return { match: found[0], reason };
    if (found.length > 1) return { match: null, reason: `${reason}-shared` };
  }
  return none;
}

/**
 * The product list with duplicate listings removed.
 *
 * A duplicate is the same product listed twice: an identical title AND an
 * identical set of SKUs. Products that merely share a title — a propane and a
 * natural-gas version, say — are distinct and both stay.
 *
 * The dropdown used to collapse on title alone, which hid those distinct
 * products and kept whichever one a Map happened to overwrite last. This keeps
 * the first occurrence, so the survivor is the listing Elasticsearch ranked
 * highest, and leaves the order otherwise untouched.
 *
 * ORDER OF OPERATIONS MATTERS. Run findExactMatch on the full list first, then
 * collapse. Some duplicate listings disagree on price — VH42-3-SP4 is live at
 * both $629 and $1,099 — and collapsing first would reduce two candidates to
 * one, manufacturing a confident top result out of a genuinely ambiguous query.
 */
export function collapseDuplicateListings(products = []) {
  if (!Array.isArray(products)) return [];

  const seen = new Set();
  return products.filter((product) => {
    const key = JSON.stringify([
      normalizeSearchText(product?.title),
      skusOf(product).map(normalizeSearchText).sort(),
    ]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
