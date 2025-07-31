import { BASE_URL } from "@/app/lib/helpers";
import CollectionCarousel from "@/app/components/atom/CollectionCarousel";
import Image from "next/image";
import Link from "next/link";
async function CollectionCarouselWrap({ data }) {
  const links = data;

  const items_per_break_point = [
    { minWidth: 0, value: 1 },
    { minWidth: 640, value: 2 },
    { minWidth: 768, value: 3 },
    { minWidth: 1024, value: 4 },
    { minWidth: 1280, value: 4 },
  ];

  return (
    <div>
      <h4 className="font-bold text-lg">{data?.mb_label}</h4>
      <CollectionCarousel breakpoints={items_per_break_point}>
        {links &&
          Array.isArray(links) &&
          links.map((link) => (
            <Link
             prefetch={false}
             href={`${BASE_URL}/${link?.url}`}
              key={`category-collection-${link?.id}-list-item`}
              className="flex flex-col"
            >
              <div className="w-full aspect-1 bg-neutral-200 relative">
                {link?.image && (
                  <Image
                    src={link?.image}
                    alt={`${link?.name} Image`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                )}
              </div>
              <div className="underline text-center mt-2 px-3 font-bold text-neutral-800">
                {link?.name}
              </div>
            </Link>
          ))}
      </CollectionCarousel>
    </div>
  );
}

export default CollectionCarouselWrap;
