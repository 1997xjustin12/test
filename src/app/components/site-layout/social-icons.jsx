import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

/**
 * Marks for the social platforms the footer can link to.
 *
 * Five come from lucide, which this project already bundles. Pinterest does not
 * — lucide dropped its brand icons — and Pinterest is the one platform this
 * store actually publishes besides Facebook, so it is drawn here rather than
 * left as the odd one out with a letter in a box.
 */

function Pinterest({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-3.65 19.31c-.09-.78-.17-1.98.04-2.83.19-.78 1.2-4.97 1.2-4.97s-.3-.61-.3-1.52c0-1.42.82-2.48 1.85-2.48.87 0 1.3.66 1.3 1.45 0 .88-.57 2.2-.86 3.42-.24 1.02.52 1.86 1.52 1.86 1.83 0 3.23-1.93 3.23-4.71 0-2.46-1.77-4.18-4.3-4.18-2.93 0-4.65 2.2-4.65 4.47 0 .89.34 1.84.77 2.35a.31.31 0 0 1 .07.3c-.08.33-.26 1.02-.29 1.16-.05.19-.16.23-.36.14-1.34-.62-2.18-2.58-2.18-4.15 0-3.38 2.45-6.48 7.08-6.48 3.71 0 6.6 2.65 6.6 6.19 0 3.69-2.33 6.66-5.56 6.66-1.08 0-2.1-.56-2.45-1.23l-.67 2.54c-.24.93-.89 2.1-1.33 2.81A10 10 0 1 0 12 2Z" />
    </svg>
  );
}

const ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  pinterest: Pinterest,
};

/** How each platform is named in the admin and in the link's accessible name. */
export const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  pinterest: "Pinterest",
};

/** The mark for a platform, or Facebook's if the name is one we cannot draw. */
export const socialIcon = (platform) => ICONS[platform] ?? ICONS.facebook;
