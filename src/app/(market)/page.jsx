import Image from "next/image";
import dynamic from "next/dynamic";
// home page section import in order
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME, STORE_CONTACT } from "@/app/lib/store_constants";

import NewHero from "@/app/components/home-section/NewHero";
import BrandsStrip from "@/app/components/home-section/BrandsStrip";
import Category from "@/app/components/home-section/Category";
import Products from "@/app/components/home-section/Products";
import Why from "@/app/components/home-section/Why";
import Promo from "@/app/components/home-section/Promo";
import Reviews from "@/app/components/home-section/Reviews";
import Blogs from "@/app/components/home-section/Blogs";
import Cta from "@/app/components/home-section/Cta";
import NewsLetter from "@/app/components/home-section/NewsLetter";


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


export default function HomePage() {
  return (
    <>
      <NewHero />
      <BrandsStrip />
      <Category />
      <Products />
      <Why />
      <Promo />
      <Reviews />
      <Blogs />
      <Cta />
      <NewsLetter />
    </>
  );
}
