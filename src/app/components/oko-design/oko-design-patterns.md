# OKO Design Patterns

Reference for design decisions in `oko-design` pages and components (Outdoor Kitchen Outlet). Written 2026-10-22 from the components already built to the OKO design system. They cite its sections as `§n` in comments, and those numbers are kept here so the two can be cross-checked.

The look: a warm workshop catalogue. Cream and charcoal surfaces, one barn-red accent, square corners, hairline borders, no shadows, no motion for its own sake.

---

## Key Differentiators vs BBQ and Solana

| | OKO | BBQ (`bbq-design`) | Solana (`new-design`) |
|---|---|---|---|
| Corners | `rounded-[2px]`, everywhere | `rounded-sm` | `rounded-xl` / `rounded-2xl` |
| Pills | Never (§5): small bordered labels instead | Square labels | `rounded-full` |
| Shadows | Never (§1, §9). Floating surfaces are solid with a border (§5) | Hover shadows | Hover shadows |
| Accent | `oko-barn` only | Theme colour + ember | Theme colour |
| Emoji | Never (§6): inline stroke SVG icons | Allowed | Allowed |
| Loading | Static placeholders, no shimmer (§7) | Skeletons | Skeletons |
| Body font | Inter | Sora | Sans |

---

## Color Tokens

Defined in `tailwind.config.ts`.

| Token | Hex | Use |
|---|---|---|
| `oko-char` | `#26221F` | Primary text, outline buttons, dark bands |
| `oko-char-soft` | `#3A332E` | Secondary text, the dark feature band surface (§8.11) |
| `oko-cream` | `#F6F2EA` | Page background (light), text on dark |
| `oko-cream-dim` | `#EBE4D6` | Image wells, input fills, alternate sections |
| `oko-barn` | `#9C3B34` | **The** accent: primary buttons, eyebrows, brand names, sale badges, focus ring |
| `oko-barn-dark` | `#7A2C27` | Primary button hover |
| `oko-barn-light` | `#C0564C` | Barn on dark surfaces |
| `oko-sage` | `#5C6B4F` | Secondary path: savings, free shipping, text links (§5) |
| `oko-sage-light` | `#8AA07C` | Sage on dark surfaces |
| `oko-stone` | `#8C8478` | Muted text, labels, breadcrumb |
| `oko-stone-line` | `#DAD2C0` | Every border and divider (light) |
| `oko-brass` | `#B08A3E` | **Ratings only** (§2): stars, nowhere else |
| `oko-night` | `#17130F` | Page background (dark) |
| `oko-night-2` | `#221D18` | Cards and panels (dark) |
| `oko-night-3` | `#1E1914` | Image wells and inputs (dark) |
| `oko-line-dark` | `#3A332C` | Borders and dividers (dark) |
| `oko-ondark` / `-muted` / `-faint` | `#D8D1C3` / `#C9C2B3` / `#A79F8D` | Text tiers on dark surfaces |

**Barn means action or urgency; sage means the secondary or reassuring path** (§5). Don't introduce other accent colours.

---

## Dark Mode Strategy

Every surface pairs a light token with its `oko-night` counterpart.

| Element | Light | Dark |
|---|---|---|
| Page | `bg-oko-cream` | `dark:bg-oko-night` |
| Card / panel | `bg-white` | `dark:bg-oko-night-2` |
| Image well / input / inner panel | `bg-oko-cream-dim` | `dark:bg-oko-night-3` |
| Border | `border-oko-stone-line` | `dark:border-oko-line-dark` |
| Heading text | `text-oko-char` | `dark:text-oko-cream` |
| Body / secondary text | `text-oko-char-soft` | `dark:text-oko-ondark` |
| Muted text | `text-oko-stone` | (same, or `dark:text-oko-ondark-faint`) |
| Barn | `text-oko-barn` | `dark:text-oko-barn-light` |
| Sage | `text-oko-sage` | `dark:text-oko-sage-light` |

---

## Typography

Fonts: `font-oko-display` (slab serif, headings), Inter (body, set on the `.outdoorkitchenoutlet` scope in `globals.css`), `font-oko-mono` (eyebrows).

| Role | Classes |
|---|---|
| Page H1 | `font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream` |
| Hero H1 | `font-oko-display font-semibold text-[clamp(26px,5vw,42px)] leading-[1.12]` |
| Section H2 | `font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream` |
| Eyebrow (§8.7) | `font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light` |
| Form label | `font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone` |
| Body | `font-inter text-[13.5px] leading-relaxed text-oko-char-soft dark:text-oko-ondark` |
| Muted line | `font-inter text-[12px]`–`[13.5px] text-oko-stone` |
| Brand name on cards | `font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn` |

**Section header (§8.7):** a mono eyebrow above a display H2, with an optional sage text link on the right:

```jsx
<div className="flex items-end justify-between gap-4 mb-8">
  <div>
    <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">Today's deals</span>
    <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">Best sellers on sale</h2>
  </div>
  <Link className="font-inter font-semibold text-[13px] text-oko-sage dark:text-oko-sage-light border-b border-oko-sage pb-0.5 hover:text-oko-barn hover:border-oko-barn">See all deals →</Link>
</div>
```

Copy voice is plain and specific (§10), with no exclamation marks in headings.

---

## Layout

| Pattern | Classes |
|---|---|
| Container | `max-w-[1260px] mx-auto px-5 sm:px-8` (narrow content: `max-w-[720px]`) |
| Section padding | `py-16` |
| Product grid | `grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 gap-[22px]` |
| Alternate section background | `bg-oko-cream-dim dark:bg-oko-night-2` |

Some older OKO files still use BBQ's `max-w-[1240px] px-4 sm:px-6` from the scaffold; new work uses the OKO container.

---

## Cards & Surfaces

**Standard card / panel:**

```
bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5 sm:p-6
```

**Inner panel:** `bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5`

**Product card (§8.10):** white and bordered, with a square `bg-oko-cream-dim` image well and the image `object-contain p-4`. Below it: the brand eyebrow in barn, the name (Inter 14px), a review line (brass stars and "N reviews", or "No reviews"), and the price block (struck-through was price in stone, price in Inter semibold 16px, "Save $x" in sage). Hover changes the border or scales the image `scale-[1.03]`; no lift, no shadow. Two versions:
- `sections/Products.jsx`: the homepage card, with a 34px outline "+" button.
- `ui/ProductCard.jsx`: the listing card, with Quick View and Add to cart buttons and the "Found it cheaper?" call line.

**Dark feature band (§8.11):** the one dark section on a page: `bg-oko-char-soft` surface, with a contained action block around the phone. Never a large barn fill.

**Floating surfaces (§5):** sticky or floating bars use a solid `bg-oko-char` with a border, never a shadow.

---

## Buttons

| Kind | Classes |
|---|---|
| Primary (barn) | `bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] py-3 transition-colors disabled:opacity-60` |
| Secondary (outline, inverts) | `border border-oko-char dark:border-oko-cream text-oko-char dark:text-oko-cream rounded-[2px] hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors` |
| Icon button (34–36px) | Square, `border border-oko-stone-line rounded-[2px]`, inverts to char on hover |
| Text link | `font-inter font-semibold text-[12.5px] text-oko-sage dark:text-oko-sage-light border-b border-transparent hover:border-oko-sage hover:text-oko-barn` |

One barn button per area: barn is the primary action, sage the secondary path (§5).

---

## Forms

| Element | Classes |
|---|---|
| Input | `w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light` |
| Disabled input | `disabled:bg-transparent disabled:border-dashed disabled:text-oko-char-soft` |
| Label | see Typography: form label |
| Quantity stepper (§9) | Three 34px bordered squares, 2px radius |

---

## Badges & Labels (§5)

Small square labels; never pills.

```
font-inter font-semibold text-[10px] uppercase tracking-[0.04em] px-2 py-1 rounded-[2px]
```

| Badge | Colour |
|---|---|
| Sale | `bg-oko-barn text-white` |
| Free shipping | `bg-oko-sage text-white` (only on products tagged for it) |
| Bestseller | `bg-oko-brass text-white` |
| New | `bg-oko-char text-oko-cream` |
| Open Box | `bg-oko-char-soft text-white` |

Bordered label variant: `border border-oko-stone-line rounded-[2px]` with stone text.

---

## Common Components (§9)

| Component | Pattern |
|---|---|
| Breadcrumb | 12px stone text, `/` separators, current page in char |
| Specs table | Bordered, `oko-stone-line` row dividers, stone uppercase labels |
| FAQ accordion | Rows separated by `oko-stone-line`, stroke chevron |
| Empty state | Centred card: display heading, 13.5px stone line, one barn button |
| Alerts | Bordered panel; barn for errors, sage for success |

---

## Icons & Imagery (§6)

- **No emoji**, anywhere: in the UI, buttons or labels.
- **Inline stroke SVGs**, `fill="none" stroke="currentColor" strokeWidth="1.6"`–`"1.8"`, sized `w-4 h-4` in buttons.
- **Ratings** are brass star glyphs (★/☆) or SVGs, with an `sr-only` text equivalent.

---

## Motion & Loading (§7)

- **Colour transitions only** (`transition-colors`), plus a gentle image `scale-[1.03]` on card hover.
- **No skeletons or shimmer.** Loading states are static placeholders.
- **Reduced motion:** the `.outdoorkitchenoutlet` scope in `globals.css` turns off all animation and transitions for `prefers-reduced-motion`.

---

## Accessibility (§12)

- **Focus ring:** a visible `2px solid` barn ring on every interactive element (barn-light in dark mode), set globally on the brand scope.
- **Icon-only buttons** have an `aria-label`.
- **Ratings** carry an `sr-only` sentence ("Rated 4 out of 5, 12 reviews"). With no reviews, the card says "No reviews" literally.
- **Contrast:** barn and sage switch to their `-light` versions on dark surfaces.

---

## Sections Index (as cited in components)

| § | Topic | Example component |
|---|---|---|
| §1 | No glows, no shadows | (throughout) |
| §2 | Brass is for ratings only | `ui/StarRating`, card review lines |
| §5 | Barn = action, sage = secondary; no pills; floating surfaces solid char | badges, floating bars |
| §6 | No emoji; stroke icons | (throughout) |
| §7 | No loading skeletons with motion | static placeholders |
| §8.4 | Promo strip | `sections/` promo strip |
| §8.5 | Hero | `sections/Hero.jsx` |
| §8.6 | Trust strip | `sections/Trust.jsx` |
| §8.7 | Section header | section headers |
| §8.8 | Category descriptors | category cards |
| §8.9 | Brand strip | brand strip |
| §8.10 | Product card | `sections/Products.jsx`, `ui/ProductCard.jsx` |
| §8.11 | Dark feature band | CTA band |
| §8.12 | Testimonials | testimonials |
| §8.13 | SEO / footer content block | footer content |
| §9 | Breadcrumb, specs table, FAQ, empty states, stepper, alerts | various |
| §10 | Copy voice | descriptors |
| §11 | (cited in a section's background prop) | — |
| §12 | Accessibility | ratings, focus |
