import { getCategoryNameById } from "@/app/lib/helpers";
import { bc_categories as bccat_json } from "../../lib/category-helpers";

export default function SingleProductCategoryChips({ categories = [] }) {
  return (
    <div className="flex gap-[5px] flex-wrap">
      {categories &&
        categories.length > 0 &&
        categories.map((v, i) => (
          <div
            key={`category-tag-${v.id}`}
            className="text-[9px] py-[4px] px-[8px] bg-theme-200 text-theme-700 font-semibold rounded-full">
            {v.name}
          </div>
        ))}
    </div>
  );
}
