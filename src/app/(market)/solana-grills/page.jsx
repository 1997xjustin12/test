// COMPONENTS
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/app/components/atom/SectionHeader";

import MobileLoader from "@/app/components/molecule/MobileLoader";
import FeatureCategoriesSection from "@/app/components/section/HomePageFeatureCategories";
import ShopAllClearanceSection from "@/app/components/section/HomePageShopAllClearance";
import AboutProductSection from "@/app/components/section/HomePageAboutProduct";
import ReviewsSection from "@/app/components/section/HomePageReviews";

import NewsLetterSection from "@/app/components/section/NewsLetter";

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
const about_content = {
  image: "/images/home/about-solana-grills-image.webp",
  imageWrap: {
    className: "relative aspect-1 w-[300px]",
  },
  contact: "(888) 667-4986",
  content: {
    title: "About Solana BBQ Grills",
    par: [
      "At Solana BBQ Grills, we’re passionate about bringing people together through great food and outdoor living. We specialize in high-quality grills, side burners, and outdoor kitchen equipment from trusted brands like Bull, Blaze, and more. From building a full outdoor kitchen to upgrading your backyard grill station, we provide reliable, performance-driven products that match your style, space, and budget.",
      "We believe outdoor cooking should be easy, enjoyable, and built to last. That’s why we offer expert support, fast shipping, and a carefully selected range of products known for durability and value. At Solana BBQ Grills, we don’t just sell equipment; we help you create unforgettable moments, one perfectly grilled meal at a time.",
    ],
  },
  button: {
    className:
      "font-medium border px-[20px] py-[8px] rounded bg-neutral-800 text-white shadow-md text-lg cursor-pointer hover:bg-neutral-700 flex items-center gap-[10px]",
  },
};

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

const BestBBQBrands = () => {
  const bbb_menu = [
    {
      name: "Blaze Outdoor Products",
      url: "#",
      child: [
        { name: "Blaze Open Box", url: "#" },
        { name: "Blaze Grills", url: "#" },
        { name: "Blaze Side Burners", url: "#" },
        { name: "Blaze Storage", url: "#" },
        { name: "Blaze Refrigeration", url: "#" },
        { name: "Blaze Accessories", url: "#" },
      ],
    },
    {
      name: "Bull outdoor Products",
      url:"#"
    },
    {
      name: "Napoleon",
      url:"#"
    },
    {
      name: "Eloquence Outdoor Kitchen Products",
      url:"#"
    },
    {
      name: "Grandeur",
      url:"#"
    },
  ];

  const items = [
    {
      name: "Gas Fireplaces",
      url: "gas-fireplaces",
      img: "/images/feature/fire-pits-2.avif",
    },
    {
      name: "Wood Fireplaces",
      url: "wood-fireplaces",
      img: "/images/feature/outdoor-fireplaces.avif",
    },
    {
      name: "Electric Fireplaces",
      url: "electric-fireplaces",
      img: "/images/feature/featured-collection-freestanding-electric-fireplaces.webp",
    },
    {
      name: "Outdoor Fireplaces",
      url: "outdoor-fireplaces",
      img: "/images/feature/outdoor-fireplaces-3.webp",
    },
  ];
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <div className="hidden lg:block">
          <SectionHeader text="Best BBQ Brands" />
          <div className="flex-col md:flex-row flex gap-[10px] mt-5">
            <div className="w-[25%] min-w-[250px] flex flex-col gap-5">
              {bbb_menu.map((i, idx) => (
                <div key={`menu-item-${idx}`} className="">
                  <Link prefetch={false} href={i?.url || "#"} className="font-bold">{i?.name}</Link>
                  <div className="mt-3 flex flex-col gap-[3px]">
                    {i?.child && Array.isArray(i?.child) && i?.child?.length > 0 && i.child.map((i2, idx2) => (
                      <Link
                        prefetch={false}
                        href={`${BASE_URL}/${i2?.url}`}
                        key={`menu-sub-item-${idx}-${idx2}`}
                      >
                        {i2.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-l w-[calc(100%-250px)]  pl-[20px]">
              <div className="text-3xl italic font-semibold __className_b1512a">
                Blaze Outdoor Products
              </div>
              <div className="flex flex-col gap-[30px] mt-5 min-h-[230px] items-center justify-center border-4 rounded">
                <div className="text-neutral-400 font-bold text-3xl">{"<CONTENT SOON />"}</div>
                {/* <div className=" w-full flex flex-col md:flex-row md:flex-wrap gap-[4px]">
                  {items.map((i, idx) => (
                    <Link
                      prefetch={false}
                      href={`${BASE_URL}/${i?.url}`}
                      key={`fireplace-stoves-1-${idx}`}
                      className="border p-4 w-full lg:w-[calc(25%-4px)] xl:w-[calc(25%-4px)] flex flex-col gap-[10px] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-1 bg-stone-100 border">
                        {
                          <Image
                            src={i.img}
                            alt={`${i.name}-image`}
                            className="w-full h-full object-cover"
                            fill
                            sizes="100vw"
                          />
                        }
                      </div>
                      <div className="h-[72px] flex justify-center items-center">
                        <div className="font-medium text-sm md:text-base text-center">
                          {i.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div> */}
              </div>
              <div className="flex mt-5 items-center justify-end">
                <Link prefetch={false} href="#" className="font-medium border px-[20px] py-[8px] rounded bg-neutral-800 text-white shadow-md text-lg cursor-pointer hover:bg-neutral-700 flex items-center gap-[10px]">Shop All Blaze Products</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <SectionHeader text="Shop Fireplaces & Stoves" />
          <div className="flex flex-col gap-[30px] mt-5">
            <div className=" w-full flex flex-wrap gap-5">
              {items.slice(0, 6).map((i, idx) => (
                <Link
                  prefetch={false}
                  href={`${BASE_URL}/${i?.url}`}
                  key={`fireplace-stoves-1-${idx}`}
                  className="w-[calc(50%-10px)] border p-4 lg:w-full flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-1 bg-stone-100 border">
                    {
                      <Image
                        src={i.img}
                        alt={`${i.name}-image`}
                        className="w-full h-full object-contain"
                        fill
                        sizes="100vw"
                      />
                    }
                  </div>
                  <div className="h-[49px]">
                    <div className="font-bold text-sm text-center">
                      {i.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                prefetch={false}
                href={`${BASE_URL}/fireplaces`}
                className="text-sm md:text-base font-bold bg-theme-600 hover:bg-theme-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md"
              >
                Shop Fireplaces & Stoves
              </Link>
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
      <AboutProductSection data={about_content} />
      <ReviewsSection />
      <BestBBQBrands />
      <NewsLetterSection />
    </>
  );
}
