export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME;
export const STORE_NAME2 = process.env.NEXT_PUBLIC_STORE_NAME2;
export const STORE_EMAIL = process.env.NEXT_PUBLIC_STORE_EMAIL;
export const STORE_CONTACT = process.env.NEXT_PUBLIC_STORE_CONTACT;
export const STORE_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN;
export const STORE_REDIS_PREFIX = process.env.STORE_REDIS_PREFIX;
export const STORE_FACEBOOK = process.env.NEXT_PUBLIC_STORE_FACEBOOK;
export const STORE_PINTEREST = process.env.NEXT_PUBLIC_STORE_PINTEREST;

// Business hours, as the Contact page publishes them (Mon–Fri 8–6, Sat 9–4,
// Sun closed, Pacific). Every other mention of hours reads these, so the site
// says one thing: the footer, cart, checkout, phone dropdown and order pages
// had drifted to 4am, 5am and 6am starts and "closed weekends".
export const HOURS_WEEKDAYS = "Mon–Fri 8am–6pm PST";
export const HOURS_WEEKEND = "Sat 9am–4pm PST · Sun closed";
export const HOURS_SUMMARY = "Mon–Fri 8am–6pm, Sat 9am–4pm PST";
