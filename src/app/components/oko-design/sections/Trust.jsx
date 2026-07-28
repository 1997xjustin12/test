// 8.6 Trust strip — four items, border-left dividers (except first) on desktop.
// 2x2 at ≤1024 (border-top on second row instead of border-left), stacked at
// ≤560. 18px barn stroke icons, 12.5px/500 labels.

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 2l2.4 6.6L21 10l-5 4.3L17.5 21 12 17.3 6.5 21 8 14.3 3 10l6.6-1.4z" />
  </svg>
);
const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="1" y="7" width="15" height="10" rx="1" />
    <path d="M16 10h4l3 3v4h-7z" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="19" r="2" />
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Per-index border rules across the three breakpoints (<560 stacked, 560 2x2,
// lg 4-in-a-row). Base border color applied on the wrapper.
const TRUST_ITEMS = [
  { Icon: StarIcon, label: "Price match guaranteed", border: "" },
  { Icon: TruckIcon, label: "Free shipping sitewide", border: "border-t min-[560px]:border-t-0 min-[560px]:border-l lg:pl-5 min-[560px]:pl-5" },
  { Icon: CheckIcon, label: "30+ top brands in stock", border: "border-t lg:border-t-0 lg:border-l lg:pl-5" },
  { Icon: PhoneIcon, label: "Concierge phone ordering", border: "border-t min-[560px]:border-l lg:border-t-0 lg:pl-5 min-[560px]:pl-5" },
];

export default function Trust() {
  return (
    <div className="bg-white dark:bg-oko-night border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 py-5">
          {TRUST_ITEMS.map(({ Icon, label, border }) => (
            <div
              key={label}
              className={`flex items-center gap-3 py-3 min-[560px]:py-2.5 lg:py-0 border-oko-stone-line dark:border-oko-line-dark ${border}`}
            >
              <span className="text-oko-barn dark:text-oko-barn-light flex-shrink-0">
                <Icon />
              </span>
              <span className="font-inter text-[12.5px] font-medium text-oko-char-soft dark:text-oko-ondark">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
