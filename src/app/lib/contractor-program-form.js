// The Professional (Contractor) Program application: a Zoho CRM Web-to-Contact
// form, rebuilt as our own component. The original embed is kept in
// docs/reference/contractors_program_form.md.
//
// The form still posts straight to Zoho from the browser, the way the embed
// did: Zoho's captcha is checked against the image the visitor's browser
// loaded, so the request can't be relayed through our server. What changed is
// everything around the post — fields, validation and messages are ours, and
// the post goes into a hidden frame so the visitor never leaves the page.

const FORM_ID = "4274033000012277001";
const FORM_DIGEST = "fd18bc5bd5afdddc50e0f221d32d17daba826864e2d84e7936212f2cc05a4c10";
const GROUP_DIGEST = "728d9762e31d9117d40ec11b255f0e4e5f64c357581796f8e039d596534c7325";

export const ZOHO_FORM = {
  name: `WebToContacts${FORM_ID}`,
  action: "https://crm.zoho.com/crm/WebToContactForm",
  captchaSrc: `https://crm.zoho.com/crm/CaptchaServlet?formId=${FORM_DIGEST}&grpid=${GROUP_DIGEST}`,
  // Zoho's own hidden fields, sent as they are. "Q29udGFjdHM=" is "Contacts".
  hidden: {
    xnQsjsdp: GROUP_DIGEST,
    zc_gad: "",
    xmIwtLD: FORM_DIGEST,
    actionType: "Q29udGFjdHM=",
    ldeskuid: "",
  },
};

/**
 * Where Zoho sends the frame after a successful post. It's on our own site so
 * the form can tell success apart from Zoho's error page (which it can't read).
 */
export const CONTRACTOR_FORM_DONE_PATH = "/api/contractor-program/done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;
const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

const phoneError = (v) => {
  const digits = v.replace(/\D/g, "");
  return digits.length < 10 || digits.length > 15
    ? "Enter a valid phone number, including area code."
    : null;
};

/**
 * Every field, in display order. `name` is the Zoho field name and must not
 * change; `group` sets the section it shows under, `cols` its width
 * ("full", "third"; half by default).
 */
export const CONTRACTOR_FIELDS = [
  { group: "company", name: "Account Name", label: "Company name", required: true, maxLength: 100, autoComplete: "organization" },
  { group: "company", name: "CONTACTCF13", label: "Ownership type", hint: "Sole proprietor, LLC, partnership…", maxLength: 255 },
  { group: "company", name: "CONTACTCF14", label: "Website", maxLength: 255, type: "url", inputMode: "url", autoComplete: "url", placeholder: "example.com",
    validate: (v) => (WEBSITE_RE.test(v) ? null : "Enter a valid web address, like example.com.") },
  { group: "company", name: "CONTACTCF7", label: "Average projects per month", maxLength: 255, inputMode: "numeric" },

  { group: "you", name: "First Name", label: "First name", required: true, maxLength: 40, autoComplete: "given-name" },
  { group: "you", name: "Last Name", label: "Last name", required: true, maxLength: 80, autoComplete: "family-name" },
  { group: "you", name: "Email", label: "Email", required: true, maxLength: 100, type: "email", inputMode: "email", autoComplete: "email",
    validate: (v) => (EMAIL_RE.test(v) ? null : "Enter a valid email address, like name@company.com.") },
  { group: "you", name: "Phone", label: "Primary phone", required: true, maxLength: 50, type: "tel", inputMode: "tel", autoComplete: "tel", validate: phoneError },
  { group: "you", name: "CONTACTCF16", label: "Secondary phone", maxLength: 255, type: "tel", inputMode: "tel", validate: phoneError },

  { group: "shipping", name: "CONTACTCF8", label: "Street address", maxLength: 255, autoComplete: "address-line1", cols: "full" },
  { group: "shipping", name: "CONTACTCF3", label: "City", maxLength: 255, autoComplete: "address-level2", cols: "third" },
  { group: "shipping", name: "CONTACTCF5", label: "State", required: true, maxLength: 255, autoComplete: "address-level1", cols: "third" },
  { group: "shipping", name: "CONTACTCF6", label: "ZIP code", required: true, maxLength: 255, inputMode: "numeric", autoComplete: "postal-code", cols: "third",
    validate: (v) => (ZIP_RE.test(v) ? null : "Enter a 5-digit ZIP code (or ZIP+4).") },

  { group: "contact", name: "CONTACTCF12", label: "Contact person", hint: "If someone else handles orders", maxLength: 255 },
  { group: "contact", name: "CONTACTCF15", label: "Contact person's phone", maxLength: 255, type: "tel", inputMode: "tel", validate: phoneError },
];

export const CONTRACTOR_GROUPS = [
  { key: "company", title: "Company" },
  { key: "you", title: "Your details" },
  { key: "shipping", title: "Shipping address" },
  { key: "contact", title: "Order contact", optional: true },
];

/** Zoho's captcha field. Not in CONTRACTOR_FIELDS: it's laid out on its own. */
export const CAPTCHA_FIELD = { name: "enterdigest", label: "Verification code", required: true, maxLength: 10 };

const ALL_FIELDS = [...CONTRACTOR_FIELDS, CAPTCHA_FIELD];

export const emptyContractorValues = () =>
  Object.fromEntries(ALL_FIELDS.map((f) => [f.name, ""]));

/** One field's error message, or null. */
export function validateContractorField(name, rawValue) {
  const field = ALL_FIELDS.find((f) => f.name === name);
  if (!field) return null;
  const value = String(rawValue ?? "").trim();
  if (!value) {
    if (!field.required) return null;
    return field === CAPTCHA_FIELD
      ? "Enter the characters shown in the image."
      : `${field.label} is required.`;
  }
  if (value.length > field.maxLength) return `${field.label} must be ${field.maxLength} characters or fewer.`;
  return field.validate ? field.validate(value) : null;
}

/** Every field's error, as { name: message }; empty when the form is valid. */
export function validateContractorForm(values) {
  const errors = {};
  for (const f of ALL_FIELDS) {
    const message = validateContractorField(f.name, values[f.name]);
    if (message) errors[f.name] = message;
  }
  return errors;
}

