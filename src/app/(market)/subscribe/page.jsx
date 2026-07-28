import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewSubscribePage from "@/app/components/new-design/page/Subscribe";
import BBQSubscribePage from "@/app/components/bbq-design/page/Subscribe";
import OKOSubscribePage from "@/app/components/oko-design/page/Subscribe";

export default function SubscribePage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <OKOSubscribePage />
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQSubscribePage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewSubscribePage />
    </div>
  );
}
