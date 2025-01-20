"use client";
import { Rating } from "@smastrom/react-rating";
import Carousel from "@/app/components/atom/Carousel";
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
export default function HomePageReviews() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto">
        <div className="flex-col md:flex-row flex gap-[50px] md:gap-[10px] items-center">
          <div className="md:w-[30%] md:p-[20px] flex flex-col gap-[8px] justify-center text-center">
            <div className="font-bell text-xl md:text-3xl">
              Our customer reviews
            </div>
            <div className="flex justify-center md:justify-start">
              <Rating
                readOnly
                value={4.5}
                fractions={2}
                style={{ maxWidth: 150 }}></Rating>
            </div>
            <div className="text-xs md:text-base">
              4.4 stars out of based from{" "}
              <span className="underline cursor-pointer">122 reviews</span>
            </div>
            <div className="flex justify-center md:justify-start">
              <div className="w-[250px] border  border-stone-500 bg-stone-200 h-[35px] rounded-lg overflow-hidden">
                <div className="h-[35px] w-[90%] bg-amber-400 border-t border-t-white"></div>
              </div>
            </div>
            <div className="text-xs md:text-sm underline text-stone-700 cursor-pointer">
              Write a review
            </div>
          </div>
          <div className="w-full lg:w-[70%] flex-col md:flex-row flex gap-[10px]">
            <Carousel breakpoints={carousel_breakpoints}>
              {reviews.map((i, idx) => (
                <div
                  key={`review-${idx}`}
                  className="bg-white w-full flex flex-col gap-[15px] justify-center items-center p-[20px] text-center">
                  <div className="flex text-center justify-center">
                    <Rating
                      readOnly
                      value={i.rating}
                      style={{ maxWidth: 150 }}
                    />
                  </div>
                  <div className="font-extrabold text-sm md:text-base">
                    {i.title}
                  </div>
                  <div className="text-xs md:text-sm">{i.text}</div>
                  <div className="flex items-center justify-center">
                    <div>
                      <img src={i.img} alt={i.name} />
                    </div>
                    <div className="text-xs text-stone-700">{i.name}</div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}
