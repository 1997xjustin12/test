import { NextResponse } from "next/server";
import { getAdminUser, isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import {
  getAdminUsers,
  envAdminUsernames,
  normalizeUsernames,
  saveAdminUsers,
} from "@/app/lib/admin-users";

/**
 * GET  /api/admin-users  -> who can use /admin, split into env and granted
 * PUT  /api/admin-users  -> replace the granted list
 *
 * Admin-only, like the rest of the admin API — which here also means only an
 * admin can make another one.
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await getAdminUsers();
  return NextResponse.json({ ...users, you: await getAdminUser(request) });
}

export async function PUT(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const usernames = normalizeUsernames(body?.usernames);
  if (!usernames) {
    return NextResponse.json({ error: "usernames must be a list" }, { status: 400 });
  }

  // Nobody may sign away their own access. The env list is the way back in, so
  // an operator who is only on the granted list would be locking themselves out
  // of the screen they are standing on — and would need someone else, or an env
  // change, to undo it.
  const you = await getAdminUser(request);
  if (you && !envAdminUsernames().includes(you) && !usernames.includes(you)) {
    return NextResponse.json(
      { error: `You cannot remove your own access (${you}). Ask another admin to do it.` },
      { status: 400 },
    );
  }

  await saveAdminUsers(usernames, you);
  return NextResponse.json({ ...(await getAdminUsers()), you });
}
