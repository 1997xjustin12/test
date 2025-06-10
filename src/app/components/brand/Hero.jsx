import React from 'react'

const content = "We're here to help you craft an outdoor kitchen that's as unique as you are, blending style, quality and functionality to make outdoor cooking a true joy.";
const title = "Your dream Outdoor Kitchen awaits at Grandeur.";
const button_label = "Shop Now"


function Hero() {
  return (
    <section>
      <div className="container mx-auto">
        <div
          className="w-full h-[calc(100vh-170px)] flex items-center justify-center bg-cover bg-center relative p-[20px] rounded-2xl bg-no-repeat max-h-[899px] min-h-[340px]"
          style={{ backgroundImage: "url('/images/grandeur/grandeur-banner.webp')" }}
        >
          <div className="absolute bg-orange-600 right-[20px] py-[30px] px-[25px] shadow-2xl w-[500px] text-white">
            <div className="font-bold text-4xl">{title}</div>
            <div className="mt-1">{content}</div>
            <button className='mt-2 text-black px-3 py-1 bg-white rounded-full shadow-md font-bold'>{button_label}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero