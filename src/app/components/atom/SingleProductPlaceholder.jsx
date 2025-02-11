import React from "react";

const loader_thumbnails = [1, 2, 3, 4];
function SingleProductPlaceholder() {
  return (
    <div className="container mx-auto">
      <div className="px-4 mt-2">
        <div className="rounded-full w-[75px] h-[24px] bg-stone-200"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-[10px] py-[20px]">
        <div className="flex-1">
          <div className="w-full px-4 mb-8">
            <div className="flex aspect-w-16 h-[350px] md:aspect-w-4 md:aspect-h-3 overflow-hidden rounded-lg shadow-md mb-4 justify-center items-center bg-stone-200"></div>
            <div className="flex gap-4 py-4 justify-center overflow-x-auto">
              {loader_thumbnails.map((item, index) => (
                <div
                  key={`img-gallery-loader-${index}`}
                  className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer bg-stone-200 transition duration-300`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-[15px] w-full">
            <div className="flex gap-[10px]">
              <div className="py-[5px] px-[25px] bg-stone-200 text-stone-600 h-[34px] w-[170px] font-semibold rounded-full"></div>
              <div className="py-[5px] px-[25px] bg-stone-200 text-stone-600 h-[34px] w-[155px] font-semibold rounded-full"></div>
            </div>
            <div className="">
              <div className="font-bold text-4xl flex flex-col gap-[2px]">
                <div className="h-[50px] w-full bg-stone-200"></div>
                <div className="h-[50px] w-[85%] bg-stone-200"></div>
                <div className="h-[50px] w-[60%] bg-stone-200"></div>
                <div className="h-[24px] w-[50%] bg-stone-200"></div>
              </div>
            </div>
            <div className="mt-[100px]">
              <div className="font-bold text-4xl flex gap-[20px]">
                <div className="h-[54px] w-[270px] bg-stone-200 rounded-full"></div>
                <div className="h-[54px] w-[54px] bg-stone-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProductPlaceholder;
