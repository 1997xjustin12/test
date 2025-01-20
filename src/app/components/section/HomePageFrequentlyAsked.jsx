const questions = [
  {
    question: "What is a good budget for buying grill?",
    answer: "",
  },
  {
    question:
      "What grill features should I look for? (lifetime warranty, 304 stainless steel, Heavy duty grates minimum 8mm.)",
    answer: "",
  },
  {
    question:
      "Do I want additional features such as a side burner, rotisserie, or smoker box?",
    answer: "",
  },
  {
    question:
      "Does the grill have a warranty? If so, what is covered, and for how long?",
    answer: "",
  },
];

export default function HomePageFrequentlyAsked() {
  return (
    <div className="w-full mt-10">
      <div className="container mx-auto p-[10px] md:p-[0px]">
        <div className="text-xl md:text-4xl font-semibold underline italic  font-bell">
          Frequently Asked Questions
        </div>
        <div className="flex flex-col gap-[10px] mt-5">
          {questions.map((i, idx) => (
            <div
              key={`frequent-question-${idx}`}
              className="bg-red-500 text-white py-[10px] px-[20px] text-xs md:text-base">
              <div>{`${idx + 1}. ${i.question}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
