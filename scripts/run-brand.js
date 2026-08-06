#!/usr/bin/env node
/**
 * Runs Next.js against a specific brand's env file.
 *
 *   node scripts/run-brand.js <brand> [next-command] [...args]
 *   node scripts/run-brand.js bbq dev
 *
 * Why a script instead of a flag:
 *   - `next dev` has no --env-file option.
 *   - `node --env-file=... next dev` fails: the Next CLI re-spawns itself
 *     through NODE_OPTIONS, and Node rejects --env-file there.
 * So we copy `.env.<brand>` over `.env.local` (the file Next actually reads)
 * and launch from that.
 *
 * It also clears .next/cache when the brand changes. unstable_cache entries for
 * store settings and page SEO are keyed by STORE_ID, but a stale cache from
 * another brand's run has bitten us more than once — clearing on switch removes
 * the whole class of confusion.
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const [, , brand, command = "dev", ...extra] = process.argv;

const available = fs
  .readdirSync(root)
  .filter((f) => /^\.env\.[a-z0-9-]+$/.test(f) && !f.endsWith(".bak"))
  .map((f) => f.replace(/^\.env\./, ""))
  .filter((b) => b !== "local");

if (!brand) {
  console.error(`Usage: node scripts/run-brand.js <brand> [command]`);
  console.error(`Available brands: ${available.join(", ") || "(none found)"}`);
  process.exit(1);
}

const envFile = path.join(root, `.env.${brand}`);
if (!fs.existsSync(envFile)) {
  console.error(`No env file for "${brand}" — expected .env.${brand}`);
  console.error(`Available brands: ${available.join(", ") || "(none found)"}`);
  process.exit(1);
}

// Swap the active env.
const target = path.join(root, ".env.local");
fs.copyFileSync(envFile, target);

// Clear the data cache when switching brands.
const nextDir = path.join(root, ".next");
// Marker lives outside .next on purpose: `next build` wipes .next but keeps
// .next/cache, so a marker stored in there would vanish while the stale data
// cache it guards survives — the clear would silently stop happening.
const markerDir = path.join(root, "node_modules", ".cache");
const marker = path.join(markerDir, "run-brand");
let previous = null;
try {
  previous = fs.readFileSync(marker, "utf8").trim();
} catch {
  // no marker yet
}

if (previous && previous !== brand) {
  for (const dir of ["cache", "dev"]) {
    fs.rmSync(path.join(nextDir, dir), { recursive: true, force: true });
  }
  console.log(`brand changed ${previous} -> ${brand}, cleared .next/cache`);
}

try {
  fs.mkdirSync(markerDir, { recursive: true });
  fs.writeFileSync(marker, brand);
} catch {
  // non-fatal — worst case we clear the cache again next time
}

// Report what's actually active, since the admin is reachable in dev and it
// must be obvious which brand's Redis keys you're about to edit.
const raw = fs.readFileSync(envFile, "utf8");
const read = (key) => {
  const m = raw.match(new RegExp(`^${key}=(.*)$`, "m"));
  return m ? m[1].trim() : "";
};
const storeId = read("STORE_ID") || read("STORE_REDIS_PREFIX");
console.log(
  [
    ``,
    `  brand      ${brand}`,
    `  STORE_ID   ${read("STORE_ID") || "(unset)"}`,
    `  redis keys ${storeId}_*`,
    `  store      ${read("NEXT_PUBLIC_STORE_NAME")}`,
    `  feed       ${read("MERCHANT_FEED_SHOPIFY_DOMAIN") || "SELF (elasticsearch)"}`,
    ``,
  ].join("\n"),
);

// Spawn Next through its JS entry rather than the .cmd shim so Windows doesn't
// need shell: true.
const nextEntry = path.join(root, "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextEntry, command, ...extra], {
  stdio: "inherit",
  cwd: root,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
