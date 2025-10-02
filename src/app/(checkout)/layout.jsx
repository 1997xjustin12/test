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
import Footer from "@/app/components/section/Footer";
import { AuthProvider } from "@/app/context/auth";
import { CartProvider } from "@/app/context/cart";
import { generateMetadata } from "@/app/metadata";
import { CartIcon } from "@/app/components/icons/lib";

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
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] flex items-center justify-between py-3">
            <div className="w-[150px] aspect-[191/94] relative">
              <Image
                src={logo || `/Logo.webp`}
                alt="Logo"
                fill
                objectFit="contain"
              />
            </div>
            <div>
              {/* <Link
                prefetch={false}
                href={`${BASE_URL}/cart`}
                className="border py-2 px-10 shadow rounded-[4px] font-bold text-white bg-theme-600 hover:bg-theme-700 text-sm"
              >
                BACK TO CART
              </Link>
               */}
              <Link
                href={`${BASE_URL}/cart`}
                title="Back to cart"
                prefetch={false}
                className={`relative text-theme-600 hover:text-theme-700`}
              >
                <CartIcon width="24" height="24" />
              </Link>
            </div>
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
