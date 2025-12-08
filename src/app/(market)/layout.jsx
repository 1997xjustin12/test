import "@/app/globals.css";
import "@smastrom/react-rating/style.css";
import { redis, keys, redisGet } from "@/app/lib/redis";
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
import SessionWrapper from "@/app/components/wrapper/SessionWrapper";
import ExtrasHeader from "@/app/components/atom/ExtrasHeader";
import { GoogleReCaptchaProvider } from "@/app/context/recaptcha";

import Script from "next/script";

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

const init = async () => {
  try {
    const redisLogoKey = "admin_solana_market_logo";
    const defaultKey = keys.dev_shopify_menu.value;
    const themeKey = keys.theme.value;
    const mgetKeys = [defaultKey, redisLogoKey, themeKey];
    return await redis.mget(mgetKeys);
  } catch (err) {
    console.warn("[init]", err);
    console.log("[init]", err);
    return null;
  }
};

export const dynamic = "force-dynamic";

export default async function MarketLayout({ children }) {
  const deskHeadFootHeight = 656; //px
  const init_data = await init();

  if (!init_data) {
    return (
      <html lang="en">
        <body className="flex items-center justify-center h-screen w-screen">
          <div className="text-center">
            <h1>Network error</h1>
            <p>Your device may be offline. Try again.</p>
          </div>
        </body>
      </html>
    );
  }

  const [menu, redisLogo, color] = init_data;

  return (
    <html lang="en">
      <head>
        {/* <Script
          id="vtag-ai-js"
          async
          src="https://r2.leadsy.ai/tag.js"
          data-pid="aIG8Pch3BLdKL5yi"
          data-version="062024"
          strategy="beforeInteractive"
        /> */}
      </head>
      <body
        className={`antialiased ${InterFont.className} ${libreBaskerville.variable} ${playfair.variable} ${playfair_display.variable} ${playfair_display_sc.variable} theme-${color}`}
      >
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        >
          <AuthProvider>
            <FreeShippingBanner />
            <ExtrasHeader />
            <CategoriesProvider
              categories={menu.map((i) => ({
                ...i,
                is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name),
              }))}
            >
              <CartProvider>
                <CompareProductsProvider>
                  <SearchProvider>
                    <SessionWrapper>
                      <TuiNavBar logo={redisLogo} menu={menu} />
                      <FixedHeader />
                      <QuickViewProvider>
                        <div
                          style={{
                            minHeight: `calc(100vh - ${deskHeadFootHeight}px)`,
                          }}
                          className={`flex flex-col`}
                        >
                          {children}
                        </div>
                      </QuickViewProvider>
                    </SessionWrapper>
                  </SearchProvider>
                </CompareProductsProvider>
              </CartProvider>
            </CategoriesProvider>
          </AuthProvider>
        </GoogleReCaptchaProvider>
        <Footer />
      </body>
    </html>
  );
}
