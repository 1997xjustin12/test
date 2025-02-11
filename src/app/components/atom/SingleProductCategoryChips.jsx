import { getCategoryNameById } from "@/app/lib/helpers";
import { bc_categories as bccat_json } from "../../lib/category-helpers";

export default function SingleProductCategoryChips({ categories = [] }) {
  return (
    <div className="flex gap-[5px] flex-wrap">
      {categories &&
        categories.length > 0 &&
        categories.map((v, i) => (
          <div
            key={`category-tag-${i}`}
            className="text-[9px] py-[4px] px-[8px] bg-orange-200 text-orange-700 font-semibold rounded-full">
            {getCategoryNameById(v, bccat_json)}
          </div>
        ))}
    </div>
  );
}
