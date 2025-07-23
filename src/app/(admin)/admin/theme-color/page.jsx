import React from "react";

import ThemeUpdater from "@/app/components/admin/ThemeUpdater";

function AdminThemeColor() {
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
      <ThemeUpdater />
    </div>
  );
}

export default AdminThemeColor;
