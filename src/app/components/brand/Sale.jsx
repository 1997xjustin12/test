import React from 'react'

function Sale() {
  return (
    <section className="my-[20px]">
        <div className="container mx-auto flex gap-[20px]">
          <div className="w-[40%] border aspect-1 relative bg-center bg-cover" style={{ backgroundImage: "url('/images/banner/bbq-banner.webp')" }}></div>
          <div className="w-[60%] flex flex-col gap-[20px]">
            <div className="flex gap-[20px]">
              <div className="w-[50%] border aspect-1 relative bg-center bg-cover" style={{ backgroundImage: "url('/images/banner/bbq-banner.webp')" }}></div>
              <div className="w-[50%] border aspect-1 relative bg-center bg-cover" style={{ backgroundImage: "url('/images/banner/bbq-banner.webp')" }}></div>
            </div>
            <div className="w-full aspect-6 bg-[#CA5008] text-white flex items-center justify-between p-5">
              <div className="flex flex-col gap-[20px] p-5">
                <div className="text-5xl font-bold">
                  Get More Saving Here!
                </div>
                <div className="text-xl font-medium tracking-wide">Over 100 products currently on SALE</div>
              </div>
              <div className="">
              {/* mdi:arrow-right */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"/></svg>
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Sale