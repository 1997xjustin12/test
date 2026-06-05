# New Design Patterns

Reference for all design decisions used across `new-design` pages and components.
Sourced from: `Hero`, `Products`, `NewsLetter`, `Brands`, `Promo`, `Cart`, `BasePlp`, `Login`, `About`, `BlogPost`, `Categories`.

---

## Key Differentiator vs BBQ Design

The single most important distinction is **border radius**. New-design uses soft, rounded corners everywhere. BBQ design uses `rounded-sm` (nearly square) everywhere.

| Element | New Design | BBQ Design |
|---|---|---|
| Cards | `rounded-2xl` | `rounded-sm` |
| Buttons | `rounded-lg` / `rounded-xl` | `rounded-sm` |
| Inputs | `rounded-lg` | `rounded-sm` |
| Badges/pills | `rounded-full` | `rounded-sm` |
| Icon containers | `rounded-xl` / `rounded-2xl` | flat square |
| CTA sections | `rounded-2xl` | `rounded-sm` |

---

## Color Scale

New-design uses **Tailwind's gray/stone scale** rather than the custom BBQ tokens (`ash`, `char`, `paper`, `smoke`, `grate`).

| Token | Role | Notes |
|---|---|---|
| `gray-50/950` | Page backgrounds | Auth, Cart |
| `gray-900` | Card dark surface | Used alongside `stone-900` |
| `gray-200/700` | Standard card borders | Most cards and panels |
| `gray-300/800` | Dividers | Utility divider, sidebar borders |
| `gray-400/500` | Muted/secondary text | Breadcrumbs, metadata |
| `stone-100/900` | Newsletter, brands strip bg | Slightly warm neutral |
| `stone-200/700` | Form borders, newsletter borders | |
| `stone-400/500` | Very muted text, empty stars | Product brand labels |
| `stone-800` | Card borders (products) | `border-stone-100 dark:border-stone-800` |
| `cream` | Products section bg (light) | Custom token |
| `charcoal` | Primary text | Custom token, equivalent to near-black |
| `theme-500/600` | Brand accent | `theme-500` preferred here vs BBQ's `theme-600` |
| `fire` | Focus rings, required field markers | |
| `orange-500/600` | Shopping assistance CTA, hover links | |
| `amber-400` | Filled star ratings | |

---

## Dark Mode Strategy

Class-based dark mode (`dark:` prefix).

### Page backgrounds
```
bg-gray-50 dark:bg-gray-950    ← Cart, auth pages
bg-stone-50 dark:bg-stone-950  ← Login page wrapper
(no bg)                        ← BasePlp inherits from layout
```

### Card surfaces
```
bg-white dark:bg-gray-900      ← Standard cards, About page cards, InfoCard
bg-white dark:bg-stone-900     ← Form card, product cards
```

### Borders
```
border-gray-200 dark:border-gray-700    ← Standard card borders
border-gray-200 dark:border-gray-800    ← InfoCard, About cards
border-stone-200 dark:border-stone-700  ← Form inputs, FormCard, tab switcher
border-stone-100 dark:border-stone-800  ← Product card shell
border-stone-200 dark:border-stone-800  ← Newsletter/Brands section border
```

### Text hierarchy
```
text-charcoal dark:text-white           ← Primary headings (serif), h1, bold labels
text-gray-900 dark:text-gray-100        ← Section headings (About, utility components)
text-gray-800 dark:text-gray-200        ← Sidebar links, card labels
text-gray-600 dark:text-gray-400        ← Body copy
text-gray-500 dark:text-gray-400        ← Secondary/muted body
text-gray-400 dark:text-gray-500        ← Very muted — breadcrumbs, metadata
text-stone-500 dark:text-stone-400      ← Form labels, newsletter body
text-stone-400 dark:text-stone-500      ← Product brand label, empty stars
```

### Section backgrounds
```
bg-cream dark:bg-stone-950              ← Products section
bg-stone-100 dark:bg-stone-900          ← Newsletter, Brands strip
border-stone-200 dark:border-stone-800  ← Newsletter/Brands border
```

### Accent / brand colors stay the same in both modes
```
text-theme-600 dark:text-theme-500   ← Overlines, section labels, product tab active
bg-theme-600 hover:bg-theme-500      ← Primary buttons
```

---

## Typography

Two font stacks:

| Font | Usage |
|---|---|
| `font-serif` | All headings, section titles, hero, newsletter heading, stat numbers in hero |
| (default sans) | Body text, labels, buttons, metadata — no explicit `font-*` class needed |

> Note: No `font-oswald` or `font-sora` — those are BBQ-only tokens.

### Hero heading
```jsx
<h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.8rem] text-white leading-[1.15]">
```

### Section heading pattern
```jsx
<p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 dark:text-theme-500 mb-1.5">
  Overline Label
</p>
<h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white leading-tight">
  Section Title
</h2>
```

### Page-level h1 (content pages)
```jsx
<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
```

### Section heading (About / utility)
```jsx
<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100" style={{ fontFamily: "Georgia,serif" }}>
```

### SectionLabel utility
```jsx
<p className="text-xs font-bold uppercase tracking-widest mb-1 text-theme-600">{children}</p>
```

### Body copy
```jsx
<p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
```

### Muted metadata
```jsx
<p className="text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-500">
```

---

## Layout

### Max-width container
```jsx
<div className="max-w-[1240px] mx-auto px-4 sm:px-6">
```

### Section padding
```
py-20 md:py-24   ← Products section
py-12            ← Newsletter
py-11            ← Brands strip
py-8             ← Cart
py-6             ← BasePlp content
```

### Hero layout (2-col)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center py-16 md:py-20">
  {/* Copy — left */}
  {/* Feature cards — right, hidden on mobile */}
</div>
```

### BasePlp layout (sidebar + main)
```jsx
<div className="flex gap-8">
  <aside className="w-[210px] shrink-0 hidden md:block">
    <div className="sticky top-[140px]">...</div>
  </aside>
  <div className="flex-1 min-w-0">...</div>
</div>
```

### Cart layout (items + sidebar)
```jsx
<div className="flex flex-col lg:flex-row gap-4 lg:items-start">
  <div className="flex-1 min-w-0">...</div>
  <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">...</div>
</div>
```

### Category grid (BasePlp)
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
```

### Product grid
```jsx
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
```

---

## Cards & Surfaces

### Standard content card
```jsx
className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl"
```

### Hoverable card (subtle — About, BasePlp)
```jsx
className="... hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
```

### Hoverable card (strong lift — products)
```jsx
className="rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:shadow-[0_12px_48px_rgba(0,0,0,.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,.5)] hover:-translate-y-1 transition-all group"
```

### Form card wrapper (FormCard)
```jsx
className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden"
```

### Hero feature card (glassmorphism)
```jsx
className="rounded-2xl overflow-hidden bg-white/7 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,.3)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,.4)] transition-all duration-300"
```

### InfoCard utility
```jsx
className="w-full rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
// icon container:
className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl bg-theme-600"
// title:
className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base"
// body:
className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
```

### Skeleton / loading
```jsx
className="rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse"
// shapes inside: rounded-full bg-gray-200 dark:bg-gray-700
```

### Empty state
```jsx
className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
// icon container:
className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-5 text-orange-400"
```

### Shopping assistance card
```jsx
className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5"
// icon container:
className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500"
```

---

## Buttons

### Primary CTA
```jsx
className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-theme-600 hover:bg-theme-500 text-gray-900 font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-theme-500/30"
```
Note: text is `text-gray-900` not `text-white` on primary buttons.

### Secondary / outline (on dark background)
```jsx
className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/60 text-white hover:bg-white/10 font-semibold transition-all duration-200"
```

### Outline on light background
```jsx
className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border-2 border-theme-500 text-theme-600 dark:text-theme-500 hover:bg-theme-500 hover:text-white font-semibold text-sm transition-all duration-200"
```

### Small / compact CTA
```jsx
className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
```

### Form submit (full-width)
```jsx
className="w-full py-2.5 bg-theme-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
```

### Add-to-cart (square icon button)
```jsx
className="flex-shrink-0 w-9 h-9 rounded-lg bg-theme-500 hover:bg-theme-600 text-white flex items-center justify-center text-lg font-light transition-colors duration-200"
```

---

## Forms

### Input
```js
const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-charcoal dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 transition-colors";
```

### Label
```js
const labelClass =
  "block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5";
```

### Error message block
```jsx
<div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
  {/* warning icon */}
  <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
</div>
```

### Two-panel form (mobile tab / desktop side-by-side)
```jsx
{/* Mobile tab container */}
<div className="flex md:hidden p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mb-6">
  <button className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
    active
      ? "bg-white dark:bg-stone-900 text-charcoal dark:text-white shadow-sm"
      : "text-stone-500 dark:text-stone-400"
  }`}>...</button>
</div>

{/* Desktop divider */}
<div className="hidden md:block w-px bg-stone-100 dark:bg-stone-800 my-8" />
```

---

## Tabs

### Product filter tabs (pill style)
```jsx
className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
  active
    ? "border-theme-500 text-theme-600 dark:text-theme-500 bg-theme-600/5"
    : "border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-theme-500 hover:text-theme-600 dark:hover:text-theme-500"
}`}
```

### Auth page tabs (rounded switcher)
```jsx
{/* Container */}
className="p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"

{/* Active */}
className="bg-white dark:bg-stone-900 text-charcoal dark:text-white shadow-sm rounded-lg"

{/* Inactive */}
className="text-stone-500 dark:text-stone-400"
```

---

## Navigation & Breadcrumbs

### Breadcrumb trail
```jsx
<nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-8">
  <Link className="hover:text-theme-500 transition-colors">Home</Link>
  <span>/</span>
  <span className="font-semibold text-gray-700 dark:text-gray-300">Current Page</span>
</nav>
```
Note: separator is `/` (not `❯` as in BBQ design).

### Back link
```jsx
<Link className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition-colors">
  {/* chevron-left svg */}
  Back to Shopping
</Link>
```

### Sidebar nav links (BasePlp)
```jsx
{/* Parent link */}
className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-theme-600 transition-colors"

{/* Child link */}
className="text-xs text-gray-400 dark:text-gray-500 hover:text-theme-600 transition-colors pl-3 border-l border-gray-200 dark:border-gray-700"
```

---

## Product Card

### Card shell
```jsx
<article className="opacity-0 translate-y-6 transition-all duration-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:shadow-[0_12px_48px_rgba(0,0,0,.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,.5)] hover:-translate-y-1 group flex flex-col">
```
The `opacity-0 translate-y-6` is the initial state for the `useReveal()` scroll animation.

### Image area
```jsx
<div className="relative h-48 bg-white">
```

### Sale badge (pill)
```jsx
<span className="bg-theme-500 text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
  -{pct}%
</span>
```

### Card body anatomy
```
brand label  → text-[10px] tracking-widest uppercase text-stone-400 dark:text-stone-500
title        → font-serif text-base text-charcoal dark:text-white leading-snug line-clamp-2
stars        → text-amber-400 text-xs (filled) + text-stone-300 dark:text-stone-600 text-xs (empty)
```

### Price — on sale
```jsx
<s className="text-xs text-stone-400 block leading-none mb-0.5">
  ${formatPrice(was)}
</s>
<span className="text-lg font-bold text-theme-500">
  ${formatPrice(price)}
</span>
```
Note: sale price uses `text-theme-500`, NOT orange.

### Price — regular
```jsx
<span className="text-lg font-bold text-charcoal dark:text-white">
  ${formatPrice(price)}
</span>
```

---

## Badges & Tags

```jsx
{/* Sale badge — pill */}
<span className="bg-theme-500 text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
  -{pct}%
</span>

{/* Success / subscribed state */}
<span className="flex items-center gap-2 px-5 py-3 rounded-lg bg-green-600/10 dark:bg-green-600/20 text-green-700 dark:text-green-400 font-semibold text-sm">
  ✓ Subscribed
</span>
```

---

## Icons

Always inline SVG, same convention as BBQ:

```jsx
<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="..." />
</svg>
```

### Icon containers (two variants)
```jsx
{/* Small — assistance card */}
className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500"

{/* Large — empty state */}
className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-400"
```

---

## Reveal / Scroll Animation

Cards and section headers use a scroll-triggered fade-in via the `useReveal()` hook:

```jsx
const ref = useReveal();
<article ref={ref} className="opacity-0 translate-y-6 transition-all duration-700 ...">
```

The hook adds a class that sets `opacity-1 translate-y-0` when the element enters the viewport. Apply to product cards and section headers — not navigation or hero content.

---

## Dividers

```jsx
{/* Section divider (utility) */}
<hr className="border-t border-gray-300 dark:border-gray-800 my-8" />

{/* Form panel divider */}
<div className="hidden md:block w-px bg-stone-100 dark:bg-stone-800 my-8" />

{/* PLP divider */}
<hr className="border-neutral-200 dark:border-neutral-700 my-[30px]" />
```

---

## Section Structure Reference

| Section | Background (light) | Background (dark) | Notes |
|---|---|---|---|
| Hero | dark gradient (full-bleed) | same | `min-h-[85vh]` |
| Products | `bg-cream` | `dark:bg-stone-950` | `py-20 md:py-24` |
| Newsletter | `bg-stone-100` | `dark:bg-stone-900` | `border-y border-stone-200 dark:border-stone-800` |
| Brands strip | `bg-cream` | `dark:bg-stone-900` | `border-b border-stone-200 dark:border-stone-800` |
| Promo | dark gradient (full-bleed) | same | |
| Cart | `bg-gray-50` | `dark:bg-gray-950` | `min-h-screen` |
| Login | `bg-stone-50` | `dark:bg-stone-950` | |
| BasePlp | — | — | Inherits from layout |

---

## Two-Tone Dark CTA Block (About page pattern)

```jsx
<div
  className="rounded-2xl p-8 text-center relative overflow-hidden"
  style={{ background: "linear-gradient(120deg,#1a0600,#3d1208)" }}
>
  <div
    className="absolute inset-0"
    style={{ background: `radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--theme-primary-700), transparent 60%), transparent 60%)` }}
  />
  <div className="relative z-10">
    <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "Georgia,serif" }}>
      CTA Heading
    </p>
    <p className="text-orange-200 text-sm mb-6">Subtext</p>
    <div className="flex flex-wrap justify-center gap-3">
      {/* Phone — ghost outline */}
      <a className="px-6 py-3 rounded-xl text-sm font-bold text-white border border-orange-400 hover:bg-orange-900/30 transition-colors">
      {/* Primary action */}
      <button className="px-6 py-3 rounded-xl text-sm font-bold bg-theme-600 text-white hover:opacity-90 transition-opacity">
    </div>
  </div>
</div>
```

---

## Promo Section (dark gradient + cards)

```jsx
<section className="relative overflow-hidden">
  {/* Background layers */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0a0300] via-[#1a0d00] to-[#0a1a10]" />
  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/35" />

  <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center py-20">
      {/* Copy — left */}
      {/* Promo cards — right */}
    </div>
  </div>
</section>
```

### Promo card item
```jsx
<Link className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 border border-white/10 md:backdrop-blur-sm">
  <span className="text-2xl sm:text-3xl flex-shrink-0">{icon}</span>
  <div>
    <h4 className="text-white text-sm font-semibold mb-0.5">{title}</h4>
    <p className="text-white/45 text-xs">{desc}</p>
  </div>
</Link>
```
