import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";

import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import Faq from "@/app/components/molecule/Faq";
import Reviews from "@/app/components/molecule/Reviews";
import HeroNotice from "@/app/components/atom/HeroNotice";
import NewsLetter from "@/app/components/section/NewsLetter";
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
import ProductsSection from "@/app/components/molecule/ProductsSection"


const feat_carousel_items = [
  {
    label: "Fireplaces",
    img: "/images/feature/Firepit.webp",
    url: `${BASE_URL}/fireplaces`,
  },
  {
    label: "Patio Heaters",
    img: "/images/feature/patio-heaters-1.webp",
    url: `${BASE_URL}/patio-heaters`,
  },
  {
    label: "Built-In Grills",
    img: "/images/feature/Built-in Grill 2.webp",
    url: `${BASE_URL}/built-in-grills`,
  },
  {
    label: "Freestanding Grills",
    img: "/images/feature/Freestanding Grill 2.webp",
    url: `${BASE_URL}/freestanding-grills`,
  },
  {
    label: "Open Box",
    img: "/images/feature/open-box.webp",
    url: `${BASE_URL}/open-box`,
  },
  {
    label: "Current Deals",
    img: "/images/home/categories/clearance.webp",
    url: `${BASE_URL}/brand/eloquence`,
  },
];

const Hero = ({ data }) => {
  const useBanner = data?.banner?.img?.src;
  if (!useBanner) return;

  return (
    <div className={`w-full mx-auto flex flex-col md:flex-row`}>
      <div className={`w-full md:w-full relative overflow-hidden`}>
        <div className="w-full relative isolate px-6 lg:px-8 bg-no-repeat bg-center bg-cover aspect-[414/77]">
          {
            <Image
              src={useBanner}
              alt={"Banner"}
              className="w-full h-full object-contain"
              fill
              loading="eager"
              priority={true}
              quality={100}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          }
        </div>
      </div>
    </div>
  );
};


function ProductGallery({ pageData, slug }) {
  return (
    <main>
      <MobileLoader isLoading={!pageData} />
      <HeroNotice data={pageData} />
      <Hero data={pageData} />
      <div className="px-1 md:px-[20px]">
        <ProductsSection category={slug} />
        {pageData?.collections &&
          Array.isArray(pageData.collections) &&
          pageData.collections.length > 0 && (
            <div className="container mx-auto flex flex-col gap-[50px]">
              {pageData.collections.map((collection) => (
                <CollectionCarouselWrap
                  key={`collection-carousel-${collection?.mb_uid}`}
                  data={collection}
                />
              ))}
            </div>
          )}
        <Reviews />
        <FeatureCategoriesSection items={feat_carousel_items} />
        {pageData?.faqs &&
          pageData?.faqs?.visible &&
          pageData?.faqs?.data &&
          Array.isArray(pageData.faqs.data) &&
          pageData.faqs.data.length > 0 && <Faq data={pageData.faqs.data} />}

        <NewsLetter />
      </div>
    </main>
  );
}

export default ProductGallery;
