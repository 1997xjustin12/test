import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Busts the cached store settings read so admin edits apply immediately.
// Called by the Store Settings admin screen after a successful save.
export async function POST() {
  revalidateTag("store-settings");
  // Layout data embeds the store name/contact, so it has to go too.
  revalidateTag("layout-data");
  return NextResponse.json({
    revalidated: true,
    tags: ["store-settings", "layout-data"],
  });
}
