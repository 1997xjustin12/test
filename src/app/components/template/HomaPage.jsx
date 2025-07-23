"use client";
import dynamic from "next/dynamic";
import MobileLoader from "@/app/components/molecule/MobileLoader";
// home page section import in order
import TuiHero from "@/app/components/template/tui_hero";
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
// const FeatureCategoriesSection = dynamic(
//   () => import("@/app/components/section/HomePageFeatureCategories"),
//   {
//     ssr: false,
//   }
// );
// import ShopAllClearanceSection from "@/app/components/section/HomePageShopAllClearance";
const ShopAllClearanceSection = dynamic(
  () => import("@/app/components/section/HomePageShopAllClearance"),
  {
    ssr: false,
  }
);
// import AboutProductSection from "@/app/components/section/HomePageAboutProduct";
const AboutProductSection = dynamic(
  () => import("@/app/components/section/HomePageAboutProduct"),
  {
    ssr: false,
  }
);
// import ReviewsSection from "@/app/components/section/HomePageReviews";
const ReviewsSection = dynamic(
  () => import("@/app/components/section/HomePageReviews"),
  {
    ssr: false,
  }
);
// import ShopCategorySection from "@/app/components/section/HomePageShopCategory";
const ShopCategorySection = dynamic(
  () => import("@/app/components/section/HomePageShopCategory"),
  {
    ssr: false,
  }
);
// import GuidesAndInspirationSection from "@/app/components/section/HomePageGuidesAndInspiration";
const GuidesAndInspirationSection = dynamic(
  () => import("@/app/components/section/HomePageGuidesAndInspiration"),
  {
    ssr: false,
  }
);
// import ShopOpenBoxSection from "@/app/components/section/HomePageShopOpenBox";
const ShopOpenBoxSection = dynamic(
  () => import("@/app/components/section/HomePageShopOpenBox"),
  {
    ssr: false,
  }
);
// import PartsAndAccessoriesSection from "@/app/components/section/HomePagePartsAndAccessories";
const PartsAndAccessoriesSection = dynamic(
  () => import("@/app/components/section/HomePagePartsAndAccessories"),
  {
    ssr: false,
  }
);
// import FrequentlyAskedSection from "@/app/components/section/HomePageFrequentlyAsked";
const FrequentlyAskedSection = dynamic(
  () => import("@/app/components/section/HomePageFrequentlyAsked"),
  {
    ssr: false,
  }
);
import NewsLetterSection from "@/app/components/section/NewsLetter";

export default function HomePageWrapper({ data }) {
  return (
    <div>
      <MobileLoader />
      <TuiHero data={data} />
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
    </div>
  );
}
