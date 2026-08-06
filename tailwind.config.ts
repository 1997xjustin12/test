import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
export default {
  // Dark mode follows the OS by default (so existing `dark:` utilities in the
  // storefront keep working) but can be forced either way by putting `.dark`
  // or `.light` on <html> - used by the admin theme switcher.
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.light *) }",
      "&:is(.dark *)",
    ],
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "theme-red",
    "theme-orange",
    "theme-amber",
    "theme-yellow",
    "theme-lime",
    "theme-green",
    "theme-emerald",
    "theme-teal",
    "theme-cyan",
    "theme-sky",
    "theme-blue",
    "theme-indigo",
    "theme-violet",
    "theme-purple",
    "theme-fuchsia",
    "theme-pink",
    "theme-rose",
    "theme-slate",
    "theme-gray",
    "theme-zinc",
    "theme-neutral",
    "theme-stone",
  ],
  theme: {
    extend: {
      colors: {
        fire: { DEFAULT: "#E85D26", light: "#F97316", accessible: "#C44B18" },
        charcoal: "#1A1A1A",
        cream: "#FAF7F4",
        sand: "#F0E8DF",
        // BBQ
        char:       '#18130f',
        ember:      '#e2541d',
        'ember-deep':'#b83c0e',
        ash:        '#f4f1ec',
        smoke:      '#2a241e',
        paper:      '#fdfbf7',
        grate:      '#d9d2c6',
        'bbq-green':'#2f7d4f',
        gold:       '#d99b1c',
        // OKO (Outdoor Kitchen Outlet) — warm workshop catalog.
        // Light tokens per docs/oko design system; *-night/*-ondark are the
        // dark-mode surfaces/text (used via Tailwind `dark:` utilities).
        'oko-char':       '#26221F',
        'oko-char-soft':  '#3A332E',
        'oko-cream':      '#F6F2EA',
        'oko-cream-dim':  '#EBE4D6',
        'oko-barn':       '#9C3B34',
        'oko-barn-dark':  '#7A2C27',
        'oko-barn-light': '#C0564C',
        'oko-sage':       '#5C6B4F',
        'oko-sage-light': '#8AA07C',
        'oko-stone':      '#8C8478',
        'oko-stone-line': '#DAD2C0',
        'oko-brass':      '#B08A3E',
        // dark-mode surfaces / lines / text-on-dark
        'oko-night':       '#17130F',
        'oko-night-2':     '#221D18',
        'oko-night-3':     '#1E1914',
        'oko-line-dark':   '#3A332C',
        'oko-ondark':      '#D8D1C3',
        'oko-ondark-muted':'#C9C2B3',
        'oko-ondark-faint':'#A79F8D',
      },
      container: {
        // padding: '15px', // Add padding
      },
      textColor: {
        theme: {
          50: "var(--theme-primary-50) !important",
          100: "var(--theme-primary-100) !important",
          200: "var(--theme-primary-200) !important",
          300: "var(--theme-primary-300) !important",
          400: "var(--theme-primary-400) !important",
          500: "var(--theme-primary-500) !important",
          600: "var(--theme-primary-600) !important",
          700: "var(--theme-primary-700) !important",
          800: "var(--theme-primary-800) !important",
          900: "var(--theme-primary-900) !important",
          950: "var(--theme-primary-950) !important",
        },
      },
      backgroundColor: {
        theme: {
          50: "var(--theme-primary-50) !important",
          100: "var(--theme-primary-100) !important",
          200: "var(--theme-primary-200) !important",
          300: "var(--theme-primary-300) !important",
          400: "var(--theme-primary-400) !important",
          500: "var(--theme-primary-500) !important",
          600: "var(--theme-primary-600) !important",
          700: "var(--theme-primary-700) !important",
          800: "var(--theme-primary-800) !important",
          900: "var(--theme-primary-900) !important",
          950: "var(--theme-primary-950) !important",
        },
      },
      borderColor: {
        theme: {
          50: "var(--theme-primary-50) !important",
          100: "var(--theme-primary-100) !important",
          200: "var(--theme-primary-200) !important",
          300: "var(--theme-primary-300) !important",
          400: "var(--theme-primary-400) !important",
          500: "var(--theme-primary-500) !important",
          600: "var(--theme-primary-600) !important",
          700: "var(--theme-primary-700) !important",
          800: "var(--theme-primary-800) !important",
          900: "var(--theme-primary-900) !important",
          950: "var(--theme-primary-950) !important",
        },
      },
      textShadow: {
        sm: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.4)",
        lg: "3px 3px 6px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        inter: "var(--font-inter)",
        "playfair-display": "var(--font-playfair-display)",
        oswald: ["var(--font-oswald)"],
        sora: ["var(--font-sora)"],
        // OKO: slab-serif display (workshop catalog), IBM Plex Mono for
        // eyebrows/counters; body reuses Inter (--font-inter).
        "oko-display": ["var(--font-oko-display)", "serif"],
        "oko-mono": ["var(--font-oko-mono)", "monospace"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
    }) {
      addUtilities({
        ".text-shadow-sm": {
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow": {
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
        },
        ".text-shadow-lg": {
          textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)",
        },
        ".text-shadow-none": {
          textShadow: "none",
        },
      });
    }),
  ],
} satisfies Config;
