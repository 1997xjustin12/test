const Badge = ({ children, variant = "orange" }) => {
  const variants = {
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span
      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase ${variants[variant]}`}
    >
      {children}
    </span>
  );
};


export default Badge;