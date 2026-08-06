import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewPaymentSuccessPage from "@/app/components/new-design/page/PaymentSuccess";
import BBQPaymentSuccessPage from "@/app/components/bbq-design/page/PaymentSuccess";
import OKOPaymentSuccessPage from "@/app/components/oko-design/page/PaymentSuccess";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/payment_success");

export default function PaymentSuccessPage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <OKOPaymentSuccessPage />
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQPaymentSuccessPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-stone-50 dark:bg-stone-950">
      <NewPaymentSuccessPage />
    </div>
  );
}
