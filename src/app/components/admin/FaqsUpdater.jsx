"use client";
import { useState, useEffect } from "react";
import CardWrap from "@/app/components/admin/CardWrap";
import Button from "@/app/components/admin/Button";
import Editor from "@/app/components/atom/RichEditor";
import { keys, redisGet, redisMultiSet } from "@/app/lib/redis";

const about = keys.faqs_about_solana.value;
const shipping_policy = keys.faqs_shipping_policy.value;
const return_policy = keys.faqs_return_policy.value;
const warranty = keys.faqs_warranty.value;

function FaqsUpdater() {
  const [tabs, setTabs] = useState([]);
  const [tab, setTab] = useState(about);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (new_content) => {
    console.log(new_content);
    setContent(new_content);
    setTabs(prev=>{
        return prev.map(i=> ({...i, content: i.key===tab? new_content: i.content}))
    })
  };

  const handleTabChange = (new_tab) => {
    setTab(new_tab);
  };

  const handleSave = () => {
    setIsLoading(true);
    const about_value = tabs.find(({key})=> key === about)?.content;
    const shipping_policy_value = tabs.find(({key})=> key === shipping_policy)?.content;
    const return_policy_value = tabs.find(({key})=> key === return_policy)?.content;
    const warranty_value = tabs.find(({key})=> key === warranty)?.content;

    const data = {
        [about]: about_value || " ",
        [shipping_policy]: shipping_policy_value || " ",
        [return_policy]: return_policy_value || " ",
        [warranty]: warranty_value || " ",
    }

    redisMultiSet(data)
    .then((res) => {
        alert("Successfully updated!")
    })  
    .catch(err => console.error("Error:", err))
    .finally(()=>{
        setIsLoading(false);
    });
  }

  useEffect(() => {
    redisGet([about, shipping_policy, return_policy, warranty]).then((res) => {
      setTabs([
        { key: about, label: "About Solana Fireplaces", content: res[0] },
        { key: shipping_policy, label: "Shipping Policy", content: res[1] },
        { key: return_policy, label: "Return Policy", content: res[2] },
        { key: warranty, label: "Warranty", content: res[3] },
      ]);
      //   initialized to about
      setContent(res[0]);
    });
  }, []);

  useEffect(()=>{
    console.log("updated tabs", tabs)
  },[tabs])

  return (
    <CardWrap>
      <div className="p-3">
        <div className="font-bold text-lg">FAQs Updater</div>
        <div className="text-sm">Don't forget to save your changes.</div>
        <div className="flex items-center my-5">
          {tabs.map((i, index) => (
            <button
              key={`tab-item-${i.key}`}
              className={`w-full font-semibold border-b-4 py-2 bg-white hover:bg-neutral-100 ${
                tab === i.key
                  ? "text-theme-500 border-theme-600 bg-theme-200 border-t border-x"
                  : "text-stone-600"
              }`}
              onClick={() => handleTabChange(i.key)}
            >
              {i.label}
            </button>
          ))}
        </div>
        <div className="mt-[20px]">
          {
            tabs.filter(i=> i.key === tab).map(i=> <Editor key={`editor-${i.key}`} content={i.content} onChange={handleChange} />)
          }
        </div>
          <div className="mt-5">
            <Button loading={isLoading} disabled={isLoading} onClick={handleSave}>Save</Button>
          </div>
      </div>
    </CardWrap>
  );
}

export default FaqsUpdater;
