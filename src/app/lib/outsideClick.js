import { useEffect, useRef } from "react";

export function useOutsideClick(handler, refsToIgnore = []) {
  const mainRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      const clickedInsideAny = [mainRef, ...refsToIgnore].some((ref) =>
        ref.current?.contains(e.target)
      );

      if (!clickedInsideAny) {
        handler();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler, refsToIgnore]);

  return mainRef;
}