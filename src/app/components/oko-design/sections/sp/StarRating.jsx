// Brass stars only (spec §2 — brass is ratings-exclusive). Carries an sr-only
// text equivalent and shows the literal "No reviews" state (§12 accessibility).
const StarRating = ({ rating = 0, size = "sm", showCount, count }) => {
  const s = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  const rounded = Math.round(rating);
  const hasCount = typeof count === "number";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`${s} ${i <= rounded ? "text-oko-brass" : "text-oko-stone-line dark:text-oko-line-dark"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      {showCount && (
        <span className="font-inter text-[11.5px] text-oko-stone">
          {count ? `${count} review${count !== 1 ? "s" : ""}` : "No reviews"}
        </span>
      )}
      <span className="sr-only">
        {rating > 0
          ? `Rated ${rating} out of 5${hasCount ? `, ${count} reviews` : ""}`
          : "No reviews"}
      </span>
    </span>
  );
};

export default StarRating;
