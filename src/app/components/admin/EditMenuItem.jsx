"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSolanaCategories } from "@/app/context/category";
import { notFound } from "next/navigation";
import Button from "@/app/components/admin/Button";
import { keys, redisGet, redisSet } from "@/app/lib/redis";
import { updateMenuItemById, generateId } from "@/app/lib/helpers";

const defaultMenuKey = keys.default_shopify_menu.value;

const PageMeta = ({ meta, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label htmlFor="meta-title">Meta Title</label>
        <textarea
          name="meta-title"
          id="meta-title"
          value={meta?.title || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="meta-description">Meta Description</label>
        <textarea
          name="meta-description"
          id="meta-description"
          value={meta?.description || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
    </div>
  );
};

const HeroContent = ({ hero, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Call For Best Pricing</span>
        </label>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="main-text">Main Text</label>
        <textarea
          name="main-text"
          id="main-text"
          value={hero?.main_text || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="sub-text">Sub Text</label>
        <textarea
          name="sub-text"
          id="sub-text"
          value={hero?.sub_text || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
    </div>
  );
};

const PriceVisibility = ({ visibility, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Price Visible</span>
        </label>
      </div>
    </div>
  );
};

const FaqItem = ({ faq, onUpdate = () => {}, onDelete = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const handleFAQDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      onDelete(faq);
    }
  };

  const handleFAQUpdate = () => {
    onUpdate({ id: faq?.id, question: question, answer: answer });
    setIsEditing((prev) => false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("question-")) {
      setQuestion((prev) => value);
    }
    if (name.includes("answer-")) {
      setAnswer((prev) => value);
    }
  };

  return (
    <div>
      <div className="border-[3px] p-2 border-indigo-600 text-white bg-indigo-600 flex justify-between gap-[50px] items-center">
        <div className="w-full">
          {isEditing ? (
            <>
              <label htmlFor="meta-title">Question</label>
              <input
                type="text"
                name={`question-${faq?.id}`}
                id={`question-${faq?.id}`}
                value={question}
                onChange={handleInputChange}
                className="text-neutral-900 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </>
          ) : (
            faq?.question
          )}
        </div>
        <div className="flex gap-[10px] items-center">
          <button onClick={handleFAQDelete}>delete</button>|{" "}
          {isEditing ? (
            <button onClick={handleFAQUpdate}>update</button>
          ) : (
            <button onClick={() => setIsEditing((prev) => true)}>edit</button>
          )}
        </div>
      </div>
      <div className="p-2 border border-indigo-300 w-full">
        {isEditing ? (
          <>
            <label htmlFor="meta-title">Answer</label>
            <textarea
              name={`answer-${faq?.id}`}
              id={`answer-${faq?.id}`}
              value={answer}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </>
        ) : (
          faq?.answer
        )}
      </div>
    </div>
  );
};

const Faqs = ({ faqsProps, onChange }) => {
  const [faqs, setFaqs] = useState(faqsProps);

  const handleAddFaqItem = () => {
    setFaqs((prev) => {
      return {
        ...prev,
        data: [
          ...prev.data,
          {
            id: `faq-item-${generateId()}`,
            question: "Question",
            answer: "Answer",
          },
        ],
      };
    });
  };

  const handleVisibilityChange = (e) => {
    const {checked} = e.target;
    let new_faq_item = null;
    setFaqs((prev) => {
      new_faq_item = {
        ...prev,
        visible: checked
      };
      return new_faq_item;
    });
    onChange(new_faq_item);
  };

  const handleFaqItemDelete = (faq_item) => {
    let new_faq_item = null;
    setFaqs((prev) => {
      new_faq_item = {
        ...prev,
        data: prev.data.filter(faq => faq.id !== faq_item.id),
      };
      return new_faq_item;
    });
    onChange(new_faq_item);
  };
  const handleFaqItemUpdate = (faq_item) => {
    let new_faq_item = null;
    setFaqs((prev) => {
      new_faq_item = {
        ...prev,
        data: prev.data.map((faq) => ({
          ...faq,
          question: faq.id === faq_item.id ? faq_item.question : faq.question,
          answer: faq.id === faq_item.id ? faq_item.answer : faq.answer,
        })),
      };

      return new_faq_item;
    });
    onChange(new_faq_item);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label
          className="inline-flex items-center space-x-2 cursor-pointer"
          title="Set FAQ Visibility"
        >
          <input
            type="checkbox"
            disabled={faqs?.data?.length === 0}
            checked={faqs?.data?.length === 0 ? false: faqs?.visible}
            onChange={handleVisibilityChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Visible</span>
        </label>
      </div>
      <div className="mt-3">
        <button
          className="rounded bg-indigo-600 text-white font-medium px-3 py-1"
          onClick={handleAddFaqItem}
          title="Add FAQ Item"
        >
          Add FAQ item
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {faqs &&
          faqs?.data &&
          faqs.data.map((faq, index) => (
            <FaqItem
              key={`faq-item-${index}`}
              faq={faq}
              onUpdate={handleFaqItemUpdate}
              onDelete={handleFaqItemDelete}
            />
          ))}
      </div>
    </div>
  );
};

function EditMenuItem({ menu_id }) {
  const { flatCategories } = useSolanaCategories();
  const [isSaving, setIsSaving] = useState(false);
  const [menuItem, setMenuItem] = useState(null);
  const [tabs, setTabs] = useState([
    { id: "meta", label: "Page Meta", isActive: false },
    { id: "hero", label: "Hero Section", isActive: true },
    { id: "dynamic_sections", label: "Dynamic Sections", isActive: false },
    { id: "faqs", label: "Page FAQs", isActive: false },
    // { id: "navigation", label: "Navigation", isActive: false },
  ]);

  // alert message
  const [alertToggle, setAlertToggle] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!Array.isArray(flatCategories) || !menu_id) return;
    const item = flatCategories.find((item) => item?.menu_id === menu_id);
    console.log("[TEST] menuItem", item);
    // price visibility tab for brand only
    if (item && item?.nav_type === "brand") {
      setTabs((prev) => [
        ...prev,
        { id: "price_visibility", label: "Price Visibility", isActive: false },
      ]);
    }
    setMenuItem(item);
  }, []);

  const handleTabChange = (tab_id) => {
    setTabs((prev) =>
      prev.map((tab) => ({ ...tab, isActive: tab.id === tab_id }))
    );
  };

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setMenuItem((prev) => ({
      ...prev,
      ...(name === "meta-title" && { meta_title: value }),
      ...(name === "meta-description" && { meta_description: value }),
    }));
  };

  const handleFAQChange = (faqs) => {
    console.log("[TEST] handleFAQChange", faqs);
    setMenuItem(prev=> {
      console.log("[TEST] prev", prev)
      const faqs_updated = {...prev, faqs: faqs};
      console.log("[TEST] faqs_updated", faqs_updated)
      return faqs_updated;
    })
  };

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    // setMenuItem(prev => ({
    //   ...prev,
    //   ...(name === "meta-title" && { meta_title: value }),
    //   ...(name === "meta-description" && { meta_description: value }),
    // }));
  };

  const handlePriceVisibilityChange = (e) => {};

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertToggle(true);
    setTimeout(() => {
      setAlertToggle(false);
      setAlertType(null);
      setAlertMessage("");
    }, 5000);
  };

  const handleMenuItemSave = () => {
    setIsSaving(true);
    redisGet(defaultMenuKey)
      .then((data) => {
        // fetch the object before saving to make sure we are updating using the latest object
        const updated = updateMenuItemById(data, menuItem?.menu_id, menuItem);
        // console.log("[TEST] fetch menu data", data);
        // console.log("[TEST] fetch menu data (updated)", updated);
        redisSet(defaultMenuKey, updated)
          .then((response) => {
            if (response.success) {
              showAlertMessage("success", "Menu object updated successful.");
            } else {
              showAlertMessage("error", "Failed to update. Please try again.");
            }
            setIsSaving(false);
          })
          .catch((error) => {
            showAlertMessage("error", "Failed to update. Please try again.");
            setIsSaving(false);
          });
      })
      .catch((error) => {
        showAlertMessage("error", "Failed to update. Please try again.");
        setIsSaving(false);
      });
  };

  const activeTab = useMemo(() => {
    const active = tabs.find((tab) => tab.isActive);
    // console.log("[TEST] activeTab", active);
    return active;
  }, [tabs]);

  if (menuItem === undefined) {
    notFound();
  }

  return (
    <div>
      <div>
        <h2>
          Edit Menu Item{" "}
          <span className="text-indigo-500">{menuItem?.name}</span>
        </h2>
      </div>
      <div className="pb-4 flex flex-col gap-1">
        <div className="text-xs">
          Your changes won't be applied until you click Save.
        </div>
        <div>
          <Button onClick={handleMenuItemSave} loading={isSaving}>
            Save
          </Button>
        </div>
        <div>
          <div
            className={`text-xs py-1 px-2 rounded border flex items-center ${
              alertType === "success"
                ? "bg-green-200 text-green-800  border-green-400"
                : "bg-red-200 text-red-800  border-red-400"
            } ${alertToggle ? "opacity-100" : "opacity-0"}`}
          >
            {alertMessage}
          </div>
        </div>
      </div>
      {/* tabs */}
      <div className="pt-3 border-b-4 border-indigo-500">
        <ul className="flex items-center gap-1">
          {tabs.map((tab) => (
            <li
              key={`edit-menu-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              className={`p-3 uppercase font-semibold text-xs  rounded-tl rounded-tr cursor-pointer ${
                tab?.isActive
                  ? "text-white bg-indigo-500"
                  : "text-neutral-400 bg-neutral-200"
              }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </div>
      {/* tab contents */}
      <div className="p-2">
        {activeTab.id === "meta" && (
          <PageMeta
            meta={{
              title: menuItem?.meta_title,
              description: menuItem?.meta_description,
            }}
            onChange={handleMetaChange}
          />
        )}
        {activeTab.id === "hero" && (
          <HeroContent
            hero={{
              main_text: menuItem?.banner?.title,
              sub_text: menuItem?.banner?.tag_line,
            }}
            onChange={handleHeroChange}
          />
        )}
        {activeTab.id === "faqs" && (
          <Faqs
            faqsProps={menuItem?.faqs || { visible: false, data: [] }}
            onChange={handleFAQChange}
          />
        )}
        {activeTab.id === "price_visibility" && (
          <PriceVisibility
            visibility={menuItem?.price_visibility === "show"}
            onChange={handlePriceVisibilityChange}
          />
        )}
      </div>
    </div>
  );
}

export default EditMenuItem;
