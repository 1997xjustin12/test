"use client";

// Shown when a product can't be loaded right now (Elasticsearch or the backend
// failed). fetchProduct throws rather than caching "not found" for a day, so
// this is temporary: "Try again" (retry) re-fetches the page from the server.
import { useEffect } from "react";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const STYLES = ISOKO
  ? {
      wrap: "font-inter",
      title: "font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream",
      text: "font-inter text-[13.5px] leading-relaxed text-oko-char-soft dark:text-oko-ondark",
      button: "px-8 py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors",
      link: "font-semibold text-oko-sage dark:text-oko-sage-light hover:text-oko-barn transition-colors",
    }
  : ISBBQ
    ? {
        wrap: "font-sora",
        title: "font-oswald font-bold text-2xl sm:text-3xl uppercase tracking-tight text-char dark:text-ash",
        text: "text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400",
        button: "px-6 py-2.5 bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm transition-colors",
        link: "font-semibold text-theme-600 hover:underline",
      }
    : {
        wrap: "",
        title: "font-serif text-3xl text-charcoal dark:text-white",
        text: "text-sm leading-relaxed text-stone-500 dark:text-stone-400",
        button: "px-7 py-3 rounded-lg bg-theme-600 hover:bg-theme-500 text-white font-semibold transition-colors",
        link: "font-semibold text-theme-600 hover:underline",
      };

export default function ProductError({ error, retry }) {
  useEffect(() => {
    console.error("Product page failed to load:", error);
  }, [error]);

  return (
    <div className={`mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center ${STYLES.wrap}`}>
      <h1 className={STYLES.title}>We couldn&apos;t load this product</h1>
      <p className={`mt-3 ${STYLES.text}`}>
        Something went wrong on our side. It&apos;s usually brief, so please try again in a moment.
        {STORE_CONTACT ? (
          <>
            {" "}You can also call us at{" "}
            <a href={`tel:${STORE_CONTACT}`} className={STYLES.link}>{STORE_CONTACT}</a>.
          </>
        ) : null}
      </p>
      <button type="button" onClick={() => retry()} className={`mt-6 ${STYLES.button}`}>
        Try again
      </button>
    </div>
  );
}
