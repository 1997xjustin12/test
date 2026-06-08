import { ISBBQ } from "@/app/lib/helpers";
import NewPrivacyPolicyPage from "@/app/components/new-design/page/PrivacyPolicy";
import BBQPrivacyPolicyPage from "@/app/components/bbq-design/page/PrivacyPolicy";

export default function PrivacyPolicyPage() {
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQPrivacyPolicyPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewPrivacyPolicyPage />
    </div>
  );
}
