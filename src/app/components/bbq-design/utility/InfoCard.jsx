const InfoCard = ({ icon, title, children, accent }) => (
  <div className={`w-full rounded-2xl p-6 border ${accent ? "border-theme-600 dark:border-theme-900/50" : "border-gray-200 dark:border-gray-800"} bg-white dark:bg-gray-900`}>
    {icon && <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl bg-theme-600">{icon}</div>}
    {title && <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base">{title}</h3>}
    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
  </div>
);

export default InfoCard;