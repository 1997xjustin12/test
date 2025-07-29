import "@/app/globals.css";
import Nav from "@/app/components/admin/NavBar";
import SideNav from "@/app/components/admin/SideBar";
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
  
  // const defaultKey = keys.default_shopify_menu.value;
  const defaultKey = keys.dev_shopify_menu.value;
  const mgetKeys = [defaultKey];
  const [menu] = await redis.mget(mgetKeys);

  return (
    <html lang="en">
      <body className={`antialiased ${MontserratFont.className} bg-slate-50`}>
        <CategoriesProvider categories={menu}>
          <Nav />
          <div className="flex">
            <SideNav />
            <div className="mt-20 ml-64 w-full">{children}</div>
          </div>
        </CategoriesProvider>
      </body>
    </html>
  );
}
