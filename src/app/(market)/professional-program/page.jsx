import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewProfessionalProgramPage from "@/app/components/new-design/page/ProfessionalProgram";
import BBQProfessionalProgramPage from "@/app/components/bbq-design/page/ProfessionalProgram";
import OKOProfessionalProgramPage from "@/app/components/oko-design/page/ProfessionalProgram";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/professional-program");

export default function ProfessionalProgramPage() {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <OKOProfessionalProgramPage />
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQProfessionalProgramPage />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <NewProfessionalProgramPage />
    </div>
  );
}
