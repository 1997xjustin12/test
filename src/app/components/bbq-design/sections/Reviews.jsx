"use client";
import { useState } from "react";
import { useReveal } from "@/app/hooks/useReveal";
import useReviews from "@/app/hooks/useReviews";

const ReviewCardSkeleton = () => (
  <div className="bg-white border border-grate rounded p-5 sm:p-6 animate-pulse">
    <div className="h-3 w-20 bg-stone-200 rounded-full mb-3" />
    <div className="flex flex-col gap-2 mb-4 min-h-[69px]">
      <div className="h-3 w-full bg-stone-200 rounded-full" />
      <div className="h-3 w-full bg-stone-200 rounded-full" />
      <div className="h-3 w-2/3 bg-stone-200 rounded-full" />
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-24 bg-stone-200 rounded-full" />
        <div className="h-2.5 w-28 bg-stone-200 rounded-full" />
      </div>
      <div className="w-4 h-4 bg-stone-200 rounded-full" />
    </div>
  </div>
);

export default function Reviews() {
  const { reviewDetails, loading } = useReviews();
  const hdrRef = useReveal();
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard((prev) => (prev === index ? null : index));
  };

  const avgRating = reviewDetails?.summary?.average_rating || 0;
  const totalReviews = reviewDetails?.summary?.total_reviews;

  console.log("reviewDetails", reviewDetails);

  return (
    <section className="py-14 sm:py-16 bg-ash">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        <div className="flex flex-wrap items-center gap-5 mb-8">
          <span className="font-oswald font-bold text-5xl sm:text-6xl leading-none">{parseFloat(avgRating).toFixed(1)}</span>
          <div>
            <div className="text-gold text-lg tracking-widest">{'★'.repeat(avgRating)}{'☆'.repeat(5 - avgRating)}</div>
            <span className="text-sm text-stone-400">Based on {totalReviews} verified customer reviews</span>
          </div>
          {/* <Link href="/reviews" className="ml-auto font-oswald font-semibold text-sm tracking-wide border-b-2 border-ember pb-0.5 hover:text-ember transition-colors">
            Write a Review →
          </Link> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {loading
            ? [...Array(3)].map((_, i) => <ReviewCardSkeleton key={`skeleton-${i}`} />)
            : (reviewDetails?.results || []).slice(0, 3).map(({ rating, comment, user }, index) => {
                const isExpanded = expandedCard === index;
                return (
                  <div key={`review-card-item-${user?.username}-${index}`} className="bg-white border border-grate rounded p-5 sm:p-6">
                    <span className="text-gold text-sm tracking-wider">{'★'.repeat(Math.ceil(rating))}{'☆'.repeat(5 - Math.ceil(rating))}</span>
                    <div className={`text-sm font-light mt-2.5 mb-4 leading-relaxed min-h-[69px] ${isExpanded ? "" : "line-clamp-3"}`}>"{comment}"</div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold">{user?.username}</p>
                        <p className="text-xs text-bbq-green">✓ Verified Buyer</p>
                      </div>
                      <button
                        onClick={() => toggleCard(index)}
                        className="text-stone-400 hover:text-stone-600 transition-colors"
                        aria-label={isExpanded ? "Collapse review" : "Expand review"}
                      >
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>

      </div>
    </section>
  );
}


    // <section id="reviews" className="py-20 md:py-24 bg-cream dark:bg-stone-950">
    //   <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
    //     {/* Header */}
    //     <div
    //       ref={hdrRef}
    //       className="opacity-0 translate-y-6 transition-all duration-700 text-center mb-12"
    //     >
    //       <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 mb-2.5">
    //         Customer Reviews
    //       </p>
    //       <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white mb-6 leading-tight">
    //         What Our Customers Say
    //       </h2>

    //       {avgRating && (
    //         <div className="flex items-center justify-center gap-4">
    //           <span className="font-serif text-[3.5rem] font-bold text-charcoal dark:text-white leading-none">
    //             {parseFloat(avgRating).toFixed(1)}
    //           </span>
    //           <div className="flex flex-col items-start gap-1">
    //             <StarRow rating={avgRating} size="lg" />
    //             <p className="text-xs text-stone-400">
    //               Based on {totalReviews} verified review{totalReviews !== 1 ? "s" : ""}
    //             </p>
    //           </div>
    //         </div>
    //       )}
    //     </div>

    //     {/* Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
    //     {/* items-start prevents grid stretch from equalising card heights across rows */}
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
    //       {loading
    //         ? [...Array(3)].map((_, i) => (
    //             <div key={`skeleton-${i}`} className={i >= 2 ? "hidden sm:block" : ""}>
    //               <ReviewCardSkeleton />
    //             </div>
    //           ))
    //         : (reviewDetails?.results || []).slice(0, 3).map((r, i) => (
    //             <div key={`home-review-card-${r.id}`} className={i >= 2 ? "hidden sm:block" : ""}>
    //               <ReviewCard {...r} />
    //             </div>
    //           ))}
    //     </div>
    //   </div>
    // </section>