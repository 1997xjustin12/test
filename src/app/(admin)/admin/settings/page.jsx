import React from "react";
import { STORE_ID, STORE_THEME } from "@/app/lib/store";
import { STORE_SETTINGS_KEY, envDefaults } from "@/app/lib/store-settings";
import StoreSettingsEditor from "@/app/components/admin/settings/StoreSettingsEditor";

export const metadata = { title: "Store Settings" };

export default function StoreSettingsPage() {
  // Env fallbacks are resolved server-side; only their values cross to the
  // client, never the env object itself.
  return (
    <StoreSettingsEditor
      storeId={STORE_ID}
      settingsKey={STORE_SETTINGS_KEY}
      envDefaults={envDefaults()}
      theme={STORE_THEME}
    />
  );
}
