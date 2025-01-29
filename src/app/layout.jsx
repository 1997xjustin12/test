import { Inter, Bellefair, Montserrat } from "next/font/google";
import "./globals.css";
import FixedHeader from "./components/template/fixed_header";
import TuiNavBar from "./components/template/tui_navbar";
import FreeShippingBanner from "@/app/components/molecule/FreeShippingBanner";
import Footer from "@/app/components/section/Footer";

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Specify weights as needed
// });
// const bell = Bellefair({
//   subsets: ["latin"],
//   weight: ["400"], // Specify weights as needed
// });

const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat", // Optional for Tailwind usage
});

export const metadata = {
  title: "Solana Fireplaces | Stylish Indoor & Outdoor Heating",
  description:
    "Transform your home with Solana Fireplaces! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${MontserratFont.className} antialiased`}>
        <FreeShippingBanner />
        <div className="hidden lg:block bg-pallete-orange py-[8px] px-[30px] text-white">
          <div className="container mx-auto  flex items-center justify-between">
            <div className="flex justify-between w-full">
              <div className="font-light text-xs">Promotions</div>
              <div className="font-light text-xs">Learning Center</div>
              <div className="font-light text-xs">Professional Program</div>
              <div className="font-light text-xs">Order Status</div>
              <div className="font-light text-xs">
                Why Buy From The Expert In Fire?
              </div>
            </div>
          </div>
        </div>
        <TuiNavBar />
        <FixedHeader></FixedHeader>
        {children}
        <Footer />
      </body>
    </html>
  );
}
