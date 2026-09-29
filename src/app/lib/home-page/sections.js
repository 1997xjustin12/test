/**
 * The section registry: what a homepage can be built from.
 *
 * One entry per section type, and each entry is the single source of truth for
 * that section — the admin form is generated from `fields`, the stored config
 * is validated against them, and the storefront renders the component with the
 * result. Adding a section later means adding an entry and a component, not
 * editing the editor.
 *
 * Two kinds of field, deliberately separated:
 *
 *   content      one value, shared by both colour schemes. Copy, links and
 *                images say the same thing in light and dark; duplicating them
 *                per mode only creates a way for the two to drift apart.
 *   appearance   one value per scheme. This is what actually differs between
 *                the light and dark designs — the button fills, the section
 *                background.
 *
 * Colours default to "theme", meaning the brand accent from /admin/theme-color.
 * A section that opts out of that keeps its hardcoded colour when the brand
 * palette changes, so the default has to be the one that follows.
 */

/** A colour field's value when nothing has been chosen. */
export const THEME_COLOR = "theme";

export const SECTION_TYPES = {
  hero: {
    label: "Hero",
    description:
      "Full-width image with the headline, supporting copy and two buttons.",
    // Rendered by components/home-page/sections/HeroSection.jsx
    content: {
      image: {
        type: "image",
        label: "Background image",
        default: "/images/banner/solana-home-hero.webp",
        // The hero image is the homepage's largest contentful paint — the one
        // asset Google times. The admin form shows this guidance.
        hint: "About 1600×700, WebP, under 200KB. This is the image Google measures the page's loading speed by.",
        required: true,
      },
      imageAlt: {
        type: "text",
        label: "Image description",
        default: "",
        hint: "Describes the image for screen readers and when the image fails to load.",
        maxLength: 160,
      },
      heading: {
        type: "text",
        label: "Headline",
        default: "Solana Fireplaces, the Right Fireplace Made Easy",
        hint: "Wraps on its own — no need to break the line.",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "20+ premium fireplace brands, free expert consultation, and easy returns. Solana Fireplaces helps you choose with confidence.",
        maxLength: 320,
      },
      primaryLabel: {
        type: "text",
        label: "Primary button label",
        default: "Get Expert Advice",
        maxLength: 40,
      },
      primaryHref: {
        type: "url",
        label: "Primary button link",
        default: "/contact",
        hint: "A path such as /contact, a full https:// address, or tel:(888) 575-9720.",
      },
      secondaryLabel: {
        type: "text",
        label: "Secondary button label",
        default: "Shop All Products",
        maxLength: 40,
      },
      secondaryHref: {
        type: "url",
        label: "Secondary button link",
        default: "/fireplaces",
      },
    },
    appearance: {
      background: {
        type: "color",
        label: "Section background",
        defaultLight: "#ffffff",
        defaultDark: "#0b0b0c",
        hint: "Shows around and behind the image.",
      },
      primaryBg: { type: "color", label: "Primary button", default: THEME_COLOR },
      primaryText: { type: "color", label: "Primary button text", default: "#ffffff" },
      // The dark design flips the second button: dark-on-light becomes
      // light-on-dark. Both are editable; these are only the starting points.
      secondaryBg: { type: "color", label: "Secondary button", defaultLight: "#17181a", defaultDark: "#ffffff" },
      secondaryText: { type: "color", label: "Secondary button text", defaultLight: "#ffffff", defaultDark: "#17181a" },
    },
  },

  valueProps: {
    label: "Value proposition",
    description:
      "A band of short promises — delivery, support, returns, price — each with an icon.",
    // Rendered by components/home-page/sections/ValuePropsSection.jsx
    content: {
      items: {
        type: "list",
        label: "Items",
        min: 1,
        max: 6,
        addLabel: "Add item",
        // Each entry in the list is edited with these fields.
        item: {
          icon: { type: "icon", label: "Icon", default: "Truck" },
          label: { type: "text", label: "Label", default: "", maxLength: 40, required: true },
        },
        default: [
          { icon: "Truck", label: "FREE SHIPPING" },
          { icon: "PhoneCall", label: "EXPERT SUPPORT" },
          { icon: "PackageOpen", label: "EASY RETURNS" },
          { icon: "Tag", label: "PRICE MATCH" },
        ],
      },
    },
    appearance: {
      background: {
        type: "color",
        label: "Band background",
        defaultLight: "#1a1a1a",
        defaultDark: "#000000",
      },
      iconColor: { type: "color", label: "Icons", default: THEME_COLOR },
      textColor: { type: "color", label: "Label text", default: THEME_COLOR },
    },
  },

  offers: {
    label: "Limited time offers",
    description:
      "A centred pitch — eyebrow, headline, copy and a call to action — above a row of images and a second button.",
    // Rendered by components/home-page/sections/OffersSection.jsx
    content: {
      eyebrow: { type: "text", label: "Eyebrow", default: "Limited Time Offers", maxLength: 60 },
      heading: {
        type: "text",
        label: "Headline",
        default: "Name Your Budget. We'll Find Your Fireplace.",
        hint: "Wraps on its own.",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "From open box savings to close-out deals, we make luxury heating accessible. Talk to an expert and discover your best deal today.",
        maxLength: 320,
      },
      primaryLabel: { type: "text", label: "Top button label", default: "Call to Save More", maxLength: 40 },
      primaryHref: {
        type: "url",
        label: "Top button link",
        default: "/contact",
        hint: "A path such as /contact, a full https:// address, or tel:(888) 575-9720.",
      },
      images: {
        type: "list",
        label: "Images",
        min: 1,
        max: 3,
        addLabel: "Add image",
        hint: "Three reads as designed — the middle one is shown wider. Fewer share the row evenly.",
        item: {
          src: { type: "image", label: "Image", default: "", required: true },
          alt: { type: "text", label: "Image description", default: "", maxLength: 160 },
        },
        default: [
          { src: "/images/banner/home-gas-fireplace.webp", alt: "" },
          { src: "/images/banner/solana-home-hero.webp", alt: "" },
          { src: "/images/banner/home-built-in-grills.webp", alt: "" },
        ],
      },
      secondaryLabel: { type: "text", label: "Bottom button label", default: "Browse All Deals", maxLength: 40 },
      secondaryHref: { type: "url", label: "Bottom button link", default: "/open-box" },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#ffffff", defaultDark: "#0b0b0c" },
      eyebrowColor: { type: "color", label: "Eyebrow text", default: THEME_COLOR },
      headingColor: { type: "color", label: "Headline text", default: THEME_COLOR },
      bodyColor: { type: "color", label: "Supporting text", defaultLight: "#3d4045", defaultDark: "#d4d4d8" },
      primaryBg: { type: "color", label: "Top button", default: THEME_COLOR },
      primaryText: { type: "color", label: "Top button text", default: "#ffffff" },
      secondaryBg: { type: "color", label: "Bottom button", defaultLight: "#17181a", defaultDark: "#ffffff" },
      secondaryText: { type: "color", label: "Bottom button text", defaultLight: "#ffffff", defaultDark: "#17181a" },
    },
  },
};

/** A colour field's starting value for one scheme. */
export function appearanceDefault(field, mode) {
  const perMode = mode === "dark" ? field.defaultDark : field.defaultLight;
  return perMode ?? field.default ?? THEME_COLOR;
}

/** Every section type, in the order the admin should offer them. */
export const sectionTypeList = () =>
  Object.entries(SECTION_TYPES).map(([type, def]) => ({
    type,
    label: def.label,
    description: def.description,
  }));

/** A new instance of a section, with every field at its default. */
export function newSection(type) {
  const def = SECTION_TYPES[type];
  if (!def) return null;

  const content = Object.fromEntries(
    Object.entries(def.content).map(([key, field]) => [
      key,
      field.type === "list"
        ? (field.default ?? []).map((item) => ({ ...item, id: itemId() }))
        : field.default ?? "",
    ]),
  );
  const appearanceFor = (mode) =>
    Object.fromEntries(
      Object.entries(def.appearance).map(([key, field]) => [key, appearanceDefault(field, mode)]),
    );

  return {
    // Stable across reorders and renames, so React keys and edits stay attached
    // to the right section.
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    visible: true,
    content,
    appearance: { light: appearanceFor("light"), dark: appearanceFor("dark") },
  };
}

const isPlainObject = (v) => Boolean(v) && typeof v === "object" && !Array.isArray(v);

/** Identifies one entry of a list, so edits and reorders stay attached to it. */
export const itemId = () => `i${Math.random().toString(36).slice(2, 9)}`;

/**
 * Whether a list entry is worth rendering.
 *
 * Keyed off the schema's required fields, not off any field being set: an item
 * with an icon but no label is an empty slot on the page, and the icon alone
 * kept it alive when this filtered on "something is filled in".
 */
function hasContent(entry, itemSchema) {
  const required = Object.entries(itemSchema).filter(([, f]) => f.required);
  if (required.length) return required.every(([key]) => String(entry[key] ?? "").trim() !== "");
  return Object.entries(entry).some(([key, v]) => key !== "id" && String(v ?? "").trim() !== "");
}

/** One entry of a list, cleaned against the list's item schema. */
function cleanItem(raw, itemSchema) {
  const out = { id: typeof raw?.id === "string" && raw.id ? raw.id.slice(0, 32) : itemId() };
  for (const [key, field] of Object.entries(itemSchema)) {
    const value = typeof raw?.[key] === "string" ? raw[key].trim() : "";
    out[key] = value
      ? field.maxLength
        ? value.slice(0, field.maxLength)
        : value
      : field.default ?? "";
  }
  return out;
}

/**
 * Cleans one stored section against its schema: unknown fields are dropped,
 * missing ones take their default, and text is trimmed to its limit.
 *
 * Whatever is in Redis was written by an admin form, but it is still input, and
 * it is rendered into every visitor's homepage — so it is treated as input.
 */
export function normalizeSection(raw) {
  if (!isPlainObject(raw)) return null;
  const def = SECTION_TYPES[raw.type];
  if (!def) return null;

  const content = {};
  for (const [key, field] of Object.entries(def.content)) {
    const value = raw.content?.[key];

    if (field.type === "list") {
      // Each item is cleaned against the list's own item schema, capped at the
      // list's maximum, and an entry with no label is dropped rather than
      // rendered as an empty slot on the page.
      const items = (Array.isArray(value) ? value : [])
        .map((entry) => cleanItem(entry, field.item))
        .filter((entry) => hasContent(entry, field.item));
      content[key] = (items.length ? items : (field.default ?? []).map((i) => ({ ...i, id: itemId() })))
        .slice(0, field.max ?? 12);
      continue;
    }

    const str = typeof value === "string" ? value.trim() : "";
    content[key] = str
      ? field.maxLength
        ? str.slice(0, field.maxLength)
        : str
      : field.default ?? "";
  }

  const scheme = (mode) => {
    const out = {};
    for (const [key, field] of Object.entries(def.appearance)) {
      const value = raw.appearance?.[mode]?.[key];
      out[key] = isColor(value) ? value : appearanceDefault(field, mode);
    }
    return out;
  };

  return {
    id: typeof raw.id === "string" && raw.id ? raw.id.slice(0, 64) : `${raw.type}-${Math.random().toString(36).slice(2, 9)}`,
    type: raw.type,
    visible: raw.visible !== false,
    content,
    appearance: { light: scheme("light"), dark: scheme("dark") },
  };
}

/** "theme", or a hex colour. Anything else is not a colour we will emit. */
export function isColor(value) {
  return value === THEME_COLOR || (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value));
}

/**
 * A link the storefront can render.
 *
 * Internal paths go through next/link; tel:, mailto: and external addresses
 * must not, so the caller needs to know which it has. Anything else — most
 * importantly javascript: — is refused outright, because this value comes from
 * a form and ends up in an href on the homepage.
 */
export function classifyHref(href) {
  const value = String(href ?? "").trim();
  if (!value) return { kind: "none", href: "#" };
  if (value.startsWith("/")) return { kind: "internal", href: value };
  if (/^(tel:|mailto:)/i.test(value)) return { kind: "protocol", href: value };
  if (/^https?:\/\//i.test(value)) return { kind: "external", href: value };
  return { kind: "none", href: "#" };
}
