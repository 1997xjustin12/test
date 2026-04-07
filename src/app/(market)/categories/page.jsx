import CategoriesPageClient from "@/app/components/template/CategoriesPageClient";
import {fetchBrands} from "@/app/lib/fn_server";

async function CategoriesPage() {
  const BRANDS = await fetchBrands();
  return <CategoriesPageClient brands={BRANDS}/>;
}

export default CategoriesPage;
