const TRUST_ITEMS = [
  { icon: '🚚', title: 'Free Shipping $499+',         sub: 'Ships in 1–2 business days' },
  { icon: '🏷️', title: 'Price-Match Guarantee',       sub: 'Found it cheaper? We\'ll match it' },
  { icon: '🛡️', title: 'Full Manufacturer Warranty',  sub: 'Authorized dealer on every brand' },
  { icon: '↩️', title: 'Easy 30-Day Returns',         sub: 'Hassle-free refund policy' },
]

export default function TrustStrip() {
  return (
    <div className="bg-char">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
        {TRUST_ITEMS.map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 px-4 py-4 text-ash">
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <b className="font-oswald text-sm tracking-wide block">{title}</b>
              <span className="text-xs text-stone-500">{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
