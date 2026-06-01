import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import "@/app/globals.css";
import { THEME_COLORS } from "@/app/data/theme-colors";
import { redis, keys } from "@/app/lib/redis";
import { Inter, Playfair_Display, Oswald, Sora } from "next/font/google";
import { AuthProvider } from "@/app/context/auth";
import { CartProvider } from "@/app/context/cart";
import { QuickViewProvider } from "@/app/context/quickview";
import { SearchProvider } from "@/app/context/search";
import { CategoriesProvider } from "@/app/context/category";
import { CompareProductsProvider } from "@/app/context/compare_product";
import { generateMetadata } from "@/app/metadata";
import SessionWrapper from "@/app/components/wrapper/SessionWrapper";
import ConditionalZohoButton from "@/app/components/widget/ConditionalZohoButton";
import LazyZohoLoader from "@/app/components/widget/LazyZohoLoader";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ISBBQ } from "@/app/lib/helpers";
import Script from "next/script";

// SOLANA COMPONENTS
import Topbar from "@/app/components/new-design/layout/Topbar";
import Navbar from "@/app/components/new-design/layout/Navbar";
import Footer from "@/app/components/new-design/layout/Footer";

// BBQ COMPONENTS
import BBQTopbar from "@/app/components/bbq-design/layout/Topbar";
import BBQNavbar from "@/app/components/bbq-design/layout/Navbar";
import BBQFooter from "@/app/components/bbq-design/layout/Footer";

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

const bodyClass = `${ISBBQ ? `${oswald.variable} ${sora.variable} bg-paper bbqgrilloutlet`: `${InterFont.variable} ${playfairDisplay.variable}`}`

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
  const [initData, categories] = await Promise.all([
    getInitData(),
    getCachedCategories(),
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

  // Preload the first 4 category cards — they're all visible above-the-fold on mobile
  // (INITIAL_COUNT = 4 in Categories.jsx). Preloading them in the server-rendered <head>
  // lets the browser fetch in parallel with JS parsing, eliminating the "late-discovered
  // image" PageSpeed audit. Index 0 is the LCP candidate → fetchPriority="high".
  const initialCats = (categories || []).slice(0, 4);

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
        {initialCats.map((cat, i) => {
          const base = `/_next/image?url=%2Fimages%2Fcategories%2F${cat.slug}.webp&q=40`;
          return (
            <link
              key={cat.slug}
              rel="preload"
              as="image"
              href={`${base}&w=512`}
              imageSrcSet={`${base}&w=375 375w, ${base}&w=512 512w, ${base}&w=640 640w, ${base}&w=750 750w`}
              imageSizes="(max-width: 1024px) calc(50vw - 2rem), calc(33vw - 2rem)"
              fetchPriority={i === 0 ? "high" : undefined}
            />
          );
        })}
        {/* eslint-disable-next-line react/no-danger */}
        <style
          dangerouslySetInnerHTML={{ __html: themeCSS }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`antialiased ${bodyClass}`}
      >
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
                        { ISBBQ ? <BBQTopbar /> : <Topbar />}
                        { ISBBQ ? <BBQNavbar logo={redisLogo} /> : <Navbar logo={redisLogo} />}
                        <main className="flex flex-col min-h-svh">
                          {children}
                        </main>
                        { ISBBQ ? <BBQFooter logo={redisLogo} />: <Footer logo={redisLogo} />}
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
      </body>
    </html>
  );
}
