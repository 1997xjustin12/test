/**
 * The icons a section can use.
 *
 * Named explicitly rather than pulled from lucide-react by string: an icon
 * imported by name at runtime means shipping the whole library, and these
 * sections are server-rendered precisely so the homepage stays cheap. Every
 * icon here is one import, and the set is chosen for what these strips
 * actually say — delivery, support, returns, price, guarantees.
 *
 * Adding one is a single line here, and it appears in the admin picker
 * immediately.
 */
import {
  Award,
  BadgeCheck,
  BadgePercent,
  Banknote,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Gift,
  Hammer,
  HandCoins,
  Headphones,
  Heart,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  PackageCheck,
  PackageOpen,
  Percent,
  PhoneCall,
  RefreshCcw,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  Timer,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export const ICONS = {
  Truck,
  PackageCheck,
  Package,
  PackageOpen,
  Boxes,
  RefreshCcw,
  RotateCcw,
  PhoneCall,
  Headphones,
  MessageCircle,
  Users,
  Tag,
  BadgePercent,
  Percent,
  CreditCard,
  Banknote,
  HandCoins,
  ShieldCheck,
  BadgeCheck,
  CheckCircle2,
  Lock,
  Award,
  Star,
  ThumbsUp,
  Heart,
  Gift,
  Sparkles,
  Flame,
  Clock,
  Timer,
  CalendarCheck,
  MapPin,
  Wrench,
  Hammer,
  Ruler,
  Zap,
};

/** Every icon name, for the admin picker. */
export const ICON_NAMES = Object.keys(ICONS);

/** The component for a saved name, or a safe stand-in if the name is unknown. */
export function iconComponent(name) {
  return ICONS[name] ?? ICONS.CheckCircle2;
}
