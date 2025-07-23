import React from 'react'
import {redis, keys} from "@/app/lib/redis";
import FavidonUpdater from '@/app/components/admin/FaviconUpdater'
import LogoUpdater from '@/app/components/admin/LogoUpdater'
import MenuUpdater from "@/app/components/admin/MenuUpdater"
import ThemeUpdater from "@/app/components/admin/ThemeUpdater"

async function AdminIndexPage() {
  const logoRedisKey = keys.logo.value;
  const faviconRedisKey = keys.favicon.value;
  const [logo, favicon] = await redis.mget([logoRedisKey,faviconRedisKey]);
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-5">
      <FavidonUpdater favicon={favicon}/>
      <LogoUpdater logo={logo}/>
      <ThemeUpdater />
      <MenuUpdater />
    </div>
  )
}

export default AdminIndexPage