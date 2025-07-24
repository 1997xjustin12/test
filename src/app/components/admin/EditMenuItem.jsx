"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSolanaCategories } from "@/app/context/category";
import { notFound } from "next/navigation";
import Button from "@/app/components/admin/Button";
import { keys, redisGet, redisSet } from "@/app/lib/redis";
import {
  BASE_URL,
  updateMenuItemById,
  generateId,
  flattenNavTree,
} from "@/app/lib/helpers";
import HeroNotice from "@/app/components/atom/HeroNotice";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";

const defaultMenuKey = keys.default_shopify_menu.value;

const PageMeta = ({ meta, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label htmlFor="meta-title">Meta Title</label>
        <textarea
          name="meta-title"
          id="meta-title"
          rows="3"
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
          rows="5"
          value={meta?.description || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
    </div>
  );
};

const HeroContent = ({ hero, images, onChange }) => {
  const [bannerImage, setBannerImage] = useState();
  // const [bannerImages, setBannerImages] = useState(images);
  // console.log("[TEST] images", images);
  useEffect(() => {
    setBannerImage(hero?.img?.src || "/images/banner/solana-home-hero.webp");
  }, [hero]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="notice-visible"
            id="notice-visible"
            checked={hero?.notice_visible || false}
            onChange={onChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Enable Hero Notice</span>
        </label>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="notice-html">Hero Notice HTML</label>
        <textarea
          name="notice-html"
          id="notice-html"
          rows="10"
          value={hero?.notice_html || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      <div className="flex flex-col gap-1">
        <label htmlFor="main-text">Main Text</label>
        <textarea
          name="main-text"
          id="main-text"
          value={hero?.title || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="sub-text">Sub Text</label>
        <textarea
          name="sub-text"
          id="sub-text"
          rows="5"
          value={hero?.tag_line || ""}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <div>
        <h2>Hero Representation</h2>
        <span className="italic text-neutral-500 text-sm">
          <strong>Note:</strong> This is a conceptual representation and may not
          fully reflect the final implementation.
        </span>
      </div>
      <div className="w-full aspect-w-3 aspect-h-1 bg-stone-300 relative overflow-hidden">
        <div className="absolute w-full top-0 left-0 z-10">
          <HeroNotice data={{ banner: hero }} />
        </div>
        <div className="absolute z-[9999] inset-0 m-auto flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-[90%]">
              <h1 className="text-balance text-md tracking-wide text-white md:text-4xl drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] italic text-center">
                {hero?.title}
              </h1>
            </div>
            <div className="flex items-center justify-center w-full">
              <h2 className="text-xs md:text-base text-balance font-normal mt-1 tracking-wide text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] text-center max-w-[75%] min-w-[75%]">
                {hero?.tag_line}
              </h2>
            </div>
          </div>
        </div>
        {bannerImage && (
          <Image
            src={bannerImage}
            alt={`Selected Banner Image`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
          />
        )}
      </div>
      <div className="mb-3 mt-10">
        <h3>Select Hero Image</h3>
        <p className="italic text-neutral-500 text-sm">
          By default, items without a banner image will automatically use the
          first image from the selection.
        </p>
        <p className="italic text-neutral-500 text-sm">
          If the image you need is not available in the selection box, please
          send it to the developer. Once uploaded, it will appear in the
          selection list.
        </p>
      </div>
      <div className="full">
        <div className="flex gap-[10px] overflow-x-auto px-2 pb-3">
          {images &&
            images.length > 0 &&
            images.map((image, index) => (
              <div
                key={`banner-image-${index}`}
                onClick={() =>
                  onChange({ target: { name: "banner-image", value: image } })
                }
                className={`cursor-pointer w-[300px] h-[120px] bg-gray-300 flex-shrink-0 relative border-4 ${
                  bannerImage === image
                    ? "border-indigo-500"
                    : "border-neutral-300"
                }`}
              >
                <Image
                  src={image}
                  alt={`Banner Image Selection ${index}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// const PriceVisibility = ({ visibility, onChange }) => {
//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex flex-col gap-1">
//         <label className="inline-flex items-center space-x-2 cursor-pointer">
//           <input
//             type="checkbox"
//             className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//           />
//           <span className="text-gray-700">Price Visible</span>
//         </label>
//       </div>
//     </div>
//   );
// };

const FaqItem = ({ faq, onUpdate = () => {}, onDelete = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="border-[3px] p-2 border-indigo-600 text-white bg-indigo-600 flex justify-between gap-[50px] items-center">
        <div {...listeners} onMouseDown={() => setIsEditing(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6.75 18.72c0 .122 0 .255.01.37c.01.13.036.3.126.477c.12.236.311.427.547.547c.176.09.348.116.478.127c.114.01.247.009.369.009h1.44c.122 0 .255 0 .37-.01c.13-.01.3-.036.478-.126a1.25 1.25 0 0 0 .546-.547c.09-.176.116-.348.127-.477c.01-.115.009-.248.009-.37v-1.44c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.477a1.25 1.25 0 0 0-.546-.547a1.3 1.3 0 0 0-.479-.127c-.114-.01-.247-.009-.369-.009H8.28c-.122 0-.255 0-.37.01c-.13.01-.3.036-.477.126a1.25 1.25 0 0 0-.547.547c-.09.176-.116.348-.127.477c-.01.115-.009.248-.009.37zm0-6c0 .122 0 .255.01.37c.01.13.036.3.126.478c.12.235.311.426.547.546c.176.09.348.116.478.127c.114.01.247.009.369.009h1.44c.122 0 .255 0 .37-.01c.13-.01.3-.036.478-.126a1.25 1.25 0 0 0 .546-.546c.09-.177.116-.349.127-.479c.01-.114.009-.247.009-.369v-1.44c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.478a1.25 1.25 0 0 0-.546-.546a1.3 1.3 0 0 0-.479-.127a5 5 0 0 0-.369-.009H8.28c-.122 0-.255 0-.37.01c-.13.01-.3.036-.477.126a1.25 1.25 0 0 0-.547.547c-.09.176-.116.348-.127.478c-.01.114-.009.247-.009.369zm0-7.44v1.44c0 .122 0 .255.01.37c.01.13.036.3.126.477c.12.236.311.427.547.547c.176.09.348.116.478.127c.114.01.247.009.369.009h1.44c.122 0 .255 0 .37-.01c.13-.01.3-.036.478-.126a1.25 1.25 0 0 0 .546-.547c.09-.176.116-.348.127-.478c.01-.114.009-.247.009-.369V5.28c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.477a1.25 1.25 0 0 0-.546-.547a1.3 1.3 0 0 0-.479-.127a5 5 0 0 0-.369-.009H8.28c-.122 0-.255 0-.37.01c-.13.01-.3.036-.477.126a1.25 1.25 0 0 0-.547.547c-.09.176-.116.348-.127.478c-.01.114-.009.247-.009.369m6 13.44c0 .122 0 .255.01.37c.01.13.036.3.126.477c.12.236.311.427.547.547c.176.09.348.116.478.127c.114.01.247.009.369.009h1.44c.122 0 .255 0 .37-.01c.13-.01.3-.036.477-.126a1.25 1.25 0 0 0 .547-.547c.09-.176.116-.348.127-.477c.01-.115.009-.248.009-.37v-1.44c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.477a1.25 1.25 0 0 0-.547-.547a1.3 1.3 0 0 0-.477-.127c-.115-.01-.248-.009-.37-.009h-1.44c-.122 0-.255 0-.37.01c-.13.01-.3.036-.478.126a1.25 1.25 0 0 0-.546.547c-.09.176-.116.348-.127.477c-.01.115-.009.248-.009.37zm0-6c0 .122 0 .255.01.37c.01.13.036.3.126.478c.12.235.311.426.547.546c.176.09.348.116.478.127c.114.01.247.009.369.009h1.44c.122 0 .255 0 .37-.01c.13-.01.3-.036.477-.126a1.25 1.25 0 0 0 .547-.546c.09-.177.116-.349.127-.479c.01-.114.009-.247.009-.369v-1.44c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.478a1.25 1.25 0 0 0-.547-.546a1.3 1.3 0 0 0-.477-.127a5 5 0 0 0-.37-.009h-1.44c-.122 0-.255 0-.37.01c-.13.01-.3.036-.478.126a1.25 1.25 0 0 0-.546.547c-.09.176-.116.348-.127.478c-.01.114-.009.247-.009.369zm0-7.44v1.44c0 .122 0 .255.01.37c.01.13.036.3.126.477c.12.236.311.427.547.547c.176.09.348.116.478.127c.114.01.247.009.369.009h1.44c.122 0 .255 0 .37-.01c.13-.01.3-.036.477-.126a1.25 1.25 0 0 0 .547-.547c.09-.176.116-.348.127-.478c.01-.114.009-.247.009-.369V5.28c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.477a1.25 1.25 0 0 0-.547-.547a1.3 1.3 0 0 0-.477-.127a5 5 0 0 0-.37-.009h-1.44c-.122 0-.255 0-.37.01c-.13.01-.3.036-.478.126a1.25 1.25 0 0 0-.546.547c-.09.176-.116.348-.127.478c-.01.114-.009.247-.009.369"
            />
          </svg>
        </div>
        <div className="w-full">
          {isEditing ? (
            <>
              <label htmlFor={`question-${faq?.id}`}>Question</label>
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
          <button
            onClick={handleFAQDelete}
            className="p-1 bg-indigo-950 hover:bg-indigo-900 rounded uppercase text-[8px] font-bold"
          >
            delete
          </button>
          |{" "}
          {isEditing ? (
            <button
              onClick={handleFAQUpdate}
              className="p-1 bg-indigo-950 hover:bg-indigo-900 rounded uppercase text-[8px] font-bold"
            >
              update
            </button>
          ) : (
            <button
              onClick={() => setIsEditing((prev) => true)}
              className="p-1 bg-indigo-950 hover:bg-indigo-900 rounded uppercase text-[8px] font-bold"
            >
              edit
            </button>
          )}
        </div>
      </div>
      <div className="p-2 border border-indigo-300 w-full bg-white">
        {isEditing ? (
          <>
            <label htmlFor={`answer-${faq?.id}`}>Answer</label>
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    const { checked } = e.target;
    let new_faq_item = {
      ...faqs,
      visible: checked,
    };
    setFaqs(new_faq_item);
    onChange(new_faq_item);
  };

  const handleFaqItemDelete = (faq_item) => {
    const updated = {
      ...faqs,
      data: faqs.data.filter((faq) => faq.id !== faq_item.id),
    };
    setFaqs(updated);
    onChange(updated);
  };

  const handleFaqItemUpdate = (faq_item) => {
    let new_faq_item = {
      ...faqs,
      data: faqs.data.map((faq) => ({
        ...faq,
        question: faq.id === faq_item.id ? faq_item.question : faq.question,
        answer: faq.id === faq_item.id ? faq_item.answer : faq.answer,
      })),
    };

    setFaqs(new_faq_item);
    onChange(new_faq_item);
  };

  function handleDragEnd(event) {
    const { active, over, items } = event;
    if (active.id !== over.id) {
      const oldIndex = faqs?.data?.findIndex((faq) => faq.id === active.id);
      const newIndex = faqs?.data?.findIndex((faq) => faq.id === over.id);
      const reorderedFaqsData = arrayMove(faqs?.data, oldIndex, newIndex);
      const updatedFaqs = { ...faqs, data: reorderedFaqsData };
      setFaqs(updatedFaqs);
      onChange(updatedFaqs);
    }
  }

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
            checked={faqs?.data?.length === 0 ? false : faqs?.visible}
            onChange={handleVisibilityChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Visible</span>
        </label>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      <div className="flex flex-col gap-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={faqs?.data}
            strategy={verticalListSortingStrategy}
          >
            {faqs &&
              faqs?.data &&
              faqs.data.map((faq) => (
                <FaqItem
                  key={`${faq?.id}`}
                  faq={faq}
                  onUpdate={handleFaqItemUpdate}
                  onDelete={handleFaqItemDelete}
                />
              ))}
          </SortableContext>
        </DndContext>
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
    </div>
  );
};

const Settings = ({ menuItem, onChange, feature_images }) => {
  const imageSlug = (img_string) => {
    return img_string.replace("/images/feature/", "").replace(".", "-");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="price-visibility"
            id="price-visibility"
            checked={menuItem?.price_visibility === "show" || false}
            disabled={menuItem?.nav_type !== "brand"}
            onChange={onChange}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-gray-700">Price Visible</span>
        </label>
        <span className="text-sm italic text-neutral-600">
          This feature is only accessible when the menu item's navigation type
          is "brand."
        </span>
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      Feature Image
      <div className="flex">
        <div className="w-[300px] aspect-1 bg-neutral-100 relative">
          {menuItem && menuItem?.feature_image && (
            <Image
              src={menuItem?.feature_image}
              alt={imageSlug(menuItem?.feature_image)}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          )}
        </div>
        <div className="pl-5 w-[calc(100%-300px)] overflow-y-auto h-[300px]">
          <div className="flex flex-wrap gap-[10px]">
            {feature_images &&
              Array.isArray(feature_images) &&
              feature_images.length > 0 &&
              feature_images.map((fimg) => (
                <div
                  key={`image-wrap-${imageSlug(fimg)}`}
                  className={`w-[90px] aspect-1 bg-neutral-200 relative border-[3px] cursor-pointer ${
                    fimg === menuItem?.feature_image ? "border-indigo-400" : ""
                  }`}
                  onClick={() =>
                    onChange({ target: { name: "feature-image", value: fimg } })
                  }
                >
                  <Image
                    src={fimg}
                    alt={imageSlug(fimg)}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="text-sm italic text-neutral-600">
        If the image you need is not available in the selection box, please send
        it to the developer. Once uploaded, it will appear in the selection
        list.
      </div>
      <div className="border-t border-gray-300 my-4"></div>
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-number">Contact Number</label>
        <input
          type="text"
          name={`contact-number`}
          id={`contact-number`}
          value={menuItem?.contact_number || ""}
          onChange={onChange}
          className="max-w-[255px] text-neutral-900 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <span className="italic text-sm text-neutral-600">
          Leaving this blank will apply <strong>(888) 575-9720</strong>
        </span>
      </div>
    </div>
  );
};

const FeatNav = ({ menuItem, onChange }) => {
  const linkOptions = useMemo(() => {
    if (!menuItem?.children) return [];

    return flattenNavTree(menuItem.children);
  }, [menuItem]);

  const activeFeatNavItems = useMemo(() => {
    if (!menuItem?.feat_nav) return [];

    return menuItem.feat_nav.map(i=> i.menu_id);
  }, [menuItem]);


  const handleOptionClick = (nav_item) => {
    const tmp = menuItem?.feat_nav ?? [];
    const tmp1 = tmp.map(i=> i?.menu_id);

    // console.log("[TEST] handleOptionClick", nav_item);
    if(tmp1.includes(nav_item?.menu_id)){
      onChange({target:{name:"feat-nav", value: tmp.filter(i=> i?.menu_id !== nav_item?.menu_id)}});
      return;
    }

    if(tmp.length < 5){
      onChange({target:{name:"feat-nav", value: [...tmp, nav_item]}})
      return;
    }
  }

  return (
    <div>
      <div className="font-medium">Select Maximum of 5 Feature Nav Links</div>
      <div className="flex bg-neutral-50 py-[20px] px-[10px] rounded  border border-slate-200">
        {/* options */}
        <div className="flex flex-wrap items-center justify-center gap-[15px]">
          {linkOptions.map((link, index) => (
            <div
              key={`feat-nav-option-${link?.slug}-${index}`}
              className={`py-1 px-2 bg-white border border-slate-100 rounded-full shadow cursor-pointer ${activeFeatNavItems.includes(link?.menu_id) ? 'bg-indigo-800 text-white hover:bg-indigo-700': 'hover:bg-indigo-200'}`}
              onClick={()=> handleOptionClick(link)}
            >
              {link?.name}
            </div>
          ))}
        </div>
      </div>
      <div>Representation</div>
      <div className="flex w-full border border-slate-100 bg-white p-[20px] justify-evenly">
          {
            menuItem
            && menuItem?.feat_nav
            && Array.isArray(menuItem?.feat_nav)
            && menuItem?.feat_nav.length > 0
            && 
            menuItem.feat_nav.map((nav_item,index) => <div
            className="w-[200px] flex flex-col gap-[10px]"
            key={`feat-nav-rep-${nav_item?.slug}-${index}`}>
              <div className="aspect-1 bg-white relative">
                {
                  nav_item?.feature_image &&
                  <Image
                    src={nav_item?.feature_image}
                    alt={`feat-nav-rep-${index}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                }
              </div>
              <div className="text-center px-2 text-sm font-semibold">{nav_item?.name}</div>
            </div>)
          }
      </div>
    </div>
  );
};

const FeatContent = ({ menuItem, onChange }) => {
  return <div>Feature Content</div>;
};

function EditMenuItem({ menu_id, images, feature_images }) {
  const { flatCategories } = useSolanaCategories();
  const [isSaving, setIsSaving] = useState(false);
  const [menuItem, setMenuItem] = useState(null);
  const [tabs, setTabs] = useState([
    { id: "meta", label: "SEO", isActive: false },
    { id: "hero", label: "Hero Section", isActive: false },
    { id: "feat_nav", label: "Featured Nav", isActive: false },
    { id: "feat_content", label: "Featured Content", isActive: false },
    { id: "faqs", label: "FAQs", isActive: false },
    { id: "settings", label: "Settings", isActive: true },
  ]);

  // alert message
  const [alertToggle, setAlertToggle] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!Array.isArray(flatCategories) || !menu_id) return;
    const item = flatCategories.find((item) => item?.menu_id === menu_id);
    // console.log("[TEST] menuItem", item);
    // price visibility tab for brand only
    // if (item && item?.nav_type === "brand") {
    //   setTabs((prev) => [
    //     ...prev,
    //     { id: "price_visibility", label: "Price Visibility", isActive: false },
    //   ]);
    // }
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
    setMenuItem((prev) => {
      const faqs_updated = { ...prev, faqs: faqs };
      return faqs_updated;
    });
  };

  const handleHeroChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "main-text") {
      setMenuItem((prev) => ({
        ...prev,
        banner: { ...prev?.banner, title: value },
      }));
    }

    if (name === "sub-text") {
      setMenuItem((prev) => ({
        ...prev,
        banner: { ...prev?.banner, tag_line: value },
      }));
    }

    if (name === "notice-visible") {
      setMenuItem((prev) => ({
        ...prev,
        banner: { ...prev?.banner, notice_visible: checked },
      }));
    }

    if (name === "notice-html") {
      setMenuItem((prev) => ({
        ...prev,
        banner: { ...prev?.banner, notice_html: value },
      }));
    }

    if (name === "banner-image") {
      setMenuItem((prev) => ({
        ...prev,
        banner: { ...prev?.banner, img: { src: value, alt: "Banner Image" } },
      }));
    }
  };

  const handlePriceVisibilityChange = (e) => {};

  const handleSettingsChange = (e) => {
    const { name, checked, value } = e.target;
    if (name === "contact-number") {
      setMenuItem((prev) => ({ ...prev, contact_number: value }));
    }

    if (name === "price-visibility") {
      setMenuItem((prev) => ({
        ...prev,
        price_visibility: checked ? "show" : "hide",
      }));
    }

    if (name === "feature-image") {
      setMenuItem((prev) => ({
        ...prev,
        feature_image: value,
      }));
    }
  };

  const handleFeatNavChange = (e) => {
    const {name, value} = e.target;
    // console.log("[TEST] handleFeatNavChange", e);
    if(name === "feat-nav"){
      setMenuItem(prev=> ({...prev, feat_nav: value}))
    }
  }

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
    return active;
  }, [tabs]);

  if (menuItem === undefined) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between">
        <h2>
          Edit Menu Item{" "}
          <span className="text-indigo-500">{menuItem?.name}</span>
        </h2>
        <a
          className="text-indigo-700 underline font-semibold flex gap-[7px]"
          href={`${BASE_URL}/${menuItem?.url}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Preview Page In New Tab"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g className="open-in-new-tab-outline">
              <g
                fill="currentColor"
                fillRule="evenodd"
                className="Vector"
                clipRule="evenodd"
              >
                <path d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5.263a1 1 0 1 1 2 0V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h5.017a1 1 0 1 1 0 2z" />
                <path d="M21.411 2.572a.963.963 0 0 1 0 1.36l-8.772 8.786a.96.96 0 0 1-1.358 0a.963.963 0 0 1 0-1.36l8.773-8.786a.96.96 0 0 1 1.357 0" />
                <path d="M21.04 2c.53 0 .96.43.96.962V8c0 .531-.47 1-1 1s-1-.469-1-1V4h-4c-.53 0-1-.469-1-1s.43-1 .96-1z" />
              </g>
            </g>
          </svg>
        </a>
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
      <div className="pt-3 border-b-4 border-indigo-500 mb-5">
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
            hero={menuItem?.banner}
            images={images}
            onChange={handleHeroChange}
          />
        )}
        {activeTab.id === "faqs" && (
          <Faqs
            faqsProps={menuItem?.faqs || { visible: false, data: [] }}
            onChange={handleFAQChange}
          />
        )}
        {activeTab.id === "settings" && (
          <Settings
            menuItem={menuItem}
            onChange={handleSettingsChange}
            feature_images={feature_images}
          />
        )}
        {activeTab.id === "feat_nav" && <FeatNav menuItem={menuItem} onChange={handleFeatNavChange}/>}
        {activeTab.id === "feat_content" && <FeatContent menuItem={menuItem} />}
      </div>
    </div>
  );
}

export default EditMenuItem;
