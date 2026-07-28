import ResetPassword from "@/app/components/oko-design/form/ResetPassword";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

function ResetPasswordPage({ token, uid }) {
  return (
    <div className="bg-oko-cream dark:bg-oko-night">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-8 py-[50px]">
        <div className="flex justify-center">
          <div className="max-w-[470px] flex flex-col items-center w-full">
            <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream text-center">
              Reset password.
            </h1>
            <div className="my-[20px] w-full">
              <ResetPassword />
            </div>
            <Link
              prefetch={false}
              href={`${BASE_URL}/login`}
              className="font-inter text-[12.5px] font-semibold uppercase tracking-[0.05em] text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
