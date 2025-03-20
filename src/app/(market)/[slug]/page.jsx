"use client";
import TuiHero from "@/app/components/template/tui_hero";
import ProductsSection from "@/app/components/section/Products";
import { getPageData } from "@/app/lib/helpers";
// import { flatCategories } from "@/app/lib/category-helpers";
import { notFound } from "next/navigation";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import { keys, redisGet } from "@/app/lib/redis";
import * as React from "react";
import { useState, useEffect } from "react";

const defaultMenuKey = keys.default_menu.value;
export default function GenericCategoryPage({ params }) {
  const { slug } = React.use(params);
  const [pageData, setPageData] = useState(null);

  const getMenu = async () => {
    return await redisGet(defaultMenuKey);
  };

  const flattenNav = (navItems) => {
    let result = [];

    const extractLinks = (items) => {
      items.forEach(({ children = [], ...rest }) => {
        result.push({ ...rest, children }); // Keep the children property
        extractLinks(children); // Recursively process children
      });
    };

    extractLinks(navItems);

    return result;
  };

  useEffect(() => {
    getMenu().then((data) => {
      const flatData = flattenNav(data);
      const _pageData =getPageData(slug, flatData);
      setPageData(_pageData);
    });
  }, [slug]);

  if (pageData === undefined) {
    {notFound()}
  } else {
    return (
      <div>
        <MobileLoader isLoading={!pageData}/>
        <TuiHero data={pageData} />
        <ProductsSection category={slug} />
      </div>
    );
  }
}
