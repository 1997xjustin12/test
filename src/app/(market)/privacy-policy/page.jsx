import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewPrivacyPolicyPage from "@/app/components/new-design/page/PrivacyPolicy";
import BBQPrivacyPolicyPage from "@/app/components/bbq-design/page/PrivacyPolicy";
import OKOPrivacyPolicyPage from "@/app/components/oko-design/page/PrivacyPolicy";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/privacy-policy");

export default function PrivacyPolicyPage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <OKOPrivacyPolicyPage />
      </div>
    );
  }
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
