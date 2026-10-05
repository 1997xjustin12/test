import {
  CircleUser,
  Headphones,
  MessageCircle,
  Package,
  Phone,
  PhoneCall,
  PhoneOutgoing,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Store,
  User,
  UserRound,
} from "lucide-react";

/**
 * The marks an operator can choose for the header's three buttons.
 *
 * A short list per slot rather than one long one: a cart picker offering a
 * flame is noise, and the point of choosing an icon is to say what the button
 * does. Imported by name so only these reach the bundle.
 */

export const HEADER_ICONS = {
  phone: { Phone, PhoneCall, PhoneOutgoing, Smartphone, Headphones, MessageCircle },
  account: { User, UserRound, CircleUser },
  cart: { ShoppingCart, ShoppingBag, ShoppingBasket, Package, Store },
};

/** The names offered for a slot, in the order the picker shows them. */
export const iconNames = (slot) => Object.keys(HEADER_ICONS[slot] ?? {});

/** The default for each slot — what the design uses. */
export const DEFAULT_ICONS = { phone: "Phone", account: "User", cart: "ShoppingCart" };

/** Whether a name is one this slot can draw. */
export const isHeaderIcon = (slot, name) => Boolean(HEADER_ICONS[slot]?.[name]);

/**
 * The component for a slot's chosen icon.
 *
 * Falls back to the slot's default rather than to nothing: a header button with
 * no mark in it is a button nobody can read, and a stored name can go stale if
 * this list is ever trimmed.
 */
export const headerIcon = (slot, name) =>
  HEADER_ICONS[slot]?.[name] ?? HEADER_ICONS[slot]?.[DEFAULT_ICONS[slot]];
