import { Suspense } from "react";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewSubscribePage from "@/app/components/new-design/page/Subscribe";
import BBQSubscribePage from "@/app/components/bbq-design/page/Subscribe";
import OKOSubscribePage from "@/app/components/oko-design/page/Subscribe";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/subscribe");

// This page reads the URL query string, so it needs its own Suspense
// boundary. The market layout deliberately no longer wraps the whole app in
// one - that made React stream the entire storefront into a hidden div, so
// nothing rendered without JavaScript. See (market)/layout.jsx.
export default function SubscribePage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <Suspense fallback={null}>
          <OKOSubscribePage />
        </Suspense>
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <Suspense fallback={null}>
          <BBQSubscribePage />
        </Suspense>
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <Suspense fallback={null}>
          <NewSubscribePage />
        </Suspense>
    </div>
  );
}
