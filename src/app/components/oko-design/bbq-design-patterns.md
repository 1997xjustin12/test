# BBQ Design Patterns

Reference for all design decisions used across `bbq-design` pages and components.
Sourced from: `ProductGallery`, `Login`, `Cart`, `BasePlp`, `SingleProductPage`.

---

## Color Tokens

These custom tokens are defined in the Tailwind config/CSS and form the core palette.

| Token | Role | Light | Dark |
|---|---|---|---|
| `ash` | Page background | off-white | — |
| `char` / `charcoal` | Dark backgrounds, text | — | dark surface |
| `paper` | Elevated surface | light | — |
| `smoke` | Elevated surface dark equiv. | — | dark |
| `grate` | Default border | light gray | — |
| `theme-600/700` | Primary brand color | used in both modes |
| `gold` | Stars, deal badges | used in both modes |
| `bbq-green` | Savings, success states | used in both modes |
| `fire` / `ember` | Focus rings, danger accents | used in both modes |

---

## Dark Mode Strategy

Class-based dark mode (`dark:` prefix). Every surface, border, and text token has a paired dark variant.

### Page backgrounds
```
bg-ash dark:bg-char           ← main pages (Cart, BasePlp, SingleProductPage)
bg-stone-50 dark:bg-stone-950 ← auth pages (Login)
dark:bg-char                  ← ProductGallery <main>
```

### Cards / panels
```
bg-white dark:bg-char                              ← FormCard, modal-style
bg-paper dark:bg-smoke                             ← Cart items, assistance blocks
bg-white dark:bg-stone-900                         ← product cards (Products section)
bg-ash dark:bg-stone-900 / dark:bg-stone-900       ← category cards
```

### Borders
```
border-grate dark:border-white/10    ← default everywhere
border-stone-200 dark:border-stone-700 ← form inputs, FormCard
```

### Text hierarchy
```
text-char dark:text-ash                  ← primary headings and body
text-charcoal dark:text-white            ← form headings
text-stone-500 dark:text-stone-400       ← secondary / muted body
text-char/40 dark:text-ash/40            ← breadcrumbs, nav, dimmed labels
text-char/50 dark:text-ash/40            ← very subtle body copy
text-stone-400 dark:text-stone-500       ← metadata (brands, ratings)
```

### Brand / accent colors stay the same in both modes
```
text-theme-600
bg-theme-600 hover:bg-theme-700
bg-theme-600/10 dark:bg-theme-600/20    ← icon containers (tinted bg)
```

---

## Typography

Two font families used throughout:

| Font | Usage |
|---|---|
| `font-oswald` | All headings, labels, buttons, badges, breadcrumbs — always `uppercase` |
| `font-sora` | Body text, inputs, descriptions, page root (`font-sora` on wrapper) |

### Section heading pattern
```jsx
<p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
  Overline Label
</p>
<h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1 text-stone-900 dark:text-ash">
  Section Title
</h2>
```

### Page-level h1
```jsx
<h1 className="font-oswald font-bold text-2xl sm:text-3xl uppercase tracking-tight text-char dark:text-ash">
```

### Card label (small)
```jsx
<p className="font-oswald text-[11px] font-semibold uppercase tracking-wide text-char dark:text-ash">
```

### Muted body copy
```jsx
<p className="text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400">
```

---

## Layout

### Max-width container
```jsx
<div className="max-w-[1240px] mx-auto px-4 sm:px-6">
```

### Section padding
```
py-14 sm:py-16   ← homepage sections
py-8             ← inner utility sections (cart, plp)
py-6             ← page content areas (SPP, BasePlp)
```

### Product hero (2-col, sticky gallery)
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 lg:items-start">
  <div className="lg:sticky lg:top-[140px]">
    <ImageGallery />
  </div>
  <ProductInfo />
</div>
```

### Cart layout (main + sidebar)
```jsx
<div className="flex flex-col lg:flex-row gap-4 lg:items-start">
  <div className="flex-1 min-w-0 flex flex-col gap-2">
    {/* cart items */}
  </div>
  <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">
    {/* order summary + assistance */}
  </div>
</div>
```

### Category grid
```jsx
{/* BasePlp — subcategory cards */}
<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">

{/* Homepage Categories */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">

{/* Product grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
```

---

## Cards & Surfaces

### Standard content card
```jsx
className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm"
```

### Hoverable category / product card
```jsx
className="... hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200"
```

### Form card wrapper (`FormCard`)
```jsx
className="bg-white dark:bg-char rounded-sm border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden"
```

### Skeleton / loading placeholder
```jsx
className="animate-pulse"
// placeholder shapes:
className="bg-grate/60 dark:bg-white/5 rounded-sm"
```

### Empty state block
```jsx
<div className="flex flex-col items-center justify-center py-20 px-4 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm text-center">
```

### Icon container
```jsx
className="w-8 h-8 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center flex-shrink-0 text-theme-600"
```

---

## Buttons

### Primary CTA (standard)
```jsx
className="px-6 py-2.5 bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm transition-colors"
```

### Primary CTA with lift (product/cart actions)
```jsx
className="... hover:-translate-y-0.5 active:scale-[.98] transition-all"
```

### Full-width form submit
```jsx
className="w-full py-2.5 bg-theme-600 hover:bg-theme-700 text-white text-sm font-semibold rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
```

### Ghost / outline button (on dark backgrounds)
```jsx
className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/15 text-ash font-oswald font-semibold text-xs uppercase tracking-wide hover:border-theme-600 hover:text-theme-500 transition-colors rounded-sm"
```

### Add to Cart (SPP widget)
```jsx
className="flex-1 min-w-[140px] flex items-center justify-center gap-2 h-11 px-5 font-oswald font-semibold text-sm uppercase tracking-wide text-white bg-theme-600 hover:bg-theme-700 hover:-translate-y-0.5 active:scale-[.98] transition-all"
```

---

## Forms

### Input
```js
const inputClass =
  "w-full px-3.5 py-2.5 rounded-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-charcoal dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 transition-colors";
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

### Two-panel form layout (desktop side-by-side, mobile tabbed)
```jsx
{/* Mobile tab switcher — hidden on md+ */}
<div className="flex md:hidden p-1 rounded-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 mb-6">
  <button className={`font-oswald flex-1 py-2 text-sm font-semibold rounded-sm transition-all ${
    active ? "bg-white dark:bg-char text-charcoal dark:text-white shadow-sm"
           : "text-stone-500 dark:text-stone-400"
  }`}>...</button>
</div>

{/* Desktop: side-by-side panels with divider */}
<div className="flex">
  <div className="flex-1 p-8 lg:p-10">...</div>
  <div className="hidden md:block w-px bg-stone-100 dark:bg-stone-800 my-8" />
  <div className="flex-1 p-8 lg:p-10">...</div>
</div>
```

---

## Tabs

```jsx
{/* Container */}
className="p-1 rounded-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"

{/* Active tab */}
className="bg-white dark:bg-char text-charcoal dark:text-white shadow-sm"

{/* Inactive tab */}
className="text-stone-500 dark:text-stone-400"
```

---

## Navigation & Breadcrumbs

### Breadcrumb trail
```jsx
<nav aria-label="breadcrumb" className="flex items-center gap-1.5 mb-6">
  <Link className="text-xs text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors">
    Home
  </Link>
  <span className="text-xs text-grate dark:text-white/20">❯</span>
  <span className="text-xs text-char dark:text-ash font-medium">Current Page</span>
</nav>
```

### Back link
```jsx
<Link className="inline-flex items-center gap-1.5 font-oswald text-xs uppercase tracking-wide text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-600 transition-colors">
  {/* chevron-left svg */}
  Back to Shopping
</Link>
```

---

## Badges & Tags

```jsx
{/* Sale / percentage off */}
<span className="font-oswald text-[10px] font-semibold px-2 py-1 text-white bg-theme-600 uppercase tracking-wide rounded-sm z-[1]">
  -{pct}%
</span>

{/* Deal / featured badge */}
<span className="font-oswald text-[10px] font-semibold px-2 py-1 text-white bg-gold uppercase tracking-wide rounded-sm z-[1]">
  {badge}
</span>
```

---

## Icons

Always inline SVG. Never icon libraries.

```jsx
<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="..." />
</svg>
```

Size scale: `w-3.5 h-3.5` (button icons) → `w-4 h-4` (standard) → `w-8 h-8` (empty states)

---

## Sticky / Fixed Elements

```jsx
{/* Product page topbar */}
className="sticky top-[64px] lg:top-[105px] bg-charcoal z-10"

{/* Sticky product gallery column */}
className="lg:sticky lg:top-[140px]"

{/* Desktop sticky CTA — separate component from mobile */}
<StickyCTA />        {/* desktop */}
<MobileStickyCTA />  {/* mobile */}
```

---

## Performance Patterns

### Above-fold vs below-fold imports (SingleProductPage pattern)
```js
// Above-fold — direct import
import ImageGallery from "...";
import ProductInfo from "...";

// Below-fold — lazy loaded, no page-level suspense flash
const DescriptionSection = dynamic(
  () => import("..."),
  { loading: () => null }
);
```

### Image optimization
```jsx
<Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
  className="object-contain group-hover:scale-[1.03] transition-transform duration-300"
  quality={40}        // use for decorative/background images
  loading="lazy"      // below-fold images
  priority={i === 0}  // first image in a list
/>
```

---

## Section Structure Reference

| Section | Background (light) | Background (dark) | Notes |
|---|---|---|---|
| ProductGallery `<main>` | — | `bg-char` | full page wrapper |
| SingleProductPage | `bg-ash` | `dark:bg-char` | + `text-char dark:text-ash font-sora` |
| BasePlp | `bg-ash` | `dark:bg-char` | + `min-h-screen font-sora` |
| Cart | `bg-ash` | `dark:bg-char` | + `min-h-screen font-sora` |
| Login page | `bg-stone-50` | `dark:bg-stone-950` | auth pages use stone scale |
| Homepage sections | `bg-white` | `dark:bg-stone-950` | Categories, Promo, Faqs |
| Products section | `bg-ash` | `dark:bg-stone-950` | already had dark: set |
| Newsletter | `bg-char` | `dark:bg-stone-950` | always dark-looking |
| Brands strip | `bg-cream` | `dark:bg-stone-900` | + border-b |

---

## Dividers

```jsx
{/* Section divider */}
<div className="border-t border-grate dark:border-white/10 my-[30px]" />

{/* Form panel divider */}
<div className="hidden md:block w-px bg-stone-100 dark:bg-stone-800 my-8" />
```

---

## Product Card

Two canonical ProductCard implementations. Both share the same shell, badge map, brand/title/price anatomy, and action row structure. Differences are noted below.

### Card shell (both variants)
```jsx
<article className="group bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200">
```

### Image area
```jsx
{/* ui/ProductCard — object-cover, taller on sm */}
<div className="relative h-40 sm:h-52 bg-white dark:bg-char overflow-hidden">

{/* sp/ProductCard — object-contain, link wraps the area */}
<Link className="relative h-40 sm:h-48 bg-white dark:bg-char overflow-hidden">
```
Image always gets `group-hover:scale-105 transition-transform duration-300`.

### Badge map (shared by both)
```js
const BADGE_STYLES = {
  bestseller: "bg-gold text-white",
  sale:       "bg-ember text-white",
  new:        "bg-char text-white",
  openbox:    "bg-smoke text-white",
};
```
Badge markup: `absolute top-2 left-2` container, span uses `font-oswald text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide` + the color class above.

### Card body anatomy
```
brand label   → font-oswald text-[10px] uppercase tracking-widest text-theme-600
product title → font-sora text-sm font-semibold text-char dark:text-ash leading-snug line-clamp-2
                hover:text-theme-600 dark:hover:text-theme-500 transition-colors
star rating   → <StarRating /> component
price section → flex items-baseline gap-1.5  (always baseline-aligned)
                bordered top: border-t border-grate dark:border-white/10
                mt-auto to anchor to bottom of flex column
```

### Price row
```jsx
<div className="flex items-baseline gap-1.5 pt-3 mt-auto border-t border-grate dark:border-white/10">
  {/* current price — ember color, NOT theme-600 */}
  <span className="font-oswald font-bold text-base text-ember-deep dark:text-ember">
    ${formatPrice(price)}
  </span>
  {/* original/was price */}
  <span className="text-xs text-char/40 dark:text-ash/30 line-through">
    ${formatPrice(was)}
  </span>
  {/* savings */}
  <span className="font-oswald text-[10px] font-bold text-bbq-green">
    −${formatPrice(save_amt)}
  </span>
</div>
```
Note: current price uses `text-ember-deep dark:text-ember`, **not** `text-theme-600`. Price is a warm-red accent intentionally distinct from the brand theme color.

### Action row — Quick View button (both variants)
```jsx
<button
  aria-label="Quick view"
  className="w-9 h-9 min-w-[36px] flex items-center justify-center bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40 hover:bg-theme-600 hover:text-white dark:hover:text-white transition-colors"
>
  {/* magnifier SVG w-4 h-4 */}
</button>
```

### Action row — Add to Cart button

`ui/ProductCard` — ember color, fire emoji, no rounded:
```jsx
<button className="relative w-full uppercase font-oswald tracking-wide flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors bg-ember hover:bg-ember-deep text-white">
  {atcLoading ? <Eos3DotsLoading /> : <>🔥<span className="hidden sm:inline">&nbsp;Add to Cart</span></>}
</button>
```

`sp/ProductCard` — theme color, rounded-sm, invisible-text loading overlay pattern:
```jsx
<button
  disabled={loading}
  className="relative flex-1 h-9 flex items-center justify-center font-oswald font-semibold text-xs uppercase tracking-wide text-white bg-theme-600 hover:bg-theme-700 rounded-sm transition-colors disabled:opacity-60"
>
  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "" : "invisible"}`}>
    <Eos3DotsLoading />
  </div>
  <span className={loading ? "invisible" : ""}>Add to Cart</span>
</button>
```

### Action row — Call button (`sp/ProductCard` only)
```jsx
<Link
  href={`tel:${STORE_CONTACT}`}
  className="h-9 px-2.5 flex items-center justify-center border border-theme-600 text-theme-600 font-oswald font-semibold text-xs uppercase tracking-wide hover:bg-theme-600/10 rounded-sm transition-colors whitespace-nowrap"
>
  Call
</Link>
```

### Found It Cheaper (FicDropDown trigger, both variants)
```jsx
<div className="text-xs text-white flex items-center cursor-default gap-[7px] flex-wrap hover:text-theme-600 transition-colors">
  Found It Cheaper?
  <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
    <ICRoundPhone width={14} height={14} />
    <span>{STORE_CONTACT}</span>
  </div>
</div>
```

### Body padding differences
| Variant | Body padding |
|---|---|
| `ui/ProductCard` | `p-2.5 sm:p-4`, margin-based spacing between elements |
| `sp/ProductCard` | `flex flex-col gap-1.5 p-3 flex-1` + `mt-auto` on price |

---

## Two-Tone CTA Block (SupportCTA pattern)

Split panel: dark side (email) + brand color side (phone).

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 rounded-sm overflow-hidden border border-grate dark:border-white/10">
  <div className="bg-char p-7 ...">
    {/* ghost button */}
    <Link className="bg-white/5 border border-white/15 text-ash hover:border-theme-600 hover:text-theme-500 ...">
  </div>
  <div className="bg-theme-600 p-7 ...">
    {/* solid white button */}
    <Link className="bg-white hover:bg-ash text-theme-700 ...">
  </div>
</div>
```
