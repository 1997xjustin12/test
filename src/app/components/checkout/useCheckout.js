"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { useGoogleReCaptcha } from "@/app/context/recaptcha";
import { mapOrderItems, debounce } from "@/app/lib/helpers";
import { lookupPostalCode } from "@/app/lib/postal-code";

/**
 * Everything /checkout does, without how it looks.
 *
 * Each brand draws its own checkout — new-design/page/Checkout.jsx,
 * bbq-design/page/Checkout.jsx, oko-design/page/Checkout.jsx — and all three
 * call this hook, so the form, the ZIP lookup, the totals and placing the
 * order behave identically on every brand. A behaviour change belongs here,
 * never in one brand's file.
 *
 * No card is taken on this page. Placing the order creates it on the backend
 * as unpaid, and the shopper is sent to the payment app with the order's
 * payment link to pay there. See lib/checkout/place-order.js.
 */

const initialForm = {
  status: null,
  payment_status: false,
  billing_first_name: "",
  billing_last_name: "",
  billing_email: "",
  billing_phone: "",
  billing_address: "",
  billing_city: "",
  billing_province: "",
  billing_zip_code: "",
  billing_country: "",
  is_valid_billing_zip: false,
  shipping_first_name: "",
  shipping_last_name: "",
  shipping_email: "",
  shipping_phone: "",
  shipping_address: "",
  shipping_city: "",
  shipping_province: "",
  shipping_zip_code: "",
  shipping_country: "",
  is_valid_shipping_zip: false,
  notes: "",
  items: [],
  newsletter: false,
  save_information: false,
  shipping_to_billing: true,
};

/**
 * The address block as rows of fields, shared by the shipping and billing
 * sections of every brand so the three cannot drift apart. `auto` fields are
 * filled from the postal code and are not typed into.
 *
 * @param prefix  "shipping" | "billing"
 */
export const addressRows = (prefix) => [
  [
    { name: `${prefix}_first_name`, label: "First name", autoComplete: `${prefix} given-name` },
    { name: `${prefix}_last_name`, label: "Last name", autoComplete: `${prefix} family-name` },
  ],
  [{ name: `${prefix}_address`, label: "Address", autoComplete: `${prefix} street-address` }],
  [
    { name: `${prefix}_zip_code`, label: "Postal code", autoComplete: `${prefix} postal-code` },
    { name: `${prefix}_country`, label: "Country", auto: true },
  ],
  [
    { name: `${prefix}_city`, label: "City", auto: true },
    { name: `${prefix}_province`, label: "State", auto: true },
  ],
  [{ name: `${prefix}_phone`, label: "Phone", type: "tel", autoComplete: `${prefix} tel` }],
];

const ADDRESS_PARTS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "city",
  "province",
  "zip_code",
  "country",
];

/**
 * The customer details an order is placed with, built the same way for a
 * guest and a signed-in shopper: every field present, strings and booleans
 * only. A signed-in shopper's form is filled from their profile, where a
 * missing field is undefined and JSON drops it, so their orders used to carry
 * fewer keys than a guest's.
 *
 * - The email is the one typed, else the account's. A signed-in shopper has no
 *   email field to type into, so an empty form value was a dead end.
 * - billing_email is always the contact email; there is no separate field.
 * - With "Use shipping address as billing address" ticked, billing is copied
 *   from shipping here, at the end. Copying field by field as the shopper
 *   typed left billing holding the profile's saved billing address for every
 *   field they didn't touch.
 */
const orderCustomer = (form, accountEmail) => {
  const text = (value) => (value == null ? "" : String(value).trim());
  const customer = {};
  for (const side of ["shipping", "billing"]) {
    for (const part of ADDRESS_PARTS) customer[`${side}_${part}`] = text(form?.[`${side}_${part}`]);
  }

  const email = customer.shipping_email || text(accountEmail);
  const sameAddress = Boolean(form?.shipping_to_billing);
  if (sameAddress) {
    for (const part of ADDRESS_PARTS) customer[`billing_${part}`] = customer[`shipping_${part}`];
  }
  customer.shipping_email = email;
  customer.billing_email = email;

  customer.is_valid_shipping_zip = Boolean(form?.is_valid_shipping_zip);
  customer.is_valid_billing_zip = sameAddress
    ? customer.is_valid_shipping_zip
    : Boolean(form?.is_valid_billing_zip);
  customer.notes = text(form?.notes);
  customer.newsletter = Boolean(form?.newsletter);
  customer.save_information = Boolean(form?.save_information);
  customer.shipping_to_billing = sameAddress;
  return customer;
};

export default function useCheckout() {
  const [cartTotal, setCartTotal] = useState({});
  const {
    clearCartItems,
    fetchOrderTotal,
    cartObject,
    cartItems,
    createAbandonedCart,
    abandonedCartUser,
  } = useCart();
  const [formError, setFormError] = useState(null);
  // Set when an order was created but came back without a payment link.
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [forage, setForage] = useState(null);
  // The account the form was last filled from. The profile is fetched again
  // every time the access token refreshes (about every ten minutes), and each
  // fetch is a new user object: refilling on every one wiped whatever the
  // shopper had typed. Filled once per account instead.
  const filledFor = useRef(null);
  const { isLoggedIn, user, loading, updateProfile, accessToken, logout } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getOrderTotal = async (newForm) => {
    const items = mapOrderItems(newForm?.items);
    if (items.length > 0) {
      const response = await fetchOrderTotal({ ...newForm, items });
      const hasCompleteShipping = Boolean(
        newForm?.shipping_zip_code && newForm?.is_valid_shipping_zip
      );
      if (response?.success) {
        setCartTotal({ ...response.data, allowPay: hasCompleteShipping });
      }
    }
  };

  const debouncedGetOrderTotal = useMemo(() => debounce(getOrderTotal, 300), []);

  // US ZIPs and Canadian postal codes — see lib/postal-code.js.
  const debouncedZipQuery = useMemo(
    () =>
      debounce(async (zip, callback) => {
        const result = await lookupPostalCode(zip);
        callback(result);
      }, 500),
    []
  );

  // "Save this information for next time", from the details the order was
  // placed with. Returned so the caller can wait for it before leaving the page.
  const saveInformation = async (customer) => {
    if (loading || !customer.save_information) return;

    if (isLoggedIn) {
      // full_name and name_initials are display fields added in the browser,
      // not the backend's. The rest of the profile is kept as it was.
      const { full_name, name_initials, ...account } = user ?? {};
      const res = await updateProfile({
        ...account,
        profile: {
          ...account.profile,
          phone: customer.shipping_phone,
          billing_address: customer.billing_address,
          billing_country: customer.billing_country,
          billing_city: customer.billing_city,
          billing_state: customer.billing_province,
          billing_zip: customer.billing_zip_code,
          shipping_address: customer.shipping_address,
          shipping_country: customer.shipping_country,
          shipping_city: customer.shipping_city,
          shipping_state: customer.shipping_province,
          shipping_zip: customer.shipping_zip_code,
        },
      });
      // updateProfile resolves with a failed response rather than throwing,
      // which made a refused save look like a saved one.
      if (!res?.ok) throw new Error(`profile update failed (${res?.status ?? "no response"})`);
      return;
    }

    const {
      newsletter, save_information, shipping_to_billing, notes,
      is_valid_shipping_zip, is_valid_billing_zip,
      ...toSave
    } = customer;
    return forage.setItem("checkout_info", toSave);
  };

  const shippingAsBilling = (condition, newForm) => ({
    ...newForm,
    billing_first_name: condition ? newForm?.shipping_first_name : "",
    billing_last_name: condition ? newForm?.shipping_last_name : "",
    billing_phone: condition ? newForm?.shipping_phone : "",
    billing_address: condition ? newForm?.shipping_address : "",
    billing_city: condition ? newForm?.shipping_city : "",
    billing_province: condition ? newForm?.shipping_province : "",
    billing_zip_code: condition ? newForm?.shipping_zip_code : "",
    billing_country: condition ? newForm?.shipping_country : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      let updatedForm = { ...prev, [name]: type === "checkbox" ? checked : value };

      if (
        updatedForm.shipping_to_billing &&
        name.startsWith("shipping_") &&
        !["shipping_to_billing", "shipping_email"].includes(name)
      ) {
        const [, ...fieldParts] = name.split("_");
        updatedForm[`billing_${fieldParts.join("_")}`] = value;
      }

      if (name === "shipping_email") {
        updatedForm.billing_email = updatedForm.shipping_email;
      }

      if (name === "shipping_to_billing") {
        updatedForm = shippingAsBilling(checked, updatedForm);
      }

      return updatedForm;
    });

    if (name === "shipping_zip_code" || name === "billing_zip_code") {
      debouncedZipQuery(value, (result) => updateOnZipChange(name, result));
    }
  };

  const updateOnZipChange = (name, result) => {
    const { error, data } = result;

    setForm((prev) => {
      const updatedForm = { ...prev };

      if (name === "shipping_zip_code") {
        updatedForm.shipping_country = error ? "" : data?.country;
        updatedForm.shipping_city = error ? "" : data?.city;
        updatedForm.shipping_province = error ? "" : data?.province;
        updatedForm.is_valid_shipping_zip = !Boolean(error);

        if (prev.shipping_to_billing) {
          updatedForm.billing_country = error ? "" : data?.country;
          updatedForm.billing_city = error ? "" : data?.city;
          updatedForm.billing_province = error ? "" : data?.province;
          updatedForm.is_valid_billing_zip = !Boolean(error);
        }

        debouncedGetOrderTotal(updatedForm);
      } else if (name === "billing_zip_code") {
        updatedForm.billing_country = error ? "" : data?.country;
        updatedForm.billing_city = error ? "" : data?.city;
        updatedForm.billing_province = error ? "" : data?.province;
        updatedForm.is_valid_billing_zip = !Boolean(error);
      }

      return updatedForm;
    });
  };

  const fillUserToForm = (user) => {
    if (!user) return;
    setForm((prev) => {
      // The profile's value where it has one, else what is already in the
      // form. Signing in on /checkout used to replace a guest's typed address
      // with the profile's blanks when the account had none saved.
      const pick = (value, current) => (value == null || value === "" ? current : value);
      const p = user?.profile ?? {};
      const updated = {
        ...prev,
        billing_first_name: pick(user?.first_name, prev.billing_first_name),
        billing_last_name: pick(user?.last_name, prev.billing_last_name),
        billing_email: pick(user?.email, prev.billing_email),
        billing_phone: pick(p.phone, prev.billing_phone),
        billing_address: pick(p.billing_address, prev.billing_address),
        billing_city: pick(p.billing_city, prev.billing_city),
        billing_province: pick(p.billing_state, prev.billing_province),
        billing_zip_code: pick(p.billing_zip, prev.billing_zip_code),
        billing_country: pick(p.billing_country, prev.billing_country),
        shipping_first_name: pick(user?.first_name, prev.shipping_first_name),
        shipping_last_name: pick(user?.last_name, prev.shipping_last_name),
        shipping_email: pick(user?.email, prev.shipping_email),
        shipping_phone: pick(p.phone, prev.shipping_phone),
        shipping_address: pick(p.shipping_address, prev.shipping_address),
        shipping_city: pick(p.shipping_city, prev.shipping_city),
        shipping_province: pick(p.shipping_state, prev.shipping_province),
        shipping_zip_code: pick(p.shipping_zip, prev.shipping_zip_code),
        shipping_country: pick(p.shipping_country, prev.shipping_country),
        is_valid_shipping_zip: false,
        is_valid_billing_zip: false,
        newsletter: false,
        save_information: false,
        shipping_to_billing: true,
      };
      debouncedZipQuery(updated.shipping_zip_code, (result) =>
        updateOnZipChange("shipping_zip_code", result)
      );
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError(null);

    const customer = orderCustomer(form, isLoggedIn ? user?.email : null);
    if (!customer.shipping_email.includes("@")) {
      setFormError("Please enter your email address.");
      setIsSubmitting(false);
      return;
    }

    if (!executeRecaptcha) {
      setFormError("reCAPTCHA not available. Please refresh the page and try again.");
      setIsSubmitting(false);
      return;
    }

    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha("checkout");
    } catch (err) {
      console.error("[Checkout] reCAPTCHA verification failed:", err);
      setFormError("reCAPTCHA verification failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (!cartTotal?.allowPay) {
      setFormError("Please fill in your shipping postal code so we can calculate your shipping total.");
      setIsSubmitting(false);
      return;
    }

    try {
      // The server creates the order as unpaid and returns its payment link.
      // No price or total is sent: the backend works those out itself.
      const response = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          recaptchaToken,
          customer,
          items: cartItems.map(({ product_id, quantity }) => ({ product_id, quantity })),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result?.success) {
        console.error("[Checkout] Order not placed:", result);
        // The backend's own messages, one per problem, when it gave any.
        setFormError(
          result?.errors?.length
            ? result.errors
            : result?.error || "We couldn't place your order. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      // The order exists from here on, whether or not there is a link to pay
      // it, so the cart is emptied — on every brand, guest or signed in.
      // Awaited: the redirect below unloads the page, which would cancel a
      // signed-in shopper's cart-close request or a guest's storage write
      // part-way and leave the ordered items sitting in the cart. Neither may
      // stop the shopper reaching payment, so a failure is logged, not shown.
      const [cleared, saved] = await Promise.allSettled([
        clearCartItems(),
        saveInformation(customer),
      ]);
      if (cleared.status === "rejected") console.error("[Checkout] Cart not cleared:", cleared.reason);
      if (saved.status === "rejected") console.error("[Checkout] Details not saved:", saved.reason);

      if (result.payment_link) {
        window.location.assign(result.payment_link);
        return;
      }

      setPlacedOrder({ orderNumber: result.order_number || null });
      setIsSubmitting(false);
    } catch (error) {
      console.error("[Checkout] Unexpected error:", error);
      setFormError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    try {
      await createAbandonedCart(cartObject, abandonedCartUser, "forced");
      await logout();
    } catch (err) {
      console.warn("[handleLogout] error", err);
    }
  };

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      const newForm = { ...form, items: cartItems };
      setForm(newForm);
      getOrderTotal(newForm);
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;
    import("@/app/lib/localForage").then((module) => {
      if (!mounted) return;
      setForage(module);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fillGuestInfo = async () => {
      const checkout_info = await forage.getItem("checkout_info");
      setForm((prev) => {
        const updated = {
          ...prev,
          ...checkout_info,
          is_valid_shipping_zip: false,
          is_valid_billing_zip: false,
          newsletter: false,
          save_information: false,
          shipping_to_billing: true,
        };
        debouncedZipQuery(updated.shipping_zip_code, (result) =>
          updateOnZipChange("shipping_zip_code", result)
        );
        return updated;
      });
    };

    if (loading && !forage) return;

    if (isLoggedIn) {
      // Never null: that means "not filled yet".
      const account = user?.id ?? user?.username ?? user?.email ?? "account";
      if (user && filledFor.current !== account) {
        filledFor.current = account;
        fillUserToForm(user);
      }
    } else {
      // Signed out on this page: the account's name, email and addresses must
      // not stay in the form for whoever is at the screen next.
      if (filledFor.current !== null) {
        setForm((prev) => ({ ...initialForm, items: prev.items }));
        // The shipping total was for the account's address; it is worked out
        // again once a postal code is entered (updateOnZipChange).
        setCartTotal((prev) => ({ ...prev, allowPay: false }));
      }
      filledFor.current = null;
      fillGuestInfo();
    }
    // No loadCart() here: the cart provider reloads on the same sign-in
    // changes, and a second load at the same moment merged the guest cart into
    // the account twice.
  }, [loading, forage, isLoggedIn, user]);

  const refNumber = useMemo(() => {
    if (loading) return null;
    return isLoggedIn
      ? cartObject?.cart_id ? "CI-" + cartObject?.cart_id : null
      : cartObject?.reference_number;
  }, [loading, isLoggedIn, cartObject]);

  return {
    form,
    handleChange,
    handleSubmit,
    cartItems,
    cartTotal,
    formError,
    placedOrder,
    isSubmitting,
    canSubmit: Boolean(cartItems?.length) && !isSubmitting && !placedOrder,
    loading,
    isLoggedIn,
    user,
    // Signed in, but the profile came back without an email: the brand pages
    // show the email field so the order can still be placed.
    askEmail: Boolean(isLoggedIn && user && !user.email),
    refNumber,
    signOut,
  };
}
