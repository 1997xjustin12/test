import { listPickableImages } from "@/app/lib/home-page/store";
import FooterEditor from "@/app/components/admin/footer/FooterEditor";

export const metadata = { title: "Footer" };
export const dynamic = "force-dynamic";

export default function AdminFooterPage() {
  return <FooterEditor images={listPickableImages()} />;
}
