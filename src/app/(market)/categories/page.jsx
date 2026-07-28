import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { fetchBrands } from "@/app/lib/fn_server";
import NewCategories from "@/app/components/new-design/page/Categories";
import BBQCategories from "@/app/components/bbq-design/page/Categories";
import OKOCategories from "@/app/components/oko-design/page/Categories";

async function CategoriesPage() {
  const BRANDS = await fetchBrands();

  if (ISOKO) return <OKOCategories brands={BRANDS} />;
  if (ISBBQ) return <BBQCategories brands={BRANDS} />;
  return <NewCategories brands={BRANDS} />;
}

export default CategoriesPage;
