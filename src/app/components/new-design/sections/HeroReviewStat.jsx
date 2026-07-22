"use client";
import useReviews from "@/app/hooks/useReviews";

const Stat = ({ num, label }) => (
  <div>
    <div className="font-serif text-3xl font-bold text-white">{num}</div>
    <div className="text-[11px] tracking-widest uppercase text-white/60 mt-0.5">
      {label}
    </div>
  </div>
);

const StatSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-14 bg-white/15 rounded mb-2" />
    <div className="h-2.5 w-16 bg-white/10 rounded" />
  </div>
);

export default function HeroStats() {
  const { reviewDetails, loading } = useReviews();
  const avgRating = reviewDetails?.summary?.average_rating;
  const totalReviews = reviewDetails?.summary?.total_reviews;

  if (loading) {
    return (
      <div className="flex justify-center md:justify-start gap-8 mb-5">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  return (
    <div className="flex justify-center md:justify-start gap-8 mb-5 animate-[fadeIn_0.4s_ease-in]">
      <Stat num="6K+" label="Products" />
      <Stat
        num={avgRating ? `${parseFloat(avgRating).toFixed(1)}★` : "4.4★"}
        label={totalReviews ? `${totalReviews} Reviews` : "122 Reviews"}
      />
      <Stat num="20+" label="Brands" />
    </div>
  );
}
