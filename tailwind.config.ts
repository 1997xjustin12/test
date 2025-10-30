import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
export default {
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
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
        },
      },
      // Enhanced Typography Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      // Enhanced Shadow System
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        // Theme-colored shadows for product cards and CTAs
        'theme': '0 10px 25px -5px var(--theme-primary-500, rgba(255, 107, 20, 0.2))',
        'theme-lg': '0 20px 40px -10px var(--theme-primary-500, rgba(255, 107, 20, 0.3))',
        'none': 'none',
      },
      // Enhanced Animation System
      transitionDuration: {
        '50': '50ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      // Enhanced Z-index Scale
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'modal-backdrop': '40',
        'modal': '50',
        'popover': '60',
        'tooltip': '70',
        'notification': '80',
      },
      // Theme Colors (Dynamic)
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
      // Text Shadow Utilities
      textShadow: {
        sm: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.4)",
        lg: "3px 3px 6px rgba(0, 0, 0, 0.3)",
      },
      // Font Families
      fontFamily: {
        libre: "var(--font-libre-baskerville)",
        "playfair": "var(--font-playfair)",
        "playfair-display": "var(--font-playfair-display)",
        "playfair-display-sc": "var(--font-playfair-display-sc)",
      },
      // Aspect Ratios
      aspectRatio: {
        'product': '1 / 1',
        'banner': '16 / 5',
        'hero': '21 / 9',
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
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
