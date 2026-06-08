import { ISBBQ } from "@/app/lib/helpers";
import NewProfessionalProgramPage from "@/app/components/new-design/page/ProfessionalProgram";
import BBQProfessionalProgramPage from "@/app/components/bbq-design/page/ProfessionalProgram";

export default function ProfessionalProgramPage() {
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
