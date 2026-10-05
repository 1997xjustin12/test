import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { THEME_COLOR } from "@/app/lib/home-page/sections";
import { STORE_NAME } from "@/app/lib/store_constants";
import HeaderMenu, { HeaderMenuBar } from "./header/HeaderMenu";
import HeaderSearch from "./header/HeaderSearch";
import { HeaderAccountButton, HeaderCartButton } from "./header/HeaderIcons";

/**
 * The configured header.
 *
 * A server component holding the layout and the colour variables, with only the
 * three pieces that need state shipped to the browser: the menu, the search
 * field and the two icon buttons. The header is on every page, so what is
 * client-side here is client-side site-wide.
 *
 * Colours are per scheme; see HeroSection for the mechanism. Every piece reads
 * them from `--sh-*` rather than taking props, so a colour change reaches the
 * client components without re-rendering them.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

export default function ConfiguredHeader({ header, logo }) {
  const content = header?.content;
  if (!content) return null;

  const appearance = header.appearance ?? {};
  const vars = (scheme) => `
    --sh-bg:${asColor(scheme.background, "#ffffff")};
    --sh-border:${asColor(scheme.borderColor, "#e8e8ea")};
    --sh-menu:${asColor(scheme.menuColor)};
    --sh-phone:${asColor(scheme.phoneColor)};
    --sh-icon:${asColor(scheme.iconColor)};
    --sh-search-bg:${asColor(scheme.searchBg, "#d9d9d9")};
    --sh-search-text:${asColor(scheme.searchText, "#17181a")};
    --sh-search-btn-bg:${asColor(scheme.searchButtonBg)};
    --sh-search-btn-text:${asColor(scheme.searchButtonText, "#ffffff")};`;

  const css = `
    .sh{${vars(appearance.light ?? {})}}
    @media (prefers-color-scheme: dark){.sh:not(.light *){${vars(appearance.dark ?? {})}}}
    .sh:is(.dark *){${vars(appearance.dark ?? {})}}
    .sh:is(.light *){${vars(appearance.light ?? {})}}`;

  const digits = String(content.phone ?? "").replace(/[^\d+]/g, "");

  return (
    <header
      className="sh sticky top-0 z-20 border-b"
      style={{ background: "var(--sh-bg)", borderColor: "var(--sh-border)" }}
    >
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Top row: mark, search, contact. */}
        <div className="flex items-center gap-3 py-3 sm:gap-5">
          <Link href="/" className="shrink-0" aria-label={`${STORE_NAME} home`}>
            {logo ? (
              <span className="relative block h-12 w-[92px] sm:h-14 sm:w-[110px]">
                <Image src={logo} alt={`${STORE_NAME} logo`} fill sizes="110px" className="object-contain" priority />
              </span>
            ) : (
              <span className="text-lg font-bold" style={{ color: "var(--sh-menu)" }}>
                {STORE_NAME}
              </span>
            )}
          </Link>

          {/* The field takes the room that is left, and on a phone that is all
              of it — which is why the phone number drops away below sm. */}
          <div className="flex min-w-0 flex-1 justify-center">
            <HeaderSearch placeholder={content.searchPlaceholder} />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {content.phone && (
              <a
                href={digits ? `tel:${digits}` : undefined}
                className="hidden items-center gap-2 text-base font-bold transition-opacity hover:opacity-70 xl:flex"
                style={{ color: "var(--sh-phone)" }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2"
                  style={{ borderColor: "var(--sh-phone)" }}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                {content.phone}
              </a>
            )}
            <HeaderAccountButton />
            <HeaderCartButton />
            <HeaderMenu />
          </div>
        </div>
      </div>

      {/* Second row: the menu, on screens wide enough to hold it. */}
      <div className="mx-auto hidden max-w-[1280px] px-4 pb-3 sm:px-6 lg:block">
        <HeaderMenuBar />
      </div>
    </header>
  );
}
