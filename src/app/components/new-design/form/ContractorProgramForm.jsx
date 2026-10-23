"use client";

// Solana's Professional Program application. Behaviour is shared
// (molecule/ContractorProgramForm); this passes Solana's styles, per
// new-design-patterns.md: soft rounded-2xl cards on the gray scale, serif
// section headings, rounded-lg inputs with fire focus and required markers,
// and the lifting primary CTA.
import ContractorProgramFormBase from "@/app/components/molecule/ContractorProgramForm";

const errorPanel =
  "rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-medium text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400";

const classes = {
  form: "",
  section: "min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 dark:border-gray-700 dark:bg-gray-900",
  legend: "float-left mb-5 w-full font-serif text-xl text-charcoal dark:text-white",
  optional: "font-sans text-sm text-stone-400 dark:text-stone-500",
  label: "mb-1.5 block text-xs font-semibold text-stone-600 dark:text-stone-400",
  required: "text-fire",
  hint: "mt-1.5 text-xs text-stone-400 dark:text-stone-500",
  input:
    "w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-stone-400 transition-colors focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/20 dark:border-stone-700 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500",
  inputError: "!border-red-400 focus:!ring-red-500/20 dark:!border-red-500/70",
  error: "mt-1.5 text-xs font-medium text-red-600 dark:text-red-400",
  captchaImage: "h-[70px] w-[200px] rounded-lg border border-stone-200 bg-white dark:border-stone-700",
  iconButton:
    "flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition-colors hover:border-orange-300 hover:text-orange-600 dark:border-stone-700 dark:text-stone-400 dark:hover:border-orange-800 dark:hover:text-orange-500",
  button:
    "w-full rounded-lg bg-theme-600 px-7 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-theme-500 hover:shadow-lg disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:w-auto",
  note: "text-xs text-gray-400 dark:text-gray-500",
  summary: errorPanel,
  summaryTitle: "text-sm font-semibold",
  summaryLink: "text-left underline underline-offset-2 hover:no-underline",
  failure: errorPanel,
  success: "flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800/50 dark:bg-green-950/30",
  successIcon: "text-green-600 dark:text-green-400",
  successTitle: "font-serif text-xl text-charcoal dark:text-white",
  successText: "mt-1 text-sm text-gray-600 dark:text-gray-300",
};

export default function ContractorProgramForm() {
  return <ContractorProgramFormBase classes={classes} />;
}
