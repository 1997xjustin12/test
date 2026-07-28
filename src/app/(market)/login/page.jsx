import {ISBBQ, ISOKO} from "@/app/lib/helpers";
import NewLoginPage from "@/app/components/new-design/page/Login";
import BBQLoginPage from "@/app/components/bbq-design/page/Login";
import OKOLoginPage from "@/app/components/oko-design/page/Login";

export default function page() {
  if(ISOKO) return <OKOLoginPage />
  if(ISBBQ) return <BBQLoginPage />
  return <NewLoginPage />
}
