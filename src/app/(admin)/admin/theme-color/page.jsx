import React from "react";

import { keys } from "@/app/lib/redis";
import ThemeUpdater from "@/app/components/admin/ThemeUpdater";

// The key is resolved here, on the server: STORE_ID is empty in the browser,
// so a key built there comes out as "_theme" for every brand.
function AdminThemeColor() {
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
      <ThemeUpdater themeKey={keys.theme.value} />
    </div>
  );
}

export default AdminThemeColor;
