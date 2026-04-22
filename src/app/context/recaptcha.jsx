"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ReCaptchaContext = createContext(null);

export function GoogleReCaptchaProvider({ reCaptchaKey, children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!reCaptchaKey) return;

    const loadScript = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => setIsReady(true));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${reCaptchaKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => window.grecaptcha.ready(() => setIsReady(true));
      document.head.appendChild(script);
    };

    // Defer until browser is idle so it doesn't compete with LCP/FID
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadScript, { timeout: 4000 });
    } else {
      setTimeout(loadScript, 3000);
    }
  }, [reCaptchaKey]);

  const executeRecaptcha = useCallback(
    async (action) => {
      if (!isReady || !window.grecaptcha) {
        throw new Error("reCAPTCHA is not ready");
      }

      try {
        const token = await window.grecaptcha.execute(reCaptchaKey, { action });
        return token;
      } catch (error) {
        console.error("reCAPTCHA execution error:", error);
        throw error;
      }
    },
    [isReady, reCaptchaKey]
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
