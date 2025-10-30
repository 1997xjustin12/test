/**
 * Design Tokens - Centralized Design System Configuration
 *
 * This file contains all design tokens for consistent styling across the application.
 * Use these tokens instead of hardcoded values for maintainability and consistency.
 */

export const designTokens = {
  // ============================
  // SPACING SCALE (Tailwind-based)
  // ============================
  spacing: {
    xs: '0.25rem',    // 4px - Tailwind: space-1
    sm: '0.5rem',     // 8px - Tailwind: space-2
    md: '1rem',       // 16px - Tailwind: space-4
    lg: '1.5rem',     // 24px - Tailwind: space-6
    xl: '2rem',       // 32px - Tailwind: space-8
    '2xl': '3rem',    // 48px - Tailwind: space-12
    '3xl': '4rem',    // 64px - Tailwind: space-16
    '4xl': '6rem',    // 96px - Tailwind: space-24
  },

  // ============================
  // BORDER RADIUS
  // ============================
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ============================
  // BOX SHADOWS (Enhanced)
  // ============================
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    none: 'none',
    // Colored shadows for product cards and CTAs
    theme: '0 10px 25px -5px var(--theme-primary-500, rgba(255, 107, 20, 0.2))',
    themeLg: '0 20px 40px -10px var(--theme-primary-500, rgba(255, 107, 20, 0.3))',
  },

  // ============================
  // TYPOGRAPHY SCALE (Enhanced)
  // ============================
  typography: {
    fontSizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeights: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ============================
  // ANIMATIONS & TRANSITIONS
  // ============================
  animations: {
    duration: {
      fast: '150ms',
      base: '200ms',
      medium: '300ms',
      slow: '500ms',
      slower: '700ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      // Custom easings
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },

  // ============================
  // Z-INDEX SCALE
  // ============================
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    notification: 80,
  },

  // ============================
  // BREAKPOINTS (Reference)
  // ============================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ============================
  // COMPONENT-SPECIFIC TOKENS
  // ============================
  components: {
    button: {
      heights: {
        sm: '2rem',     // 32px
        md: '2.5rem',   // 40px
        lg: '3rem',     // 48px
        xl: '3.5rem',   // 56px
      },
      padding: {
        sm: '0.5rem 1rem',     // py-2 px-4
        md: '0.625rem 1.5rem', // py-2.5 px-6
        lg: '0.75rem 2rem',    // py-3 px-8
        xl: '1rem 2.5rem',     // py-4 px-10
      },
    },
    input: {
      height: '2.75rem',  // 44px - Optimal touch target
      padding: '0.75rem', // 12px
      borderWidth: '1px',
      focusRingWidth: '2px',
    },
    card: {
      padding: {
        sm: '1rem',     // 16px
        md: '1.5rem',   // 24px
        lg: '2rem',     // 32px
      },
      gap: '1rem',      // 16px
    },
    header: {
      height: {
        mobile: '4rem',    // 64px
        desktop: '5rem',   // 80px
      },
      sticky: {
        mobile: '3.5rem',  // 56px
        desktop: '4.5rem', // 72px
      },
    },
    footer: {
      padding: {
        mobile: '2rem 1rem',   // py-8 px-4
        desktop: '3rem 2rem',  // py-12 px-8
      },
    },
    productCard: {
      aspectRatio: '1 / 1',
      gap: '0.75rem',        // 12px
      padding: '1rem',       // 16px
      hoverScale: '1.02',
      hoverShadow: 'lg',
    },
  },

  // ============================
  // ACCESSIBILITY
  // ============================
  accessibility: {
    focusRing: {
      width: '2px',
      offset: '2px',
      color: 'var(--theme-primary-500, #ff6b14)',
      style: 'solid',
    },
    minTouchTarget: '44px', // WCAG 2.5.5 - Minimum touch target size
    minContrastRatio: 4.5,  // WCAG AA standard
  },

  // ============================
  // GRID SYSTEM
  // ============================
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4,
    },
    gap: {
      sm: '0.5rem',   // 8px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
      xl: '2rem',     // 32px
    },
    maxWidth: '1536px', // 2xl container
  },
};

// ============================
// UTILITY FUNCTIONS
// ============================

/**
 * Get a nested design token value
 * @param {string} path - Dot notation path to token (e.g., 'spacing.md')
 * @returns {string|undefined} The token value
 */
export function getToken(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], designTokens);
}

/**
 * Get spacing class name for Tailwind
 * @param {string} size - Size key (xs, sm, md, lg, xl, etc.)
 * @param {string} property - CSS property (p, m, px, py, mt, etc.)
 * @returns {string} Tailwind class name
 */
export function getSpacingClass(size, property = 'p') {
  const sizeMap = {
    xs: '1',
    sm: '2',
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
    '3xl': '16',
    '4xl': '24',
  };
  return `${property}-${sizeMap[size] || '4'}`;
}

/**
 * Generate animation class string
 * @param {string} duration - Duration key from tokens
 * @param {string} easing - Easing key from tokens
 * @returns {string} CSS transition value
 */
export function getTransition(duration = 'base', easing = 'inOut') {
  const dur = designTokens.animations.duration[duration] || '200ms';
  const ease = designTokens.animations.easing[easing] || 'ease-in-out';
  return `all ${dur} ${ease}`;
}

// ============================
// CSS-IN-JS HELPERS
// ============================

/**
 * Convert design tokens to CSS custom properties
 * @returns {object} CSS custom properties object
 */
export function tokensToCSS() {
  return {
    // Spacing
    '--spacing-xs': designTokens.spacing.xs,
    '--spacing-sm': designTokens.spacing.sm,
    '--spacing-md': designTokens.spacing.md,
    '--spacing-lg': designTokens.spacing.lg,
    '--spacing-xl': designTokens.spacing.xl,

    // Shadows
    '--shadow-sm': designTokens.shadows.sm,
    '--shadow-base': designTokens.shadows.base,
    '--shadow-md': designTokens.shadows.md,
    '--shadow-lg': designTokens.shadows.lg,
    '--shadow-xl': designTokens.shadows.xl,

    // Transitions
    '--transition-fast': getTransition('fast'),
    '--transition-base': getTransition('base'),
    '--transition-medium': getTransition('medium'),
    '--transition-slow': getTransition('slow'),

    // Z-index
    '--z-dropdown': designTokens.zIndex.dropdown,
    '--z-sticky': designTokens.zIndex.sticky,
    '--z-fixed': designTokens.zIndex.fixed,
    '--z-modal': designTokens.zIndex.modal,
  };
}

export default designTokens;
