import { ISBBQ } from "@/app/lib/helpers";
import NewContactPage from "@/app/components/new-design/page/Contact";
import BBQContactPage from "@/app/components/bbq-design/page/Contact";

export default function ContactPage() {
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQContactPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewContactPage />
    </div>
  );
}
