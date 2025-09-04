import Image from "next/image";
import Link from "next/link";
import SectionHeader from "../atom/SectionHeader";

export default function HomeBlogs({ title = "", contents, imageAspect="aspect-[4/3]"}) {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <SectionHeader text={title} />
        <div className="flex flex-col lg:flex-row gap-[20px] mt-5">
          {contents &&
            contents.map((i, idx) => (
              <div key={`blog-${idx}`} className="w-full group hover:shadow">
                <div className="relative bg-green-400">
                  <div
                    className={`font-medium text-sm md:text-base z-[1] absolute bottom-[20px] right-[0px] h-[auto] w-[content] text-white px-[25px] py-[5px] shadow-md ${i.tag_bg}`}
                  >
                    {i.tag}
                  </div>
                  <div className={`${imageAspect} bg-stone-800`}>
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
                    <Link prefetch={false} href={i?.url || "#"} className="px-2 group-hover:underline font-normal font-libre transition-all duration-300 italic text-center h-[52px] line-clamp-2">
                      <h3>{i.title}</h3>
                    </Link>
                    <div className="text-sm md:text-base h-[72px] line-clamp-3 px-2">
                      {i.content}
                    </div>
                  </div>
                  <Link prefetch={false} href={i?.url || "#"} className="text-sm md:text-base underline font-bold text-right px-4">
                    LEARN MORE
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
