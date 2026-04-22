const SectionHeading = ({ children, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <span className="block w-1 h-5 bg-orange-500 rounded-full flex-shrink-0" />
      <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
        {children}
      </h2>
    </div>
    {action}
  </div>
);

export default SectionHeading;
