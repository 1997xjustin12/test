
const ITEMS = [
  { icon: "🚚", title: "Free Shipping",  sub: "On selected orders" },
  { icon: "💬", title: "Expert Support", sub: "Talk to a specialist" },
  { icon: "🔄", title: "Easy Returns",   sub: "Hassle-free policy" },
  { icon: "🏷️", title: "Best Prices",    sub: "Price match guarantee" },
];

export default function Features() {
  return (
    <div className="bg-charcoal dark:bg-black py-8">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="
          grid
          grid-cols-2 gap-px md:grid-cols-4
          bg-white/5 dark:bg-white/5
          rounded-xl overflow-hidden
        ">
          {ITEMS.map(({ icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 px-6 py-5 bg-charcoal dark:bg-black">
              <div className="w-10 h-10 rounded-xl bg-fire/15 flex items-center justify-center text-xl flex-shrink-0">
                {icon}
              </div>
              <div>
                <strong className="block text-white text-sm">{title}</strong>
                <span className="text-white/40 text-xs">{sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
