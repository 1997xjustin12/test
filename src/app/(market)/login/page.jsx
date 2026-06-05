import {ISBBQ} from "@/app/lib/helpers";
import NewLoginPage from "@/app/components/new-design/page/Login";
import BBQLoginPage from "@/app/components/bbq-design/page/Login";

export default function page() {
  if(ISBBQ) return <BBQLoginPage />
  return <NewLoginPage />
}
