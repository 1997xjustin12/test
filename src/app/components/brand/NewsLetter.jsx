import React from 'react'
import {MDIEmailOutline} from "@/app/components/icons/lib"

function NewsLetter() {
  return (
    <section className="my-[20px]">
        <div className="container mx-auto py-1 px-[100px]">
            <div className="rounded-[30px] bg-black text-white px-[70px] py-[50px] flex items-center gap-[30px]">
                <div className="w-full text-5xl font-extrabold">STAY UP TO DATE ABOUT OUR LATEST OFFERS</div>
                <div className="w-[450px] flex flex-col gap-[30px]">
                    <div className="relative flex items-center">
                      <div className="absolute left-[15px] text-neutral-600">
                        <MDIEmailOutline />
                      </div>
                      <input  className="w-full rounded-full p-3 pl-[50px]" type="text" placeholder='Enter your email address' />
                    </div>
                    <button className="w-full rounded-full p-3 bg-white text-black font-bold">Subscribe to Newsletter</button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default NewsLetter