"use client";
import { useState, useEffect } from "react";
import { MDIPropaneTank, MDIBaselineGasMeter } from "../icons/lib";
const subLabels = [
  {
    option_label: "NG",
    value: "Natural Gas",
    icon: <MDIBaselineGasMeter width={36} height={36} />,
  },
  {
    option_label: "LP",
    value: "Liquid Propane",
    icon: <MDIPropaneTank width={36} height={36} />,
  },
];
export default function ProductOption({ option }) {
  const [icon, setIcon] = useState(null);
  const [subLabel, setSubLabel] = useState(null);

  useEffect(() => {
    if (option) {
      setSubLabel(
        subLabels.find(
          ({ option_label }) => option_label === option.option_label
        )?.value
      );

      setIcon(
        subLabels.find(
          ({ option_label }) => option_label === option.option_label
        )?.icon
      );
      // console.log(
      //   "subLabel",
      //   subLabels.find(
      //     ({ option_label }) => option_label === option.option_label
      //   )?.value
      // );
    }
  }, [option]);
  return (
    <button
      className={`border rounded-md shadow-sm pl-[10px] pr-[25px] py-[10px] flex items-center ${
        option?.is_checked
          ? "border-theme-500 bg-theme-400 opacity-100 text-white"
          : "text-stone-600"
      }`}>
      {icon && <div>{icon}</div>}
      <div className="text-left">
        <div>{option?.option_label}</div>
        {subLabel && <div className="text-xs">{subLabel}</div>}
      </div>
    </button>
  );
}
