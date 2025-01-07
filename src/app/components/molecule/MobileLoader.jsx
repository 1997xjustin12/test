"use client";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import Loader from "../../loading";
export default function MobileLoader() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // if (isMobile) {
    // Simulate loading behavior
    const timer = setTimeout(() => setIsLoading(false), 2000); // Adjust duration as needed
    return () => clearTimeout(timer);
    // } else {
    //   setIsLoading(false);
    // }
  }, []);

  return <>{isLoading && <Loader />}</>;
}
