"use client";
import { useState } from "react";
import { subscribe } from "@/app/lib/api";
import { Eos3DotsLoading } from "@/app/components/icons/lib";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await subscribe(email);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  return (
    <div className="mt-20 bg-[#f1f1f1] py-[30px]">
      <div className="container mx-auto  gap-[30px] flex flex-col justify-center text-center">
        <div className="text-stone-800 text-sm md:text-lg px-[20px]">
          Stay in the Loop! Subscribe to Our Mailing List for Exclusive Sales,
          Blogs, Recipes, Guides and more!
        </div>
        <div>
          <div className="border inline-block">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                required
                value={email || ""}
                onChange={handleChange}
                placeholder="Enter Email Address"
                className=" text-sm md:text-base p-[15px] bg-white rounded-none outline-none focus:border-theme-300 focus:ring-orange-300 ring:2 border-theme-500 border md:w-[500px]"
              />
              <button
                disabled={loading}
                className="w-[100px] h-[56px] text-white bg-theme-500 border border-theme-500 text-sm md:text-base relative"
              >
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                    loading === true ? "visible" : "invisible"
                  }`}
                >
                  <Eos3DotsLoading width={70} height={70} />
                </div>
                <span className={loading === true ? "invisible" : "visible"}>
                  Join
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
