import React from "react";

import { redis, keys } from "@/app/lib/redis";
import FavidonUpdater from "@/app/components/admin/FaviconUpdater";
import LogoUpdater from "@/app/components/admin/LogoUpdater";

async function AdminFaviconLogo() {
  const [logo, favicon] = await redis.mget([
    keys.logo.value,
    keys.favicon.value,
  ]);
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
      <FavidonUpdater favicon={favicon} />
      <LogoUpdater logo={logo} />
    </div>
  );
}

export default AdminFaviconLogo;
