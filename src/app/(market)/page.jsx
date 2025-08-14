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
import { BASE_URL, getPageData } from "@/app/lib/helpers";
import { keys, redisGet } from "@/app/lib/redis";
const defaultMenuKey = keys.dev_shopify_menu.value;
const slug = "";

const feat_carousel_items = [
  {
    label: "Fireplaces",
    img: "/images/home/categories/Fireplace.webp",
    url: `${BASE_URL}/fireplaces`,
  },
  {
    label: "Fire Pits",
    img: "/images/home/categories/firepits.webp",
    url: `${BASE_URL}/fire-pits`,
  },
  {
    label: "Chimney",
    img: "/images/home/categories/chimney.webp",
    url: `${BASE_URL}/chimney`,
  },
  {
    label: "Gas Logs",
    img: "/images/home/categories/gas_logs.webp",
    url: `${BASE_URL}/gas-logs`,
  },
  {
    label: "Clearance",
    img: "/images/home/categories/clearance.webp",
    url: `${BASE_URL}/on-sale`,
  },
];



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
      setPageData(_pageData);
    });
  }, [slug]);

  return (
    // <HomePageWrapper data={page_data} />
    <>
      <MobileLoader />
      <HomeHero data={pageData} />
      <FeatureCategoriesSection items={feat_carousel_items} />
      <ShopAllClearanceSection />
      <AboutProductSection />
      <ReviewsSection />
      <ShopCategorySection />
      <GuidesAndInspirationSection />
      <ShopOpenBoxSection />
      <PartsAndAccessoriesSection />
      {/* <FrequentlyAskedSection /> */}
      <NewsLetterSection />
    </>
  );
}
