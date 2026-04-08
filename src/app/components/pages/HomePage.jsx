import Image from "next/image";
import dynamic from "next/dynamic";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME, STORE_CONTACT } from "@/app/lib/store_constants";

import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
// Lazy-load below-fold sections to reduce initial JS bundle
const ShopAllClearanceSection = dynamic(
  () => import("@/app/components/section/HomePageShopAllClearance"),
);
const ShopOpenBoxSection = dynamic(
  () => import("@/app/components/section/HomePageShopOpenBox"),
);
const AboutProductSection = dynamic(
  () => import("@/app/components/section/HomePageAboutProduct"),
);
const ReviewsSection = dynamic(
  () => import("@/app/components/section/HomePageReviews"),
);
const GuidesAndInspirationSection = dynamic(
  () => import("@/app/components/section/HomePageGuidesAndInspiration"),
);
const NewsLetterSection = dynamic(
  () => import("@/app/components/section/NewsLetter"),
);

// OLD UI CONSTANTS & FUNCTIONS
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

const sac_contents_2 = [
  {
    image: {
      src: "/images/home/elevate-your-fireplace.webp",
      alt: "Modern Fireplace Designs",
    },
    title: "Modern Fireplace Designs",
    content:
      "A modern fireplace can elevate your home, providing both warmth and a stylish focal point for family gatherings or quiet evenings. We offer a wide selection of fireplaces including wood-burning, gas, and electric.",
    button: {
      label: "Learn More",
      url: `${BASE_URL}/blogs/modern-fireplace-designs`,
    },
  },
  {
    image: {
      src: "/images/home/clearance.webp",
      alt: "Outdoor-Kitchen-Deals-Img",
    },
    title: "Name your budget",
    content:
      "On a budget, no problem. Create your dream backyard kitchen with top-of-the-line grills, BBQ islands, and all the essential accessories, all while taking advantage of great deals and savings. Expert standing by!",
    button: {
      label: "Call now to Save",
      url: `${BASE_URL}/contact`,
    },
  },
];

const about_content = {
  image: "/images/banner/fireplace-banner.webp",
  contact: STORE_CONTACT,
  content: {
    title: `About ${STORE_NAME}`,
    par: [
      `At ${STORE_NAME}, we believe that the heart of a home extends beyond its walls. We specialize in creating exceptional outdoor living experiences through our expertly curated selection of high-quality fireplaces, fire pits, and related accessories. We are committed to providing you with products and the knowledge and support you need to transform your outdoor space into a warm, inviting haven.`,
      `Beyond fireplaces, Solana also caters to outdoor living enthusiasts by offering a wide range of outdoor kitchen products. Our selection includes top-of-the-line grills, BBQ islands, and accessories to create the ultimate outdoor cooking and entertainment area. With ${STORE_NAME}, you can rely on our expertise and dedication to quality, knowing that you are choosing a partner committed to enhancing your home and lifestyle with the best in both indoor and outdoor heating and cooking solutions.`,
    ],
  },
};

const OldHero = () => {
  return (
    <div className="w-full mx-auto">
      {/* Mobile banner — priority preloads this image in <head> */}
      <div className="block sm:hidden relative aspect-[2/1]">
        <Image
          src="/images/banner/solana-home-hero-mobile.webp"
          alt="Banner"
          fill
          className="object-cover"
          priority={true}
          sizes="100vw"
          quality={85}
        />
      </div>
      {/* Desktop banner — priority preloads this image in <head> */}
      <div className="hidden sm:block relative aspect-[414/77]">
        <Image
          src="/images/banner/home-banner-202509.webp"
          alt="Banner"
          fill
          className="object-cover"
          priority={true}
          sizes="100vw"
          quality={85}
        />
      </div>
    </div>
  );
};
// OLD UI FUNCTIONS END

function HomePage() {
  return (
    <main>
      <OldHero />
      <div className="mt-10">
        <FeatureCategoriesSection items={feat_carousel_items} />
      </div>
      <ShopAllClearanceSection contents={sac_contents_2} />
      <ShopOpenBoxSection />
      <AboutProductSection data={about_content} />
      <ReviewsSection />
      <GuidesAndInspirationSection />
      <NewsLetterSection />
    </main>
  );
}

export default HomePage;
