// NPM
import Image from "next/image";
import Link from "next/link";
// COMPONENTS
import SectionHeader from "@/app/components/atom/SectionHeader";
import MobileLoader from "@/app/components/molecule/MobileLoader";
import NewsLetterSection from "@/app/components/section/NewsLetter";
import FAQsSection from "@/app/components/atom/FAQs"
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
// HELPERS
import { keys, redis } from "@/app/lib/redis";
import { BASE_URL, createSlug } from "@/app/lib/helpers";
// CONSTANTS
const pathname = "solana-bbq-grills";
const shopUrl = `${BASE_URL}/eloquence`;
export const metadata = {
  title: "Shop Outdoor Kitchen Equipment | Solana BBQ Grills",
  description:
    "Upgrade your backyard with premium outdoor kitchen equipment from Solana BBQ Grills. Best prices on grills, burners, and accessories. Shop now!",
};
const defaultMenuKey = keys.dev_shopify_menu.value;
const faqs = [
  {
    id: "Q1",
    is_open: false,
    question: "How do I choose a BBQ?",
    answer:
      "Choose a barbecue grill with a cooking surface that matches your household size and lifestyle. For one or two people, a grill with about 200 square inches is sufficient. A typical four-person household should look for a cooking area between 450 and 550 square inches. For bigger families or those who enjoy hosting gatherings, a grill with a cooking area of 550 to 650 square inches is the perfect choice.",
  },
  {
    id: "Q2",
    is_open: false,
    question: "Which material is good for a grill?",
    answer:
      "304 stainless steel is a popular choice for grills, thanks to its superior durability and excellent resistance to corrosion and oxidation, making it ideal for long-term outdoor use.",
  },
  {
    id: "Q3",
    is_open: false,
    question: "What is a good price for a grill?",
    answer:
      "A high-quality gas grill often costs over $2,000. Our favorite, the Eloquence Grill, is just $1,459.99, saving you $292 without compromising on performance.",
  },
  {
    id: "Q4",
    is_open: false,
    question: "How long do grills last?",
    answer:
      "A well-made gas grill typically lasts between 5 to 15 years, while high-end models can reach up to 20 years with proper care and maintenance. Electric grills typically have a lifespan comparable to gas grills, lasting anywhere between 5 and 15 years.",
  },
  {
    id: "Q5",
    is_open: false,
    question: "What type of grill is the healthiest?",
    answer:
      "While no grill is entirely free of health risks, gas grills are generally considered safer than other traditional options. However, electric grills, though less popular, pose the lowest risk of exposing food to carcinogens as they operate without open flames or smoke.",
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
const Hero = () => {
  const useBanner = "/images/banner/home-banner.webp";
  // const data = {
  //   title: "Grill Better for Less with Solana Outdoor Kitchen Equipments",
  //   tag_line:
  //     "Solana Grills offers high-quality grills, burners, and outdoor kitchen accessories from trusted brands to help you build a stylish and functional outdoor cooking space that fits your needs.",
  // };
  return (
    <div
      className={`w-full mx-auto flex flex-col md:flex-row`}
    >
      <div className={`w-full md:w-full`}>
        <div className="w-full relative isolate px-6 lg:px-8 bg-no-repeat bg-center bg-cover bg-stone-800 h-[250px] md:h-[calc(100vh-450px)] md:max-h-[550px]">
          {
            <Image
              src={useBanner}
              alt={"Banner"}
              className="w-full h-full object-cover"
              fill
              loading="eager"
              priority={true}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          }
          {/* <div className="absolute z-[9999] inset-0 m-auto flex items-center justify-center">
            <div className="container text-center flex justify-center">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="w-[90%]">
                  <h1 className="text-balance text-md tracking-wide text-white md:text-4xl drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] italic">
                    {data?.title}
                  </h1>
                </div>
                <div className="w-[75%]">
                  <h2 className="text-xs md:text-base text-balance font-normal mt-1 tracking-wide text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] text-center">
                    {data?.tag_line}
                  </h2>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// ELOQUENCE COMPONENTS
const sub_category_obj = [
  {
    name: "Eloquence Grills",
    url: `${BASE_URL}/eloquence-grills`,
    image: "/images/feature/eloquence-grills.webp",
  },
  {
    name: "Eloquence Side Burners",
    url: `${BASE_URL}/eloquence-side-burners`,
    image: "/images/feature/eloquence-side-burners.webp",
  },
  {
    name: "Eloquence Storage",
    url: `${BASE_URL}/eloquence-storage`,
    image: "/images/feature/eloquence-storage.webp",
  },
  {
    name: "Eloquence Accessories",
    url: `${BASE_URL}/eloquence-accessories`,
    image: "/images/feature/eloquence-accessories.webp",
  },
];

const SubCategoriesDisplay = ({ categories }) => {
  if (!categories) {
    return;
  }
  return (
    <div>
      <div className="container mx-auto mb-10 px-[10px] lg:px-[20px]">
        <div className="flex gap-[30px]">
          {categories &&
            Array.isArray(categories) &&
            categories?.length > 0 &&
            categories.map((category, index) => (
              <Link
                prefetch={false}
                href={category?.url}
                className="w-[220px] flex flex-col gap-[15px] group"
                key={`sub-category-flex-display-${index}`}
              >
                <div className="aspect-1 p-[30px] rounded-full bg-neutral-white relative box-border border-[10px] border-white group-hover:border-slate-300 group-hover:shadow transition-all duration-300 ease-in-out group-hover:pb-[40px] group-hover:pt-[20px] overflow-hidden">
                  <div className="aspect-1 box-border relative">
                    {category?.image && (
                      <Image
                        src={category?.image}
                        title={`${category?.name} Image`}
                        alt={`${createSlug(category?.name)}-image`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    )}
                  </div>
                </div>
                <div className="text-center font-bold">{category?.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <div className="container mx-auto mb-10 px-[10px] lg:px-[20px]">
      <div className="flex">
        <div className="w-full">
          <div className="aspect-w-3 aspect-h-2 relative">
            <Image
              src={`/images/home/blogs/why-eloquence_720x.webp`}
              title={`Why Eloquence Image`}
              alt={`why-eloquence-image`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        </div>
        <div className="w-full flex items-center">
          <div className="p-3 flex flex-col gap-[10px]">
            <div className="h-[80px] relative flex items-start justify-start text-left">
              <Image
                src={`/images/feature/eloquence-text-logo.avif`}
                title={`Eloquence Text Logo`}
                alt={`${createSlug(`Eloquence Text Logo`)}-image`}
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
            <div>
              <h2 className="text-2xl">
                Elevating Outdoor Cooking with Affordable Luxury
              </h2>
            </div>
            <div>
              <p>
                All Eloquence built-in grills are crafted with precision,
                featuring high-performance burners, heavy-duty stainless steel
                construction, sleek dual-lined hoods, and premium cooking grates
                for consistent, even heat. Designed for both style and strength,
                Eloquence grills offer the perfect blend of elegance and
                functionality. Each unit is engineered for easy integration into
                our custom outdoor kitchens, making it simple to upgrade your
                backyard with a touch of luxury that lasts.
              </p>
            </div>
            <div className="box-border py-5">
              <Link
                prefetch={false}
                href={`${BASE_URL}/eloquence`}
                className="box-border bg-theme-600 text-white font-bold py-3 px-10 rounded-full hover:shadow-md"
              >
                Shop All Eloquent Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const blogs = [
  {
    title: "Blog 1",
    img: "/images/home/blogs/the-ultimate-guide-to-building-your-dream-outdoor-bbq-kitchen-solana.webp",
    tag: "Buying Guide",
    tag_bg: "bg-green-600",
    content:
      "This comprehensive guide will walk you through every step of the process, from initial planning to adding those final personal touches.",
  },
  {
    title: "Blog 2",
    img: "/images/home/blogs/your-guide-to-affordable-bbq-bliss-image-solana.webp",
    tag: "Buying Guide",
    tag_bg: "bg-green-600",
    content:
      "This guide will walk you through the steps to designing a fantastic outdoor BBQ kitchen without breaking the bank.",
  },
  {
    title: "Blog 3",
    img: "/images/home/blogs/essential-outdoor-kitchen-maintenance-tips-for-long-lasting-performance-image-solana.webp",
    tag: "Tips & Tricks",
    tag_bg: "bg-rose-600",
    content:
      "This guide provides key tips for effective outdoor kitchen maintenance, helping you preserve both beauty and functionality.",
  },
];

const BlogsSection = ({ blogs }) => {
  return (
    <div className="container mx-auto mb-10 px-[10px] lg:px-[20px]">
      <h4 className="font-bold text-2xl mb-3">Elouqence Resource Center</h4>
      <div className="flex  flex-col md:flex-row  gap-[20px]">
        {blogs &&
          Array.isArray(blogs) &&
          blogs?.length > 0 &&
          blogs.map((blog, index) => (
            <div
              key={`blog-item-${index}`}
              className="w-full flex flex-col gap-[15px]"
            >
              <div className="aspect-[4/3] relative bg-neutral-200 flex items-center justify-center">
                <div className="font-bold text-neutral-500">
                  Blog Image Here
                </div>
              </div>
              <h5 className="text-lg font-bold text-center">{blog?.title}</h5>
            </div>
          ))}
      </div>
    </div>
  );
};

const videos = [
  {title: `TWIN EAGLES 18″ OUTDOOR BAR Outdoor Kitchen Outlet`, src: "https://www.youtube.com/embed/-0u7Q_WBmyE" },
  {title: `Welcome to Outdoor Kitchen Outlet`, src: "https://www.youtube.com/embed/RhECp_AXlNQ" },
  {title: `TWIN EAGLES FREESTANDING DINE & BREAKFAST CLUB 30” Gas Grill Base with 2 Doors Outdoor Kitchen Outlet`, src: "https://www.youtube.com/embed/jsjhMVh4aHY" }
];

const VideoSection = ({videos}) => {
  return (
    <div className="container mx-auto mb-10 px-[10px] lg:px-[20px]">
      <h4 className="font-bold text-2xl mb-3">Elouqence Videos</h4>
      <div className="flex flex-col md:flex-row gap-[20px]">
        {
          videos && Array.isArray(videos) && videos?.length > 0 &&
          videos.map((video, index) => 
        <div key={`video-section-item-${index}`} className="w-full">
          <iframe
            className="w-full aspect-[4/3]"
            src={video?.src}
            title={video?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>)
        }
      </div>
    </div>
  );

};

// MAIN COMPONENT
export default async function EloquencePage() {
  // const menu = await getMenu();

  // const pageData = flattenNav(menu).find(({ url }) => url === pathname);
  return (
    <>
      <MobileLoader />
      <Hero />
      <div className="bg-[#e53237] mb-10">
        <div className="container mx-auto p-2">
          <Link
            prefetch={false}
            href={shopUrl}
            className="flex justify-center items-center gap-[20px] font-medium text-white"
          >
            Price so low we cannot advertise. Call for Closeout Availability{" "}
            <button className="p-2 bg-neutral-50 font-bold text-black">
              See Offers!
            </button>
          </Link>
        </div>
      </div>
      <SubCategoriesDisplay categories={sub_category_obj} />
      <div className="bg-black mb-10">
        <div className="container mx-auto p-2">
          <Link
            prefetch={false}
            href={shopUrl}
            className="flex justify-center items-center gap-[20px] font-medium text-white"
          >
            Free White Glove Service on Selected Items.Export{" "}
            <button className="p-2 bg-neutral-50 font-bold text-black">
              Find Out More!
            </button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto mb-10 flex flex-col gap-[20px]">
        <CollectionCarouselWrap
          data={{ id: 17, mb_label: "Exclusive Offers For You" }}
        />
        <div className="text-center">
          <Link
            prefetch={false}
            href={`${BASE_URL}/eloquence-grills`}
            className="bg-theme-600 text-white font-bold py-3 px-10 rounded-full hover:shadow-md"
          >
            Shop All Eloquence Exclusives
          </Link>
        </div>
      </div>

      <div className="container mx-auto mb-10 flex flex-col gap-[20px]">
        <CollectionCarouselWrap
          data={{ id: 17, mb_label: "Best Seller For Eloquence" }}
        />
        <div className="text-center">
          <Link
            prefetch={false}
            href={`${BASE_URL}/brand/eloquence`}
            className="bg-theme-600 text-white font-bold py-3 px-10 rounded-full hover:shadow-md"
          >
            Shop All Eloquence Best Sellers
          </Link>
        </div>
      </div>
      <AboutSection />
      <BlogsSection blogs={blogs} />
      <VideoSection videos={videos} />
      <div className="container mx-auto mb-10 px-[10px] lg:px-[20px]">
        <h4 className="font-bold text-2xl mb-3">Frequently Asked Questions</h4>
        <FAQsSection faqs={faqs} itemClassName="bg-red-600 hover:bg-red-500 text-white py-[10px] px-[20px] cursor-pointer flex justify-between font-medium"/>
      </div>
    </>
  );
}
