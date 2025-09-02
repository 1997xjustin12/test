"use client";
import { useState } from "react";
import { MingcuteDownLine, MingcuteUpLine } from "../icons/lib";

const FAQs = ({faqs, itemClassName="bg-theme-600 hover:bg-theme-500 text-white py-[10px] px-[20px] cursor-pointer flex justify-between font-medium"}) => {
    const [questions, setQuestions] = useState(faqs);
  
    const toggleAnswer = (id) => {
      setQuestions((prev) => {
        const selected_prev_state = prev.find((i) => i.id === id)?.is_open;
        return prev.map((i) => ({
          ...i,
          is_open: i.id === id ? !selected_prev_state : false,
        }));
      });
    };
  
    return (
      <div className="w-full">
        <div className="container mx-auto">
          <div className="flex flex-col gap-[10px]">
            {questions.map((i, idx) => (
              <div
                key={`frequent-question-${i.id}-${idx}`}
                className="text-xs md:text-base">
                <div
                  className={itemClassName}
                  onClick={() => toggleAnswer(i.id)}>
                  <div className="w-[calc(100%-70px)]  self-center"><h3>{`${
                    idx + 1
                  }. ${i.question}`}</h3></div>
                  <div>
                    {i.is_open ? <MingcuteUpLine /> : <MingcuteDownLine />}
                  </div>
                </div>
                <div
                  className={`border border-neutral-700 text-stone-700 py-[10px] px-[20px] ${
                    i.is_open ? "block" : "hidden"
                  }`}>
                  {`${i.answer}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

export default FAQs