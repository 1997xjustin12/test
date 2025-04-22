import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import Image from "next/image";
// import RenderBanner from "@/app/components/atom/RenderBanner";

const default_contact = "(888) 575-9720";

export default function Hero({ data }) {
  const useBanner =
    !data?.banner?.img?.src || data?.banner?.img?.src === ""
      ? "/images/banner/solana-home-hero.webp"
      : data?.banner?.img?.src;

  const contact =
    !data?.banner?.contact || data?.banner?.contact === ""
      ? default_contact
      : data?.banner?.contact;

  return (
    <div
      className={`container mx-auto flex flex-col md:flex-row ${
        data ? "fade-in" : "opacity-0"
      }`}
    >
      <div className={`w-full ${data?.children && data?.children.length > 0 ? 'md:w-[calc(100%-370px)]':'md:w-full'}`}>
        <div className="w-full relative isolate px-6 lg:px-8 bg-no-repeat bg-center bg-cover bg-stone-800 h-[250px]  md:h-[calc(100vh-450px)]">
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
          {/* <RenderBanner img={useBanner} /> */}
          <div className="absolute z-[9999] inset-0 m-auto flex items-center justify-center">
            <div className="text-center flex justify-center">
              <div className="px-[20px] py-[7px]">
                <div>
                  <h1 className="text-balance text-md font-extrabold tracking-wide text-white md:text-5xl text-shadow-lg">
                    {data?.banner?.title}
                  </h1>
                  <h2 className="text-xs md:text-base text-balance mt-1 tracking-wide text-white text-shadow-lg">
                    {data?.banner?.tag_line}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        {data?.name !== "Home" && (
          <div className="flex-col flex lg:flex-row">
            <div className="w-full lg:w-[calc(100%-250px)] p-[20px]">
              <div className="flex flex-col gap-[20px]">
                {/* <div className="border-theme-500 border-l-4 text-2xl pl-3 font-bold text-stone-600">
                  {data?.name}
                </div> */}
                <div className="text-sm text-stone-600 font-light lg:text-lg">
                  {data?.banner?.description}
                </div>
                <div className="flex flex-col gap-[10px]">
                  {/* <div className="uppercase text-xs text-theme-500">
                      Link &gt;
                    </div> */}
                  <hr />
                  <div className="text-xs flex flex-col md:flex-row  lg:text-lg">
                    <div className="font-bold text-stone-500">
                      Further Questions? ASK AN EXPERT!
                    </div>
                    <Link
                      href={`tel:${contact}`}
                      className="flex md:ml-[8px] text-theme-500 font-bold items-center"
                    >
                      <Icon
                        icon="ic:baseline-phone"
                        className=" mr-[3px]"
                      />
                      {contact}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full p-[30px] bg-stone-100 flex flex-col gap-[20px] relative lg:w-[250px] h-[360px]">
              <Link href={`tel:${contact}`} prefetch={false}>
                <Image
                  src="/images/banner/sub-banner-image.webp"
                  alt={`Sub Banner Image`}
                  className="object-contain"
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  sizes="100vw"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
      {data?.children && data?.children.length > 0 && (
        <div className="w-full md:w-[370px] p-[25px] overflow-hidden">
          <div>
            <div className="text-stone-500 flex items-center gap-[4px]">
              <Icon icon="mdi:cart" width="24" height="24" />{" "}
              <div className="text-xs uppercase font-bold">
                Shop by Category
              </div>
            </div>

            <div className="flex flex-col gap-[15px] mt-[20px]  md:h-[729px] md:overflow-y-auto md:pb-[20px] md:pt-[8px] md:pr-[10px]">
              {data.children &&
                data.children.length > 0 &&
                data.children.map((i, index) => (
                  <div
                    key={`sub-category-${i.name.toLowerCase()}-${index}`}
                    className="flex"
                  >
                    <div className="w-[40px] flex justify-center items-center">
                      <Icon
                        icon="material-symbols:info-outline"
                        width="24"
                        height="24"
                        className="text-stone-600"
                      />
                    </div>
                    <div className="w-[calc(100%-40px)]">
                      <Link href={i.url ?? "#"}>
                        <div className="flex items-center shadow-md rounded overflow-hidden gap-[10px] w-full group">
                          <div className="w-[80px] h-[80px] flex justify-center items-center relative">
                            <Image
                              src="/images/banner/firepit-banner.webp"
                              alt={`sub-category-${i.url}`}
                              className="w-[80px] h-[80px] object-cover"
                              layout="fill"
                              objectFit="cover" // Ensures the image covers the parent while maintaining aspect ratio
                              objectPosition="center"
                              // priority={true}
                              // width={1000}
                              // height={0}
                            />
                          </div>
                          <div
                            className={`text-sm uppercase text-stone-600 font-bold w-[calc(100%-95px)] group-hover:text-theme-500`}
                          >
                            {i.name}
                          </div>
                          <div className="text-stone-600 group-hover:text-theme-500">
                            <Icon
                              icon="icon-park:right"
                              width="30"
                              height="30"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// }
