"use effect";

import React from "react";
import StarRating from "@/app/components/new-design/sections/sp/StarRating";
import Pagination from "@/app/components/new-design/ui/Pagination";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Reviews({reviews, reviewCount}) {

  return (
    <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
      {reviews.map((review, i) => (
        <div key={review.id ?? i} className="py-5 first:pt-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {review?.user?.username || review.name || "Verified Buyer"}
              </p>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatDate(review.created_at)}
            </span>
          </div>
          {review.title && (
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {review.title}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {review.comment || review.content || ""}
          </p>
        </div>
      ))}
      {/* Pagination */}
      {reviewCount > 10 && (
        <Pagination total_count={reviewCount || 0} results_per_page={10} />
      )}
    </div>
  );
}

export default Reviews;
