const InfoCard = ({ icon, title, children, accent }) => (
  <div className={`w-full rounded-sm p-6 border bg-paper dark:bg-smoke ${accent ? "border-theme-600 dark:border-theme-600/40" : "border-grate dark:border-white/10"}`}>
    {icon && (
      <div className="w-10 h-10 rounded-sm flex items-center justify-center mb-4 text-xl bg-theme-600">
        {icon}
      </div>
    )}
    {title && (
      <h3 className="font-oswald font-bold text-base uppercase tracking-wide text-char dark:text-ash mb-2">
        {title}
      </h3>
    )}
    <div className="text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400">{children}</div>
  </div>
);

export default InfoCard;
