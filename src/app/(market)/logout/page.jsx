import { ISBBQ } from "@/app/lib/helpers";
import NewLogoutPage from "@/app/components/new-design/page/Logout";
import BBQLogoutPage from "@/app/components/bbq-design/page/Logout";

export default function LogoutPage() {
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-stone-50 dark:bg-stone-950">
        <BBQLogoutPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-stone-50 dark:bg-stone-950">
      <NewLogoutPage />
    </div>
  );
}
