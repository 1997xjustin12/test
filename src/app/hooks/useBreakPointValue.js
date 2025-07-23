// import { useMediaQuery } from "react-responsive";

import { useWindowWidth } from "@/app/hooks/useWindowWidth";
export const useBreakpointValue = (breakpoints) => {
  const width = useWindowWidth();

  return breakpoints
    .sort((a, b) => b.minWidth - a.minWidth)
    .find(({ minWidth }) => minWidth < width)?.value;
};
