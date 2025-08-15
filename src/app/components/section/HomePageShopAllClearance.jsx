"use client";
import Image from "next/image";
import Link from "next/link";

export default function HomePageShopAllClearance({contents}) {
  return (
    <div className="container mx-auto px-[10px] lg:px-[20px] mt-5">
      {/* font-bell */}
      <div className="w-full flex flex-col md:flex-row gap-[50px]">
        {contents.map((item, index) => (
          <div
            key={`shop-all-content-${index}`}
            className="w-full flex flex-col gap-[10px] min-h-[420px] pb-[80px] relative"
          >
            <div className="w-full aspect-2 min-h-[200px] flex items-center justify-center overflow-hidden rounded-[25px] relative">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                className="w-full h-full min-h-[200px] object-cover"
                fill
                sizes="100vw"
              />
            </div>
            <h2 className="text-center text-xl md:text-3xl font-semibold">
              {item.title}
            </h2>
            <div className="text-center px-[10px] md:text-lg">
              {item.content}
            </div>
             {/* absolute bottom-[20px] left-1/2 -translate-x-1/2 */}
             <div className="absolute bottom-[20px] left-0 w-full flex justify-center">
                <Link href={item.button.url} prefetch={false}>
                  <button className={item?.button?.className || "font-medium border px-[20px] py-[8px] rounded-xl bg-theme-600 text-white shadow-md text-lg cursor-pointer hover:bg-theme-500"}>
                    {item.button.label}
                  </button>
                </Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
