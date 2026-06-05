import { ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

import { notFound } from "next/navigation";

import NewResetPassword from "@/app/components/new-design/page/ResetPassword";
import BBQResetPassword from "@/app/components/bbq-design/page/ResetPassword";

export const metadata = {
  title: `Reset Password | ${STORE_NAME}`,
};

const wrapperClass = "min-h-svh py-10 px-4 sm:px-6";

const ThemeComponent = ({ token, uid }) => {
  if (ISBBQ) {
    return (
      <div className={`${wrapperClass} bg-stone-50 dark:bg-stone-950`}>
        <BBQResetPassword token={token} uid={uid} />
      </div>
    );
  }
  return (
    <div className={`${wrapperClass} bg-stone-50 dark:bg-stone-950`}>
      <NewResetPassword token={token} uid={uid} />
    </div>
  );
};

async function ResetPasswordPage({ params }) {
  const { token, uid } = await params;

  if (!token || !uid) notFound();

  return <ThemeComponent token={token} uid={uid} />;
}

export default ResetPasswordPage;
