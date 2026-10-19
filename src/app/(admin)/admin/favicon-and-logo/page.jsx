import React from "react";

import { redis, keys } from "@/app/lib/redis";
import { STORE_ID } from "@/app/lib/store";
import FavidonUpdater from "@/app/components/admin/FaviconUpdater";
import LogoUpdater from "@/app/components/admin/LogoUpdater";

// The keys are resolved here, on the server, and handed down. STORE_ID is a
// server-only env var: in the browser it is empty, so a key built there comes
// out as "_favicon" — one key shared by every brand and read by none of them.
//
// The picker options are the files in public/favicon and public/logo, listed
// at build time in next.config.ts.
const options = (list) => (list || "").split(",").filter(Boolean);

async function AdminFaviconLogo() {
  // Unreadable (Redis down or out of quota) shows as "nothing saved", so the
  // page still opens; a save then reports its own failure.
  const [logo, favicon] = await redis
    .mget([keys.logo.value, keys.favicon.value])
    .catch((error) => {
      console.error("[admin/favicon-and-logo] current values unavailable:", error?.message || error);
      return [null, null];
    });
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
      <FavidonUpdater
        favicon={favicon}
        redisKey={keys.favicon.value}
        options={options(process.env.BRANDING_FAVICON_OPTIONS)}
        brand={STORE_ID}
      />
      <LogoUpdater
        logo={logo}
        redisKey={keys.logo.value}
        options={options(process.env.BRANDING_LOGO_OPTIONS)}
        brand={STORE_ID}
      />
    </div>
  );
}

export default AdminFaviconLogo;
