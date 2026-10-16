import "@/app/globals.css";
import "@smastrom/react-rating/style.css";
import { redis, keys } from "@/app/lib/redis";
import { THEME_COLORS } from "@/app/data/theme-colors";
import { bodyClass } from "brand-fonts";
import { AuthProvider } from "@/app/context/auth";
import { CartProvider } from "@/app/context/cart";
import { GoogleReCaptchaProvider } from "@/app/context/recaptcha";
import { generateMetadata } from "@/app/metadata";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";

import CheckoutHeader from "@/app/components/new-design/layout/CheckoutHeader";
import Footer from "@/app/components/new-design/layout/Footer";
import BBQCheckoutHeader from "@/app/components/bbq-design/layout/CheckoutHeader";
import BBQFooter from "@/app/components/bbq-design/layout/Footer";
import OKOCheckoutHeader from "@/app/components/oko-design/layout/CheckoutHeader";
import OKOFooter from "@/app/components/oko-design/layout/Footer";

export const metadata = await generateMetadata();

export default async function CheckoutLayout({ children }) {
  const [redisLogo, color] = await redis.mget([keys.logo.value, keys.theme.value]);

  // The brand's theme colour, exactly as the (market) layout sets it. Without
  // these variables every `theme-*` utility on the checkout resolves to
  // nothing — this layout is a root of its own and inherits none of market's.
  const activeTheme = THEME_COLORS[color] ?? THEME_COLORS.orange;
  const themeCSS = `:root{${Object.entries(activeTheme)
    .map(([k, v]) => `--theme-primary-${k}:${v}`)
    .join(";")}}`;

  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} suppressHydrationWarning />
      </head>
      {/* bodyClass is this brand's fonts plus its theme scope (.bbqgrilloutlet,
          .outdoorkitchenoutlet) — the same module the storefront uses, so the
          checkout is set in the brand's typeface. */}
      <body className={`antialiased ${bodyClass}`}>
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
          <AuthProvider>
            <CartProvider>
              {ISOKO ? <OKOCheckoutHeader /> : ISBBQ ? <BBQCheckoutHeader /> : <CheckoutHeader logo={redisLogo} />}
              <div className="flex flex-col min-h-screen">{children}</div>
              {/* Inside the providers: FooterNewsletter calls useAuth(), and
                  outside AuthProvider that returns null and crashes the page. */}
              {ISOKO ? <OKOFooter logo={redisLogo} /> : ISBBQ ? <BBQFooter logo={redisLogo} /> : <Footer logo={redisLogo} />}
            </CartProvider>
          </AuthProvider>
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
