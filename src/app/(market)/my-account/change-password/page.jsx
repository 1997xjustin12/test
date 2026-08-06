import ChangePasswordPage from "@/app/components/new-design/sections/my-account/ChangePasswordPage";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/my-account/change-password");

export default function Page() {
  return <ChangePasswordPage />;
}
