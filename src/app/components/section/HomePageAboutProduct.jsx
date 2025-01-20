export default function HomePageAboutProduct() {
  return (
    <div className="w-full mt-5">
      <div className="container mx-auto bg-[#F6F6F6]">
        <div className="w-full flex flex-col md:flex-row">
          <div className="w-full md:w-[60%] p-[40px] flex flex-col gap-[30px]">
            <div className="text-xl md:text-3xl font-semibold font-bell">
              About Blaze Grill Products
            </div>
            <div className="w-full flex items-center justify-center md:hidden">
              <img
                src="/images/home/about-blaze.webp"
                alt=""
                className="w-full"
              />
            </div>
            <div className="text-sm md:text-base">
              <p className="text-left">
                Blaze Outdoor Products brings quality, affordable outdoor
                cooking to your backyard. With over 45 years of experience, we
                design grills and outdoor kitchens that make grilling easy and
                fun for everyone. Our products are build to last, providing a
                perfect fit for any outdoor space and giving you the tools to
                cook great meals for family and friends.
              </p>
              <p className="text-left mt-[20px]">
                At Blaze, everyone deserves a great outdoor cooking experience
                without the high price tag. We're passionate about grilling and
                creating spaces where people can gather and enjoy each other's
                company. Every Blase product is made with care and comes with a
                solid warranty, so you can feel confident it will last. From
                casual BBQs to big get-togethers, Blaze makes it easy to enjoy
                luxury, quality, and affordability right in your backyard.
              </p>
            </div>
            <div className="flex justify-center md:justify-start">
              <button className="bg-red-600 text-white py-[7px] px-[25px] rounded-md">
                Call Now <span>888-667-4986</span>
              </button>
            </div>
          </div>
          <div className="hidden md:block w-full md:w-[40%] p-[40px]">
            <div className="w-full flex items-center justify-center">
              <img
                src="/images/home/about-blaze.webp"
                alt=""
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
