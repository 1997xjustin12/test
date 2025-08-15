import "@/app/globals.css";
import { redis, keys, redisGet } from "@/app/lib/redis";
import { Inter, Libre_Baskerville } from "next/font/google";
// import localFont from "next/font/local";
import FixedHeader from "@/app/components/template/fixed_header";
// import TuiNavBar from "@/app/components/template/tui_navbar"; // uncomment for bigcommerce structure
import TuiNavBar from "@/app/components/template/tui_navbarV3"; // uncomment for shopify structure
import FreeShippingBanner from "@/app/components/molecule/FreeShippingBanner";
import Footer from "@/app/components/section/Footer";
import { CartProvider } from "@/app/context/cart";
import { QuickViewProvider } from "@/app/context/quickview";
import { SearchProvider } from "@/app/context/search";
import { CategoriesProvider } from "@/app/context/category";
import { CompareProductsProvider } from "@/app/context/compare_product";
import { generateMetadata } from "@/app/metadata";
import SessionWrapper from "@/app/components/wrapper/SessionWrapper"; // 👈 You'll create this file
import ExtrasHeader from "@/app/components/atom/ExtrasHeader"
const shopify = true; // if shopify product structure

const InterFont = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'], // Available weights: 400 (regular), 700 (bold)
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre-baskerville',
});

export const metadata = await generateMetadata();
export default async function MarketLayout({ children }) {
  const redisLogoKey = "admin_solana_market_logo";
  // const redisLogo = await redis.get(redisLogoKey);
  // const defaultKey = shopify? keys.default_shopify_menu.value :keys.default_menu.value;
  const defaultKey = keys.dev_shopify_menu.value;
  const themeKey = keys.theme.value;
  const mgetKeys = [defaultKey, redisLogoKey, themeKey];
  const [menu, redisLogo, color] = await redis.mget(mgetKeys);
  return (
    <html lang="en">
      <body
        className={`antialiased ${InterFont.className} ${libreBaskerville.variable} theme-${color}`}
      >
        <FreeShippingBanner />
        <ExtrasHeader />
        <CategoriesProvider categories={menu.map(i=> ({...i, is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name)}))}>
          <CartProvider>
            <CompareProductsProvider>
              <SearchProvider>
              <SessionWrapper>
                <TuiNavBar logo={redisLogo} menu={menu} />
                <FixedHeader />
                <QuickViewProvider>
                  <div className="flex flex-col min-h-screen">{children}</div>
                </QuickViewProvider>
                </SessionWrapper>
              </SearchProvider>
            </CompareProductsProvider>
          </CartProvider>
        </CategoriesProvider>
        <Footer />
      </body>
    </html>
  );
}
