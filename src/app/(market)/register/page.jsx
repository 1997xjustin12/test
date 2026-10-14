import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewLoginPage from "@/app/components/new-design/page/Login";
import BBQLoginPage from "@/app/components/bbq-design/page/Login";
import OKOLoginPage from "@/app/components/oko-design/page/Login";
import { pageMetadata } from "@/app/lib/page-seo";

/**
 * Create an account.
 *
 * This used to be a form of its own — unstyled, outside every brand's design,
 * and the only registration form in the app that did not send a reCAPTCHA
 * token. /api/register has required one since 25 November 2025, so every
 * attempt through this page answered "reCAPTCHA token is required" and nobody
 * could register here for about eleven months.
 *
 * Rather than teach a second form about reCAPTCHA, the route now renders the
 * same screen as /login, opened on its register panel. One registration form
 * per brand, which is already the one the My Account button leads to — so a
 * fix to it cannot miss this page again, and this page cannot drift out of the
 * brand's design again.
 *
 * The URL is kept rather than redirected: it is linked and may be indexed, and
 * a 200 on the right screen is better than a hop.
 */
export const generateMetadata = () => pageMetadata("/register");

export default function page() {
  if (ISOKO) return <OKOLoginPage initialTab="register" />;
  if (ISBBQ) return <BBQLoginPage initialTab="register" />;
  return <NewLoginPage initialTab="register" />;
}
