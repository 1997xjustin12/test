"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import { createSlug } from "@/app/lib/helpers";
import { useAuth } from "@/app/context/auth";

const FirstReview = ({ openForm }) => {
  return (
    <div className="mt-2">
      <div className="my-3 px-5 py-2 rounded-full inline-block bg-stone-300 text-stone-700 shadow text-xs">
        If product doesn't have reviews yet
      </div>
      <Rating
        readOnly
        value={8}
        fractions={2}
        style={{ maxWidth: 100 }}
      ></Rating>
      <p>Be the first to write a review</p>
      <div className="flex gap-2">
        <button
          onClick={() => openForm("review")}
          className="px-10 py-1 bg-stone-600 hover:bg-stone-700 border-2 border-stone-600 hover:border-stone-700 text-white"
        >
          Write a review
        </button>
        {/* <button
          onClick={() => openForm("inquiry")}
          className="px-10 py-1 border-2 border-stone-600 hover:border-stone-700 text-stone-600 hover:text-stone-700"
        >
          Ask a question
        </button> */}
      </div>
    </div>
  );
};

const ReviewForm = ({ product }) => {
  const { productReviewCreate, productReviewList } = useAuth();
  const inputRef = useRef(null);
  const [form, setForm] = useState({
    product: product?.product_id,
    rating: 4,
    title: "Good value for the price",
    comment:
      "A few scratches on the exterior but nothing major. Still a great deal for the price.",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("[form]", form);
      const response = await productReviewCreate(form);
      const data = await response.json();
      console.log("[response]", response);
      console.log("[data]", data);
      if (!response.ok) {
        console.warn("[handleSubmit]", err);
        return;
      }
    } catch (err) {
      console.warn("[handleSubmit]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const productImage = useMemo(() => {
    if (!product?.images?.length) return null;
    return product.images.find((image) => image?.position === 1)?.src ?? null;
  }, [product]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await productReviewList([product?.product_id]);
      console.log("[reviews]", reviews);
    };
    if (product) {
      setForm((prev) => ({ ...prev, product: product?.product_id }));
      fetchReviews();
    }
  }, [product]);

  return (
    <div className="rounded shadow-lg p-5 mt-5 border border-neutral-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3>Write a review</h3>
        <div className="flex items-center gap-5">
          <div className="h-[100px] w-[100px] relative">
            {productImage && (
              <Image
                src={productImage}
                title={`${product?.title}`}
                alt={`${createSlug(product?.title)}-image`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            )}
          </div>
          <div className="w-[calc(100%-100px)]">
            <p className="text-sm font-medium text-neutral-800">
              {product?.title}
            </p>
          </div>
        </div>
        <div>
          <label htmlFor="username" className="text-xs font-bold">
            <span className="text-red-600">*</span> Rating
          </label>
          {/* <div>Let us know your rating for this product</div> */}
          <Rating
            value={form?.rating || 3}
            onChange={(e) =>
              handleChange({ target: { name: "rating", value: e } })
            }
            style={{ maxWidth: 150 }}
          ></Rating>
        </div>
        <div>
          <label htmlFor="username" className="text-xs font-bold">
            <span className="text-red-600">*</span> Title
          </label>
          <input
            ref={inputRef}
            placeholder="Title"
            name="title"
            value={form?.title || ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="username" className="text-xs font-bold">
            <span className="text-red-600">*</span> Comment
          </label>
          <textarea
            name="comment"
            value={form?.comment || ""}
            onChange={handleChange}
            rows="4"
            placeholder="Enter your comment..."
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-5 items-center flex-col-reverse sm:flex-row">
          <button
            type="button"
            className="text-[12px] mb:text-base py-1 font-medium text-stone-700"
          >
            Cancel Review
          </button>
          <button
            type="submit"
            className="text-[12px] sm:text-base px-10 py-1 bg-stone-600 hover:bg-stone-700 border-2 border-stone-600 hover:border-stone-700 text-white"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

const InquiryForm = ({ product_id }) => {
  return <div>Inquiry Form</div>;
};

const ReviewSummary = ({ product }) => {
  const [reviewSummary, setReviewSummary] = useState({
    overall_rating: 4.8,
    by_star: [
      { name: "lowest", star: 1, votes: 1 },
      { name: "low", star: 2, votes: 0 },
      { name: "mid", star: 3, votes: 2 },
      { name: "high", star: 4, votes: 5 },
      { name: "highest", star: 5, votes: 10 },
    ],
  });

  const calculatePercentage = (totalVotes, individualVotes) => {
    if (
      totalVotes === 0 ||
      typeof totalVotes !== "number" ||
      typeof individualVotes !== "number"
    ) {
      return 0;
    }

    const percentage = (individualVotes / totalVotes) * 100;

    return Math.round(percentage * 100) / 100;
  };

  const total_votes = useMemo(() => {
    const by_star = reviewSummary?.by_star;
    return by_star.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.votes;
    }, 0);
  }, [reviewSummary]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full text-center">
        <div className="text-4xl font-bold">
          {reviewSummary?.overall_rating}
        </div>
        <div className="flex w-full justify-center">
          <Rating readOnly value={4} style={{ maxWidth: 100 }}></Rating>
        </div>
        <div className="text-neutral-500 text-xs mt-1">
          {total_votes} ratings
        </div>
      </div>
      <div className="w-full">
        {reviewSummary?.by_star?.length &&
          reviewSummary?.by_star.map((item) => (
            <div
              className="flex items-center gap-2"
              key={`review-summary-${item?.name}`}
            >
              <div className="w-[100px]">
                <Rating
                  readOnly
                  value={item?.star}
                  style={{ maxWidth: 100 }}
                ></Rating>
              </div>
              <div className="w-[calc(100%-60px)]">
                <div className="h-2 bg-neutral-200 rounded-full">
                  <div
                    style={{
                      width: `${calculatePercentage(
                        total_votes,
                        item?.votes
                      )}%`,
                    }}
                    className={`h-2 bg-indigo-500 rounded-full`}
                  ></div>
                </div>
              </div>
              <div className="w-[60px] text-xs text-neutral-500 text-right">
                {item?.votes} rating
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

function ProductReviewSection({ product }) {
  const [visibleForm, setVisibleForm] = useState("review");
  const [review, setReview] = useState(1);

  const handleFormToggle = (form) => {
    setVisibleForm((prev) => {
      if (prev === form) return null;
      return form;
    });
  };

  return (
    <div className="">
      <h2>Customer Reviews</h2>
      {review ? (
        <div className="mt-5 flex gap-[20px]">
          <div className="w-full p-5 rounded-md border border-neutral-300">
            <ReviewSummary product={product} />
          </div>
        </div>
      ) : (
        <FirstReview openForm={handleFormToggle} />
      )}
      {visibleForm && (
        <>
          {visibleForm === "review" && <ReviewForm product={product} />}
          {visibleForm === "inquiry" && <InquiryForm />}
        </>
      )}
    </div>
  );
}

export default ProductReviewSection;
