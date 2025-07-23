import "@/app/globals.css";
import Nav from "@/app/components/admin/NavBar";
import SideNav from "@/app/components/admin/SideBar";

import { Montserrat } from "next/font/google";
const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat", // Optional for Tailwind usage
});

export const metadata = {
  title: "Admin Solana",
};
export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${MontserratFont.className} bg-slate-50`}>
        <Nav />
        {/* <div className="flex">
          <SideNav />
          <div className="mt-20 ml-64 bg-red-500 w-full">{children}</div>
        </div> */}
        <div className="w-full mt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
