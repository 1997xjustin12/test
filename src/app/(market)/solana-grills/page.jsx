// COMPONENTS
import Image from "next/image";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";

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
      
    </>
  );
}
