import { ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";
import NewAbout from "@/app/components/new-design/page/About";
import BBQAbout from "@/app/components/bbq-design/page/About";

export const metadata = {
  title: `About | ${STORE_NAME}`,
};

const wrapperClass = "min-h-svh py-10 px-4 sm:px-6";

const ThemeComponent = () => {
  if (ISBBQ) {
    return (
      <div className={`${wrapperClass} bg-ash dark:bg-char`}>
        <BBQAbout />
      </div>
    );
  }
  return (
    <div className={`${wrapperClass} bg-stone-50 dark:bg-stone-950`}>
      <NewAbout />
    </div>
  );
};

export default function About() {
  return <ThemeComponent />;
}
