import React, { Suspense } from "react";
import { keys } from "@/app/lib/redis";
import PageSeoEditor from "@/app/components/admin/page-seo/PageSeoEditor";

export const metadata = { title: "Page SEO" };

export default function PageSeoAdminPage() {
  // Resolved server-side — STORE_ID isn't available in the browser.
  return (
    <Suspense fallback={null}>
      <PageSeoEditor seoKey={keys.page_seo.value} />
    </Suspense>
  );
}
