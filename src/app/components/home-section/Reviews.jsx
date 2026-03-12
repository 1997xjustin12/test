import { Star } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const REVIEWS = [
  {
    id: 1,
    name: "James M.",
    location: "Phoenix, AZ",
    rating: 5,
    avatar: "J",
    avatarBg: "from-orange-500 to-red-700",
    text: "The team at Solana helped me choose the perfect linear gas fireplace for our renovation. The process was seamless and the installation guidance was invaluable. Absolutely love the result!",
    product: "Napoleon Ascent 60 Linear",
  },
  {
    id: 2,
    name: "Sara R.",
    location: "Austin, TX",
    rating: 5,
    avatar: "S",
    avatarBg: "from-blue-600 to-blue-800",
    text: "Fast shipping, great prices, and the open-box deal I got on an outdoor fire pit was incredible. Saved nearly $400 on a premium product. Highly recommend Solana to anyone.",
    product: "Hearth & Home Fire Pit Table",
  },
  {
    id: 3,
    name: "Derek K.",
    location: "Denver, CO",
    rating: 5,
    avatar: "D",
    avatarBg: "from-emerald-500 to-emerald-700",
    text: "As a contractor, the professional program has been a game-changer. Dedicated support, contractor pricing, and products that my clients love. Solana is our go-to for every project.",
    product: "Lynx Professional 54\" Grill",
  },
  {
    id: 4,
    name: "Michelle T.",
    location: "Scottsdale, AZ",
    rating: 5,
    avatar: "M",
    avatarBg: "from-purple-500 to-purple-800",
    text: "I was nervous ordering a fireplace online but Solana made it so easy. Their experts walked me through everything and the product arrived perfectly packaged. Will definitely order again.",
    product: "Dimplex Revillusion 36\"",
  },
  {
    id: 5,
    name: "Robert L.",
    location: "Dallas, TX",
    rating: 4,
    avatar: "R",
    avatarBg: "from-amber-500 to-orange-600",
    text: "Great selection and competitive prices. Customer service was very responsive when I had questions about installation clearances. The fireplace looks stunning in our living room.",
    product: "Regency City Series 40\"",
  },
  {
    id: 6,
    name: "Linda C.",
    location: "Las Vegas, NV",
    rating: 5,
    avatar: "L",
    avatarBg: "from-rose-500 to-rose-700",
    text: "Ordered the outdoor kitchen package and couldn't be happier. Everything arrived on time, the quality is outstanding, and the Solana team was helpful every step of the way.",
    product: "Blaze 32\" 4-Burner Grill",
  },
];

const OVERALL_RATING = 4.4;
const TOTAL_REVIEWS = 122;

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={
            s <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-stone-200 text-stone-200"
          }
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// REVIEW CARD
// ─────────────────────────────────────────

function ReviewCard({ name, location, rating, avatar, avatarBg, text, product }) {
  return (
    <article
      className="relative flex flex-col bg-white rounded-2xl p-5 sm:p-6
                 shadow-md hover:shadow-xl transition-shadow duration-300
                 overflow-hidden"
    >
      {/* Large decorative quote mark */}
      <span
        aria-hidden="true"
        className="absolute top-1 left-4 font-serif text-7xl sm:text-8xl
                   text-orange-500/10 leading-none select-none pointer-events-none"
      >
        &ldquo;
      </span>

      {/* Stars */}
      <div className="mb-3 relative z-10">
        <StarRating rating={rating} size={13} />
      </div>

      {/* Review text */}
      <p className="text-stone-600 text-sm sm:text-[0.9rem] leading-relaxed
                    flex-1 mb-4 relative z-10">
        &ldquo;{text}&rdquo;
      </p>

      {/* Product tag */}
      <p className="text-[0.65rem] sm:text-xs font-medium text-orange-500
                    bg-orange-50 border border-orange-100 rounded-full
                    px-2.5 py-1 self-start mb-4">
        {product}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
        {/* Avatar */}
        <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full
                         bg-gradient-to-br ${avatarBg}
                         flex items-center justify-center
                         text-white font-bold text-sm sm:text-base`}>
          {avatar}
        </div>
        <div>
          <p className="text-stone-900 font-semibold text-sm leading-tight">
            {name}
          </p>
          <p className="text-stone-400 text-xs mt-0.5">{location}</p>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-[#FAF7F4] py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em]
                        uppercase text-orange-500 mb-2 sm:mb-3">
            Customer Reviews
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl
                         text-stone-900 leading-tight mb-5 sm:mb-6">
            What Our Customers Say
          </h2>

          {/* Overall rating summary */}
          <div className="inline-flex items-center gap-3 sm:gap-4
                          bg-white rounded-2xl shadow-md
                          px-5 sm:px-7 py-3.5 sm:py-4">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 leading-none">
              {OVERALL_RATING}
            </span>
            <div className="flex flex-col items-start gap-1">
              <StarRating rating={Math.round(OVERALL_RATING)} size={18} />
              <p className="text-stone-400 text-xs sm:text-sm">
                Based on{" "}
                <span className="font-semibold text-stone-600">
                  {TOTAL_REVIEWS} verified reviews
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Reviews Grid
              • Mobile  : 1 col
              • sm      : 2 cols
              • lg      : 3 cols
        ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="text-center mt-10 sm:mt-12">
          <a
            href="https://www.google.com/search?q=solana+fireplaces+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold
                       text-stone-500 hover:text-orange-500
                       transition-colors duration-200 underline underline-offset-4"
          >
            View all reviews on Google
          </a>
        </div>

      </div>
    </section>
  );
}