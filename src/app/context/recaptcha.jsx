"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ReCaptchaContext = createContext(null);

export function GoogleReCaptchaProvider({ reCaptchaKey, children }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!reCaptchaKey) {
      console.error("reCAPTCHA site key is not provided");
      return;
    }

    // Check if script is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${reCaptchaKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
    };

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(
        `script[src*="google.com/recaptcha"]`
      );
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
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
