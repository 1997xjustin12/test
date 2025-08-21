import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../atom/SectionHeader";
import { BASE_URL } from "@/app/lib/helpers";
const blogs = [
  {
    url:`${BASE_URL}/blogs/fireplace-ideas`,
    title: "Fireplace Ideas",
    img: "/images/home/blogs/fireplace-ideas.webp",
    tag: "Inspiration Guide",
    tag_bg: "bg-theme-600",
    content:
      "Explore the most popular fireplace design styles and features to help you choose the perfect one for your home.",
  },
  {
    url: `${BASE_URL}/blogs/fireplace-tv-stand-guide`,
    title: "How to Choose a Fireplace TV Stand",
    img: "/images/home/blogs/fireplace-tv-stand.webp",
    tag: "Buying Guide",
    tag_bg: "bg-green-600",
    content:
      "Learn how to choose a fireplace TV stand, where to place it and make it fit seamlessly into your current decor.",
  },
  {
    url: `${BASE_URL}/blogs/types-of-fireplace-mantels-a-complete-guide`,
    title: "Types of Fireplaces & Mantels",
    img: "/images/home/blogs/types-of-fireplaces.webp",
    tag: "Buying Guide",
    tag_bg: "bg-green-600",
    content:
      "Ready for a new fireplace? We show you types of fireplaces, based on fuel. Plus, what you need to know about mantels.",
  },
];

export default function HomePageGuidesAndInspiration() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <SectionHeader text="Fireplaces How-To Guides & Inspiration" />
        <div className="flex flex-col lg:flex-row gap-[20px] mt-5">
          {blogs.map((i, idx) => (
            <Link prefetch={false} href={i?.url} key={`blog-${idx}`} className="w-full group hover:shadow-lg border border-neutral-300 rounded-lg hover:border-neutral-500 overflow-hidden">
              <div className="relative bg-green-400">
                <div
                  className={`font-medium text-sm md:text-base z-[1] absolute bottom-[20px] right-[0px] h-[auto] w-[content] text-white px-[25px] py-[5px] shadow-md ${i.tag_bg}`}
                >
                  {i.tag}
                </div>
                <div className="aspect-w-3 aspect-h-2 bg-stone-800">
                  {i?.img && (
                    <Image
                      src={i.img}
                      alt={`${i.title}-image`}
                      className="object-cover group-hover:opacity-100 opacity-50 transition-opacity duration-500"
                      width={1000}
                      height={0}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
                    />
                  )}
                </div>
              </div>
              <div className="py-[15px] flex flex-col gap-[20px] transition-all duration-500">
                <div className="flex flex-col gap-[15px] h-[150px]">
                  <div className="px-2 group-hover:underline font-normal font-libre transition-all duration-300 italic text-center h-[52px] line-clamp-2">
                    <h3>{i.title}</h3>
                  </div>
                  <div className="text-sm md:text-base h-[72px] line-clamp-3 px-2">
                    {i.content}
                  </div>
                </div>
                <div className="text-sm md:text-base underline font-bold text-right px-4">
                  LEARN MORE
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
