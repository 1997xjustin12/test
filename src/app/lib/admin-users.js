import { redis } from "@/app/lib/redis";
import { storeKey } from "@/app/lib/store";
import { readOrDegrade } from "@/app/lib/upstream";

/**
 * Who may use /admin.
 *
 * Access used to be ADMIN_USERNAMES alone, which meant granting someone access
 * required an env change and a redeploy. The list now has two halves:
 *
 *   the env list    ADMIN_USERNAMES — always admins, not editable from the app
 *   the granted list  stored in Redis, managed at /admin/admin-users
 *
 * The env list is deliberately a floor rather than a seed. It is the way back
 * in: an empty or unreachable Redis, or a granted list saved without you in it,
 * still leaves the people named in the environment able to sign in. Nothing an
 * operator does on the admin screen can lock everyone out, which is the failure
 * this feature would otherwise be one careless save away from.
 *
 * Store-scoped, like every other per-brand key — `solana_admin_users`. Each
 * brand's deployment already carries its own ADMIN_USERNAMES, so its granted
 * list belongs to it too; granting access on one brand does not grant it on
 * the others.
 *
 * No unstable_cache here on purpose: this is read by the proxy, which runs in
 * the edge runtime where that is unavailable. It is only read on /admin paths,
 * so it costs one Upstash call per admin request and nothing at all on the
 * storefront — and reading it fresh is what keeps a revocation effective on the
 * next request rather than whenever a session happens to expire.
 */

export const ADMIN_USERS_KEY = storeKey("admin_users");

/** One name: trimmed, lowercased, and bounded so a stored list stays sane. */
const clean = (value) => String(value ?? "").trim().toLowerCase().slice(0, 150);

/** Trimmed, lowercased, de-duplicated, empties dropped. Order is preserved. */
export function normalizeUsernames(value) {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.map(clean).filter(Boolean))].slice(0, 100);
}

/**
 * The names in ADMIN_USERNAMES. Read at call time, never cached.
 *
 * Unset or empty means nobody — an admin surface that opens up when a variable
 * is missing is the wrong way round, and a missing variable is exactly what a
 * fresh deployment looks like.
 */
export function envAdminUsernames() {
  return (process.env.ADMIN_USERNAMES || "")
    .split(",")
    .map(clean)
    .filter(Boolean);
}

/** The stored grants. Throws if Redis cannot be reached; see getAdminUsers. */
async function readGrantedAdmins() {
  const stored = await redis.get(ADMIN_USERS_KEY);
  const record = typeof stored === "string" ? JSON.parse(stored) : stored;
  return {
    granted: normalizeUsernames(record?.usernames) ?? [],
    updatedAt: typeof record?.updatedAt === "string" ? record.updatedAt : null,
    updatedBy: typeof record?.updatedBy === "string" ? record.updatedBy : null,
  };
}

/**
 * Everyone who may sign in, split by where they come from.
 *
 * A failed Redis read degrades to the env list rather than to nobody: an outage
 * must not lock the operators out of the admin, and it must not silently hand
 * access to a granted name either — the safe direction is the smaller list.
 */
export async function getAdminUsers() {
  const env = envAdminUsernames();
  const { granted, updatedAt, updatedBy } = await readOrDegrade(
    "admin-users",
    readGrantedAdmins,
    { granted: [], updatedAt: null, updatedBy: null },
  );

  // A name in both halves is an env admin; it cannot be revoked here, and
  // listing it twice would suggest otherwise.
  const extra = granted.filter((name) => !env.includes(name));
  return { env, granted: extra, all: [...env, ...extra], updatedAt, updatedBy };
}

/** Whether this username may use /admin right now. */
export async function isAdminUser(username) {
  const name = clean(username);
  if (!name) return false;
  // Checked first and without a network call, so the env list still works when
  // Redis does not.
  if (envAdminUsernames().includes(name)) return true;
  const { granted } = await getAdminUsers();
  return granted.includes(name);
}

/** Replaces the granted list. Env names are dropped: they are not ours to store. */
export async function saveAdminUsers(usernames, updatedBy) {
  const env = envAdminUsernames();
  const record = {
    usernames: (normalizeUsernames(usernames) ?? []).filter((n) => !env.includes(n)),
    updatedAt: new Date().toISOString(),
    updatedBy: clean(updatedBy) || null,
  };
  await redis.set(ADMIN_USERS_KEY, JSON.stringify(record));
  return record;
}
