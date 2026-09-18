import { unstable_cache } from "next/cache";
import "@/app/globals.css";
import { THEME_COLORS } from "@/app/data/theme-colors";
import { redis, keys } from "@/app/lib/redis";
import { bodyClass, THEME as FONTS_THEME } from "brand-fonts";
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
import AiChatWidget from "@/app/components/widget/AiChatWidget";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { readOrDegrade } from "@/app/lib/upstream";
import { STORE_THEME } from "@/app/lib/store";
import {
  buildOrganization,
  buildWebSite,
  serializeJsonLd,
} from "@/app/lib/structured-data";
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

// Fonts come from the brand module next.config.ts resolves for this
// deployment's STORE_ID. Declaring all three brands' families here made every
// page preload 8 font files (202KB) to render the two a brand uses — see
// fonts/solana.js. The check below turns a mis-resolved alias into a build
// error rather than another brand's typeface on the page.
if (FONTS_THEME !== STORE_THEME) {
  throw new Error(
    `Font bundle is for "${FONTS_THEME}" but this build is "${STORE_THEME}" — ` +
      `check the brand-fonts alias in next.config.ts`,
  );
}

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

/**
 * A menu item as the client actually reads it.
 *
 * The whole nav tree — 287 nodes — is serialised into every storefront page so
 * the header, breadcrumbs, price visibility and product URLs can be built in
 * the browser. It was 163KB of every page, and most of it was never read:
 * roughly 25 fields per node, of which the browser uses nine.
 *
 * So this is a whitelist, not a blacklist: a field is here only because
 * something in the browser reads it.
 *
 *   name, url, key, id      the links themselves (Navbar, BreadCrumbs,
 *                           getNameBySlug, getPopularSearchUrl, tui_filter_sort)
 *   children                the tree the menus and breadcrumbs walk
 *   origin_name, nav_type,  category and brand resolution in context/category.js
 *   filter_type             and ProductsSectionV2 (page_category:/page_brand:)
 *   price_visibility        isPriceVisible()
 *   searchable              the facet list ProductsSectionV2 registers
 *   nav_visibility          isNavVisible(), which keeps an item out of the
 *                           header — dropping it put two hidden brand links
 *                           back in the nav, which is how it was caught
 *   collection_display      only .id and .name are read
 *   banner.img.src/.alt     the category cards on a no-results search
 *
 * Dropped because nothing in the browser reads them — checked across every
 * component that takes the menu on all three brands, and the shared helpers
 * they call: menu_id, parent_id, parentId, depth, index, isLast, parent,
 * page_contact_number, order, slug, feature_image, and the banner's own
 * title and tag_line. BasePlp does read slug and feature_image, but from
 * the server's own menu read in /[slug]/page.jsx, not from this copy.
 * meta_title and meta_description are server-side only — /[slug]'s
 * generateMetadata reads them from its own Redis read.
 *
 * The admin layout is untouched: the menu editor gets the full menu.
 */
const clientMenuItem = (item) => ({
  id: item?.id,
  key: item?.key,
  name: item?.name,
  url: item?.url,
  origin_name: item?.origin_name,
  nav_type: item?.nav_type,
  filter_type: item?.filter_type,
  price_visibility: item?.price_visibility,
  searchable: item?.searchable,
  nav_visibility: item?.nav_visibility,
  ...(item?.collection_display && typeof item.collection_display === "object"
    ? {
        collection_display: {
          id: item.collection_display.id,
          name: item.collection_display.name,
        },
      }
    : item?.collection_display !== undefined
      ? { collection_display: item.collection_display }
      : {}),
  ...(item?.banner?.img?.src
    ? { banner: { img: { src: item.banner.img.src, alt: item.banner.img.alt } } }
    : {}),
  ...(Array.isArray(item?.children)
    ? { children: item.children.map(clientMenuItem) }
    : {}),
});

// Menu, logo and theme, when Redis cannot be reached. The page still renders:
// header without its nav, default theme colour, logo from the brand's own
// static asset. Everything below <main> is the page's own data and unaffected.
const NO_LAYOUT_DATA = [null, null, null];

export default async function MarketLayout({ children }) {
  // None of these three may take the storefront down. This layout wraps every
  // market route, so a thrown read used to return HTTP 500 — with an empty body
  // — for the entire site, and an empty read called notFound() and published
  // "page does not exist" for every URL we have. Both were caused by one Redis
  // blip, and the 404 could be cached and indexed. A degraded header is the
  // right answer; see lib/upstream.js.
  const [initData, categories, storeSettings] = await Promise.all([
    readOrDegrade("layout:menu+logo+theme", getInitData, NO_LAYOUT_DATA),
    readOrDegrade("layout:categories", getCachedCategories, []),
    getStoreSettings(),
  ]);

  const [menu, redisLogo, color] = initData ?? NO_LAYOUT_DATA;

  const activeTheme = THEME_COLORS[color] ?? THEME_COLORS.orange;
  const themeCSS = `:root{${Object.entries(activeTheme)
    .map(([k, v]) => `--theme-primary-${k}:${v}`)
    .join(";")}}`;

  const formattedMenuItems =
    menu?.map((i) => ({
      ...clientMenuItem(i),
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
        {/* Store + site identity for crawlers and AI agents. Emitted once here
            rather than per page; page-level schema (Product, ItemList,
            BreadcrumbList) references the same @id. See
            docs/agentic-ai/agentic-ai-readiness.md. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(buildOrganization(), buildWebSite()),
          }}
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
                {/* No Suspense boundary here on purpose.
                    It used to wrap this entire subtree, because SearchProvider
                    called useSearchParams(). React streams suspended content
                    into a `<div hidden>` at the end of <body> and moves it into
                    place with an inline script on hydration — so with
                    JavaScript disabled the whole storefront rendered blank.
                    The markup was in the HTML but never became visible, which
                    is precisely what AI agents and text-extraction crawlers
                    read. The boundary now lives inside SearchProvider around a
                    non-rendering leaf, and around the header below, so <main>
                    reaches the document body as ordinary HTML.
                    See docs/agentic-ai/agentic-ai-readiness.md. */}
                  <SearchProvider>
                    <SessionWrapper>
                      <QuickViewProvider>
                        {/* No Suspense boundary: SearchBox reads the URL query
                            through a leaf of its own (SearchParamsBridge), so the
                            header renders as server HTML. It used to stream in on
                            hydration and push the page down — the site's whole CLS. */}
                          { ISOKO ? <OKOTopbar /> : ISBBQ ? <BBQTopbar /> : <Topbar />}
                          { ISOKO ? <OKONavbar logo={redisLogo} /> : ISBBQ ? <BBQNavbar logo={redisLogo} /> : <Navbar logo={redisLogo} />}
                        <main className="flex flex-col min-h-svh">
                          {children}
                        </main>
                        { ISOKO ? <OKOFooter logo={redisLogo} /> : ISBBQ ? <BBQFooter logo={redisLogo} />: <Footer logo={redisLogo} />}
                        <ConditionalZohoButton />
                        <LazyZohoLoader />
                        {/* Bottom-left: Zoho's live-chat button owns
                            bottom-right on every page it renders. */}
                        <AiChatWidget />
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
              </CompareProductsProvider>
            </CartProvider>
          </CategoriesProvider>
          </AuthProvider>
        </StoreSettingsProvider>
      </body>
    </html>
  );
}
