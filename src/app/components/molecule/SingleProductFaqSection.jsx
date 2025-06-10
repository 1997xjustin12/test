import { useState, useEffect } from "react";
import { keys, redisGet } from "@/app/lib/redis";
import parse from "html-react-parser";

import { MingcuteUpLine, MingcuteDownLine } from "@/app/components/icons/lib";

const about = keys.faqs_about_solana.value;
const shipping_policy = keys.faqs_shipping_policy.value;
const return_policy = keys.faqs_return_policy.value;
const warranty = keys.faqs_warranty.value;

function SingleProductFaqSection() {
  const [policy_section, setPolicySection] = useState([
    {
      key: about,
      label: "About Solana Fireplaces",
      content: "",
      expanded: false,
    },
    {
      key: shipping_policy,
      label: "Shipping Policy",
      content: "",
      expanded: false,
    },
    {
      key: return_policy,
      label: "Return Policy",
      content: "",
      expanded: false,
    },
    { key: warranty, label: "Warranty", content: "", expanded: false },
  ]);

  const handleExpandFAQsSection = (key) => {
    setPolicySection((prev) => {
      return prev.map((i) => ({
        ...i,
        expanded: i.key === key ? !i.expanded : i.expanded,
      }));
    });
  };

  useEffect(() => {
    redisGet([about, shipping_policy, return_policy, warranty])
      .then((response) => {
        // console.log("redisGetResponse", response);
        setPolicySection((prev) => {
          return prev.map((item, index) => {
            return { ...item, content: response[index] };
          });
        });
      })
      .catch((err) => console.log("error", err));
  }, []);

  return <div className="p-4">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
          <div className="text-2xl font-semibold text-stone-900 my-[20px]">
            FAQS
          </div>
          <div className="bg-zinc-100 p-5 flex flex-col gap-[10px] rounded">
            {policy_section.map((i) => (
              <div key={`section-${i.key}`} className="">
                <div className="text-lg font-semibold text-stone-900 border-b">
                  {i.label}
                </div>
                {i.content && (
                  <div className="relative">
                    <div
                      className={`text-sm flex flex-col gap-[10px] py-[10px] ${ i.key !== warranty ? i.expanded ? "" : "!line-clamp-2": "" }`}
                    >
                      {parse(i.content)}
                    </div>
                    <div className="bg-zinc-100 w-full h-3 absolute left-0 bottom-0"></div>
                  </div>
                )}
                {
                  i.key !== warranty && 
                  <button
                    className="text-sm font-semibold text-blue-400 flex items-center"
                    onClick={() => handleExpandFAQsSection(i.key)}
                  >
                    {i.expanded ? <MingcuteUpLine width={18} height={18}/> : <MingcuteDownLine width={18} height={18}/>}
                    {i.expanded ? "See Less" : "See More"}
                  </button>
                }
              </div>
            ))}
          </div>
        </div>
      </div>;
}

export default SingleProductFaqSection;
