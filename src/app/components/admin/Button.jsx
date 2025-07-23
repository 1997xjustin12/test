'use client';
import { Eos3DotsLoading } from "@/app/components/icons/lib";

function Button({children, loading=true, disabled, onClick, variant = 'blue'}) {
  const variantColors = {
    red: "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
    blue: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    teal: "bg-teal-700 hover:bg-teal-800 focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800",
  };

  const buttonClassName= `${variantColors[variant]} h-[40px] min-w-[90] flex items-center  justify-center text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center  relative`;
 return (
    <button
    onClick={onClick}
    disabled={disabled===true || loading===true}
    className={buttonClassName}
>
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading === true? 'visible':'invisible'}`}>
    <Eos3DotsLoading width={50} height={50} />
    </div>
    <span className={loading===true ? 'invisible': 'visible'}>{children}</span></button>
  )
}

export default Button