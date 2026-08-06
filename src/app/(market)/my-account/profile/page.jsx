import ProfilePage from "@/app/components/new-design/sections/my-account/ProfilePage";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/my-account/profile");

export default function Page() {
  return <ProfilePage />;
}
