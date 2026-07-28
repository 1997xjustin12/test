import StarRating from "@/app/components/oko-design/sections/sp/StarRating";
import Reviews from "@/app/components/oko-design/sections/sp/Reviews";

function formatSummary(summary) {
  if (!summary || !summary.total_reviews) return [];
  const { total_reviews, ...stars } = summary;
  const rows = [5, 4, 3, 2, 1].map((rating) => {
    const count = stars[`rating_${rating}_count`] || 0;
    const pct = total_reviews > 0 ? parseFloat(((count / total_reviews) * 100).toFixed(1)) : 0;
    return { star: rating, count, pct };
  });
  const drift = parseFloat((100 - rows.reduce((sum, r) => sum + r.pct, 0)).toFixed(1));
  if (drift !== 0) {
    const maxIdx = rows.reduce((best, r, i) => (r.count > rows[best].count ? i : best), 0);
    rows[maxIdx].pct = parseFloat((rows[maxIdx].pct + drift).toFixed(1));
  }
  return rows;
}

const ReviewsSection = ({ rating, reviewCount, reviews = [], summary, product_id }) => {
  const bars = formatSummary(summary);
  const hasReviews = reviews.length > 0;

  return (
    <section id="reviews" className="mb-12">
      <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
        <div className="flex items-center px-5 py-4 border-b border-oko-stone-line dark:border-oko-line-dark gap-3">
          <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-oko-brass" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
          <h3 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">
            Customer reviews
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center pb-6 border-b border-oko-stone-line dark:border-oko-line-dark mb-6">
            <div className="text-center sm:pr-6 sm:border-r sm:border-oko-stone-line dark:sm:border-oko-line-dark">
              <p className="font-oko-display font-bold text-[42px] text-oko-char dark:text-oko-cream leading-none">
                {rating > 0 ? rating.toFixed(1) : "—"}
              </p>
              <div className="mt-1.5 flex justify-center">
                <StarRating rating={rating} size="lg" count={reviewCount} />
              </div>
              <p className="font-inter text-[12px] text-oko-stone mt-1">
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {bars.map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="font-inter text-[12px] text-oko-stone w-3 text-right">{star}</span>
                  <svg className="w-3 h-3 text-oko-brass flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 h-1.5 bg-oko-stone-line dark:bg-oko-line-dark overflow-hidden rounded-[2px]">
                    <div className="h-full bg-oko-brass rounded-[2px]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-inter text-[11px] text-oko-stone w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          {hasReviews ? (
            <Reviews reviews={reviews} reviewCount={reviewCount} product_id={product_id} />
          ) : (
            <div className="text-center py-6">
              <p className="font-oko-display font-semibold text-[21px] text-oko-char dark:text-oko-cream mb-1">
                No reviews
              </p>
              <p className="font-inter text-[13.5px] text-oko-stone">
                Verified purchasers can share their feedback in the account portal.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
