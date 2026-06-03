"use client";
import SubcategoryTabsDropdown from "./SubcategoryTabsDropdown";

function SubcategoryTabs({ subs }) {
  return (
    <div className="bg-paper dark:bg-char border-b border-grate dark:border-white/10 sticky top-[64px] md:top-[105px] z-10 min-h-[50px]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <SubcategoryTabsDropdown subs={subs} />
      </div>
    </div>
  );
}

export default SubcategoryTabs;
