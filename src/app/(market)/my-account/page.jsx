import { ISBBQ } from "@/app/lib/helpers";
import NewMyAccountPage from "@/app/components/new-design/page/MyAccount";
import BBQMyAccountPage from "@/app/components/bbq-design/page/MyAccount";

export const metadata = {
  title: "My Account",
};

export default function MyAccountPage() {
  if (ISBBQ) return <BBQMyAccountPage />;
  return <NewMyAccountPage />;
}
