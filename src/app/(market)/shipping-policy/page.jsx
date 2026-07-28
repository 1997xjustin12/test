import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewShippingPolicyPage from "@/app/components/new-design/page/ShippingPolicy";
import BBQShippingPolicyPage from "@/app/components/bbq-design/page/ShippingPolicy";
import OKOShippingPolicyPage from "@/app/components/oko-design/page/ShippingPolicy";

export default function ShippingPolicyPage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <OKOShippingPolicyPage />
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQShippingPolicyPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewShippingPolicyPage />
    </div>
  );
}
