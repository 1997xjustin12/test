import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";

// Busts the cached store settings read so admin edits apply immediately.
// Called by the Store Settings admin screen after a successful save.
export async function POST(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("store-settings", { expire: 0 });
  // Layout data embeds the store name/contact, so it has to go too.
  revalidateTag("layout-data", { expire: 0 });
  return NextResponse.json({
    revalidated: true,
    tags: ["store-settings", "layout-data"],
  });
}
