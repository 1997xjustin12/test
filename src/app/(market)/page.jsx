"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    label: "Patio Heaters",
    img: "/images/feature/patio-heaters-1.webp",
    url: `${BASE_URL}/patio-heaters`,
  },
  {
    label: "Built-In Grills",
    img: "/images/feature/built-in-grills.webp",
    url: `${BASE_URL}/built-in-grills`,
  },
  {
    label: "Freestanding Grills",
    img: "/images/feature/freestanding-grills.webp",
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

const sac_contents = [
  {
    image: {
      src: "/images/home/elevate-your-fireplace.webp",
      alt: "Modern Fireplace Designs",
    },
    title: "How to Choose the Right Outdoor Kitchen Island for Your Backyard",
    content:
      "A modern fireplace can elevate your home, providing both warmth and a stylish focal point for family gatherings or quiet evenings. We offer a wide selection of fireplaces including wood-burning, gas, and electric.",
    button: {
      label: "Learn More",
      url: `https://outdoorkitchenoutlet.com/blogs/general-information/best-custom-outdoor-kitchen`,
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
      url: `https://outdoorkitchenoutlet.com/pages/contact-us`,
    },
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
  contact: "(888) 575-9720",
  content: {
    title: "About Solana Fireplaces",
    par: [
      "At Solana Fireplaces, we believe that the heart of a home extends beyond its walls. We specialize in creating exceptional outdoor living experiences through our expertly curated selection of high-quality fireplaces, fire pits, and related accessories. We are committed to providing you with products and the knowledge and support you need to transform your outdoor space into a warm, inviting haven.",
      "Beyond fireplaces, Solana also caters to outdoor living enthusiasts by offering a wide range of outdoor kitchen products. Our selection includes top-of-the-line grills, BBQ islands, and accessories to create the ultimate outdoor cooking and entertainment area. With Solana Fireplaces, you can rely on our expertise and dedication to quality, knowing that you are choosing a partner committed to enhancing your home and lifestyle with the best in both indoor and outdoor heating and cooking solutions.",
    ],
  },
};

const faqs = [
  {
    id: "Q1",
    is_open: false,
    question: "What is a fireplace also called?",
    answer:
      "A fireplace is often referred to by names highlighting its parts and design, such as mantel, chimney, firebox, flue, grate, hearthstone, or fire surround.",
  },
  {
    id: "Q2",
    is_open: false,
    question: "What is a fireplace used for?",
    answer:
      "A fireplace or hearth, made of brick, stone, or metal, contains a fire for heating and ambiance. Modern designs offer varying heat efficiency.",
  },
  {
    id: "Q3",
    is_open: false,
    question: "What is the definition of a fireplace?",
    answer:
      "A fireplace is a framed chimney opening or metal container with a smoke pipe for an open fire. It can also be an outdoor brick, stone, or metal structure for fires.",
  },
  {
    id: "Q4",
    is_open: false,
    question: "What does a fireplace symbolize?",
    answer:
      "In art, literature, and film, the fireplace symbolizes home, warmth, comfort, and safety, enriching storytelling.",
  },
  {
    id: "Q5",
    is_open: false,
    question: "Which type of fireplace is best?",
    answer:
      "Gas fireplaces are more efficient, cleaner, and safer than wood-burning ones, producing fewer emissions and no ash or soot. They’re easier to maintain and can operate during power outages.",
  },
];


const Hero = () => {
  const useBanner = "/images/banner/home-banner-202509.webp";
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
      <Hero />
      {/* <HomeHero data={pageData} /> */}
      <div className="mt-10">
        <FeatureCategoriesSection items={feat_carousel_items} />
      </div>

      {/* <ShopAllClearanceSection contents={sac_contents} /> */}
      <ShopAllClearanceSection contents={sac_contents_2} />
      <ShopOpenBoxSection />
      <AboutProductSection data={about_content} />
      <ReviewsSection />
      {/* <ShopCategorySection /> */}
      <GuidesAndInspirationSection />
      {/* <PartsAndAccessoriesSection /> */}
      {/* <FrequentlyAskedSection faqs={faqs}/> */}
      <NewsLetterSection />
    </>
  );
}
