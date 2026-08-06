import OrdersPage from "@/app/components/new-design/sections/my-account/OrdersPage";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/my-account/orders");

export default function Page() {
  return <OrdersPage />;
}
