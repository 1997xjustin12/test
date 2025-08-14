// COMPONENTS
import Image from "next/image";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
import ShopAllClearanceSection from "@/app/components/section/HomePageShopAllClearance";

// HELPERS
import { keys, redis } from "@/app/lib/redis";
import { BASE_URL } from "@/app/lib/helpers";

// CONSTANTS
const pathname = "solana-grills";
const defaultMenuKey = keys.dev_shopify_menu.value;
const feat_carousel_items = [
  {
    label: "Gas Grills and Smokers",
    img: "/images/home/categories/bbq-grills-and-smokers.webp",
    url: `${BASE_URL}/#`,
  },
  {
    label: "Outdoor Kitchen Storage",
    img: "/images/home/categories/outdoor-kitchen-storage.webp",
    url: `${BASE_URL}/#`,
  },
  {
    label: "Side Burners",
    img: "/images/home/categories/side-burners.webp",
    url: `${BASE_URL}/#`,
  },
  {
    label: "Outdoor Refrigeration",
    img: "/images/home/categories/outdoor-refrigeration.webp",
    url: `${BASE_URL}/#`,
  },
  {
    label: "Accessories",
    img: "/images/home/categories/accessories.webp",
    url: `${BASE_URL}/#`,
  },
  {
    label: "Covers",
    img: "/images/home/categories/covers.webp",
    url: `${BASE_URL}/#`,
  },
];

const sac_contents = [
  {
    image: {
      src: "/images/home/unmatched-power-and-precision-from-bull-outdoor-products.webp",
      alt: "Unmatched Power and Precision from Bull Outdoor Products Image",
    },
    title: "Unmatched Power and Precision from Bull Outdoor Products",
    content:
      "Bull Outdoor Products has been a trusted name in outdoor kitchen equipment since 1993, offering durable, high-performance grills and accessories. At Solana BBQ Grills, we proudly carry Bull’s top-quality products to help you create a reliable and stylish outdoor cooking space.",
    button: {
      label: "Shop All Bull Products",
      url: `${BASE_URL}/bull-outdoor-products`,
      className:
        "font-medium border px-[20px] py-[8px] rounded bg-neutral-800 text-white shadow-md text-lg cursor-pointer hover:bg-neutral-700",
    },
  },
  {
    image: {
      src: "/images/home/cook-with-power-and-precision-using-blaze-grills.webp",
      alt: "Cook with Power and Precision Using Blaze Grills Image",
    },
    title: "Cook with Power and Precision Using Blaze Grills",
    content:
      "Blaze Grills delivers commercial-grade performance and sleek design at a great value. Made with durable stainless steel and precise engineering, Blaze is trusted by backyard chefs who want pro-level results. At Solana BBQ Grills, we proudly offer Blaze products to help you create a high-performance outdoor kitchen.",
    button: {
      label: "Shop All Blaze Products",
      url: `${BASE_URL}/blaze-outdoor-products`,
      className:
        "font-medium border px-[20px] py-[8px] rounded bg-neutral-800 text-white shadow-md text-lg cursor-pointer hover:bg-neutral-700",
    },
  },
];

// FUNCTIONS
const getMenu = async () => {
  return await redis.get(defaultMenuKey);
};

const flattenNav = (navItems) => {
  let result = [];

  const extractLinks = (items) => {
    items.forEach(({ children = [], ...rest }) => {
      result.push({ ...rest, children });
      extractLinks(children);
    });
  };

  extractLinks(navItems);

  return result;
};

// EXTENDED COMPONENT
const Hero = ({ data }) => {
  const useBanner =
    !data?.banner?.img?.src || data?.banner?.img?.src === ""
      ? "/images/banner/solana-home-hero.webp"
      : data?.banner?.img?.src;

  return (
    <div
      className={`w-full mx-auto flex flex-col md:flex-row ${
        data ? "fade-in" : "opacity-0"
      }`}
    >
      <div className={`w-full md:w-full`}>
        <div className="w-full relative isolate px-6 lg:px-8 bg-no-repeat bg-center bg-cover bg-stone-800 h-[250px] md:h-[calc(100vh-450px)] md:max-h-[550px]">
          {
            <Image
              src={useBanner}
              alt={data?.banner?.img?.alt ?? "Banner"}
              className="w-full h-full object-cover"
              fill
              loading="eager"
              priority={true}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          }
          <div className="absolute z-[9999] inset-0 m-auto flex items-center justify-center">
            <div className="container text-center flex justify-center">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="w-[90%]">
                  <h1 className="text-balance text-md tracking-wide text-white md:text-4xl drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] italic">
                    {data?.banner?.title}
                  </h1>
                </div>
                <div className="w-[75%]">
                  <h2 className="text-xs md:text-base text-balance font-normal mt-1 tracking-wide text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] text-center">
                    {data?.banner?.tag_line}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN COMPONENT
export default async function SolanaGrillsPage() {
  const menu = await getMenu();

  const pageData = flattenNav(menu).find(({ url }) => url === pathname);
  return (
    <>
      <MobileLoader />
      <Hero data={pageData} />
      <FeatureCategoriesSection items={feat_carousel_items} />
      <ShopAllClearanceSection contents={sac_contents} />
    </>
  );
}
