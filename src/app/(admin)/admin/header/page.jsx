import HeaderEditor from "@/app/components/admin/header/HeaderEditor";

export const metadata = { title: "Header" };
export const dynamic = "force-dynamic";

export default function AdminHeaderPage() {
  return <HeaderEditor />;
}
