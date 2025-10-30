"use client";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import {subscribe, unsubscribe} from "@/app/lib/api"

const Subscribe = () => {
  const [loading, setLoading] = useState(false); 
  const {user} = useAuth();

  const handleSubscribe = async() => {
    try{
      setLoading(true);
      await subscribe(user?.email);
    }catch(err){
    }finally{
      setLoading(false);
    }
  }

  const allow = useMemo(()=>{
    return !(!!user?.email && !loading)
  },[user,loading])

  return (
    <div className="bg-white w-fullshadow-lg border rounded-lg flex flex-col-reverse md:flex-row overflow-hidden">
      <div className="w-full p-[20px] flex flex-col justify-between">
        <h3>Newsletter</h3>
        <div className="mt-5 ">
          <h4 className="font-semibold">
            Make every weekend feel like vacation.
          </h4>
          <p>Join now for bundle deals and outdoor inspiration.</p>
        </div>

        <button onClick={handleSubscribe} disabled={allow} className="mt-5 px-10 py-2 border-2 font-bold border-theme-600 bg-theme-600 text-white rounded hover:bg-theme-700 hover:shadow h-[44px] relative"> 
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              allow === true ? "visible" : "invisible"
            }`}
          >
            <Eos3DotsLoading width={70} height={70} />
          </div>
          <span className={allow === true ? "invisible" : "visible"}>
            Subscribe
          </span>
        </button>
      </div>
      <div className="w-full flex bg-neutral-400 items-center justify-center">
        <div className="text-white">{"<FeatureImage />"}</div>
      </div>
    </div>
  );
};

const Unsubscribe = () => {
  const [loading, setLoading] = useState(false); 
  const {user} = useAuth();

  const handleUnsubscribe = async() => {
    try{
      setLoading(true);
      await unsubscribe(user?.email);
    }catch(err){
    }finally{
      setLoading(false);
    }
  }

  const allow = useMemo(()=>{
    return !(!!user?.email && !loading)
  },[user,loading])

  return (
    <div className="bg-white w-fullshadow-lg border rounded-lg flex flex-col-reverse md:flex-row overflow-hidden">
      <div className="w-full p-[20px] flex flex-col justify-between">
        <h3>Newsletter</h3>
        <div className="mt-5 ">
          <h4 className="font-semibold">
            You’re already subscribed to our newsletter.
          </h4>
          <p>You’ll continue receiving product drops, seasonal discounts, and outdoor living inspiration.</p>
        </div>

        <button onClick={handleUnsubscribe} disabled={allow} className="mt-5 px-10 py-2 border-2 font-bold border-red-600 bg-red-600 text-white rounded hover:bg-red-700 hover:shadow h-[44px] relative"> 
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              allow === true ? "visible" : "invisible"
            }`}
          >
            <Eos3DotsLoading width={70} height={70} />
          </div>
          <span className={allow === true ? "invisible" : "visible"}>
            Unsubscribe
          </span>
        </button>
      </div>
      <div className="w-full flex bg-neutral-400 items-center justify-center">
        <div className="text-white">{"<FeatureImage />"}</div>
      </div>
    </div>
  );
};


export default function MyAccountPage() {
  const { isLoggedIn, user, fullName } = useAuth();

  const handleLinkClick = (e) => {
    e.preventDefault();
    const link = e.target.closest("a");

    if (link) {
      window.location.href = link;
    }
  };

  if (!isLoggedIn && !user) return null;

  return (
    <div className="flex flex-col gap-5 ">
      <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg">
        <h3>Dashboard</h3>
        {user && (
          <div className="pt-[20px] flex gap-[20px] flex-col">
            <p>
              Hello <span className="font-bold">{fullName}</span>, (
              <span className="text-neutral-500">Not</span>{" "}
              <span className="text-neutral-500 font-bold">{fullName}?</span>{" "}
              <Link
                onClick={handleLinkClick}
                prefetch={false}
                href={`${BASE_URL}/logout`}
                className="text-red-700 font-semibold"
              >
                Logout
              </Link>
              )
            </p>
            <p>
              From your account dashboard you can view your recent{" "}
              <Link
                onClick={handleLinkClick}
                prefetch={false}
                href={`${BASE_URL}/my-account/orders`}
                className="text-red-700 font-semibold"
              >
                orders
              </Link>
              , manage your{" "}
              <Link
                onClick={handleLinkClick}
                prefetch={false}
                href={`${BASE_URL}/my-account/profile`}
                className="text-red-700 font-semibold"
              >
                shipping and billing addresses
              </Link>
              , and change your{" "}
              <Link
                onClick={handleLinkClick}
                prefetch={false}
                href={`${BASE_URL}/my-account/change-password`}
                className="text-red-700 font-semibold"
              >
                password.
              </Link>
            </p>
          </div>
        )}
      </div>

      <Subscribe />
      <Unsubscribe />
    </div>
  );
}
