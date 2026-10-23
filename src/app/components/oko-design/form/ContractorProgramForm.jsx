"use client";

// OKO's Professional Program application. Behaviour is shared
// (molecule/ContractorProgramForm); this passes OKO's styles, per
// oko-design-patterns.md: one 2px-cornered catalog card, mono eyebrows over
// hairline rules for sections, Inter uppercase labels, cream inputs, barn for
// errors and the CTA, sage for success, stroke icons and no emoji.
import ContractorProgramFormBase from "@/app/components/molecule/ContractorProgramForm";

const errorPanel =
  "rounded-[2px] border border-oko-barn bg-white p-4 font-inter text-[13.5px] text-oko-barn dark:border-oko-barn-light dark:bg-oko-night-3 dark:text-oko-barn-light";

const classes = {
  form: "rounded-[2px] border border-oko-stone-line bg-white p-5 sm:p-8 dark:border-oko-line-dark dark:bg-oko-night-2",
  section: "min-w-0",
  legend: "mb-5 w-full border-b border-oko-stone-line pb-2 font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:border-oko-line-dark dark:text-oko-barn-light",
  optional: "font-inter normal-case tracking-normal text-oko-stone",
  label: "mb-1.5 block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone dark:text-oko-ondark-faint",
  required: "text-oko-barn dark:text-oko-barn-light",
  hint: "mt-1.5 font-inter text-[12px] text-oko-stone dark:text-oko-ondark-faint",
  input:
    "w-full rounded-[2px] border border-oko-stone-line bg-oko-cream-dim px-4 py-3 font-inter text-[14px] text-oko-char placeholder-oko-stone outline-none transition-colors focus:border-oko-barn dark:border-oko-line-dark dark:bg-oko-night-3 dark:text-oko-cream dark:focus:border-oko-barn-light",
  inputError: "!border-oko-barn dark:!border-oko-barn-light",
  error: "mt-1.5 font-inter text-[12px] font-medium text-oko-barn dark:text-oko-barn-light",
  captchaImage: "h-[70px] w-[200px] rounded-[2px] border border-oko-stone-line bg-white dark:border-oko-line-dark",
  iconButton:
    "flex h-[34px] w-[34px] items-center justify-center rounded-[2px] border border-oko-stone-line text-oko-stone transition-colors hover:border-oko-char hover:text-oko-char dark:border-oko-line-dark dark:text-oko-ondark-muted dark:hover:border-oko-cream dark:hover:text-oko-cream",
  button:
    "w-full rounded-[2px] bg-oko-barn px-8 py-3 font-inter text-[13.5px] font-semibold text-white transition-colors hover:bg-oko-barn-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
  note: "font-inter text-[12px] text-oko-stone dark:text-oko-ondark-faint",
  summary: errorPanel,
  summaryTitle: "font-semibold",
  summaryLink: "text-left text-oko-char underline underline-offset-2 hover:text-oko-barn dark:text-oko-ondark dark:hover:text-oko-barn-light",
  failure: errorPanel,
  success: "flex items-start gap-3 rounded-[2px] border border-oko-sage bg-white p-6 dark:border-oko-sage-light dark:bg-oko-night-2",
  successIcon: "text-oko-sage dark:text-oko-sage-light",
  successTitle: "font-oko-display text-[22px] font-semibold leading-[1.2] text-oko-char dark:text-oko-cream",
  successText: "mt-1 font-inter text-[13.5px] leading-relaxed text-oko-char-soft dark:text-oko-ondark",
};

export default function ContractorProgramForm() {
  return <ContractorProgramFormBase classes={classes} />;
}
