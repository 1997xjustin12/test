"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const ReCaptchaContext = createContext(null);

/** How long a form waits for the reCAPTCHA script before giving up. */
const READY_TIMEOUT_MS = 10_000;

export function GoogleReCaptchaProvider({ reCaptchaKey, children }) {
  const [isReady, setIsReady] = useState(false);
  // Resolves once grecaptcha is ready. Shared by the idle-time load and any
  // form that needs a token sooner, so the script is only ever added once.
  const readyRef = useRef(null);

  const load = useCallback(() => {
    if (readyRef.current) return readyRef.current;
    readyRef.current = new Promise((resolve, reject) => {
      const done = () => window.grecaptcha.ready(() => { setIsReady(true); resolve(); });
      if (window.grecaptcha?.ready) return done();
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${reCaptchaKey}`;
      script.async = true;
      script.defer = true;
      script.onload = done;
      script.onerror = () => {
        readyRef.current = null; // let a later attempt try again
        reject(new Error("reCAPTCHA failed to load"));
      };
      document.head.appendChild(script);
    });
    return readyRef.current;
  }, [reCaptchaKey]);

  useEffect(() => {
    if (!reCaptchaKey) return;
    // Defer until browser is idle so it doesn't compete with LCP/FID
    const start = () => load().catch(() => {});
    if ("requestIdleCallback" in window) {
      requestIdleCallback(start, { timeout: 4000 });
    } else {
      setTimeout(start, 3000);
    }
  }, [reCaptchaKey, load]);

  /**
   * A token for `action`. If the script hasn't loaded yet it is loaded now and
   * waited for, rather than failing: a returning shopper can type a password
   * and press Sign in before the idle-time load has even started.
   */
  const executeRecaptcha = useCallback(
    async (action) => {
      if (!reCaptchaKey) throw new Error("reCAPTCHA is not configured");
      if (!isReady || !window.grecaptcha) {
        await Promise.race([
          load(),
          new Promise((_, reject) => setTimeout(() => reject(new Error("reCAPTCHA is not ready")), READY_TIMEOUT_MS)),
        ]);
      }

      try {
        const token = await window.grecaptcha.execute(reCaptchaKey, { action });
        return token;
      } catch (error) {
        console.error("reCAPTCHA execution error:", error);
        throw error;
      }
    },
    [isReady, reCaptchaKey, load]
  );

  return (
    <ReCaptchaContext.Provider value={{ executeRecaptcha, isReady }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function useGoogleReCaptcha() {
  const context = useContext(ReCaptchaContext);

  if (context === null) {
    return { executeRecaptcha: null, isReady: false };
  }

  return context;
}
