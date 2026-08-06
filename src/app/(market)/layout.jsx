import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import "@/app/globals.css";
import { THEME_COLORS } from "@/app/data/theme-colors";
import { redis, keys } from "@/app/lib/redis";
import { Inter, Playfair_Display, Oswald, Sora, Zilla_Slab, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/app/context/auth";
import { CartProvider } from "@/app/context/cart";
import { QuickViewProvider } from "@/app/context/quickview";
import { SearchProvider } from "@/app/context/search";
import { CategoriesProvider } from "@/app/context/category";
import { StoreSettingsProvider } from "@/app/context/store-settings";
import { getStoreSettings } from "@/app/lib/store-settings";
import { CompareProductsProvider } from "@/app/context/compare_product";
import { generateMetadata } from "@/app/metadata";
import SessionWrapper from "@/app/components/wrapper/SessionWrapper";
import ConditionalZohoButton from "@/app/components/widget/ConditionalZohoButton";
import LazyZohoLoader from "@/app/components/widget/LazyZohoLoader";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import Script from "next/script";

// SOLANA COMPONENTS
import Topbar from "@/app/components/new-design/layout/Topbar";
import Navbar from "@/app/components/new-design/layout/Navbar";
import Footer from "@/app/components/new-design/layout/Footer";

// BBQ COMPONENTS
import BBQTopbar from "@/app/components/bbq-design/layout/Topbar";
import BBQNavbar from "@/app/components/bbq-design/layout/Navbar";
import BBQFooter from "@/app/components/bbq-design/layout/Footer";

// OKO COMPONENTS
import OKOTopbar from "@/app/components/oko-design/layout/Topbar";
import OKONavbar from "@/app/components/oko-design/layout/Navbar";
import OKOFooter from "@/app/components/oko-design/layout/Footer";

const InterFont = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "optional",
  variable: "--font-playfair-display",
});

export const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

export const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sora',
  display: 'swap',
})

// OKO display + mono. Slab serif for the workshop-catalog headings (moves
// away from the generic Fraunces-on-cream default; see design system §14),
// IBM Plex Mono for eyebrows/counters. OKO body copy reuses Inter.
export const zillaSlab = Zilla_Slab({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oko-display',
  display: 'swap',
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-oko-mono',
  display: 'swap',
})

const bodyClass = ISOKO
  ? `${zillaSlab.variable} ${InterFont.variable} ${plexMono.variable} bg-oko-cream dark:bg-oko-night outdoorkitchenoutlet`
  : ISBBQ
    ? `${oswald.variable} ${sora.variable} bg-paper bbqgrilloutlet`
    : `${InterFont.variable} ${playfairDisplay.variable}`

export const metadata = await generateMetadata();

// Both cached for 24h under the "layout-data" tag.
// Bust via GET /api/revalidate-all?secret=... after updating menu, logo, theme, or categories.
const getInitData = unstable_cache(
  async () => {
    const mgetKeys = [keys.dev_shopify_menu.value, keys.logo.value, keys.theme.value];
    return await redis.mget(mgetKeys);
  },
  ["layout-init-data"],
  { revalidate: 86400, tags: ["layout-data"] },
);

const getCachedCategories = unstable_cache(
  () => fetchUniqueCategories(),
  ["layout-categories"],
  { revalidate: 86400, tags: ["layout-data"] },
);

export default async function MarketLayout({ children }) {
  const [initData, categories, storeSettings] = await Promise.all([
    getInitData(),
    getCachedCategories(),
    getStoreSettings(),
  ]);

  if (!initData) {
    return notFound();
  }

  const [menu, redisLogo, color] = initData;

  const activeTheme = THEME_COLORS[color] ?? THEME_COLORS.orange;
  const themeCSS = `:root{${Object.entries(activeTheme)
    .map(([k, v]) => `--theme-primary-${k}:${v}`)
    .join(";")}}`;

  const formattedMenuItems =
    menu?.map((i) => ({
      ...i,
      is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name),
    })) || [];

  // NOTE: the first-4-category-card preloads used to live here. They only ever
  // render on the homepage (Categories.jsx), but this layout wraps every market
  // route — so product, category, cart and checkout pages were all preloading
  // four images they never display, one of them at fetchPriority="high",
  // competing with each page's real LCP element. Moved to the homepage itself;
  // see (market)/(home)/page.jsx.

  return (
    <html lang="en">
      <head>
        {/* dns-prefetch is cheap (DNS only, no TCP/TLS).
            preconnect is intentionally omitted here — Next.js already adds 2
            for Google Fonts, and adding more pushes past the browser's 4-connection
            warning. Pages that need fast CDN image loading add their own preconnect. */}
        <link
          rel="dns-prefetch"
          href="https://bbq-spaces.sfo3.cdn.digitaloceanspaces.com"
        />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        {/* eslint-disable-next-line react/no-danger */}
        <style
          dangerouslySetInnerHTML={{ __html: themeCSS }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`antialiased ${bodyClass}`}
      >
        <StoreSettingsProvider settings={storeSettings}>
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
                        { ISOKO ? <OKOTopbar /> : ISBBQ ? <BBQTopbar /> : <Topbar />}
                        { ISOKO ? <OKONavbar logo={redisLogo} /> : ISBBQ ? <BBQNavbar logo={redisLogo} /> : <Navbar logo={redisLogo} />}
                        <main className="flex flex-col min-h-svh">
                          {children}
                        </main>
                        { ISOKO ? <OKOFooter logo={redisLogo} /> : ISBBQ ? <BBQFooter logo={redisLogo} />: <Footer logo={redisLogo} />}
                        <ConditionalZohoButton />
                        <LazyZohoLoader />
                        {process.env.NEXT_PUBLIC_GA_ID && (
                          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
                        )}
                        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
                          <>
                            <Script id="meta-pixel" strategy="afterInteractive">{`
                              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
                              n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
                              t=b.createElement(e);t.async=!0;t.src=v;
                              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
                              (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
                              fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                              fbq('track','PageView');
                            `}</Script>
                            <noscript>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img height="1" width="1" style={{display:"none"}} alt=""
                                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                              />
                            </noscript>
                          </>
                        )}
                      </QuickViewProvider>
                    </SessionWrapper>
                  </SearchProvider>
                </Suspense>
              </CompareProductsProvider>
            </CartProvider>
          </CategoriesProvider>
          </AuthProvider>
        </StoreSettingsProvider>
      </body>
    </html>
  );
}
