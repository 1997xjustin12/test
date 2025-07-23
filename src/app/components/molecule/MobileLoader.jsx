"use client";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";
import Loader from "../../(market)/loading";
export default function MobileLoader({isLoading}) {
  // const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000); // Adjust duration as needed
  //   return () => clearTimeout(timer);
  // }, []);

  return <>{isLoading && <Loader />}</>;
}
