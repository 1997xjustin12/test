import ResetPassword from "@/app/components/form/ResetPassword";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";
export const metadata = {
  title: `Reset Password | ${STORE_NAME}`,
};

function ResetPasswordPage({ params }) {
  const { token, uid } = params;
  return (
    <div className="container mx-auto">
      <div className="px-4 py-[50px]">
        <div className="flex justify-center">
          <div className="max-w-[400px] flex flex-col items-center">
            <h2 className="font-extrabold mb-5">Reset your password</h2>
            <div className="my-[20px] w-full">
              <ResetPassword token={token} uid={uid} />
            </div>
            <Link
              prefetch={false}
              href={`${BASE_URL}/login`}
              className="text-theme-600 hover:underline block text-sm font-bold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
