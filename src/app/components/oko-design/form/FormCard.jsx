import React from "react";

function FormCard({ children }) {
  return (
    <div className="bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark overflow-hidden">
      {children}
    </div>
  );
}

export default FormCard;
