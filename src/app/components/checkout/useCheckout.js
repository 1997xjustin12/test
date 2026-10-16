"use client";
import { useState, useEffect, useMemo } from "react";
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

export default function useCheckout() {
  const [cartTotal, setCartTotal] = useState({});
  const {
    clearCartItems,
    fetchOrderTotal,
    loadCart,
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

  const saveInformation = (condition) => {
    if (loading || !condition) return;
    const {
      items, newsletter, save_information, shipping_to_billing,
      notes, payment_details, payment_status, payment_method, status,
      ...toSave
    } = form;

    // Returned so the caller can wait for it before leaving the page.
    if (isLoggedIn) {
      return updateProfile({
        ...user,
        profile: {
          phone: toSave?.shipping_phone,
          billing_address: toSave?.billing_address,
          billing_country: toSave?.billing_country,
          billing_city: toSave?.billing_city,
          billing_state: toSave?.billing_province,
          billing_zip: toSave?.billing_zip_code,
          shipping_address: toSave?.shipping_address,
          shipping_country: toSave?.shipping_country,
          shipping_city: toSave?.shipping_city,
          shipping_state: toSave?.shipping_province,
          shipping_zip: toSave?.shipping_zip_code,
        },
      });
    }
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
      const updated = {
        ...prev,
        billing_first_name: user?.first_name,
        billing_last_name: user?.last_name,
        billing_email: user?.email,
        billing_phone: user?.profile?.phone,
        billing_address: user?.profile?.billing_address,
        billing_city: user?.profile?.billing_city,
        billing_province: user?.profile?.billing_state,
        billing_zip_code: user?.profile?.billing_zip,
        billing_country: user?.profile?.billing_country,
        shipping_first_name: user?.first_name,
        shipping_last_name: user?.last_name,
        shipping_email: user?.email,
        shipping_phone: user?.profile?.phone,
        shipping_address: user?.profile?.shipping_address,
        shipping_city: user?.profile?.shipping_city,
        shipping_province: user?.profile?.shipping_state,
        shipping_zip_code: user?.profile?.shipping_zip,
        shipping_country: user?.profile?.shipping_country,
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
      const customer = { ...form };
      delete customer.items;

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
        saveInformation(form?.save_information),
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
      fillUserToForm(user);
    } else {
      fillGuestInfo();
    }

    loadCart();
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
    refNumber,
    signOut,
  };
}
