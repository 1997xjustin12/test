#!/usr/bin/env node
/**
 * Checks every API route against scripts/api-routes.js.
 *
 *   npm run check:routes
 *
 * Three questions, each of which has gone wrong in this repo at least once:
 *
 *   1. Is every route file classified?   A new route is public until someone
 *                                        notices. Nothing used to notice.
 *   2. Does the code match the claim?    A route listed as `admin` that never
 *                                        checks for an admin is worse than one
 *                                        nobody classified, because the list
 *                                        now says it is safe.
 *   3. Is every public route throttled?  Or written down in UNTHROTTLED with a
 *                                        reason. The list can shrink, never
 *                                        silently grow.
 *
 * Deliberately evidence-based rather than convention-based. It greps each file
 * for the thing that would actually do the work — `isAuthorizedAdminRequest`,
 * a comparison against REVALIDATE_SECRET, a read of the caller's authorization
 * header — so a route cannot pass by being named well or by importing a helper
 * it never calls.
 *
 * Exits non-zero on any failure, so it can gate a pull request.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const inventory = require("./api-routes.js");

// ── Find every route file ────────────────────────────────────────────────
const files = [];
function walk(dir, keep) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, keep);
    else if (keep(entry.name)) files.push(full);
  }
}
walk(path.join(ROOT, "src/app/api"), (n) => n === "route.js");
walk(path.join(ROOT, "src/pages/api"), (n) => n.endsWith(".js"));

/** File path to the url it is served at. */
function toUrl(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  return rel.startsWith("src/app/api")
    ? "/api" + rel.slice("src/app/api".length).replace(/\/route\.js$/, "")
    : "/api" + rel.slice("src/pages/api".length).replace(/\.js$/, "");
}

// ── What a file must contain to deserve its group ────────────────────────
//
// The caller's own token arrives in the incoming request. An Authorization
// header the route *sends* is a server-side credential (Elasticsearch, the
// collections key) and means the opposite — which is the mistake a looser
// pattern makes, and why these are anchored to `req.headers`.
const EVIDENCE = {
  admin: /isAuthorizedAdminRequest|getAdminUser/,
  secret: /REVALIDATE_SECRET/,
  user: /req\.headers\.authorization|req\.headers\[["']authorization["']\]|headers\.get\(["']authorization["']\)/,
  public: null, // nothing is required; the throttling check covers it
};

const THROTTLED = /lib\/rate-limit/;

// ── Compare ──────────────────────────────────────────────────────────────
const declared = new Map();
for (const group of ["admin", "secret", "user", "public"]) {
  for (const url of inventory[group]) {
    if (declared.has(url)) {
      console.error(`  listed twice: ${url} (${declared.get(url)} and ${group})`);
    }
    declared.set(url, group);
  }
}

const found = new Map(files.map((f) => [toUrl(f), f]));
const problems = [];
const notes = [];

for (const [url, file] of [...found].sort()) {
  const group = declared.get(url);
  if (!group) {
    problems.push(
      `UNCLASSIFIED  ${url}\n` +
        `              Add it to scripts/api-routes.js. If anyone may call it, it goes in\n` +
        `              \`open\` and needs a rate limit.`,
    );
    continue;
  }

  const source = fs.readFileSync(file, "utf8");
  const needed = EVIDENCE[group];
  if (needed && !needed.test(source)) {
    problems.push(
      `CLAIM NOT MET ${url}\n` +
        `              Listed as \`${group}\`, but nothing in the file does that check.\n` +
        `              Either fix the route or move it to the group it belongs in.`,
    );
  }

  if (group === "public" && !THROTTLED.test(source)) {
    if (!(url in inventory.UNTHROTTLED)) {
      problems.push(
        `UNTHROTTLED   ${url}\n` +
          `              A public route with no rate limit. Wrap the handler in\n` +
          `              withRateLimit / withRouteRateLimit, or add it to UNTHROTTLED\n` +
          `              in scripts/api-routes.js with the reason it is tolerable.`,
      );
    } else {
      notes.push(`${url} — ${inventory.UNTHROTTLED[url]}`);
    }
  }
}

for (const url of declared.keys()) {
  if (!found.has(url)) {
    problems.push(
      `GONE          ${url}\n` +
        `              Listed in scripts/api-routes.js but no route file serves it.\n` +
        `              Remove the entry.`,
    );
  }
}

// An excuse for a route that no longer needs one is stale, not harmless: it
// would silently excuse a future route at the same path.
for (const url of Object.keys(inventory.UNTHROTTLED)) {
  const file = found.get(url);
  if (!file) {
    problems.push(`STALE EXCUSE  ${url}\n              In UNTHROTTLED but no such route. Remove it.`);
  } else if (THROTTLED.test(fs.readFileSync(file, "utf8"))) {
    problems.push(
      `STALE EXCUSE  ${url}\n` +
        `              In UNTHROTTLED but the route is throttled now. Remove the excuse.`,
    );
  }
}

// ── Report ───────────────────────────────────────────────────────────────
const counts = { admin: 0, secret: 0, user: 0, public: 0 };
for (const g of declared.values()) counts[g] += 1;

console.log(
  `  ${found.size} routes — ` +
    `${counts.admin} admin · ${counts.secret} secret · ${counts.user} user · ${counts.public} public`,
);

if (notes.length) {
  console.log(`\n  ${notes.length} public routes are not throttled, each written down:`);
  for (const n of notes.sort()) console.log(`    · ${n}`);
}

if (problems.length) {
  console.log("");
  for (const p of problems) console.log(`  ${p}\n`);
  console.error(`  ${problems.length} problem${problems.length === 1 ? "" : "s"}.`);
  process.exit(1);
}

console.log("\n  Every route is classified and does what its group claims.");
