"use client";
import { useState, useEffect } from "react";
import MobileLoader from "@/app/components/molecule/MobileLoader";
// home page section import in order
import HomeHero from "@/app/components/atom/HomeHero";
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
import ShopAllClearanceSection from "@/app/components/section/HomePageShopAllClearance";
import AboutProductSection from "@/app/components/section/HomePageAboutProduct";
import ReviewsSection from "@/app/components/section/HomePageReviews";
import ShopCategorySection from "@/app/components/section/HomePageShopCategory";
import GuidesAndInspirationSection from "@/app/components/section/HomePageGuidesAndInspiration";
import ShopOpenBoxSection from "@/app/components/section/HomePageShopOpenBox";
import PartsAndAccessoriesSection from "@/app/components/section/HomePagePartsAndAccessories";
import FrequentlyAskedSection from "@/app/components/section/HomePageFrequentlyAsked";
import NewsLetterSection from "@/app/components/section/NewsLetter";
import { getPageData } from "@/app/lib/helpers";
import { keys, redisGet } from "@/app/lib/redis";
const defaultMenuKey = keys.default_menu.value;
const slug = "";
// import HomePageWrapper from "@/app/components/template/HomaPage";
export default function HomePage({ params }) {
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
      const _pageData = getPageData(slug, flatData);
      console.log("_pageData", _pageData);
      setPageData(_pageData);
    });
  }, [slug]);

  return (
    // <HomePageWrapper data={page_data} />
    <>
      <MobileLoader />
      <HomeHero data={pageData} />
      <FeatureCategoriesSection />
      <ShopAllClearanceSection />
      <AboutProductSection />
      <ReviewsSection />
      <ShopCategorySection />
      <GuidesAndInspirationSection />
      <ShopOpenBoxSection />
      <PartsAndAccessoriesSection />
      <FrequentlyAskedSection />
      <NewsLetterSection />
    </>
  );
}
