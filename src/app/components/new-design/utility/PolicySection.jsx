const PolicySection = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
      <span className="w-1 h-5 rounded-full shrink-0 inline-block bg-theme-600"/>
      {title}
    </h2>
    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3 pl-3">{children}</div>
  </div>
);

export default PolicySection;   