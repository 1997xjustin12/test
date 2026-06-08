import { ISBBQ } from "@/app/lib/helpers";
import NewUnsubscribePage from "@/app/components/new-design/page/Unsubscribe";
import BBQUnsubscribePage from "@/app/components/bbq-design/page/Unsubscribe";

export default function UnsubscribePage() {
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQUnsubscribePage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewUnsubscribePage />
    </div>
  );
}
