// "use client";
// import { useState, useEffect } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
// import LoaderIcon from "./LoaderIcon";
// export default function PageLoader() {
//   const [isVisible, setIsVisible] = useState(false);
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [loadingFlag, setLoadingFlag] = useState(false);

//   useEffect(() => {
//     const url = `${pathname}?${searchParams}`;
//     setLoadingFlag((prev) => !prev);
//     // ...
//   }, [pathname, searchParams]);

//   useEffect(() => {
//     console.log("triggered LOADING");
//     setIsVisible(true); // Show the component initially
//     document.body.style.overflow = "hidden";
//     const timer = setTimeout(() => {
//       document.body.style.overflow = "";
//       setIsVisible(false); // Hide the component after 5 seconds
//     }, 2000);

//     return () => {
//       clearTimeout(timer); // Cleanup the timer on unmount
//       document.body.style.overflow = ""; // Cleanup on unmount
//     };
//   }, [loadingFlag]);

//   return (
//     <>
//       {isVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
//           <div className="text-center">
//             <LoaderIcon width="200" height="200" dark={false} />
//             <div className="text-stone-300 text-3xl">Loading...</div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
