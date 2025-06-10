import React from "react";

const content_html =
  "<p><b>Grandeur</b> is where your dream outdoor kitchen becomes a reality. From seasoned chefs to beginners, we offer premium outdoor kitchen solutions to bring loved ones together. With innovative technology, lasting durability, and beautiful designs, we help create a space for memorable meals and cherished moments.</p><p>Our team of passionate outdoor kitchen experts is here for you every step of the way, ready to assist through chat or call. At Grandeur, we're dedicated to supporting you in building the perfect outdoor kitchen for your home, one you'll enjoy for years to come.</p>";

function About() {
  return (
    <section className="bg-zinc-200">
      <div className="container mx-auto flex py-[30px] gap-[40px]">
        <div
          className="w-[30%] p-3 flex flex-col gap-[20px] text-2xl"
          dangerouslySetInnerHTML={{ __html: content_html }}
        ></div>
        <div className="w-[70%] flex items-center justify-center gap-[10px]">
          <div className="w-full h-full">
            <div
              className="w-full h-full bg-no-repeat bg-cover bg-center relative shadow-lg"
              style={{
                backgroundImage: "url('/images/grandeur/built-in-grills.webp')",
              }}
            >
              <div className="text-white bg-orange-600 px-5 py-3 inline-block absolute bottom-[10%] right-0 font-bold">BUILT-IN GRILLS</div>
            </div>
          </div>
          <div className="w-full h-full flex flex-col gap-[10px]">
            <div
              className="w-full h-[70%] bg-no-repeat bg-cover bg-center relative shadow-lg"
              style={{
                backgroundImage: "url('/images/grandeur/outdoor-storage.webp')",
              }}
            >
              <div className="text-white bg-orange-600 px-5 py-3 inline-block absolute bottom-[10%] right-0 font-bold">OUTDOOR STORAGE</div>
            </div>
            <div
              className="w-full h-[30%] bg-no-repeat bg-cover bg-center relative shadow-lg"
              style={{
                backgroundImage: "url('/images/grandeur/outdoor-kitchen.webp')",
              }}
            >
              <div className="text-white bg-orange-600 px-5 py-3 inline-block absolute bottom-[10%] right-0 font-bold">MORE ON OUTDOOR KITCHEN</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
