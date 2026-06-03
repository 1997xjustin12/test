const SectionHeading = ({ children, action }) => (
  <div className="flex items-center justify-between mb-5">
    <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
      {children}
    </p>
    {action}
  </div>
);

export default SectionHeading;
