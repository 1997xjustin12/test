import Image from "next/image";
import SectionHeader from "../atom/SectionHeader";
const blogs = [
  {
    title: "Fireplace Ideas",
    img: "/images/home/blogs/fireplace-ideas.webp",
    tag: "Inspiration Guide",
    tag_bg: "bg-orange-600",
    content:
      "Explore the most popular fireplace design styles and features to help you choose the perfect one for your home.",
  },
  {
    title: "How to Choose a Fireplace TV Stand",
    img: "/images/home/blogs/fireplace-tv-stand.webp",
    tag: "Buying Guide",
    tag_bg: "bg-green-600",
    content:
      "Learn how to choose a fireplace TV stand, where to place it and make it fit seamlessly into your current decor.",
  },
  {
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
            <div key={`blog-${idx}`} className="w-full group hover:shadow">
              <div className="relative bg-green-400">
                <div
                  className={`font-medium text-sm md:text-base z-[1] absolute bottom-[20px] right-[0px] h-[auto] w-[content] text-white px-[25px] py-[5px] shadow-md ${i.tag_bg}`}>
                  {i.tag}
                </div>
                <div className="aspect-w-3 aspect-h-2 bg-stone-800">
                  {
                    // <img
                    //   src={i.img}
                    //   alt={i.title}
                    //   className={`object-cover group-hover:opacity-100 opacity-50 transition-opacity duration-500`}
                    // />
                    <Image
                      src={i.img}
                      alt={`${i.title}-image`}
                      className="object-cover group-hover:opacity-100 opacity-50 transition-opacity duration-500"
                      // fill
                      width={1000}
                      height={0}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"

                      // loading="eager"
                      // priority={false}
                    />
                  }
                </div>
              </div>
              <div className="py-[15px] flex flex-col gap-[20px] group-hover:px-[15px] transition-all duration-500">
                <div className="group-hover:underline text-lg md:text-2xl  font-bold md:font-normal font-bell transition-all duration-300">
                  {i.title}
                </div>
                <div className="text-sm md:text-base">{i.content}</div>
                <div className="text-sm md:text-base underline font-bold text-right">
                  LEARN MORE
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
