import React from 'react'

function Sale() {
  return (
    <section className="my-[20px]">
        <div className="container mx-auto flex gap-[20px]">
          <div className="w-[40%] border aspect-1"></div>
          <div className="w-[60%] flex flex-col gap-[20px]">
            <div className="flex gap-[20px]">
              <div className="w-[50%] border aspect-1"></div>
              <div className="w-[50%] border aspect-1"></div>
            </div>
            <div className="w-full aspect-6 bg-[#CA5008] text-white flex items-center">
              <div className="flex flex-col gap-[20px]">
                <div className="text-5xl font-bold">
                  Get More Saving Here!
                </div>
                <div className="text-xl font-medium tracking-wide">Over 100 products currently on SALE</div>
              </div>
              <div>Arror</div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default Sale