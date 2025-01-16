export default function NewsLetter() {
  return (
    <div className="mt-20 bg-[#f1f1f1] py-[30px]">
      <div className="container mx-auto  gap-[30px] flex flex-col justify-center text-center">
        <div className="text-stone-800 text-lg">
          Stay in the Loop! Subscribe to Our Mailing List for Exclusive Sales,
          Blogs, Recipes, Guides and more!
        </div>
        <div>
          <div className="border inline-block">
            <input
              type="text"
              placeholder="Enter Email Address"
              className="p-[15px] rounded-none outline-none focus:border-orange-300 focus:ring-orange-300 bg-[#f1f1f1] ring:2 border-stone-900 border w-[500px]"
            />
            <button className="py-[15px] px-[30px] text-white bg-stone-900 border border-stone-900">
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
