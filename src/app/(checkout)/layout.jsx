import "@/app/globals.css";
import "@smastrom/react-rating/style.css";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLogoAndTheme } from "@/app/lib/branding";
import { CHECKOUT_UNAVAILABLE_PATH, getCheckoutState } from "@/app/lib/checkout-availability";
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

// A function, not `metadata = await generateMetadata()`: that ran once per
// server start, so a favicon changed in admin never showed until a redeploy.
export { generateMetadata };

export default async function CheckoutLayout({ children }) {
  // Checkout switched off for this domain: send the shopper to the storefront's
  // "checkout isn't open yet" page. Decided here rather than in the page because
  // (checkout)/loading.jsx wraps the page in a Suspense boundary — the shell is
  // already streaming by the time the page runs, so a redirect there arrives as
  // a 200 with a client-side redirect instead of a 307. The layout runs before
  // anything is sent. This route group holds /checkout only.
  const checkout = await getCheckoutState((await headers()).get("host"));
  if (checkout.closed) redirect(CHECKOUT_UNAVAILABLE_PATH);

  // A missing logo must not stop anyone paying: if Redis is unreachable (or out
  // of quota) the checkout renders with the default logo and colour. Caught out
  // here, not inside the cache, so a failure is never stored as the answer.
  const [redisLogo, color] = await getLogoAndTheme().catch((error) => {
    console.error("checkout layout: logo/theme unavailable, using defaults:", error?.message || error);
    return [null, null];
  });

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
