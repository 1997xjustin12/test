# Outdoor Kitchen Outlet — Design System Specification

**Purpose:** This document is the single source of truth for building out the full e-commerce site. Every new page and component must be derived from the tokens and patterns below. Do not introduce colors, fonts, radii, or shadows that are not defined here.

---

## 1. Design direction

**Warm American workshop retail.** Cream paper stock, charcoal ink, barn-red as the only true action color, and a high-contrast serif doing all the talking. The feel is a well-made trade catalog, not a SaaS storefront — flat, printed, square-cornered, confident about price.

The commercial thesis of this site is **the phone number**. Every page is built to push toward a call, because the business claims phone-only pricing that isn't listed. The phone number is a first-class design element, not a footer detail.

**Three rules that define the look. Break any one and it stops being this brand:**

1. **No shadows. Ever.** Separation is achieved with a 1px border and a background shift, never elevation. There is no shadow scale in this system.
2. **2px border-radius on everything rectangular.** Not 0, not 8px. Just barely softened. Only circles (avatars, badges, floating buttons) use `50%`.
3. **Barn red is reserved.** It marks action and urgency only — primary buttons, sale badges, phone numbers, brand eyebrows, active nav. It is never a decorative fill or a large background.

---

## 2. Color

### Tokens

```css
--char:        #26221F;  /* charcoal — primary text, dark surfaces, footer */
--char-soft:   #3A332E;  /* softened charcoal — body copy, dark feature bands */
--cream:       #F6F2EA;  /* page background (default surface) */
--cream-dim:   #EBE4D6;  /* alternate section surface, input fills, image wells */
--barn:        #9C3B34;  /* PRIMARY ACTION — buttons, sale, phone, urgency */
--barn-dark:   #7A2C27;  /* barn hover/pressed */
--barn-light:  #C0564C;  /* barn on dark backgrounds only (contrast-safe) */
--sage:        #5C6B4F;  /* SECONDARY — logistics, savings, "view all" links */
--stone:       #8C8478;  /* muted/tertiary text, inactive states */
--stone-line:  #DAD2C0;  /* all borders and dividers on light surfaces */
--brass:       #B08A3E;  /* ratings and stars ONLY — never anything else */
```

### Semantic assignment (do not deviate)

| Role | Token |
|---|---|
| Page background | `--cream` |
| Card / header / nav surface | `#fff` |
| Alternate band surface | `--cream-dim` |
| Dark band surface | `--char-soft` |
| Footer / promo strip surface | `--char` |
| Heading text | `--char` |
| Body text | `--char-soft` |
| Muted / meta / placeholder | `--stone` |
| Border, divider, rule | `--stone-line` |
| Primary button, sale badge, urgency | `--barn` |
| Free shipping, savings, secondary link | `--sage` |
| Star ratings | `--brass` |

### Borders on dark surfaces

Never use `--stone-line` on dark. Use translucent cream instead:

```css
--line-on-dark-strong: rgba(246,242,234,0.22);  /* inputs, interactive edges */
--line-on-dark:        rgba(246,242,234,0.16);  /* card and cell borders */
--line-on-dark-faint:  rgba(246,242,234,0.14);  /* section dividers */
```

Text on dark: headings `#fff`, body `#D8D1C3`, muted `#C9C2B3`, faint `#A79F8D`, legal `#8A8272`.

### Section background rhythm

Pages alternate surfaces to create rhythm without dividers. The homepage sequence is:

`cream-dim (announce) → white (header/nav) → char (promo) → hero image → white (trust) → cream (section) → white (brand strip) → cream-dim (products) → char-soft (feature band) → cream (testimonials) → cream-dim (SEO) → char (footer)`

**Rule for new pages:** never place two identical surfaces adjacent without a border between them. Alternate `cream` and `cream-dim` for content sections, and drop in one `char-soft` band per page maximum as a focal break.

---

## 3. Typography

### Families

```css
--font-display: 'Fraunces', serif;          /* weights 500, 600, 700 */
--font-body:    'Inter', sans-serif;        /* weights 400, 500, 600 */
--font-mono:    'IBM Plex Mono', monospace; /* weight 500 */
```

- **Fraunces** — all headings, the logo wordmark, the large phone number, and testimonial-adjacent display moments. Default weight 600. Italic is used for the emotional payoff word in a headline (`<em>guaranteed.</em>`) and is always colored `--barn-light` on dark or `--barn` on light.
- **Inter** — all body copy, navigation, buttons, prices, product names, form fields. Never used above 19px.
- **IBM Plex Mono** — eyebrows/kickers and numeric counters (cart badge) only. This is the "spec sheet" voice. Do not use it for body text.

### Size scale

```css
--fs-01:  9px;    --fs-07: 12.5px;  --fs-13: 16px;
--fs-02: 10px;    --fs-08: 13px;    --fs-14: 19px;
--fs-03: 10.5px;  --fs-09: 13.5px;  --fs-15: 21px;
--fs-04: 11px;    --fs-10: 14px;    --fs-16: 27px;
--fs-05: 11.5px;  --fs-11: 14.5px;  --fs-17: 29px;
--fs-06: 12px;    --fs-12: 15.5px;  --fs-18: 42px;
```

The half-pixel steps are intentional. They produce the dense, tightly-graded feel of a printed catalog. Keep them.

### Applied scale

| Use | Size | Family | Weight | Line-height |
|---|---|---|---|---|
| Hero H1 | `--fs-18` | display | 600 | 1.12 |
| Dark band H2 | `--fs-17` | display | 600 | 1.18 |
| Section H2 | `--fs-16` | display | 600 | 1.2 |
| Sub-section H2 | `--fs-15` | display | 600 | 1.3 |
| Logo / footer logo | `--fs-14` | display | 600 | 1.1 |
| Price (current) | `--fs-13` | body | 600 | 1.2 |
| Hero lede | `--fs-12` | body | 400 | 1.55 |
| Body paragraph | `--fs-11` | body | 400 | 1.55 |
| Product name | `--fs-10` | body | 500 | 1.3 |
| Body small / testimonial | `--fs-09` | body | 400 | 1.55 |
| Button label | `--fs-09` | body | 600 | 1 |
| Nav link | `--fs-08` | body | 600 | 1 |
| Footer / list link | `--fs-07` | body | 400–500 | 1.5 |
| Meta, review count | `--fs-05` | body | 400 | 1.4 |
| Brand eyebrow, footer heading | `--fs-04` | body | 600 | 1.2 |
| Section eyebrow | `--fs-04` | mono | 500 | 1.2 |
| Icon label | `--fs-03` | body | 400 | 1.2 |
| Logo subline | `--fs-02` | body | 400 | 1.2 |
| Counter badge | `--fs-01` | mono | 500 | 1 |

Global body line-height: **1.55**. Headings are always tighter (1.1–1.3).

### Letter-spacing rule

**Tracking increases as size decreases. All-caps text is always tracked.**

| Size band | Tracking |
|---|---|
| ≥ 19px (display) | `0` to `0.02em` |
| 14–16px | `0` |
| 12.5–13.5px, uppercase | `0.03em` – `0.05em` |
| 11–12px, uppercase | `0.04em` – `0.08em` |
| 10–10.5px, uppercase | `0.06em` – `0.14em` |
| Mono eyebrow (11px) | `0.14em` |
| Logo subline (10px) | `0.32em` |

### Case rules

- Headlines: **sentence case, ending in a period** when they are a statement ("Listed prices aren't always our best price.").
- Navigation, eyebrows, badges, footer headings, brand eyebrows: **UPPERCASE**.
- Buttons and product names: **sentence case**.
- Never use title case anywhere.

---

## 4. Spacing and layout

### Container

```css
--wrap-max: 1260px;
--wrap-pad: 32px;   /* desktop */
```

Every full-width band contains a `.wrap` at max 1260px with 32px side padding. The band's background bleeds full-width; the content never does.

### Spacing scale

Normalize all spacing to this scale. Existing ad-hoc values round to the nearest step.

```css
--sp-1:  4px;   --sp-5: 20px;   --sp-9:  48px;
--sp-2:  8px;   --sp-6: 24px;   --sp-10: 56px;
--sp-3: 12px;   --sp-7: 32px;   --sp-11: 64px;
--sp-4: 16px;   --sp-8: 40px;   --sp-12: 80px;
```

### Vertical rhythm

- Standard content section: `padding: 64px 0`
- Compact band (brand strip): `padding: 36px 0`
- Footer top: `52px 32px 36px`
- Section header to content gap: `32px`
- Fixed bar heights: announcement `38px`, promo strip `46px`, nav `52px`, header `96px`

### Grid presets

| Grid | Columns | Gap |
|---|---|---|
| Category cards | `repeat(4, 1fr)` | 18px |
| Product cards | `repeat(4, 1fr)` | 22px |
| Testimonials | `repeat(3, 1fr)` | 22px |
| Feature cells | `repeat(2, 1fr)` | 20px |
| Dark band (copy / cells) | `0.85fr 1.15fr` | 56px |
| Prose + links | `1.15fr 0.85fr` | 52px |
| Footer | `1.3fr 1fr 1fr 1fr 1.2fr` | 32px |

Aspect ratios: category card `4/3`, product image `1/1`, hero media `520px` fixed height.

---

## 5. Surfaces, borders, radius

```css
--radius: 2px;          /* everything rectangular */
--radius-pill: 50%;     /* counters, floating buttons */
--border: 1px solid var(--stone-line);
```

- Logo lockup is the **one exception**: `1.5px solid var(--barn)`.
- **No `box-shadow` anywhere in the system.** If something needs to float above the page (popups, chat bubble, sticky bars), it uses a solid `--char` background and its own contrast — not a shadow.
- Cards are `#fff` with a `--stone-line` border. Card image wells are `--cream-dim` with a bottom border separating them from the body.

---

## 6. Iconography

- **Inline SVG only.** No icon fonts, no raster icons.
- Style: **stroke-only, no fill**, `viewBox="0 0 24 24"`, Feather/Lucide geometry.
- Stroke width: `1.6` for header/utility icons, `2` for feature and trust icons.
- Rendered size: 16px (inline), 18–20px (trust/feature), 22px (floating).
- Stroke color inherits the semantic context: `--char` in the header, `--barn` in trust strips, `#fff` on dark.

---

## 7. Motion

Deliberately minimal — this is a print-feeling site.

```css
--t-fast: .25s;   /* opacity, color */
--t-slow: .3s;    /* transform */
```

- Only two motion patterns exist: **image opacity/scale on card hover** (`opacity .25s, transform .3s`, scale to `1.03`) and **color inversion on button hover**.
- Add `transition: background-color .2s, color .2s, border-color .2s` to all interactive elements for consistency (the original omits this).
- No scroll animations, no parallax, no entrance reveals, no loading skeletons with shimmer.
- Wrap all motion in `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }`.

---

## 8. Component patterns

### 8.1 Announcement bar
`--cream-dim` background, bottom border, 38px tall, centered 13px text. Contains one promise and the phone number in `--barn` semibold. Competitor names may be styled in display italic for emphasis.

### 8.2 Header (96px, white)
Three zones: **logo lockup** (bordered box, display wordmark + tracked subline) — **search pill** (flex:1, max 460px, `--cream-dim` fill, 1px border, 2px radius, borderless input + trailing 16px stroke icon) — **right cluster** (stacked "Best prices by phone" tag over the number in `--barn`, then icon-over-label utility links with an absolutely-positioned circular `--barn` counter badge).

### 8.3 Primary nav (52px, white)
Horizontal, 34px gap, uppercase 12.5px/600 with `0.05em` tracking, `2px solid transparent` bottom border that becomes `--barn` on hover along with the text. One item (Sale) is permanently `--barn`.

### 8.4 Promo strip (46px, charcoal)
Centered offer text with a white rectangular call button. Used for the single loudest current offer. One per page, maximum.

### 8.5 Hero
520px media, image at `opacity: 0.9` over `--char`, with a **horizontal scrim** so copy stays legible over the left third:

```css
background: linear-gradient(90deg,
  rgba(38,34,31,0.88) 0%,
  rgba(38,34,31,0.62) 42%,
  rgba(38,34,31,0.08) 72%);
```

Copy is absolutely positioned, left-anchored, max 640px: H1 (with one italic barn-light phrase) → 15.5px lede at max 460px → two-column checkmark benefit list (`✓` in `--barn-light`) → primary + outline button pair → a `--barn` corner tag bottom-right.

### 8.6 Trust strip (white)
Four items in a row. Dividers are `border-left: 1px solid var(--stone-line)` on every item except the first, with 20px left padding. 18px `--barn` stroke icon + 12.5px/500 label.

### 8.7 Section header
`display:flex; justify-content:space-between; align-items:flex-end`. Left: mono uppercase eyebrow in `--barn` (11px, `0.14em`) above the display H2. Right: a "View all →" link in `--sage` with a 1px bottom border. Margin-bottom 32px.

### 8.8 Category card
`4/3` aspect over `--char`. Image at `opacity: 0.8`, hover `0.6` + `scale(1.03)`. Bottom-left label block: 16px display name over an 11.5px descriptor listing what's inside the category.

### 8.9 Brand strip (white, bordered top and bottom)
Brand names as **display-font wordmarks in `--stone`**, not logo images, space-between across the row, turning `--barn` on hover. Ends with an "All 30+ brands →" link in `--barn`.

### 8.10 Product card
White, bordered, 2px radius.
- **Media:** `1/1`, `--cream-dim` well, bottom border. Badges: `--barn` "SALE" top-left, `--sage` "FREE SHIPPING" top-right, both 4px/9px padding, uppercase, ~10px. If there's no sale badge, the shipping badge moves to top-left.
- **Body (16px padding):** `--barn` uppercase brand eyebrow → 14px/500 product name → review line (brass stars + count, or the literal text "No reviews").
- **Price row:** flex space-between. Left is a three-part price block — struck-through `--stone` "was", 16px/600 `--char` "now", and a `--sage` "Save $X" line. Right is a 34px square outline `+` button that inverts to `--char` fill on hover.

**Never hide the "No reviews" state.** Showing it consistently is part of the catalog honesty voice.

### 8.11 Dark feature band
`--char-soft` background. Left column: barn-light mono eyebrow → 29px white H2 (max 400px) → 14.5px paragraph → a solid `--barn` block containing a stroke phone icon and the number in **display 700 at 20px**. Right column: 2×2 grid of cells bordered in `--line-on-dark`, each 20px padded with a 14.5px white bold label over 13px `#C9C2B3` copy.

### 8.12 Testimonial card
White, bordered, 24px padding. Brass star row → 13.5px quote → attribution formatted **"D. Ferraro — Scottsdale, AZ"** (initial, surname, em dash, city, state) in 12px/600 `--stone`.

### 8.13 SEO / footer content block
`--cream-dim`, bordered top and bottom, split `1.15fr 0.85fr`. Left: 21px H2, two prose paragraphs at 13.5px, then a wrapped row of `--sage` brand links. Right: two columns of categorized links under 11.5px uppercase `--stone` headings.

### 8.14 Footer
`--char`, five columns. Column 1 is the brand block: display wordmark, 12.5px description at max 280px, and an inline newsletter form (bordered container, transparent input, solid `--barn` button, no gap between them). Columns 2–5 are link lists under `--barn-light` uppercase 11px headings. Bottom bar is divided by `--line-on-dark-faint`, 11.5px `#8A8272`, copyright left and legal links right.

### 8.15 Persistent overlays
- **Chat launcher:** 52px `--sage` circle, fixed bottom-right 24px, white stroke icon.
- **Offer bar:** fixed bottom-left, `--char` background, barn-light display headline over 11.5px muted copy, with a dismiss control. **Must be a real `<button>`**, not a span.

---

## 9. Components to build (not in the source file)

Specify these in the same language:

- **Breadcrumb** — 12px `--stone`, `/` separators, current page in `--char-soft`. Sits directly under the nav on `--cream`.
- **Collection page** — left filter rail (240px) on `--cream-dim` with `--stone-line` dividers between filter groups; group headings use the 11px uppercase `--stone` treatment. Product grid is 3-up beside the rail. Sort control is a bordered 2px-radius select matching the search pill.
- **Pagination** — square 34px bordered cells matching the `+` button; current page is filled `--char`.
- **Product detail page** — gallery left on a `--cream-dim` well with a 1/1 main image and a thumbnail strip; buy box right containing brand eyebrow, display-font product title (27px), star row, the three-part price block scaled up, a quantity stepper (three 34px bordered squares), a full-width `--barn` "Add to cart" button, and directly beneath it a bordered `--cream-dim` panel repeating the phone number with "Call for a lower price." Specs go in a bordered table with `--stone-line` row dividers and `--stone` uppercase labels in the left column.
- **Quantity stepper** — `−` / value / `+` in three 34px bordered squares, 2px radius, matching the card add button's hover inversion.
- **Cart drawer** — white, 420px, slides from right, `--stone-line` left border, no shadow. Line items are bordered rows. Footer of the drawer is `--cream-dim` with the subtotal and a full-width `--barn` checkout button.
- **Form fields** — copy the search pill: `--cream-dim` fill, `1px solid --stone-line`, 2px radius, 12px/16px padding, 14px Inter. Labels are 11px uppercase `--stone` above the field. Error state uses a `--barn` border and 12px `--barn` helper text below. Never rely on placeholders as labels.
- **Alerts / toasts** — bordered 2px-radius blocks, no shadow. Success uses a `--sage` left border (4px), error uses `--barn`. Body copy 13.5px on `#fff`.
- **Empty states** — centered, 24px display heading, 13.5px `--stone` line, one `--barn` primary button. Use plain direction, never apology.
- **Tabs / accordions** — tab labels use the nav treatment (uppercase 12.5px with the 2px barn underline); accordion rows are separated by `--stone-line` with a stroke chevron.

---

## 10. Copy voice

- **Headlines are statements with periods.** They make a claim, and the payoff word is italic.
- **Price is always framed as a delta:** was, now, and the saving named in dollars.
- **The phone number appears on every page at least three times** — announcement bar, header, and one in-page block — and always as `888-667-4986`, never abbreviated.
- **Links that lead deeper end in `→`.** Links that are just navigation don't.
- **Sentence case, plain verbs, no exclamation marks.** "Call now," "Shop grills," "See all deals."
- **Buttons name their outcome** and keep the same word through the flow: an "Add to cart" button produces "Added to cart."
- **Descriptors under category names list contents,** not benefits ("Gas, pellet, charcoal, kamado" — not "Grills you'll love").

---

## 11. Responsive system

The source file's responsive layer is incomplete and partly non-functional. Build it properly:

```css
--bp-lg: 1024px;
--bp-md: 768px;
--bp-sm: 560px;
```

**≤1024px**
- Category, product, and testimonial grids → 2 columns. Trust strip → 2×2 (remove `border-left`, add `border-top` on the second row instead).
- Dark band and SEO block → single column.
- Footer → 2 columns; brand block spans both.
- **The hero cannot stay absolutely positioned.** Switch it to a stacked layout: image becomes a 280–320px banner, copy sits below it on `--char` with 32px padding. The existing `grid-template-columns:1fr` rule on `.hero .wrap` does nothing because the hero is not a grid — delete it.
- **Do not simply hide the nav.** Replace it with a hamburger that opens a full-screen `--cream` panel; links keep their uppercase treatment at 15px with `--stone-line` dividers.

**≤768px**
- Hero H1 → 30px, section H2 → 22px. Section padding → 44px.
- Wrap padding → 20px.
- Search collapses into an icon that expands to a full-width row under the header.
- Header height → 64px; move the phone number into a sticky bottom bar (`--barn`, full width, 52px, "Call 888-667-4986").

**≤560px**
- All grids → 1 column. Footer → 1 column.
- Hero H1 → 26px. Trust strip → stacked rows.
- Persistent overlays: keep the offer bar, drop the chat bubble (they collide).

Use `clamp()` for the three display sizes rather than hard breakpoint jumps:
`--fs-18: clamp(26px, 5vw, 42px);`

---

## 12. Accessibility floor

Non-negotiable for every component:

- **Visible focus ring on everything interactive:** `outline: 2px solid var(--barn); outline-offset: 2px;` (use `--barn-light` on dark surfaces). The system has no focus styles today — add them globally.
- Every icon-only control needs an accessible name (`aria-label`). This includes the search input, the `+` add-to-cart buttons, the cart link, and the popup dismiss.
- Dismiss controls, steppers, and toggles are `<button>` elements, not `<span>`s.
- Text over the hero must sit within the ≥0.62 opacity region of the scrim. Verify 4.5:1 against the actual image, not the flat color.
- `--stone` (#8C8478) on `--cream` is roughly 3.4:1 — **it fails for body text.** Use it only for ≥16px or bold text, meta labels, and non-essential detail. For anything a customer must read, use `--char-soft`.
- Star ratings need a text equivalent ("Rated 5 out of 5, 2 reviews") for screen readers.
- Product cards: the whole card should not be one link. Link the product name, keep the add button separate.

---

## 13. Copy-paste token block

```css
:root{
  /* color */
  --char:#26221F; --char-soft:#3A332E;
  --cream:#F6F2EA; --cream-dim:#EBE4D6;
  --barn:#9C3B34; --barn-dark:#7A2C27; --barn-light:#C0564C;
  --sage:#5C6B4F; --stone:#8C8478; --stone-line:#DAD2C0; --brass:#B08A3E;
  --line-on-dark-strong:rgba(246,242,234,0.22);
  --line-on-dark:rgba(246,242,234,0.16);
  --line-on-dark-faint:rgba(246,242,234,0.14);
  --text-on-dark:#D8D1C3; --text-on-dark-muted:#C9C2B3;
  --text-on-dark-faint:#A79F8D; --text-on-dark-legal:#8A8272;

  /* type */
  --font-display:'Fraunces',serif;
  --font-body:'Inter',sans-serif;
  --font-mono:'IBM Plex Mono',monospace;
  --fs-01:9px;   --fs-02:10px;  --fs-03:10.5px; --fs-04:11px;
  --fs-05:11.5px;--fs-06:12px;  --fs-07:12.5px; --fs-08:13px;
  --fs-09:13.5px;--fs-10:14px;  --fs-11:14.5px; --fs-12:15.5px;
  --fs-13:16px;  --fs-14:19px;  --fs-15:21px;   --fs-16:27px;
  --fs-17:29px;  --fs-18:clamp(26px,5vw,42px);
  --lh-body:1.55; --lh-tight:1.2; --lh-display:1.12;

  /* space */
  --sp-1:4px;  --sp-2:8px;  --sp-3:12px; --sp-4:16px;
  --sp-5:20px; --sp-6:24px; --sp-7:32px; --sp-8:40px;
  --sp-9:48px; --sp-10:56px;--sp-11:64px;--sp-12:80px;

  /* structure */
  --wrap-max:1260px; --wrap-pad:32px;
  --radius:2px; --radius-pill:50%;
  --border:1px solid var(--stone-line);
  --t-fast:.25s; --t-slow:.3s;
  --h-announce:38px; --h-promo:46px; --h-nav:52px; --h-header:96px;
}
```

Load fonts as: `Fraunces:wght@500;600;700`, `Inter:wght@400;500;600`, `IBM+Plex+Mono:wght@500`, with `display=swap`.

---

## 14. One honest risk

Warm cream backgrounds near `#F4F1EA` paired with a high-contrast serif and a terracotta-family accent are currently the single most common look produced by AI design tools — it appears regardless of subject. This palette sits close to that cluster.

What keeps it from reading generic is the parts that are specific to the subject: the deep, brown-shifted barn red rather than a bright terracotta, the sage/brass pair doing real semantic work (logistics vs. ratings), the total absence of shadows and rounding, and the mono eyebrow acting as a spec-sheet voice.

**Protect those.** If the build agent starts adding shadows, softening corners, or brightening the red toward orange, the identity collapses into the default. If you want to push further from the cluster, the highest-leverage single change is to swap the display face — a condensed grotesque or a slab serif would keep the workshop-catalog feel while moving well away from the Fraunces-on-cream default.
