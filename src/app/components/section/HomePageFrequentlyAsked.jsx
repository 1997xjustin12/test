"use client";
import { useState } from "react";
import { MingcuteDownLine, MingcuteUpLine } from "../icons/lib";
import SectionHeader from "@/app/components/atom/SectionHeader";

const static_questions = [
  {
    id: "Q1",
    is_open: false,
    question: "What is a fireplace also called?",
    answer:
      "A fireplace is often referred to by names highlighting its parts and design, such as mantel, chimney, firebox, flue, grate, hearthstone, or fire surround.",
  },
  {
    id: "Q2",
    is_open: false,
    question: "What is a fireplace used for?",
    answer:
      "A fireplace or hearth, made of brick, stone, or metal, contains a fire for heating and ambiance. Modern designs offer varying heat efficiency.",
  },
  {
    id: "Q3",
    is_open: false,
    question: "What is the definition of a fireplace?",
    answer:
      "A fireplace is a framed chimney opening or metal container with a smoke pipe for an open fire. It can also be an outdoor brick, stone, or metal structure for fires.",
  },
  {
    id: "Q4",
    is_open: false,
    question: "What does a fireplace symbolize?",
    answer:
      "In art, literature, and film, the fireplace symbolizes home, warmth, comfort, and safety, enriching storytelling.",
  },
  {
    id: "Q5",
    is_open: false,
    question: "Which type of fireplace is best?",
    answer:
      "Gas fireplaces are more efficient, cleaner, and safer than wood-burning ones, producing fewer emissions and no ash or soot. They’re easier to maintain and can operate during power outages.",
  },
];

export default function HomePageFrequentlyAsked() {
  const [questions, setQuestions] = useState(static_questions);

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
    <div className="w-full mt-10">
      <div className="container mx-auto px-[10px] lg:px-[20px]">
        <SectionHeader text="Frequently Asked Questions" />
        <div className="flex flex-col gap-[10px] mt-5">
          {questions.map((i, idx) => (
            <div
              key={`frequent-question-${i.id}-${idx}`}
              className="text-xs md:text-base">
              <div
                className="bg-orange-600 hover:bg-orange-500  text-white py-[10px] px-[20px] cursor-pointer flex justify-between font-medium"
                onClick={() => toggleAnswer(i.id)}>
                <div className="w-[calc(100%-70px)]  self-center">{`${
                  idx + 1
                }. ${i.question}`}</div>
                <div>
                  {i.is_open ? <MingcuteUpLine /> : <MingcuteDownLine />}
                </div>
              </div>
              <div
                className={`border border-orange-400 text-stone-700 py-[10px] px-[20px] ${
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
