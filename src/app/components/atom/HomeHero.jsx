import Image from "next/image";
// import RenderBanner from "@/app/components/atom/RenderBanner";


export default function Hero({ data }) {
  // console.log("data", data);
  const useBanner =
    !data?.banner?.img?.src || data?.banner?.img?.src === ""
      ? "/images/banner/solana-home-hero.webp"
      : data?.banner?.img?.src;

  return (
    <div
      className={`container mx-auto flex flex-col md:flex-row`}
    >
      <div className={`w-full`}>
        <div className="w-full relative isolate px-6 lg:px-8 bg-no-repeat bg-center bg-cover bg-stone-800 h-[250px]  md:h-[calc(100vh-450px)] md:max-h-[550px]">
          {
            <Image
              src={useBanner}
              alt={data?.banner?.img?.alt ?? "Banner"}
              className="w-full h-full object-cover"
              fill
              loading="eager"
              priority={true}
              sizes="100vw"
            />
          }
          {/* <RenderBanner img={useBanner} /> */}
          <div className="absolute z-[9999] inset-0 m-auto flex items-center justify-center">
            <div className="text-center flex justify-center">
              <div className="px-[20px] py-[7px]">
                <div>
                  <div className="text-balance text-md font-extrabold tracking-wide text-white md:text-5xl text-shadow-lg">
                    {data?.banner?.title}
                  </div>
                  <div className="text-xs md:text-base text-balance mt-1 tracking-wide text-white text-shadow-lg">
                    {data?.banner?.tag_line}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
