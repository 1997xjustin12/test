import "@/app/globals.css";
import Nav from "@/app/components/brand/Nav";
import Footer from "@/app/components/brand/Footer";

import { Montserrat } from "next/font/google";
const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat", // Optional for Tailwind usage
});

export const metadata = {
  title: "Developer Solana",
};
export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased ${MontserratFont.className} bg-zinc-50`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
