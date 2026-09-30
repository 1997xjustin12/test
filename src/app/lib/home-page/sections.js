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

  categories: {
    label: "Categories",
    description:
      "A pitch, then a grid of category tiles — image, name over it, description beneath.",
    // Rendered by components/home-page/sections/CategoriesSection.jsx
    content: {
      eyebrow: { type: "text", label: "Eyebrow", default: "Browse by Categories", maxLength: 60 },
      heading: {
        type: "text",
        label: "Headline",
        default: "Explore Fireplaces & Outdoor Essentials",
        hint: "Wraps on its own.",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "Find the right fireplace or outdoor product for your space.\nSolana Fireplaces offers 20+ premium brands and free expert guidance.",
        hint: "A line break here is kept on the page, so the two sentences can sit on their own lines.",
        maxLength: 320,
      },
      items: {
        type: "list",
        label: "Categories",
        min: 1,
        max: 12,
        addLabel: "Add category",
        hint: "Four to a row on a desktop, two on a phone. A category with no link, or a link that goes nowhere, is left off the page.",
        item: {
          image: { type: "image", label: "Image", default: "", required: true },
          name: { type: "text", label: "Name", default: "", maxLength: 60, required: true },
          href: {
            type: "url",
            label: "Link",
            default: "",
            hint: "A path such as /gas-fireplaces, or a full https:// address.",
          },
          description: { type: "textarea", label: "Description", default: "", maxLength: 240 },
        },
        default: [
          {
            image: "/images/banner/home-gas-fireplace.webp",
            name: "Gas Fireplaces",
            href: "/gas-fireplaces",
            description:
              "Browse gas fireplaces in a range of styles and sizes, from classic inserts to modern linear designs.",
          },
          {
            image: "/images/categories/heating-and-fire.webp",
            name: "Electric Fireplaces",
            href: "/electric-fireplaces",
            description:
              "Explore electric fireplaces with realistic flame technology, perfect for bedrooms, offices, and living spaces.",
          },
          {
            image: "/images/categories/grills-and-smokers.webp",
            name: "Grills & Smokers",
            href: "/category/grills-and-smokers",
            description:
              "Shop built-in and freestanding grills, smokers, and griddles for every backyard setup.",
          },
          {
            image: "/images/categories/outdoor-refrigeration.webp",
            name: "Outdoor Refrigeration",
            href: "/outdoor-refrigeration",
            description:
              "Outdoor refrigerators, kegerators, and ice makers built to handle the elements.",
          },
          {
            image: "/images/categories/installation-and-parts.webp",
            name: "Installation & Parts",
            href: "/category/installation-and-parts",
            description:
              "Essential mounting kits, gas lines, and structural components to ensure a safe and seamless outdoor kitchen setup.",
          },
          {
            image: "/images/categories/accessories.webp",
            name: "Accessories",
            href: "/category/accessories",
            description:
              "OEM burners, igniters, and grates to maintain your favorite outdoor appliances.",
          },
          {
            image: "/images/categories/outdoor-kitchen-components.webp",
            name: "Outdoor Kitchen Components",
            href: "/category/outdoor-kitchen-components",
            description:
              "Durable stainless steel storage drawers, access doors, and built-in islands to complete your custom outdoor space.",
          },
          {
            image: "/images/categories/deals.webp",
            name: "Deals",
            href: "/current-deals",
            description:
              "Shop exclusive deals and open-box fireplaces and outdoor products from premium brands.",
          },
        ],
      },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#d9d9d9", defaultDark: "#0b0b0c" },
      eyebrowColor: { type: "color", label: "Eyebrow text", default: THEME_COLOR },
      headingColor: { type: "color", label: "Headline text", default: THEME_COLOR },
      bodyColor: { type: "color", label: "Supporting text", defaultLight: "#1a1a1a", defaultDark: "#d4d4d8" },
      // Sits on the image, so it is white in both schemes unless changed.
      tileNameColor: { type: "color", label: "Name on the tile", default: "#ffffff" },
      tileTextColor: { type: "color", label: "Description text", defaultLight: "#3d4045", defaultDark: "#d4d4d8" },
    },
  },

  whyChoose: {
    label: "Why choose",
    description:
      "Two overlapping images beside a pitch, a list of reasons and a call to action.",
    // Rendered by components/home-page/sections/WhyChooseSection.jsx
    content: {
      image: {
        type: "image",
        label: "Main image",
        default: "/images/categories/outdoor-kitchen-components.webp",
        hint: "Shown square, so the middle of the picture is what survives the crop.",
        required: true,
      },
      imageAlt: { type: "text", label: "Main image description", default: "", maxLength: 160 },
      secondaryImage: {
        type: "image",
        label: "Overlapping image",
        default: "/images/banner/home-built-in-grills.webp",
        hint: "Sits across the bottom corner of the main one. Clear it to show one image on its own.",
      },
      secondaryImageAlt: {
        type: "text",
        label: "Overlapping image description",
        default: "",
        maxLength: 160,
      },
      eyebrow: { type: "text", label: "Eyebrow", default: "Why Choose Solana?", maxLength: 60 },
      heading: {
        type: "text",
        label: "Headline",
        default: "Trusted Fireplace Guidance for Every Space",
        hint: "Wraps on its own.",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "From your first call to final installation, our consultants help you find the fireplace that actually fits your space and your life.",
        maxLength: 320,
      },
      items: {
        type: "list",
        label: "Reasons",
        min: 1,
        max: 8,
        addLabel: "Add reason",
        item: {
          title: { type: "text", label: "Title", default: "", maxLength: 60, required: true },
          description: { type: "textarea", label: "Description", default: "", maxLength: 240 },
        },
        default: [
          {
            title: "20+ Premium Brands",
            description: "We carry the brands professionals trust, so you never have to guess on quality.",
          },
          {
            title: "Expert Support",
            description: "Our consultants help you choose the right option, no extra cost, no pressure.",
          },
          {
            title: "Contractor Program",
            description: "Dedicated pricing and support built for builders, designers, and contractors.",
          },
          {
            title: "Best Price Guarantee",
            description: "Find the same product for less? We'll match the price.",
          },
        ],
      },
      buttonLabel: { type: "text", label: "Button label", default: "Get Free Quote", maxLength: 40 },
      buttonHref: {
        type: "url",
        label: "Button link",
        default: "/contact",
        hint: "A path such as /contact, a full https:// address, or tel:(888) 575-9720.",
      },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#ffffff", defaultDark: "#0b0b0c" },
      // The design uses two oranges: a lighter amber for the eyebrow and the
      // reason titles, the brand accent for the headline and the button.
      eyebrowColor: { type: "color", label: "Eyebrow text", default: "#e0a31a" },
      headingColor: { type: "color", label: "Headline text", default: THEME_COLOR },
      bodyColor: { type: "color", label: "Supporting text", defaultLight: "#1a1a1a", defaultDark: "#d4d4d8" },
      itemTitleColor: { type: "color", label: "Reason titles", default: "#e0a31a" },
      itemTextColor: { type: "color", label: "Reason text", defaultLight: "#1a1a1a", defaultDark: "#d4d4d8" },
      buttonBg: { type: "color", label: "Button", default: THEME_COLOR },
      buttonText: { type: "color", label: "Button text", default: "#ffffff" },
    },
  },

  reviews: {
    label: "Reviews",
    description:
      "Customer reviews on a coloured band. The reviews themselves come from the store's own review list, newest first — only the wording and colours are set here.",
    // Rendered by components/home-page/sections/ReviewsSection.jsx
    content: {
      heading: {
        type: "text",
        label: "Headline",
        default: "Reviews From Our Customers",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "Read real reviews on fireplaces, grills, and outdoor living products from Solana Fireplaces customers.",
        maxLength: 320,
      },
    },
    appearance: {
      // The design's band is the brand orange, in both schemes — it is the
      // section's whole identity rather than a backdrop that should invert.
      background: { type: "color", label: "Band background", default: THEME_COLOR },
      headingColor: { type: "color", label: "Headline text", default: "#ffffff" },
      bodyColor: { type: "color", label: "Supporting text", default: "#ffffff" },
      cardBg: { type: "color", label: "Card background", default: "#ffffff" },
      avatarBg: { type: "color", label: "Initial circle", default: "#dfa013" },
      nameColor: { type: "color", label: "Reviewer name", default: "#17181a" },
      starColor: { type: "color", label: "Stars", default: "#ffce38" },
      dateColor: { type: "color", label: "Date", default: "#52525b" },
      reviewTextColor: { type: "color", label: "Review text", default: "#3d4045" },
    },
  },

  newsletter: {
    label: "Newsletter",
    description: "A centred sign-up: headline, a line of copy, an email field and a button.",
    // Rendered by components/home-page/sections/NewsletterSection.jsx
    content: {
      heading: {
        type: "text",
        label: "Headline",
        default: "Never Miss a Deal",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "Sign up for exclusive deals, new arrivals, and expert tips\ndelivered straight to your inbox.",
        hint: "A line break here is kept on the page.",
        maxLength: 320,
      },
      placeholder: {
        type: "text",
        label: "Field placeholder",
        default: "Enter Your Email Address",
        maxLength: 60,
      },
      buttonLabel: {
        type: "text",
        label: "Button label",
        default: "Subscribe to our Newsletter",
        maxLength: 40,
        required: true,
      },
      successMessage: {
        type: "text",
        label: "Message after signing up",
        default: "Thanks — you're on the list.",
        maxLength: 120,
      },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#ffffff", defaultDark: "#0b0b0c" },
      headingColor: { type: "color", label: "Headline text", default: "#dfa013" },
      bodyColor: { type: "color", label: "Supporting text", defaultLight: "#1a1a1a", defaultDark: "#d4d4d8" },
      inputBg: { type: "color", label: "Field background", defaultLight: "#d9d9d9", defaultDark: "#27272a" },
      inputText: { type: "color", label: "Field text", defaultLight: "#17181a", defaultDark: "#fafafa" },
      buttonBg: { type: "color", label: "Button", default: THEME_COLOR },
      buttonText: { type: "color", label: "Button text", default: "#ffffff" },
    },
  },

  blogs: {
    label: "Blog",
    description:
      "A row of posts from this brand's blog, with a link through to the rest. Either the latest, or ones you choose.",
    // Rendered by components/home-page/sections/BlogsSection.jsx
    content: {
      heading: {
        type: "text",
        label: "Headline",
        default: "Check Out Our Blog",
        maxLength: 120,
        required: true,
      },
      subheading: {
        type: "textarea",
        label: "Supporting text",
        default:
          "Guides, tips, and inspiration to help you choose, style, and care for your fireplace or outdoor space.",
        maxLength: 320,
      },
      posts: {
        type: "blogs",
        label: "Posts",
        max: 3,
        hint: "Leave this empty to show the three most recent posts, which keeps the homepage current on its own. Choose posts to pin a particular three.",
        default: [],
      },
      fallbackTag: {
        type: "text",
        label: "Label above the title",
        default: "Inspiration Guide",
        hint: "Used for a post that has no category of its own.",
        maxLength: 40,
      },
      buttonLabel: { type: "text", label: "Button label", default: "Read More", maxLength: 40 },
      buttonHref: { type: "url", label: "Button link", default: "/blogs" },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#d9d9d9", defaultDark: "#0b0b0c" },
      headingColor: { type: "color", label: "Headline text", default: THEME_COLOR },
      bodyColor: { type: "color", label: "Supporting text", defaultLight: "#1a1a1a", defaultDark: "#d4d4d8" },
      tagColor: { type: "color", label: "Label above the title", default: "#dfa013" },
      titleColor: { type: "color", label: "Post title", defaultLight: "#17181a", defaultDark: "#fafafa" },
      buttonBg: { type: "color", label: "Button", default: THEME_COLOR },
      buttonText: { type: "color", label: "Button text", default: "#ffffff" },
    },
  },

  faq: {
    label: "FAQ",
    description: "Questions and answers, all shown at once.",
    // Rendered by components/home-page/sections/FaqSection.jsx
    content: {
      heading: {
        type: "text",
        label: "Headline",
        default: "Frequently Asked Questions",
        maxLength: 120,
        required: true,
      },
      items: {
        type: "list",
        label: "Questions",
        min: 1,
        max: 12,
        addLabel: "Add question",
        item: {
          question: { type: "text", label: "Question", default: "", maxLength: 200, required: true },
          answer: { type: "textarea", label: "Answer", default: "", maxLength: 600, required: true },
        },
        default: [
          {
            question: "Do I need to know what type of fireplace I want before I contact you?",
            answer:
              "Not at all. Our consultants can walk you through gas, electric, and wood options based on your space, budget, and needs, at no extra cost.",
          },
          {
            question: "How does the price match guarantee work?",
            answer:
              "If you find the same product for less at a competing retailer, we'll match that price. Just reach out with the details before you buy.",
          },
          {
            question: "Do you offer installation support?",
            answer:
              "Yes. Our team guides you from choosing the right fireplace through the installation process, so you're never left figuring it out alone.",
          },
          {
            question: "Do you work with contractors and builders?",
            answer:
              "Yes. Our Contractor Program offers dedicated pricing and support for builders, designers, and contractors working on residential or commercial projects.",
          },
          {
            question: "What if I need to return an item?",
            answer:
              "We offer easy returns, so if something isn't the right fit, we'll help you make it right.",
          },
        ],
      },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#ffffff", defaultDark: "#0b0b0c" },
      headingColor: { type: "color", label: "Headline text", default: THEME_COLOR },
      questionColor: { type: "color", label: "Question text", default: "#dfa013" },
      answerColor: { type: "color", label: "Answer text", defaultLight: "#1a1a1a", defaultDark: "#d4d4d8" },
    },
  },

  brandCarousel: {
    label: "Brand carousel",
    description:
      "The brand logos, scrolling. Which brands appear is not set here — it is every brand in the Brands menu that has a logo file, in menu order.",
    // Rendered by components/home-page/sections/BrandCarouselSection.jsx
    content: {
      heading: {
        type: "text",
        label: "Heading",
        default: "Trusted Brands We Carry",
        hint: "Sits above the strip. Clear it to show the logos on their own.",
        maxLength: 80,
      },
    },
    appearance: {
      background: { type: "color", label: "Section background", defaultLight: "#ffffff", defaultDark: "#0b0b0c" },
      headingColor: { type: "color", label: "Heading text", default: THEME_COLOR },
      // The logo files have no transparency — they are drawn on white — so
      // they need a plate of their own rather than sitting on the section
      // colour, or a dark background turns every logo into a white card.
      tileBg: { type: "color", label: "Logo background", default: "#ffffff" },
    },
  },

  brandLine: {
    label: "Brand line",
    description: "A single centred line on its own band.",
    // Rendered by components/home-page/sections/BrandLineSection.jsx
    content: {
      text: {
        type: "text",
        label: "Text",
        default: "20+ Premium Brands available at Solana",
        maxLength: 120,
        required: true,
      },
    },
    appearance: {
      background: { type: "color", label: "Band background", defaultLight: "#1a1a1a", defaultDark: "#000000" },
      textColor: { type: "color", label: "Text", default: THEME_COLOR },
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

    if (field.type === "blogs") {
      // Slugs, not posts: which posts exist is the blog's business, and a slug
      // that has since been unpublished should drop out of the page rather
      // than be preserved here as a stale copy of a post.
      const slugs = (Array.isArray(value) ? value : [])
        .map((slug) => String(slug ?? "").trim().toLowerCase().slice(0, 200))
        .filter(Boolean);
      content[key] = [...new Set(slugs)].slice(0, field.max ?? 3);
      continue;
    }

    const str = typeof value === "string" ? value.trim() : "";
    if (str) {
      content[key] = field.maxLength ? str.slice(0, field.maxLength) : str;
      continue;
    }
    // No key at all means the field was never set — a section built from
    // nothing, or one saved before this field existed — and it takes its
    // default. A key that is there and empty means someone emptied it, which
    // is a deliberate act: emptying a button's link is how an operator removes
    // that button, and restoring the default would put back the very thing
    // they just deleted. Only a required field insists on a value.
    if (value === undefined) {
      content[key] = field.default ?? "";
      continue;
    }
    content[key] = field.required ? field.default ?? "" : "";
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
