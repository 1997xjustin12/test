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

const sac_contents = [
  {
    image: {
      src: "/images/home/elevate-your-fireplace.webp",
      alt: "Modern-Fireplace-Designs-Img",
    },
    title: "Modern Fireplace Designs",
    content:
      "A modern fireplace can elevate your home, providing both warmth and a stylish focal point for family gatherings or quiet evenings. We offer a wide selection of fireplaces including wood-burning, gas, and electric.",
    button: {
      label: "Shop All Fireplaces",
      url: `${BASE_URL}/fireplaces`,
    },
  },
  {
    image: {
      src: "/images/home/clearance.webp",
      alt: "Outdoor-Kitchen-Deals-Img",
    },
    title: "Outdoor Kitchen Deals",
    content:
      "Create your dream backyard kitchen with top-of-the-line grills, BBQ islands, and all the essential accessories, all while taking advantage of great deals and savings.",
    button: {
      label: "Shop All Outdoor Kitchen Deals",
      url: `${BASE_URL}/outdoor-kitchen`,
    },
  },
];

const about_content = {
  image: "/images/banner/fireplace-banner.webp",
  contact: "(888) 667-4986",
  content: {
    title: "About Solana Fireplaces",
    par: [
      "At Solana Fireplaces, we believe that the heart of a home extends beyond its walls. We specialize in creating exceptional outdoor living experiences through our expertly curated selection of high-quality fireplaces, fire pits, and related accessories. We are committed to providing you with products and the knowledge and support you need to transform your outdoor space into a warm, inviting haven.",
      "Beyond fireplaces, Solana also caters to outdoor living enthusiasts by offering a wide range of outdoor kitchen products. Our selection includes top-of-the-line grills, BBQ islands, and accessories to create the ultimate outdoor cooking and entertainment area. With Solana Fireplaces, you can rely on our expertise and dedication to quality, knowing that you are choosing a partner committed to enhancing your home and lifestyle with the best in both indoor and outdoor heating and cooking solutions.",
    ],
  },
};

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
      <ShopAllClearanceSection contents={sac_contents} />
      <AboutProductSection data={about_content} />
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
