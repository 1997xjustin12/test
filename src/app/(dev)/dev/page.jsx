
import CardWrap from "@/app/components/admin/CardWrap";
import Categories from "@/app/components/dev/BigCommerceCategories";
import Brands from "@/app/components/dev/BigCommerceBrands";
async function DevIndexPage() {
  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-5">
      <CardWrap>
        <div className="p-3 font-bold text-lg">Developers Page</div>
      </CardWrap>

      <Categories />
      <Brands />
    </div>
  );
}

export default DevIndexPage;
