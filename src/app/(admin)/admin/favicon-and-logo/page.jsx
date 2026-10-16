import React from "react";

import { redis, keys } from "@/app/lib/redis";
import FavidonUpdater from "@/app/components/admin/FaviconUpdater";
import LogoUpdater from "@/app/components/admin/LogoUpdater";

// The keys are resolved here, on the server, and handed down. STORE_ID is a
// server-only env var: in the browser it is empty, so a key built there comes
// out as "_favicon" — one key shared by every brand and read by none of them.
async function AdminFaviconLogo() {
  const [logo, favicon] = await redis.mget([
    keys.logo.value,
    keys.favicon.value,
  ]);
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
      <FavidonUpdater favicon={favicon} redisKey={keys.favicon.value} />
      <LogoUpdater logo={logo} redisKey={keys.logo.value} />
    </div>
  );
}

export default AdminFaviconLogo;
