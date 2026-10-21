import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
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
 * Only ever fills an empty key (SET NX): a menu already there is someone's
 * work and is never replaced from here. The key is global, so one press
 * covers all three brands.
 */
export const dynamic = "force-dynamic";

const fail = (error, status) =>
  NextResponse.json({ status: "error", error }, { status });

export async function POST(request) {
  if (!(await isAuthorizedAdminRequest(request))) return fail("Unauthorized", 401);

  try {
    // Stored as JSON text, exactly as /api/redis writes the menu on save.
    const saved = await redis.set(keys.dev_shopify_menu.value, JSON.stringify(snapshot), { nx: true });
    if (saved !== "OK") return fail("A menu is already saved. Nothing was changed.", 409);
    return NextResponse.json({ status: "ok", items: snapshot.length });
  } catch (error) {
    console.error("menu-seed: save failed:", error?.message || error);
    return fail("Couldn't save the menu. Nothing was changed.", 502);
  }
}
