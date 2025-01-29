"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import Image from "next/image";
import RenderBanner from "@/app/components/atom/RenderBanner";

export default function Hero({ data }) {
  const useBanner =
    data?.banner?.img?.src ?? "/images/banner/solana-home-hero.webp";
  if (data && data.children && data.children.length > 0) {
    return (
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="w-full  md:w-[calc(100%-370px)]">
          <div className="w-full relative isolate px-6 lg:px-8 bg-no-repeat bg-center bg-cover bg-stone-800 h-[250px]  md:h-[calc(100vh-450px)]">
            {
              <Image
                src={useBanner}
                alt={`Banner`}
                className="w-full h-full object-cover"
                fill
                // width={1000}
                // height={1000}
                loading="eager"
                priority={true}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
              />
            }
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
          <div className="flex-col flex md:flex-row">
            <div className="w-full md:w-[calc(100%-250px)] p-[20px]">
              <div className="flex flex-col gap-[20px]">
                <div className="border-orange-500 border-l-4 text-2xl pl-3 font-bold text-stone-600">
                  {data?.name}
                </div>
                <div className="text-sm text-stone-600 font-light">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolorum exercitationem, eaque reiciendis ad expedita repellat
                  nobis, harum, commodi facere explicabo velit deserunt
                  molestias? Iure aut eum officiis aspernatur veritatis
                  voluptates.
                </div>
                <div className="flex flex-col gap-[10px]">
                  <div className="uppercase text-xs text-orange-500">
                    Link &gt;
                  </div>
                  <hr />
                  <div className="text-xs flex flex-col md:flex-row">
                    <div className="font-bold text-stone-500">
                      Further Questions? ASK AN EXPERT!
                    </div>
                    <Link
                      href={`tel:(888)%20977-9085`}
                      className="flex md:ml-[8px] text-orange-500 font-bold">
                      <Icon
                        icon="ic:baseline-phone"
                        className=" mr-[3px]"
                        width="15"
                        height="15"
                      />
                      (888) 977-9085
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[250px] p-[30px] bg-[rgb(151,151,151)] flex flex-col gap-[20px]">
              <div>
                <div className="text-white text-3xl font-bold">LEARNING</div>
                <div className="text-white text-3xl">CENTER</div>
              </div>
              <div className="text-xs text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur debitis reiciendis quibusdam eos error quaerat natus
                incidunt modi laudantium! Incidunt.
              </div>
              <div className="text-white text-[0.780rem] font-bold flex items-center group cursor-pointer">
                <div className="text-white group-hover:text-orange-400">
                  START LEARNING NOW
                </div>
                <Icon
                  icon="icon-park-twotone:right-c"
                  className="text-white ml-[10px] group-hover:text-orange-400"
                  width="20"
                  height="20"
                />
              </div>
            </div>
          </div>
        </div>
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
                    className="flex">
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
                            className={`text-sm uppercase text-stone-600 font-bold w-[calc(100%-95px)] group-hover:text-orange-500`}>
                            {i.name}
                          </div>
                          <div className="text-stone-600 group-hover:text-orange-500">
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
      </div>
    );
  } else {
    return (
      <div className="container mx-auto w-full relative isolate  bg-no-repeat bg-center bg-cover bg-stone-800 h-[250px] md:h-[calc(100vh-450px)]">
        <RenderBanner img={useBanner} />
        {
          // for lazy loading
          // <Image
          //   src={useBanner}
          //   alt={`Banner`}
          //   className="w-full h-full object-cover"
          //   width={980}
          //   height={0}
          //   loading="eager"
          //   priority={true}
          //   sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
          // />
          // -----------------
        }
        <div className="absolute z-[9999] inset-0 m-auto flex items-center justify-center">
          <div className="text-center flex justify-center">
            {/* <div className="px-[20px] py-[7px] border-white bg-[rgba(0,0,0,.8)] border-4 max-w-[calc(100%-30px)]"> */}
            <div className="px-[20px] py-[7px]">
              {data?.name === "All Products" ? (
                <div>
                  <div className="text-balance text-md font-extrabold tracking-wide text-white md:text-5xl text-shadow-lg">
                    Modern Fireplaces and Outdoor Living
                  </div>
                  <div className="text-xs md:text-base text-balance mt-1 tracking-wide text-white text-shadow-lg">
                    Transform Your Spaces with Elegant Designs Built for Comfort
                    and Durability
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-balance text-md font-extrabold tracking-wide text-white md:text-5xl text-shadow-lg">
                    {data?.banner?.title}
                  </div>
                  <div className="text-xs md:text-base text-balance mt-1 tracking-wide text-white text-shadow-lg">
                    {data?.banner?.tag_line}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
