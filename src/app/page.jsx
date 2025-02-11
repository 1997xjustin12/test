import MobileLoader from "./components/molecule/MobileLoader";
// home page section import in order
import TuiHero from "./components/template/tui_hero";
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

// import HomePageWrapper from "@/app/components/template/HomaPage";
export default async function HomePage({ params }) {
  const page_data = {
    name: "All Products",
    children: [],
    banner_img: null,
  };
  return (
    // <HomePageWrapper data={page_data} />
    <>
      <MobileLoader />
      <TuiHero data={page_data} />
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
