"use client";

import { useState, useRef } from "react";
import StarRating from "@/app/components/oko-design/sections/sp/StarRating";
import Pagination from "@/app/components/oko-design/ui/Pagination";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchProductReviews(productId, page = 1) {
  if (!productId) throw new Error("Product ID is required to fetch reviews.");
  const url = `/api/reviews/list?product_id=${encodeURIComponent(productId)}&page=${page}`;
  const response = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Error: ${response.status}`);
  return data;
}

function Reviews({ reviews, reviewCount, product_id }) {
  const [reviewList, setReviewList] = useState(reviews || []);
  const reviewsTopRef = useRef(null);

  const handlePageChange = async (page) => {
    const response = await fetchProductReviews(product_id, page);
    setReviewList(response?.results || []);
    if (reviewsTopRef.current) {
      const y = reviewsTopRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div ref={reviewsTopRef} className="flex flex-col divide-y divide-oko-stone-line dark:divide-oko-line-dark">
      {reviewList.map((review, i) => (
        <div key={review.id ?? i} className="py-5 first:pt-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-inter text-[13.5px] font-semibold text-oko-char dark:text-oko-cream">
                {review?.user?.username || review.name || "Verified buyer"}
              </p>
              <div className="mt-1">
                <StarRating rating={review.rating} size="sm" />
              </div>
            </div>
            <span className="font-inter text-[12px] text-oko-stone whitespace-nowrap">
              {formatDate(review.created_at)}
            </span>
          </div>
          {review.title && (
            <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream mb-1">
              {review.title}
            </p>
          )}
          <p className="font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark leading-[1.55]">
            {review.comment || review.content || ""}
          </p>
        </div>
      ))}

      {reviewCount > 10 && (
        <Pagination
          total_count={reviewCount || 0}
          results_per_page={10}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Reviews;
