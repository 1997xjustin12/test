import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import { createSlug } from "@/app/lib/helpers";
import { redis, keys } from "@/app/lib/redis";
import snapshot from "@/app/data/nav-menu-oct-16.json";

/**
 * POST /api/menu-seed -> save the bundled menu snapshot as the menu
 *
 * For a Redis server that has no menu yet (the new kv.solanabbqgrills.com
 * until the Nov 1 migration), so the menu builder has a tree to edit. The
 * snapshot is the same file the market layout falls back to, so what the
 * shoppers already see becomes what the admin edits.
 *
 * Only ever fills an empty key, or replaces the raw snapshot exactly as an
 * earlier version of this route stored it: a menu anyone has edited is never
 * replaced from here. The key is global, so one press covers all three brands.
 */
export const dynamic = "force-dynamic";

const fail = (error, status) =>
  NextResponse.json({ status: "error", error }, { status });

/**
 * The snapshot is the header's trimmed shape (clientMenuItem in the market
 * layout), which drops menu_id, parent_id and slug. The builder and the item
 * editor find everything by menu_id, so without it every item shared one
 * undefined id and the tree couldn't be dragged or edited. `id` is the old
 * menu_id (the builder writes id = menu_id), and the rest follows from the tree.
 */
const withMenuIds = (items, parentId = "") =>
  items.map((item) => {
    const menu_id = item.menu_id ?? item.id;
    return {
      ...item,
      id: menu_id,
      menu_id,
      parent_id: item.parent_id ?? parentId,
      slug: item.slug ?? createSlug(item.key ?? item.name ?? ""),
      ...(Array.isArray(item.children) ? { children: withMenuIds(item.children, menu_id) } : {}),
    };
  });

export async function POST(request) {
  if (!(await isAuthorizedAdminRequest(request))) return fail("Unauthorized", 401);

  const key = keys.dev_shopify_menu.value;
  // Stored as JSON text, exactly as /api/redis writes the menu on save.
  const menu = JSON.stringify(withMenuIds(snapshot));

  try {
    const stored = await redis.get(key);
    if (stored == null) {
      // NX: a menu saved since the read above wins.
      if ((await redis.set(key, menu, { nx: true })) !== "OK") {
        return fail("A menu is already saved. Nothing was changed.", 409);
      }
    } else if (JSON.stringify(stored) === JSON.stringify(snapshot)) {
      // The raw snapshot, saved before this route added the ids. No one can
      // have edited it: the builder keeps Save disabled until it is repaired.
      await redis.set(key, menu);
    } else {
      return fail("A menu is already saved. Nothing was changed.", 409);
    }
    return NextResponse.json({ status: "ok", items: snapshot.length });
  } catch (error) {
    console.error("menu-seed: save failed:", error?.message || error);
    return fail("Couldn't save the menu. Nothing was changed.", 502);
  }
}
