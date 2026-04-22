import { Suspense } from "react";
import "@/app/globals.css";
import { redis, keys } from "@/app/lib/redis";
import { unstable_cache } from "next/cache";
import { UIV2 } from "@/app/lib/helpers";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/app/context/auth";
import { CartProvider } from "@/app/context/cart";
import { QuickViewProvider } from "@/app/context/quickview";
import { SearchProvider } from "@/app/context/search";
import { CategoriesProvider } from "@/app/context/category";
import { CompareProductsProvider } from "@/app/context/compare_product";
import { generateMetadata } from "@/app/metadata";
import SessionWrapper from "@/app/components/wrapper/SessionWrapper";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import { notFound } from "next/navigation";

// OLD DESIGN COMPONENTS
import FixedHeader from "@/app/components/template/fixed_header";
import ExtrasHeader from "@/app/components/atom/ExtrasHeader";
import TuiNavBar from "@/app/components/template/tui_navbarV3"; // uncomment for shopify structure
import FreeShippingBanner from "@/app/components/molecule/FreeShippingBanner";
import OldFooter from "@/app/components/section/Footer";

// NEW DESIGN COMPONENTS
import Topbar from "@/app/components/new-design/layout/Topbar";
import Navbar from "@/app/components/new-design/layout/Navbar";
import Footer from "@/app/components/new-design/layout/Footer";
import RatingStyles from "@/app/components/atom/RatingStyles";

/** * SPEED FIX 1: Reduced font weights & consolidated Playfair versions.
 * Using 'swap' ensures text is visible while fonts load (prevents FOIT).
 */
const InterFont = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair-display",
});

export const metadata = await generateMetadata();

const getInitData = unstable_cache(
  async () => {
    try {
      const mgetKeys = [
        keys.dev_shopify_menu.value,
        "admin_solana_market_logo",
        keys.theme.value,
      ];
      return await redis.mget(mgetKeys);
    } catch (err) {
      console.error("[Redis Init Error]:", err);
      return null;
    }
  },
  ["market-layout-init"],
  { revalidate: 3600 }
);

export default async function MarketLayout({ children }) {
  /** * SPEED FIX 2: Parallel Fetching.
   * Both requests fire at the same time instead of waiting for each other.
   */
  const [initData, categories] = await Promise.all([
    getInitData(),
    fetchUniqueCategories(),
  ]);

  /** * SEO FIX: Handle missing data properly.
   * Returning a 404 or throwing an error is better than a 200 OK "Error" div.
   */
  if (!initData) {
    return notFound();
  }

  const [menu, redisLogo, color] = initData;

  // Pre-process menu items outside of the JSX for cleaner rendering
  const formattedMenuItems =
    menu?.map((i) => ({
      ...i,
      is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name),
    })) || [];

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://bbq-spaces.sfo3.cdn.digitaloceanspaces.com" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://bbq-spaces.sfo3.digitaloceanspaces.com" />
      </head>
      <body
        className={`antialiased ${InterFont.variable} ${playfairDisplay.variable} theme-${color}`}
      >
          <RatingStyles />
          <AuthProvider>
            <CategoriesProvider
              menu_items={formattedMenuItems}
              categories={categories}
            >
              <CartProvider>
                <CompareProductsProvider>
                  <Suspense fallback={null}>
                  <SearchProvider>
                    <SessionWrapper>
                      <QuickViewProvider>
                        {UIV2 && (
                          <>
                            <Topbar />
                            <Navbar logo={redisLogo} />
                          </>
                        )}
                        {!UIV2 && (
                          <>
                            <FreeShippingBanner />
                            <ExtrasHeader />
                            <TuiNavBar logo={redisLogo} menu={menu} />
                            <FixedHeader />
                          </>
                        )}
                        <main className="flex flex-col min-h-svh">
                          {children}
                        </main>
                        {UIV2 && <Footer />}
                        {!UIV2 && <OldFooter />}
                      </QuickViewProvider>
                    </SessionWrapper>
                  </SearchProvider>
                  </Suspense>
                </CompareProductsProvider>
              </CartProvider>
            </CategoriesProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
