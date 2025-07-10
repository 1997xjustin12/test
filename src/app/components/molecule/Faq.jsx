"use client";
import { useState, useEffect } from "react";
import { MingcuteDownLine, MingcuteUpLine } from "../icons/lib";
import SectionHeader from "@/app/components/atom/SectionHeader";

export default function Faq({data}) {
  const [faqs, setFaqs] = useState([]);

  const toggleAnswer = (id) => {
    setFaqs((prev) => {
      const selected_prev_state = prev.find((i) => i.id === id)?.is_open;
      return prev.map((i) => ({
        ...i,
        is_open: i.id === id ? !selected_prev_state : false,
      }));
    });
  };

  useEffect(()=>{
    if(data){
        setFaqs(prev=>{
            return data.map(datum=> ({...datum, is_open:false}))
        })
    }
  },[data])

  return (
      <div className="container mx-auto px-[10px] lg:px-[20px] py-[5px]">
        <h2 className="underline">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-[10px] mt-5">
          {faqs.map((i, idx) => (
            <div
              key={`frequent-question-${i.id}-${idx}`}
              className="text-xs md:text-base">
              <div
                className="bg-theme-600 hover:bg-theme-500  text-white py-[10px] px-[20px] cursor-pointer flex justify-between font-medium"
                onClick={() => toggleAnswer(i.id)}>
                <div className="w-[calc(100%-70px)]  self-center">{`${
                  idx + 1
                }. ${i.question}`}</div>
                <div>
                  {i.is_open ? <MingcuteUpLine /> : <MingcuteDownLine />}
                </div>
              </div>
              <div
                className={`border border-theme-400 text-stone-700 py-[10px] px-[20px] ${
                  i.is_open ? "block" : "hidden"
                }`}>
                {`${i.answer}`}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
