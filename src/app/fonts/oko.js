/**
 * Outdoor Kitchen Outlet's typefaces. See fonts/solana.js for why each brand's
 * fonts live in their own module.
 *
 * Slab serif for the workshop-catalog headings (moves away from the generic
 * Fraunces-on-cream default; see design system §14), IBM Plex Mono for
 * eyebrows and counters, Inter for body copy.
 */
import { Inter, Zilla_Slab, IBM_Plex_Mono } from "next/font/google";

export const THEME = "oko";

// Inter is variable — one file for every weight.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Zilla Slab and IBM Plex Mono have no variable version, so these stay as
// explicit weights: one file each, only the weights the design uses.
const zillaSlab = Zilla_Slab({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-oko-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-oko-mono",
});

export const bodyClass = `${zillaSlab.variable} ${inter.variable} ${plexMono.variable} bg-oko-cream dark:bg-oko-night outdoorkitchenoutlet`;
