"use client";
import SubcategoryTabsDropdown from "./SubcategoryTabsDropdown";

function SubcategoryTabs({ subs }) {
  return (
    <div className="bg-white dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark sticky top-[64px] md:top-[105px] z-10 min-h-[50px]">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        <SubcategoryTabsDropdown subs={subs} />
      </div>
    </div>
  );
}

export default SubcategoryTabs;
