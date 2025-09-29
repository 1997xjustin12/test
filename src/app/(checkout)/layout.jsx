import "@/app/globals.css";
import { redis, keys, redisGet } from "@/app/lib/redis";
import Link from "next/link";
import Image from "next/image";
import {
  Inter,
  Libre_Baskerville,
  Playfair_Display,
  Playfair,
  Playfair_Display_SC,
} from "next/font/google";
// import localFont from "next/font/local";
import FixedHeader from "@/app/components/template/fixed_header";
// import TuiNavBar from "@/app/components/template/tui_navbar"; // uncomment for bigcommerce structure
import TuiNavBar from "@/app/components/template/tui_navbarV3"; // uncomment for shopify structure
import FreeShippingBanner from "@/app/components/molecule/FreeShippingBanner";
import Footer from "@/app/components/section/Footer";
import { AuthProvider } from "@/app/context/auth";
import { CartProvider } from "@/app/context/cart";
import { QuickViewProvider } from "@/app/context/quickview";
import { SearchProvider } from "@/app/context/search";
import { CategoriesProvider } from "@/app/context/category";
import { CompareProductsProvider } from "@/app/context/compare_product";
import { generateMetadata } from "@/app/metadata";
import SessionWrapper from "@/app/components/wrapper/SessionWrapper"; // 👈 You'll create this file
import ExtrasHeader from "@/app/components/atom/ExtrasHeader";
import { BASE_URL } from "../lib/helpers";
const shopify = true; // if shopify product structure

const InterFont = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"], // Available weights: 400 (regular), 700 (bold)
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre-baskerville",
});

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-playfair",
});

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair-display",
});

const playfair_display_sc = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-playfair-display-sc",
});
// add playfair_display font
// add
export const metadata = await generateMetadata();

const Header = ({ logo }) => {
  return (
    <section className="border-b border-neutral-300 shadow">
      <div className="container mx-auto px-5">
        <div className="min-h-[130px] flex items-center justify-between">
          <div className="w-[180px] aspect-[191/94] relative">
            <Image
              src={logo || `/Logo.webp`}
              alt="Logo"
              fill
              objectFit="contain"
            />
          </div>
          <div>
            <Link
              prefetch={false}
              href={`${BASE_URL}/cart`}
              className="border p-3 shadow rounded-[4px] font-bold text-white bg-theme-600 hover:bg-theme-700"
            >
              BACK TO CART
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default async function CheckoutLayout({ children }) {
  const redisLogoKey = keys.logo.value;
  const themeKey = keys.theme.value;
  const mgetKeys = [redisLogoKey, themeKey];
  const [redisLogo, color] = await redis.mget(mgetKeys);
  return (
    <html lang="en">
      <body
        className={`antialiased ${InterFont.className} ${libreBaskerville.variable} ${playfair.variable} ${playfair_display.variable} ${playfair_display_sc.variable} theme-${color}`}
      >
        <AuthProvider>
          <CartProvider>
            <Header logo={redisLogo} />
            <div className="flex flex-col min-h-screen">{children}</div>
          </CartProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
