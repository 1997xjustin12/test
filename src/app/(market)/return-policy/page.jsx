import { ISBBQ } from "@/app/lib/helpers";
import NewReturnPolicyPage from "@/app/components/new-design/page/ReturnPolicy";
import BBQReturnPolicyPage from "@/app/components/bbq-design/page/ReturnPolicy";

export default function ReturnPolicyPage() {
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQReturnPolicyPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewReturnPolicyPage />
    </div>
  );
}
