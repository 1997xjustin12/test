// Private or transactional paths. No crawler benefits from these, and several
// are user-specific, so they are denied to everyone including AI agents.
// The catalogue API is the one part of /api meant to be found. Allow entries
// are listed before the blanket /api/* disallow because more specific rules win
// — without this carve-out the endpoints exist but every crawler is told not to
// fetch them, which defeats the point of publishing them.
const PUBLIC_API_PATHS = [
  "/api/catalog/",
  "/api/catalog/*",
];

const PRIVATE_PATHS = [
  "/api/*",
  "/admin/*",
  "/dev/*",
  "/checkout/*",
  "/my-account/*",
  "/login",
  "/register",
  "/logout",
  "/forgot-password",
  "/reset-password/*",
  "/cart",
  "/payment_success",
  "/subscribe",
  "/unsubscribe",
];

/**
 * AI crawlers, named explicitly.
 *
 * These were already allowed — by omission, via the `*` rule. Naming them turns
 * an accident into a decision and makes the policy reviewable, because the two
 * kinds of AI crawler have very different business implications:
 *
 *   search    - fetches pages to cite them in AI answers and shopping results.
 *               This is distribution. Blocking it removes the store from those
 *               surfaces entirely.
 *   training  - collects content to train models. No traffic comes back.
 *
 * Several vendors split the two (OAI-SearchBot vs GPTBot, Google-Extended
 * covers Gemini training while Googlebot keeps indexing), so "visible in AI
 * answers but not used for training" is a coherent position if the client wants
 * it. To adopt it, move the `training` entries into DISALLOWED_AI_CRAWLERS.
 *
 * Current policy: allow both, matching the site's existing effective behaviour.
 * See docs/agentic-ai-readiness.md → "Open decisions".
 */
const AI_CRAWLERS = {
  search: [
    "OAI-SearchBot", // ChatGPT search results
    "ChatGPT-User", // user-initiated ChatGPT browsing
    "PerplexityBot",
    "Perplexity-User",
    "Claude-SearchBot",
    "Claude-User",
    "Applebot", // also powers Siri / Spotlight
    "Amazonbot",
    "Bingbot", // Copilot answers ride on Bing's index
  ],
  training: [
    "GPTBot",
    "ClaudeBot",
    "anthropic-ai",
    "Google-Extended",
    "Applebot-Extended",
    "meta-externalagent",
    "FacebookBot",
    "Bytespider",
    "cohere-ai",
    "Diffbot",
    "Omgilibot",
    "Timpibot",
  ],
};

const ALLOWED_AI_CRAWLERS = [...AI_CRAWLERS.search, ...AI_CRAWLERS.training];
const DISALLOWED_AI_CRAWLERS = [];

export default function robots() {
  // No placeholder fallback: pointing crawlers at a sitemap on a domain we do
  // not own is worse than omitting the directive, so an unset base URL simply
  // drops the Sitemap line. See the matching guard in sitemap.js.
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", ...PUBLIC_API_PATHS],
        disallow: PRIVATE_PATHS,
      },
      ...(ALLOWED_AI_CRAWLERS.length
        ? [
            {
              userAgent: ALLOWED_AI_CRAWLERS,
              allow: ["/", ...PUBLIC_API_PATHS],
              disallow: PRIVATE_PATHS,
            },
          ]
        : []),
      ...(DISALLOWED_AI_CRAWLERS.length
        ? [{ userAgent: DISALLOWED_AI_CRAWLERS, disallow: "/" }]
        : []),
    ],
    ...(BASE_URL ? { sitemap: `${BASE_URL}/sitemap.xml` } : {}),
  };
}
