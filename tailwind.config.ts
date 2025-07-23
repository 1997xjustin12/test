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
        // montserrat: "var(--font-montserrat)",
        // bell: "var(--font-bell)",
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
