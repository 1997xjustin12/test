"use client";

// BBQ's Professional Program application. Behaviour is shared
// (molecule/ContractorProgramForm); this passes BBQ's styles, per
// bbq-design-patterns.md: near-square rounded-sm everywhere, paper/smoke
// cards on grate borders, Oswald uppercase for headings, labels and buttons,
// Sora for inputs and body copy.
import ContractorProgramFormBase from "@/app/components/molecule/ContractorProgramForm";

const errorPanel =
  "rounded-sm border border-red-200 bg-red-50 px-3.5 py-3 font-sora text-xs font-medium text-red-600 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400";

const classes = {
  form: "font-sora",
  section: "min-w-0 rounded-sm border border-grate bg-paper p-5 sm:p-6 dark:border-white/10 dark:bg-smoke",
  legend: "float-left mb-5 w-full border-l-[3px] border-theme-600 pl-3 font-oswald text-base font-bold uppercase leading-tight tracking-wide text-char dark:text-ash",
  optional: "font-sora text-xs font-light normal-case tracking-normal text-stone-500 dark:text-stone-400",
  label: "mb-1.5 block font-oswald text-[11px] font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-400",
  required: "text-theme-600",
  hint: "mt-1.5 text-xs font-light text-stone-500 dark:text-stone-400",
  input:
    "w-full rounded-sm border border-stone-200 bg-white px-3.5 py-2.5 font-sora text-sm text-charcoal placeholder:text-stone-400 transition-colors focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/20 dark:border-stone-700 dark:bg-char dark:text-white dark:placeholder:text-stone-500",
  inputError: "!border-red-500 focus:!ring-red-500/20 dark:!border-red-500/70",
  error: "mt-1.5 text-xs font-medium text-red-600 dark:text-red-400",
  captchaImage: "h-[70px] w-[200px] rounded-sm border border-grate bg-white dark:border-white/10",
  iconButton:
    "flex h-10 w-10 items-center justify-center rounded-sm border border-grate bg-white text-stone-500 transition-colors hover:border-theme-600 hover:text-theme-600 dark:border-white/10 dark:bg-char dark:text-stone-400",
  button:
    "w-full rounded-sm bg-theme-600 px-8 py-3 font-oswald text-sm font-semibold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-theme-700 active:scale-[.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
  note: "text-xs font-light text-stone-500 dark:text-stone-400",
  summary: errorPanel,
  summaryTitle: "font-oswald text-sm font-semibold uppercase tracking-wide",
  summaryLink: "text-left underline underline-offset-2 hover:no-underline",
  failure: errorPanel,
  success: "flex items-start gap-3 rounded-sm border border-bbq-green/30 bg-paper p-6 dark:border-bbq-green/40 dark:bg-smoke",
  successIcon: "text-bbq-green",
  successTitle: "font-oswald text-lg font-bold uppercase tracking-tight text-char dark:text-ash",
  successText: "mt-1 text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400",
};

export default function ContractorProgramForm() {
  return <ContractorProgramFormBase classes={classes} />;
}
