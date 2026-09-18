/**
 * BBQ Grill Outlet's typefaces. See fonts/solana.js for why each brand's fonts
 * live in their own module.
 */
import { Oswald, Sora } from "next/font/google";

export const THEME = "bbq";

// Variable versions exist for both, so one file each covers every weight
// (previously 500/600/700 of Oswald and 300–600 of Sora, one file per weight).
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

export const bodyClass = `${oswald.variable} ${sora.variable} bg-paper bbqgrilloutlet`;
