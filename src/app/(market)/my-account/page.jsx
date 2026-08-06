import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewMyAccountPage from "@/app/components/new-design/page/MyAccount";
import BBQMyAccountPage from "@/app/components/bbq-design/page/MyAccount";
import OKOMyAccountPage from "@/app/components/oko-design/page/MyAccount";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/my-account");

export default function MyAccountPage() {
  if (ISOKO) return <OKOMyAccountPage />;
  if (ISBBQ) return <BBQMyAccountPage />;
  return <NewMyAccountPage />;
}
