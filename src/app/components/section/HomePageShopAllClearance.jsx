export default function HomePageShopAllClearance() {
  return (
    <div className="w-full mt-5">
      <div className="container mx-auto">
        <div className="w-full flex gap-[20px]">
          <div className="w-full flex flex-col gap-[10px]">
            <div className="w-full aspect-2">
              <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                {/* <div className="font-extrabold text-stone-700 text-3xl">
                  CONTENT 1
                </div> */}
                <img
                  src="/images/home/elevate-your-fireplace.webp"
                  alt=""
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-center text-3xl font-semibold font-bell">
              Elevate Your Space with a Modern Fireplace
            </div>
            <div className="text-center  font-bell">
              Discover the warmth and elegance a modern fireplace brings to your
              home. Perfect for family gatherings or relaxing evenings, our
              sleek design complement any living space. Shop now and save on
              creating your favorite spot for comfort and style. Find the
              fireplace that fits your home today!
            </div>
            <div className="text-center">
              <button className="border px-[20px] py-[8px] rounded-xl font-bell">
                shop all fireplaces
              </button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <div className="w-full aspect-2">
              <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                {/* <div className="font-extrabold text-stone-700 text-3xl">
                  CONTENT 2
                </div> */}
                <img
                  src="/images/home/clearance.webp"
                  alt=""
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-center text-3xl font-semibold font-bell">
              Upgrade Your Backyard with Outdoor Kitchen Deals
            </div>
            <div className="text-center  font-bell">
              Create the ultimate outdoor cooking space with our premium grills
              and accessories. Shop now and save big on must-have products for
              your dream backyard kitchen!
            </div>
            <div className="text-center">
              <button className="border px-[20px] py-[8px] rounded-xl  font-bell">
                shop all clearance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
