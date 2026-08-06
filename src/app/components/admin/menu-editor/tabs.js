/**
 * Single source of truth for the menu-editor tabs.
 * Each `slug` maps 1:1 to a route segment under
 * /admin/menu-builder/edit/[menu_id]/<slug>.
 */
export const MENU_EDITOR_TABS = [
  { slug: "seo", label: "SEO" },
  { slug: "hero", label: "Hero Section" },
  { slug: "featured-nav", label: "Featured Nav" },
  { slug: "featured-content", label: "Featured Content" },
  { slug: "faqs", label: "FAQs" },
  { slug: "product-collections", label: "Product Collections" },
  { slug: "category-collections", label: "Category Collections" },
  { slug: "settings", label: "Settings" },
];

export const DEFAULT_MENU_EDITOR_TAB = MENU_EDITOR_TABS[0].slug;

export const menuEditorTabHref = (menu_id, slug) =>
  `/admin/menu-builder/edit/${menu_id}/${slug}`;
