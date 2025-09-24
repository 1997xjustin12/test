// NPM
import Image from "next/image";
import Link from "next/link";
// COMPONENTS
import MobileLoader from "@/app/components/molecule/MobileLoader";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
import NewsLetterSection from "@/app/components/section/NewsLetter";
import FAQsSection from "@/app/components/atom/FAQs";
import BlogsSection from "@/app/components/section/HomeBlogs";

import CarouselWrap from "@/app/components/atom/CarouselWrap";
import { Rating } from "@smastrom/react-rating";
import { parseRatingCount } from "@/app/lib/helpers";
// HELPERS
import { keys, redis } from "@/app/lib/redis";
import { BASE_URL, createSlug } from "@/app/lib/helpers";
import openBoxItemPrice from "@/app/components/atom/openBoxItemPrice";
// CONSTANTS
const pathname = "solana-bbq-grills";
const shopUrl = `${BASE_URL}/eloquence`;
export const metadata = {
  title: "Shop Outdoor Kitchen Equipment | Solana BBQ Grills",
  description:
    "Upgrade your backyard with premium outdoor kitchen equipment from Solana BBQ Grills. Best prices on grills, burners, and accessories. Shop now!",
};
const defaultMenuKey = keys.dev_shopify_menu.value;

const contact_number = "(888) 667-4986";

const color1 = "#e98f3b";
const color2 = "#e53237";

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

// EXTENDED COMPONENT
const Hero = () => {
  const useBanner = "/images/home/eloquence/eloquence-banner-202509.webp";
  return (
    <div className={`w-full mx-auto flex flex-col md:flex-row`}>
      <div className={`w-full md:w-full relative overflow-hidden`}>
        <div className="w-full relative aspect-[640/119] bg-red-200">
          {
            <Image
              src={useBanner}
              alt={"Banner"}
              className="object-contain"
              fill
              loading="eager"
              priority={true}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          }
        </div>
      </div>
    </div>
  );
};

const HeroAlert = () => {
  return (
    <div className="bg-[#4c4c53]">
      <div className="container mx-auto p-2 text-xs sm:text-base">
        <Link
          prefetch={false}
          href={`tel:${contact_number}`}
          className="text-white"
        >
          <div className="text-center">
            Call For Best Pricing{" "}
            <span className="underline">{`888-667-4986`}</span>
          </div>
          <div className="text-center">
            Experts are standing by to provide you with best pricing and
            exclusive package deal discounts. Save today with just 1 call.
          </div>
        </Link>
      </div>
    </div>
  );
};

const Block1 = () => {
  const image =
    "/images/home/eloquence/built-to-impress-priced-to-compete.webp";
  const imageAlt = "Build to Impress. Priced to Compete";
  return (
    <div className="container mx-auto p-[10px] md:px-[20] md:py-[40px]">
      <div className="flex gap-[20px]">
        <div className="w-full aspect-[500/260] bg-white flex items-center justify-center">
          <div className="font-bold text-xl text-neutral-400 relative">
            <Image
              src={image}
              alt={imageAlt}
              className="object-cover"
              width={1000}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          </div>
        </div>
        <div className="w-full flex items-center">
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[#e98f3b] text-[40px] font-medium leading-[120%] italic font-playfair-display">
              Build to Impress. Priced to Compete
            </h2>
            <p>
              Eloquence Outdoor Living combines premium outdoor kitchen
              equipment with timeless design to enhance backyard kitchens of
              every style. For outdoow cooking essentials to storage solutions,
              fireplaces, and accessories, each piece is built for lasting
              performance. Designed to impress and priced to compete, we make
              creating your dream outdoor space easier then ever
            </p>
            <div>
              <button className="py-2 px-10 font-semibold text-white bg-[#e53237] rounded-[15px]">
                Shop now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const block2_items = [
  {
    label: "Eloquence Grills",
    image: "/images/home/eloquence/eloquence-home-eloquence-grills.webp",
    url: `${BASE_URL}/eloquence-grills`,
  },
  {
    label: "Eloquence Side Burners",
    image: "/images/home/eloquence/eloquence-home-eloquence-side-burners.webp",
    url: `${BASE_URL}/eloquence-side-burners`,
  },
  {
    label: "Eloquence Storage",
    image: "/images/home/eloquence/eloquence-home-eloquence-storage.webp",
    url: `${BASE_URL}/eloquence-storage`,
  },
  {
    label: "Eloquence Accessories",
    image: "/images/home/eloquence/eloquence-home-eloquence-accessories.webp",
    url: `${BASE_URL}/eloquence-accessories`,
  },
  {
    label: "Eloquence Fireplaces",
    image: "/images/home/eloquence/eloquence-home-eloquence-fireplaces.webp",
    url: `${BASE_URL}/eloquence-fireplaces`,
  },
];

const Block2 = () => {
  const breakpoints = [
    { minWidth: 0, value: 1 },
    { minWidth: 350, value: 2 },
    { minWidth: 750, value: 3 },
    { minWidth: 850, value: 4 },
    { minWidth: 1024, value: 5 },
    { minWidth: 1280, value: 6 },
  ];
  return (
    <div className="container mx-auto p-[10px] md:px-[20] md:py-[40px]">
      <h2 className="text-[#e98f3b] text-[40px] font-medium leading-[120%] italic font-playfair-display mb-5 text-center">
        Design You Can Feel. Performance You Can Trust
      </h2>
      <p className="mb-7">
        We bring together premium outdoor kitchen equipment and styling design
        to transform your backyard into a true culinary destination. Explore our
        collections of built-in grills, side burners, storage solutions, outdoor
        fireplaces, and kitchen accessories crafted for lasting performance and
        timeless appeal.
      </p>
      <div className="flex gap-[20px] w-full">
        <CarouselWrap breakpoints={breakpoints}>
          {block2_items.map((item, index) => (
            <Link
              key={`eloquence-products-categories-${createSlug(item?.label)}`}
              prefetch={false}
              href={item?.url}
              className="flex flex-col border-[3px] border-white hover:border-[#e98f3b] transition-all duration-300 w-full aspect-[236/362]"
            >
              <div className="bg-neutral-200  aspect-[100/120] flex items-center justify-center relative">
                {item?.image && (
                  <Image
                    src={item?.image}
                    title={`${item?.label}`}
                    alt={`${createSlug(item?.label)}-image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                )}
              </div>
              <div className="font-playfair-display font-medium bg-[#e98f3b] min-h-[80px] flex items-center justify-center text-center px-[8px]">
                {item?.label}
              </div>
            </Link>
          ))}

          <Link
            prefetch={false}
            href={`${BASE_URL}/eloquence`}
            className="relative border-[3px] border-white hover:border-[#e98f3b] bg-[#333333] transition-all duration-300 w-full aspect-[236/362]"
          >
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-[35px]">
              <div className="relative aspect-1 w-[65%]">
                <Image
                  src="/images/home/eloquence/eloquence-logo-only.webp"
                  title={`Shop All Eloquence`}
                  alt={`eloquence-logo-only-image`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div className="font-playfair-display text-lg font-[300] text-white">
                Shop All Eloquence
              </div>
            </div>
          </Link>
        </CarouselWrap>
      </div>
    </div>
  );
};

const getCollectionProducts = async (id) => {
  const res = await fetch(
    `${BASE_URL}/api/collections/collection-products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return false;
    // throw new Error("Failed to fetch collection products");
  }

  return res.json();
};

const Block3 = async () => {
  // eloquence-grills id 483
  const data = await getCollectionProducts(483);

  const items_per_break_point = [
    { minWidth: 0, value: 1 },
    { minWidth: 640, value: 2 },
    { minWidth: 768, value: 3 },
    { minWidth: 1280, value: 4 },
  ];

  return (
    <div className="container mx-auto p-[10px] md:px-[20] md:py-[40px]">
      <h2 className="text-[#e98f3b] text-[40px] font-medium leading-[120%] italic font-playfair-display mb-5 text-center">
        Our Best Sellers
      </h2>
      <CarouselWrap breakpoints={items_per_break_point}>
        {data &&
          data.map((item, index) => (
            <div
              key={`carousel-product-item-${item?.handle}`}
              className="bg-blue-50 transition-all delay-300 px-[10px] py-[20px] hover:shadow"
            >
              <Link
                prefetch={false}
                href={`${BASE_URL}/${createSlug(item?.brand)}/product/${
                  item?.handle
                }`}
                title={item?.title}
              >
                <div className="aspect-[120/80] px-[10px] relative bg-white mb-3 w-full">
                  <DisplayImage data={item} />
                </div>
              </Link>
              <div className="px-[20px] flex flex-col gap-[15px]">
                <Link
                  prefetch={false}
                  href={`${BASE_URL}/${createSlug(item?.brand)}/product/${
                    item?.handle
                  }`}
                  className="h-[480x] line-clamp-2 transition-all delay-75 hover:text-theme-600 hover:underline"
                  title={item?.title}
                >
                  {item?.title}
                </Link>
                <div>
                  <Rating
                    readOnly
                    value={parseRatingCount(item?.ratings?.rating_count)}
                    fractions={2}
                    style={{ maxWidth: 120 }}
                  ></Rating>
                </div>
                <div>
                  <PriceFormatter price={item?.variants?.[0]?.price} />
                </div>
                <div className="text-center">
                  <AddToCartButtonWrap product={item}>
                    <button
                      className={`bg-[${color2}] text-white font-semibold rounded-full py-2 px-10`}
                      title={item?.title}
                    >
                      Buy Now
                    </button>
                  </AddToCartButtonWrap>
                </div>
              </div>
            </div>
          ))}
      </CarouselWrap>
      <div className="text-center">
        <button
          className={`bg-[${color2}] text-white font-bold rounded-[15px] py-2 px-20`}
        >
          Shop now
        </button>
      </div>
    </div>
  );
};

const PriceFormatter = ({ price }) => {
  // Format price into integer and decimals
  const formatPrice = (in_price) => {
    if (!in_price) return { intPart: "", decimalPart: "" };

    const [intPart, decimalPart = "00"] = String(in_price).split(".");
    return {
      intPart,
      decimalPart: decimalPart.padEnd(2, "0").slice(0, 2), // always 2 digits
    };
  };

  const { intPart, decimalPart } = formatPrice(price);

  return (
    <div>
      {intPart && (
        <div className="text-3xl font-semibold relative text-[#e98f3b]">
          ${intPart}
          <sup className="text-sm">{decimalPart}</sup>
        </div>
      )}
    </div>
  );
};

const DisplayImage = ({ data }) => {
  if (!data && data.images) return;
  const image = data.images.find(({ position }) => position === 1);
  return (
    <>
      {image && (
        <Image
          src={image?.src}
          title={`${data.title}`}
          alt={`${createSlug(data.title)}-image`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 300px"
        />
      )}
    </>
  );
};

const Reviews = () => {
  const reviews = [
    {
      rating: 5,
      title: "Unlock Your Inner Chef",
      text: "I'm thrilled with this Blaze grill! It's live having a professional grade.",
      img: "/images/home/user-profile-review-1.webp",
      name: "Rendell Silver",
    },
    {
      rating: 5,
      title: "Impressive Quality",
      text: "What a fantastic grill! This Grandeur Premium has...",
      img: "/images/home/user-profile-review-1.webp",
      name: "Zachary Pugh",
    },
    {
      rating: 5,
      title: "Super Team",
      text: "Great customer service and even sent me a replacement...",
      img: "/images/home/user-profile-review-2.webp",
      name: "Sarah Smith",
    },
  ];

  const carousel_breakpoints = [
    { minWidth: 0, value: 1 },
    { minWidth: 1024, value: 2 },
    { minWidth: 1280, value: 3 },
  ];
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto">
        <div className="flex-col lg:flex-row flex gap-[50px] lg:gap-[10px] items-center">
          <div className="lg:w-[30%] lg:p-[20px] flex flex-col gap-[8px] justify-center text-center lg:justify-normal lg:text-left">
            <h2 className="text-[#e98f3b] text-[40px] font-medium leading-[120%] italic font-playfair-display">
              Our customer reviews
            </h2>
            <div className="flex justify-center lg:justify-start">
              <Rating
                readOnly
                value={4.5}
                fractions={2}
                style={{ maxWidth: 150 }}
              ></Rating>
            </div>
            <div className="text-xs lg:text-base">
              4.4 stars out of based from{" "}
              <span className="underline cursor-pointer">122 reviews</span>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="w-[250px] border  border-stone-500 bg-stone-200 h-[35px] rounded-lg overflow-hidden">
                <div className="h-[35px] w-[90%] bg-amber-400 border-t border-t-white"></div>
              </div>
            </div>
            <div className="text-xs lg:text-sm underline text-stone-700 cursor-pointer">
              Write a review
            </div>
          </div>
          <div className="w-full lg:w-[70%] flex-col lg:flex-row flex gap-[10px] min-h-[227px]">
            <CarouselWrap breakpoints={carousel_breakpoints}>
              {reviews.map((i, idx) => (
                <div key={`review-${idx}`} className="bg-white w-full p-[20px]">
                  <div className=" flex flex-col gap-[15px]  justify-center items-center  text-center">
                    <div className="flex text-center justify-center">
                      <Rating
                        readOnly
                        value={i.rating}
                        style={{ maxWidth: 150 }}
                      />
                    </div>
                    <div className="font-extrabold text-sm lg:text-base">
                      {i.title}
                    </div>
                    <div className="text-xs lg:text-sm">{i.text}</div>
                    <div className="flex items-center justify-center">
                      <div className="relative w-[30px] h-[30px]">
                        {
                          <Image
                            src={i.img}
                            alt={`${i.name}-image`}
                            className="w-full h-full object-cover"
                            width={200}
                            height={200}
                          />
                        }
                      </div>
                      <div className="text-xs text-stone-700">{i.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CarouselWrap>
          </div>
        </div>
      </div>
    </div>
  );
};

const Block4 = () => {
  return <Reviews />;
};

const Block5 = () => {
  const image =
    "/images/home/eloquence/where-lasting-flavor-meets-lasting-value.webp";
  const imageAlt = "Where Lasting Flavor, Meets Lasting Value";
  return (
    <div className="container mx-auto p-[10px] md:px-[20] md:py-[40px]">
      <div className="flex gap-[20px]">
        <div className="w-full flex items-center">
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[#e98f3b] text-[40px] font-medium leading-[120%] italic font-playfair-display">
              Where Lasting Flavor, Meets Lasting Value
            </h2>
            <p>
              An outdoor kitchen is more than a cooking space, it's the heart of
              the family gatherings and celebrations. At Eloquence Outdoor
              Living, we craft premium grills, storage, and fireplaces that
              bring lasting flavor to every meal and timeless value to your
              backyard kitchen. Designed to impress and built to endure, our
              collections turn outdoor living into an experience worth savoring.
            </p>
            <div>
              <button className="py-2 px-10 font-semibold text-white bg-[#e53237] rounded-[15px]">
                Shop now
              </button>
            </div>
          </div>
        </div>
        <div className="w-full aspect-[500/260] bg-white flex items-center justify-center shadow">
          <div className="font-bold text-xl text-neutral-400 relative">
            <Image
              src={image}
              alt={imageAlt}
              className="object-cover"
              width={1000}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Block6 = () => {
  return <Blogs />;
};

const Blogs = () => {
  const blogs = [
    {
      title:
        "The Eloquence Journey: From Ordinary to Extraordinary Backyard Outdoor Kitchens",
      img: "/images/home/eloquence/proven-tips-to-extend-your-grills-lifespan.webp",
      tag: "Buying Guide",
      tag_bg: "bg-green-600",
      content:
        "Eloquence was born from a simple belief. The backyard outdoor kitchen should feel luxurious withiout luxurious price.",
    },
    {
      title: "Stainless BBQ Grill Showdown: Eloquence vs Bull",
      img: "/images/home/eloquence/key-outdoor-kitchen-appliances-for-bbq-mastery.webp",
      tag: "Buying Guide",
      tag_bg: "bg-green-600",
      content:
        "Outdoor living with a stainless BBQ grill is no longer a trend. It's a lifestyle. Families gather around patio tables...",
    },
    {
      title: "Best Materials for Outdoor Kitchens That Last Years",
      img: "/images/home/eloquence/key-outdoor-kitchen-appliances-for-bbq-mastery-1.webp",
      tag: "Tips & Tricks",
      tag_bg: "bg-rose-600",
      content:
        "Transforming your backyard with an outdoor kitchen starts with selecting the best materials for outdoor kitchens to ensure durability...",
    },
  ];

  return (
    <div className="container mx-auto px-[10px] lg:px-[20px]">
      <h2 className="text-[#e98f3b] text-[40px] font-medium leading-[120%] italic font-playfair-display">
        Your Trusted Backyard BBQ Resource
      </h2>
      <div className="flex flex-col lg:flex-row gap-[20px] mt-5">
        {blogs &&
          blogs.map((i, idx) => (
            <div key={`blog-${idx}`} className="w-full group hover:shadow">
              <div className="relative bg-green-400">
                <div
                  className={`font-medium text-sm md:text-base z-[1] absolute bottom-[20px] right-[0px] h-[auto] w-[content] text-white px-[25px] py-[5px] shadow-md ${i.tag_bg}`}
                >
                  {i.tag}
                </div>
                <div className={`aspect-[538/333] bg-stone-800`}>
                  {i?.img && (
                    <Link prefetch={false} href={i?.url || "#"}>
                      <Image
                        src={i.img}
                        alt={`${i.title}-image`}
                        className="object-cover group-hover:opacity-100 opacity-50 transition-opacity duration-500"
                        width={1000}
                        height={0}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                      />
                    </Link>
                  )}
                </div>
              </div>
              <div className="py-[15px] flex flex-col gap-[20px] transition-all duration-500">
                <div className="flex flex-col gap-[15px] h-[150px]">
                  <Link
                    prefetch={false}
                    href={i?.url || "#"}
                    className="px-2 group-hover:underline font-normal font-libre transition-all duration-300 italic text-center h-[52px] line-clamp-2"
                  >
                    <h3>{i.title}</h3>
                  </Link>
                  <div className="text-sm md:text-base h-[72px] line-clamp-3 px-2">
                    {i.content}
                  </div>
                </div>
                <Link
                  prefetch={false}
                  href={i?.url || "#"}
                  className="text-sm md:text-base underline font-bold text-right px-4"
                >
                  LEARN MORE
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const Block7 = () => {
  return (
    <div className="mt-20 bg-[#f1f1f1] py-[30px]">
      <div className="container mx-auto  gap-[30px] flex flex-col justify-center text-center">
        <div className="text-stone-800 text-sm md:text-lg px-[20px]">
          Stay in the Loop! Subscribe to Our Mailing List for Exclusive Sales,
          Blogs, Recipes, Guides and more!
        </div>
        <div>
          <div className="border inline-block">
            <input
              type="text"
              placeholder="Enter Email Address"
              className=" text-sm md:text-base p-[15px] rounded-none outline-none focus:border-stone-700 focus:ring-stone-700 bg-[#f1f1f1] ring:2 border-stone-500 border md:w-[500px]"
            />
            <button className="py-[15px] px-[30px] text-white bg-stone-800 border border-stone-500 text-sm md:text-base">
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN COMPONENT
export default async function EloquencePage() {
  return (
    <>
      <MobileLoader />
      <Hero />
      <HeroAlert />
      <Block1 />
      <Block2 />
      <Block3 />
      <Block4 />
      <Block5 />
      <Block6 />
      <Block7 />
    </>
  );
}
