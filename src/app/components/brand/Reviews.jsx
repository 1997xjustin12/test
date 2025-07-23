"use client";
import dynamic from "next/dynamic";
import { Rating } from "@smastrom/react-rating";
const Carousel = dynamic(() => import("@/app/components/atom/Carousel"), {
  ssr: false,
});

const sample_reviews = [
  {
    stars: 5,
    name: "Sarah M.",
    message:
      "I’ve used many grills over the years, but Grandeur Grills truly stands out. The high BTU output and even heat distribution make every cookout a success. It s built to last and delivers restaurant-quality results right in my backyard!",
  },
  {
    stars: 5,
    name: "Alex K.",
    message:
      "I wanted a durable stainless steel gas grill that could handle anything from steaks to slowcooked ribs, and Grandeur Grills delivered. The build quality is outstanding, and the heat control technology ensures perfect grilling every time!",
  },
  {
    stars: 5,
    name: "James L.",
    message:
      "I upgraded to a Grandeur Grills freestanding grill, and it has completely transformed my outdoor kitchen. The high performance burners and precision temperature control make grilling effortless, and the flavors are unbeatable!",
  },
];

const items_per_break_point = [
    { minWidth: 0, value: 1 },
    { minWidth: 640, value: 2 },
    { minWidth: 768, value: 3 },
    { minWidth: 1024, value: 3 },
    { minWidth: 1280, value: 3 },
  ];


function Reviews({ label }) {
  return (
    <section className="my-[20px]">
      <div className="container mx-auto flex justify-center flex-col items-center">
        <div className="font-extrabold text-5xl pt-[100px] pb-[50px] uppercase">{label}</div>
        {/* review cards */}
        <div className="w-full">
          <Carousel breakpoints={items_per_break_point}>
            {sample_reviews.map((item,index) => (
              <div key={`carousel-reviews-${index}`} className="px-[30px] py-[20px] rounded-2xl border-neutral-300 border flex flex-col bg-white overflow-hidden shadow">
                <Rating
                readOnly
                value={item.stars}
                fractions={2}
                style={{ maxWidth: 120 }}
                ></Rating>
                <div className="mt-2 font-bold">{item.name}</div>
                <div className="mt-2 line-clamp-5 text-neutral-700">{item.message}</div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
