# Design System Documentation

## Overview

This design system provides a comprehensive set of components, tokens, and guidelines for building consistent, accessible, and beautiful user interfaces across the e-commerce platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Colors & Theming](#colors--theming)
5. [Spacing](#spacing)
6. [Components](#components)
7. [Animations](#animations)
8. [Accessibility](#accessibility)
9. [Best Practices](#best-practices)

---

## Getting Started

### Installation

All design system utilities are already integrated into the project. To use them:

```javascript
// Import design tokens
import { designTokens, getToken, getTransition } from '@/app/lib/designTokens';

// Import components
import Button from '@/app/components/atom/Button';
import { Skeleton, SkeletonProductCard } from '@/app/components/atom/Skeleton';
import { useToast } from '@/app/context/toast';
```

### Quick Start Example

```jsx
import Button from '@/app/components/atom/Button';
import { useToast } from '@/app/context/toast';

function MyComponent() {
  const { success } = useToast();

  const handleClick = () => {
    success('Action completed successfully!');
  };

  return (
    <Button variant="primary" size="md" onClick={handleClick}>
      Click Me
    </Button>
  );
}
```

---

## Design Tokens

Design tokens are the visual design atoms of the design system. They're stored in `/src/app/lib/designTokens.js`.

### Spacing Scale

Use Tailwind spacing utilities instead of hardcoded values:

| Token | Value | Tailwind Class | Use Case |
|-------|-------|----------------|----------|
| xs    | 4px   | `space-1`      | Tight spacing, icons |
| sm    | 8px   | `space-2`      | Small gaps |
| md    | 16px  | `space-4`      | Default spacing |
| lg    | 24px  | `space-6`      | Section spacing |
| xl    | 32px  | `space-8`      | Large sections |
| 2xl   | 48px  | `space-12`     | Major sections |

**Example:**
```jsx
// ❌ Bad - Hardcoded values
<div className="gap-[10px] p-[15px]">

// ✅ Good - Use Tailwind scale
<div className="gap-2 p-4">
```

### Shadow System

Enhanced shadow scale with theme-colored variants:

```jsx
// Standard shadows
shadow-sm    // Subtle elevation
shadow-md    // Default cards
shadow-lg    // Prominent elements
shadow-xl    // Modals, overlays

// Theme-colored shadows
shadow-theme    // Product cards with brand color
shadow-theme-lg // CTAs and featured items
```

### Border Radius

```jsx
rounded-md   // 6px - Default for most components
rounded-lg   // 8px - Cards, buttons
rounded-xl   // 12px - Large cards
rounded-full // Circular elements
```

---

## Typography

### Font Hierarchy

The typography scale now includes proper line heights and letter spacing for optimal readability:

| Size | Line Height | Use Case |
|------|-------------|----------|
| `text-xs` | 1.5 | Captions, labels |
| `text-sm` | 1.5 | Secondary text |
| `text-base` | 1.5 | Body text |
| `text-lg` | 1.5 | Emphasized body |
| `text-xl` | 1.4 | Subheadings |
| `text-2xl` | 1.3 | Section titles |
| `text-3xl` | 1.3 | Page titles |
| `text-4xl` | 1.2 | Hero headlines |
| `text-5xl` | 1.1 | Large displays |

### Font Families

```jsx
font-sans             // Inter - Body text (default)
font-libre            // Libre Baskerville - Serif accents
font-playfair         // Playfair Display - Elegant headings
font-playfair-display-sc // Small caps variant
```

### Font Weights

```jsx
font-light    // 300 - Light emphasis
font-normal   // 400 - Body text
font-medium   // 500 - Slightly bold
font-semibold // 600 - Subheadings
font-bold     // 700 - Headings
font-extrabold // 800 - Strong emphasis
font-black    // 900 - Maximum impact
```

### Usage Example

```jsx
<h1 className="text-4xl font-bold font-playfair text-gray-900">
  Product Title
</h1>
<p className="text-base font-normal text-gray-700 mt-2">
  Product description with optimal readability.
</p>
```

---

## Colors & Theming

### Dynamic Theme System

The platform supports **22 color themes** that can be switched dynamically by admins:

```
red, orange, amber, yellow, lime, green, emerald, teal, cyan,
sky, blue, indigo, violet, purple, fuchsia, pink, rose,
slate, gray, zinc, neutral, stone
```

### Using Theme Colors

```jsx
// Text colors
<span className="text-theme-500">Primary text</span>
<span className="text-theme-600">Darker variant</span>

// Background colors
<button className="bg-theme-500 hover:bg-theme-600">
  Primary Button
</button>

// Border colors
<div className="border border-theme-500">
  Themed border
</div>
```

### Static Color Palette

For non-themed elements:

```jsx
// Green (success)
text-pallete-green    // #089e1b
bg-pallete-green

// Dark (text)
text-pallete-dark     // #2e2e2e
bg-pallete-dark

// Gray (secondary)
text-pallete-gray     // #9c9c9c
text-pallete-lightgray // #d8d8d8
```

### Semantic Colors

```jsx
// Success
bg-green-600 text-white

// Error
bg-red-600 text-white

// Warning
bg-yellow-500 text-gray-900

// Info
bg-blue-600 text-white
```

---

## Spacing

### Container

Containers are now centered with responsive padding:

```jsx
<div className="container mx-auto">
  {/* Content automatically padded: 16px default, 24px on sm, 32px on lg */}
</div>
```

### Gap Utilities

Use consistent gap values:

```jsx
gap-2  // 8px - Tight spacing
gap-4  // 16px - Default spacing
gap-6  // 24px - Comfortable spacing
gap-8  // 32px - Generous spacing
```

---

## Components

### Button Component

**Location:** `/src/app/components/atom/Button.jsx`

#### Variants

```jsx
// Primary (brand-colored)
<Button variant="primary">Primary Action</Button>

// Secondary (neutral)
<Button variant="secondary">Secondary Action</Button>

// Outline (bordered)
<Button variant="outline">Outline Button</Button>

// Ghost (transparent)
<Button variant="ghost">Ghost Button</Button>

// Danger (destructive actions)
<Button variant="danger">Delete</Button>

// Success (confirmations)
<Button variant="success">Confirm</Button>

// Link (text-like)
<Button variant="link">Learn More</Button>
```

#### Sizes

```jsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button> {/* Default */}
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

#### States & Props

```jsx
// Loading state
<Button loading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// With icons
<Button leftIcon={<IconComponent />}>With Icon</Button>
<Button rightIcon={<ArrowIcon />}>Next</Button>
```

#### Icon Button

```jsx
import { IconButton } from '@/app/components/atom/Button';

<IconButton
  icon={<HeartIcon />}
  label="Add to favorites"
  size="md"
  variant="ghost"
/>
```

### Skeleton Components

**Location:** `/src/app/components/atom/Skeleton.jsx`

#### Basic Skeleton

```jsx
import { Skeleton } from '@/app/components/atom/Skeleton';

<Skeleton className="w-full h-48" variant="rectangular" />
<Skeleton className="w-32 h-4" variant="text" />
<Skeleton className="w-12 h-12" variant="circular" />
```

#### Pre-built Skeletons

```jsx
import {
  SkeletonProductCard,
  SkeletonProductGrid,
  SkeletonHeader,
  SkeletonTable,
  SkeletonList
} from '@/app/components/atom/Skeleton';

// Product loading state
<SkeletonProductCard />

// Product grid loading
<SkeletonProductGrid count={8} columns={4} />

// Header loading
<SkeletonHeader />

// Table loading
<SkeletonTable rows={5} columns={4} />
```

### Toast Notifications

**Location:** `/src/app/context/toast.js` and `/src/app/components/atom/Toast.jsx`

#### Setup

Add ToastProvider to your layout:

```jsx
import { ToastProvider } from '@/app/context/toast';

export default function Layout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
```

#### Usage

```jsx
import { useToast } from '@/app/context/toast';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = () => {
    success('Item added to cart!');
  };

  const handleError = () => {
    error('Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    warning('Your session will expire soon.');
  };

  const handleWithAction = () => {
    success('Profile updated!', {
      action: {
        label: 'View Profile',
        onClick: () => router.push('/profile')
      }
    });
  };

  return (
    <button onClick={handleSuccess}>Show Toast</button>
  );
}
```

#### Toast Options

```javascript
toast.success(message, {
  duration: 5000,        // Auto-dismiss time (ms), 0 = no auto-dismiss
  dismissible: true,     // Show close button
  title: 'Success!',     // Optional title
  action: {              // Optional action button
    label: 'Undo',
    onClick: () => {}
  }
});
```

---

## Animations

### Animation Utilities

Pre-built animation classes in `globals.css`:

#### Fade Animations

```jsx
<div className="fade-in">Fades in</div>
<div className="fade-out">Fades out</div>
<div className="fade-in-up">Fades in from below</div>
<div className="fade-in-down">Fades in from above</div>
```

#### Scale Animations

```jsx
<div className="scale-in">Scales in</div>
<div className="scale-out">Scales out</div>
```

#### Slide Animations

```jsx
<div className="slide-in-right">Slides from right</div>
<div className="slide-in-left">Slides from left</div>
```

#### Hover Effects

```jsx
<div className="hover-lift">Lifts on hover</div>
<div className="hover-scale">Scales on hover</div>
```

### Custom Timing

Use Tailwind duration and easing utilities:

```jsx
<div className="transition-all duration-200 ease-in-out">
  Fast transition
</div>

<div className="transition-all duration-500 ease-spring">
  Spring animation
</div>
```

Available easings:
- `ease-spring` - Bouncy spring effect
- `ease-smooth` - Smooth bezier curve
- `ease-in` / `ease-out` / `ease-in-out` - Standard

---

## Accessibility

### Focus States

All interactive elements have visible focus indicators:

```jsx
// Automatically applied to all focusable elements
*:focus-visible {
  outline: 2px solid theme-color;
  outline-offset: 2px;
}
```

### Touch Targets

Minimum touch target size is **44x44px** (WCAG 2.5.5):

```jsx
// Buttons automatically meet this requirement
<Button size="md">Accessible Button</Button>

// For custom elements
<div className="min-h-[44px] min-w-[44px] flex items-center justify-center">
  <CustomTouchTarget />
</div>
```

### ARIA Labels

Always provide labels for screen readers:

```jsx
<IconButton
  icon={<SearchIcon />}
  label="Search products"  // Required for accessibility
/>

<button aria-label="Close modal" onClick={handleClose}>
  <XIcon />
</button>
```

### Semantic HTML

Use proper HTML elements:

```jsx
// ✅ Good
<button onClick={handleClick}>Click me</button>
<nav>...</nav>
<main>...</main>

// ❌ Bad
<div onClick={handleClick}>Click me</div>
```

### Loading States

Indicate loading to screen readers:

```jsx
<Button loading aria-busy="true">
  Processing...
</Button>

<div role="status" aria-label="Loading...">
  <Skeleton />
</div>
```

---

## Best Practices

### 1. Use Design Tokens

```jsx
// ❌ Avoid hardcoded values
<div style={{ padding: '15px', gap: '10px' }}>

// ✅ Use Tailwind utilities
<div className="p-4 gap-2">
```

### 2. Consistent Spacing

```jsx
// ❌ Inconsistent
<div className="gap-[10px]">
<div className="gap-[12px]">
<div className="gap-[15px]">

// ✅ Consistent scale
<div className="gap-2">  {/* 8px */}
<div className="gap-4">  {/* 16px */}
<div className="gap-6">  {/* 24px */}
```

### 3. Accessible Colors

Ensure sufficient contrast (WCAG AA: 4.5:1 for text):

```jsx
// ✅ Good contrast
<p className="text-gray-900 bg-white">

// ⚠️ Check contrast
<p className="text-gray-400 bg-gray-300">
```

### 4. Responsive Design

Mobile-first approach:

```jsx
<div className="
  text-sm      /* Mobile */
  md:text-base /* Tablet */
  lg:text-lg   /* Desktop */
">
```

### 5. Performance

Use memoization for expensive renders:

```jsx
const MemoizedProductCard = memo(ProductCard, (prev, next) => {
  return prev.id === next.id && prev.updated_at === next.updated_at;
});
```

### 6. Loading States

Always show loading feedback:

```jsx
{isLoading ? (
  <SkeletonProductGrid count={8} />
) : (
  <ProductGrid products={products} />
)}
```

### 7. Error Handling

Provide clear error feedback:

```jsx
const { error } = useToast();

try {
  await addToCart(product);
  success('Added to cart!');
} catch (err) {
  error('Could not add item. Please try again.');
}
```

---

## Migration Guide

### Replacing Old Components

#### Old Button → New Button

```jsx
// Old
<button className="bg-theme-500 text-white px-4 py-2 rounded">
  Click me
</button>

// New
<Button variant="primary" size="md">
  Click me
</Button>
```

#### Old Loading → New Skeleton

```jsx
// Old
{loading && <div>Loading...</div>}

// New
{loading ? (
  <SkeletonProductCard />
) : (
  <ProductCard product={product} />
)}
```

#### Alert → Toast

```jsx
// Old
<div className="alert alert-success">Success!</div>

// New
const { success } = useToast();
success('Operation completed!');
```

---

## Component Checklist

When creating new components, ensure:

- [ ] Uses design tokens (spacing, colors, shadows)
- [ ] Responsive across all breakpoints
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Has loading/error states
- [ ] Follows naming conventions
- [ ] Documented with JSDoc comments
- [ ] Memoized if computationally expensive
- [ ] Uses Tailwind utilities (not custom CSS)

---

## Resources

### Files

- **Design Tokens:** `/src/app/lib/designTokens.js`
- **Tailwind Config:** `/tailwind.config.ts`
- **Global Styles:** `/src/app/globals.css`
- **Components:** `/src/app/components/atom/`

### External Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Headless UI](https://headlessui.com/) - Accessible components
- [Heroicons](https://heroicons.com/) - Icon library

---

## Support

For questions or issues with the design system:

1. Check this documentation first
2. Review the component source code
3. Check existing component usage in the codebase
4. Consult the team for clarification

---

**Last Updated:** 2025-10-29
**Version:** 1.0.0
