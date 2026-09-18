/**
 * Solana Fireplaces' typefaces.
 *
 * One module per brand, because next/font preloads every family declared in a
 * module that reaches the page. Declaring all three brands' fonts in
 * (market)/layout.jsx made every page preload 8 font files — 202KB at high
 * priority — when a brand renders two. Measured on mobile (Slow 4G, 4x CPU):
 * those preloads occupied the connection from 0.86s to 1.9s, the
 * render-blocking stylesheet only arrived at 1.69s, and first paint followed
 * at 2.07s.
 *
 * next.config.ts resolves "brand-fonts" to the file for this deployment's
 * STORE_ID, so a build ships one brand's fonts only. A missing alias is a
 * build error (nothing resolves "brand-fonts"), and a wrong one is caught by
 * the THEME check in (market)/layout.jsx — neither can quietly serve another
 * brand's typeface.
 */
import { Inter, Playfair_Display } from "next/font/google";

export const THEME = "solana";

// Neither font is preloaded, because the Solana design does not currently
// render either one. Its markup uses Tailwind's own stacks — `font-serif`
// (ui-serif, Georgia) on the headings, the default `ui-sans-serif, system-ui`
// for body copy — and the `font-inter` utility appears only inside ISOKO
// branches. So both files were being fetched at high priority on every page
// and applied to nothing: document.fonts reported zero loaded faces while
// 202KB of fonts came down the wire.
//
// The variables and utilities stay defined, so `font-playfair-display` still
// works where it is used (/brand/eloquence, brand/Reviews.jsx) — the browser
// now fetches the file on those pages only, when an element asks for it.
// Which typefaces Solana should actually render is task B1, the brand kit.
//
// No `weight` list: both have a variable version, so one file covers every
// weight, where listing weights individually meant a file each (Inter was 3).
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "optional",
  preload: false,
  variable: "--font-playfair-display",
});

export const bodyClass = `${inter.variable} ${playfairDisplay.variable}`;
