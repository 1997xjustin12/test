import React from "react";

function Extra() {
  const labels = [
    "elegant & modern design",
    "high-performance grilling",
    "durable & weather resistant",
    "designed for family gatherings"
  ];
  return (
    <section className="my-[20px]">
      <div className="container mx-auto">
        <div className="flex items-center">
          {labels.map((label, index) => (
            <div key={label+"-"+index} className="w-full flex flex-col justify-center items-center">
              <div className="w-[200px] border aspect-1 center bg-zinc-100"></div>
              <div className="uppercase h-[48px] text-center">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Extra;
