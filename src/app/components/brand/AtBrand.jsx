import React from "react";

const questions = [
  {
    q: "Outdoor Grills 101: Which Type is Right for You?",
    a: "Choosing the perfect grill can be overwhelming, but we're here to help! In this guide, we’ll break down the different types of grills: gas, charcoal, pellet, and kamado, so you can choose the best one for your cooking style and needs.",
  },
  {
    q: "Outdoor Grills 101: Which Type is Right for You?",
    a: "Choosing the perfect grill can be overwhelming, but we're here to help! In this guide, we’ll break down the different types of grills: gas, charcoal, pellet, and kamado, so you can choose the best one for your cooking style and needs.",
  },
];

const feat_image = [
  { src: "/images/grandeur/at-grandeur-1.webp", title: "", alt: "" },
  { src: "/images/grandeur/at-grandeur-2.webp", title: "", alt: "" },
  { src: "/images/grandeur/at-grandeur-3.webp", title: "", alt: "" },
];

function AtBrand() {
  return (
    <>
      <section className="bg-zinc-200">
        <div className="container mx-auto flex flex-col py-[60px] gap-[40px]">
          {/* text content */}
          <div className="flex flex-col gap-[20px]">
            <p>
              Let Grandeur be your trusted partner for all things outdoor
              cooking. From BBQ smokers and gas grills to pellet grills,
              charcoal grills, kamado grills, and everything in between, we
              offer an unmatched selection of high-quality outdoor kitchen
              solutions. Compare us to any other online store, and you'll
              quickly see there's no better place to find top-tier BBQ grills,
              accessories, and expert advice.
            </p>
            <p>
              Let us help you turn your backyard into the ultimate gathering
              space with the best grills and outdoor kitchen products available.
            </p>
          </div>

          {/* 3 col images */}
          <div className="flex gap-[50px] items-center">
            {feat_image.map((image, index) => (
              <div
                key={`feat-img-${index}`}
                className="w-full aspect-1 bg-zinc-300 h-full bg-cover bg-center bg-no-repeat shadow-lg"
                style={{
                  backgroundImage: `url('${image.src}')`,
                }}
              ></div>
            ))}
          </div>

          <div className="mt-[30px] font-bold text-lg w-full text-center">
            Experience next-level outdoor grilling with a brand that prioritizes
            performance, precision, and the joy of family gatherings around the
            fire.
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto py-[40px] flex items-center gap-[50px]">
          <div className="w-[60%] text-2xl flex flex-col gap-[50px]">
            {questions.map((item, index) => (
              <div
                key={`atbrand-q-and-a-${index}`}
                className="flex flex-col gap-[30px]"
              >
                <div className="font-bold">{item.q}</div>
                <div>{item.a}</div>
              </div>
            ))}
          </div>
          <div
            className="w-[40%] aspect-1 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('/images/grandeur/freestanding-grill.webp')",
            }}
          ></div>
        </div>
      </section>
    </>
  );
}

export default AtBrand;
