import "@/app/globals.css";
import { redis, keys, redisGet } from "@/app/lib/redis";
import { Montserrat } from "next/font/google";
// import localFont from "next/font/local";
import FixedHeader from "@/app/components/template/fixed_header";
import TuiNavBar from "@/app/components/template/tui_navbar";
import FreeShippingBanner from "@/app/components/molecule/FreeShippingBanner";
import Footer from "@/app/components/section/Footer";
import { CartProvider } from "@/app/context/cart";
import { QuickViewProvider } from "@/app/context/quickview";
import { SearchProvider } from "@/app/context/search";
import { FilterProvider } from "@/app/context/filter";
import { generateMetadata } from "@/app/metadata";
const MontserratFont = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat", // Optional for Tailwind usage
});
// const Bell = localFont({
//   src: "./fonts/bell-mt-italic.ttf",
//   weight: "100 900",
//   variable: "--font-bell",
//   display: "swap",
// });
// export const metadata = {
//   icons:{
//     icon: '/api/favicon'
//   },
//   title: "Solana Fireplaces | Stylish Indoor & Outdoor Heating",
//   description:
//     "Transform your home with Solana Fireplaces! Add warmth and style with our wood, gas, and electric designs. Shop now and create your perfect space!",
// };

export const metadata = await generateMetadata();
export default async function MarketLayout({ children }) {
  const redisLogoKey = "admin_solana_market_logo";
  // const redisLogo = await redis.get(redisLogoKey);
  const dafaultKey = keys.default_menu.value;
  const themeKey = keys.theme.value;
  const mgetKeys = [dafaultKey, redisLogoKey, themeKey];
  const [menu, redisLogo, color] = await redis.mget(mgetKeys);
  return (
    <html lang="en">
      <body
        className={`antialiased ${MontserratFont.className} theme-${color}`}
      >
        <FreeShippingBanner />
        <div className="hidden lg:block bg-theme-500 py-[8px] px-[30px] text-white">
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
        <CartProvider>
          <FilterProvider>
            <SearchProvider>
              <TuiNavBar logo={redisLogo} menu={menu} />
              <FixedHeader />
              <QuickViewProvider>
                <div className="flex flex-col min-h-screen">{children}</div>
              </QuickViewProvider>
            </SearchProvider>
          </FilterProvider>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
