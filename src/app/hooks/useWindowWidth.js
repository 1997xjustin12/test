import { useState, useEffect } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0); // Initialize to 0 or a default value

  useEffect(() => {
    // Check if `window` is available
    if (typeof window !== "undefined") {
      const handleResize = () => setWidth(window.innerWidth);

      // Set initial width
      setWidth(window.innerWidth);

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Cleanup on component unmount
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return width;
};
