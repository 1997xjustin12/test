import { Suspense } from "react";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewUnsubscribePage from "@/app/components/new-design/page/Unsubscribe";
import BBQUnsubscribePage from "@/app/components/bbq-design/page/Unsubscribe";
import OKOUnsubscribePage from "@/app/components/oko-design/page/Unsubscribe";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/unsubscribe");

// This page reads the URL query string, so it needs its own Suspense
// boundary. The market layout deliberately no longer wraps the whole app in
// one - that made React stream the entire storefront into a hidden div, so
// nothing rendered without JavaScript. See (market)/layout.jsx.
export default function UnsubscribePage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <Suspense fallback={null}>
          <OKOUnsubscribePage />
        </Suspense>
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <Suspense fallback={null}>
          <BBQUnsubscribePage />
        </Suspense>
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <Suspense fallback={null}>
          <NewUnsubscribePage />
        </Suspense>
    </div>
  );
}
