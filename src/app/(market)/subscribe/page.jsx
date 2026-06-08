import { ISBBQ } from "@/app/lib/helpers";
import NewSubscribePage from "@/app/components/new-design/page/Subscribe";
import BBQSubscribePage from "@/app/components/bbq-design/page/Subscribe";

export default function SubscribePage() {
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
