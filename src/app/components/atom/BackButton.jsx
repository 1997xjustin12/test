import { useRouter } from "next/navigation";
import { FluentChevronLeft } from "@/app/components/icons/lib";
const BackButton = ({ label = "Back", className = "" }) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back(); // Go back to the previous page
    } else {
      router.push("/"); // Fallback to home if no history
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`pr-[10px] text-white bg-theme-400 hover:bg-theme-500  rounded-full flex items-center gap-[5px] ${className}`}>
      <FluentChevronLeft width={20} height={20} />
      <div>{label}</div>
    </button>
  );
};

export default BackButton;
