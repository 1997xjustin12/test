import { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import FixedHeader from "./components/template/fixed_header";
import TuiNavBar from "./components/template/tui_navbar";
// import PageLoader from "./components/atom/PageLoader";
import { Icon } from "@iconify/react/dist/iconify.js";
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify weights as needed
});

export const metadata = {
  title: "Solana Fireplaces",
  description:
    "Shop high-quality fireplaces, grills, gas stoves, and outdoor heating solutions. Enhance your home or patio with stylish and energy-efficient products. Free shipping and expert advice available!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="bg-[#4C4C53] flex items-center justify-center py-[8px]">
          <div className="text-white mr-[10px] text-[16px]">
            Free shipping on orders over $99
          </div>
          <Icon
            icon="material-symbols-light:delivery-truck-speed"
            width="28"
            height="28"
            className="text-white"
          />
        </div>
        <div className="hidden md:block bg-pallete-orange py-[8px] px-[30px] text-white">
          <div className="container mx-auto  flex items-center justify-between">
            <div className="flex justify-between w-[80%]">
              <div className="font-extralight">Promotions</div>
              <div className="font-extralight">Learning Center</div>
              <div className="font-extralight">Professional Program</div>
              <div className="font-extralight">Order Status</div>
              <div className="font-extralight">
                Why Buy From The Expert In Fire?
              </div>
            </div>
            <div className="w-[20%] text-right">SignIn | SignUp</div>
          </div>
        </div>
        <TuiNavBar />
        <FixedHeader></FixedHeader>
        {children}
        {/* <PageLoader /> */}
      </body>
    </html>
  );
}
