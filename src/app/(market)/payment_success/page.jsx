import { ISBBQ } from "@/app/lib/helpers";
import NewPaymentSuccessPage from "@/app/components/new-design/page/PaymentSuccess";
import BBQPaymentSuccessPage from "@/app/components/bbq-design/page/PaymentSuccess";

export default function PaymentSuccessPage() {
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
