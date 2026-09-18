"use client";
import { useEffect, useRef } from "react";

/**
 * Fades a block in when it scrolls into view — the same effect as the
 * useReveal() hook, as a wrapper instead of a hook.
 *
 * The difference matters for what the browser has to download. useReveal() is
 * a hook, so any section using it had to be a client component, and eight
 * sections were client components for the animation alone: their markup, their
 * icons and their data all shipped to the browser and hydrated. Passing them
 * through this wrapper keeps those sections on the server — children rendered
 * by a server component and handed to a client component stay server-rendered,
 * and their code never reaches the browser. Only this file does.
 *
 * Children must not be interactive: anything with state or handlers belongs in
 * its own client component.
 *
 * Usage mirrors what the hook's call sites already wrote by hand:
 *   <Reveal className="opacity-0 translate-y-6 transition-all duration-700">
 */
export default function Reveal({ as: Tag = "div", className, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Nothing to observe with: show the content rather than leave it at
    // opacity-0 (the class the call site starts from).
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("opacity-100", "translate-y-0");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
