import "@/app/globals.css";
import "@smastrom/react-rating/style.css";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import AdminContent from "@/app/components/admin/AdminContent";
import { getAdminUser, isDevBypass } from "@/app/lib/admin-auth";
import { redis, keys } from "@/app/lib/redis";
import { CategoriesProvider } from "@/app/context/category";

import { Montserrat } from "next/font/google";
const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat", // Optional for Tailwind usage
});

export const metadata = {
  title: "Page Configurator",
};
export default async function AdminLayout({ children }) {
  // Second, independent gate. proxy.js already refuses non-admins at the edge;
  // this repeats the check where it cannot be bypassed by a matcher change or a
  // route that sidesteps the proxy. It runs before the menu read, so a rejected
  // request costs nothing.
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const isAdmin =
    isDevBypass(headerStore.get("host")) ||
    Boolean(await getAdminUser({ cookies: cookieStore }));
  if (!isAdmin) notFound();

  // const defaultKey = keys.default_shopify_menu.value;
  const defaultKey = keys.dev_shopify_menu.value;
  const mgetKeys = [defaultKey];
  const [menu_items] = await redis.mget(mgetKeys);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the stored colour scheme before first paint (no flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("admin-theme");if(t==="dark"||t==="light"){document.documentElement.classList.add(t)}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${MontserratFont.className} bg-zinc-50 dark:bg-zinc-950`}>
        <CategoriesProvider menu_items={menu_items}>
          <AdminContent>
            {children}
          </AdminContent>
        </CategoriesProvider>
      </body>
    </html>
  );
}
