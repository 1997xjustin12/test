import CheckoutComponent from "@/app/components/molecule/CheckoutComponent";
import { STORE_NAME } from "@/app/lib/store_constants";
export const metadata = {
  title: `Checkout | ${STORE_NAME}`,
};
function CheckoutPage() {
  return <CheckoutComponent />;
}

export default CheckoutPage;
