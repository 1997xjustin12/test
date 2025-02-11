'use client'
import TuiHero from "../components/template/tui_hero";
import ProductsSection from "../components/section/Products";
import { getPageData } from "../lib/helpers";
import { flatCategories } from "../lib/category-helpers";
import { notFound } from "next/navigation";
import MobileLoader from "../components/molecule/MobileLoader";

import * as React from 'react'
import {useState, useEffect} from "react";

export default function GenericCategoryPage({ params }) {
  const {slug} = React.use(params);
  const [pageData, setPageData] = useState(null);
  useEffect(()=>{
    setPageData(getPageData(slug, flatCategories))
  },[slug]);

  if (pageData === undefined) {
    notFound();
  }else{
    return (
      <div>
        <MobileLoader />
        <TuiHero data={pageData} />
        <ProductsSection
          // category={main_cat_array.includes(slug) ? slug : "all-products"}
          category={slug}
        />
      </div>
    );
  }
}
