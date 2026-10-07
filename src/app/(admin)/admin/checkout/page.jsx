import CheckoutSettings from "@/app/components/admin/checkout/CheckoutSettings";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default function AdminCheckoutPage() {
  return <CheckoutSettings />;
}
