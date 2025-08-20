"use client";

import { useState, useEffect } from "react";

export default function CheckoutForm({ onChange }) {
  const required_fields = [
    "billing_first_name",
    "billing_last_name",
    "billing_email",
    "billing_phone",
    "billing_address",
    "billing_country",
    "shipping_first_name",
    "shipping_last_name",
    "shipping_email",
    "shipping_phone",
    "shipping_address",
    "shipping_country",
  ];
  const initialForm = {
    status: null,
    payment_method: null,
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
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_email: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_province: "",
    shipping_zip_code: "",
    shipping_country: "",
    notes: "",
    items: [],
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  async function createOrder(orderData) {
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : { message: "Invalid JSON response from server" };

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      console.log("Order created:", result.order);
      return result.order;
    } catch (error) {
      console.error("Order creation failed:", error.message || error);
      throw error;
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newForm = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };
    setForm({...newForm});
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};

    if (!form.billing_first_name.trim())
      newErrors.billing_first_name = "Required";
    if (!form.billing_last_name.trim())
      newErrors.billing_last_name = "Required";
    if (!form.billing_email.trim()) {
      newErrors.billing_email = "Required";
    } else if (!isValidEmail(form.billing_email)) {
      newErrors.billing_email = "Invalid email";
    }
    if (!form.billing_phone.trim()) newErrors.billing_phone = "Required";
    if (!form.billing_address.trim()) newErrors.billing_address = "Required";
    if (!form.billing_country.trim()) newErrors.billing_country = "Required";

    if (!sameAsBilling) {
      if (!form.shipping_first_name.trim())
        newErrors.shipping_first_name = "Required";
      if (!form.shipping_last_name.trim())
        newErrors.shipping_last_name = "Required";
      if (!form.shipping_phone.trim()) newErrors.shipping_phone = "Required";
      if (!form.shipping_address.trim())
        newErrors.shipping_address = "Required";
      if (!form.shipping_country.trim())
        newErrors.shipping_country = "Required";

      if (!form.shipping_email.trim()) {
        newErrors.shipping_email = "Required";
      } else if (!isValidEmail(form.shipping_email)) {
        newErrors.shipping_email = "Invalid email";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formattedItems = items.map((item) => ({
        product_id: item?.product_id,
        price: item?.variants?.[0]?.price,
        quantity: item.count,
        total: Number((item?.variants?.[0]?.price * item.count).toFixed(2)),
      }));
      const newForm = form;
      newForm["items"] = formattedItems;
      const response = await createOrder(form);
      setForm(initialForm);
      setSameAsBilling(false);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyBillingToShipping = () => {
    setForm((prev) => ({
      ...prev,
      shipping_first_name: prev.billing_first_name,
      shipping_last_name: prev.billing_last_name,
      shipping_email: prev.billing_email,
      shipping_phone: prev.billing_phone,
      shipping_address: prev.billing_address,
      shipping_city: prev.billing_city,
      shipping_province: prev.billing_province,
      shipping_zip_code: prev.billing_zip_code,
      shipping_country: prev.billing_country,
    }));
  };

  const handleSameAsBillingChange = (e) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);
    if (checked) {
      copyBillingToShipping();
    }
  };

  const billingFields = [
    "billing_first_name",
    "billing_last_name",
    "billing_email",
    "billing_phone",
    "billing_address",
  ];

  const hasBillingErrors = billingFields.some((field) => {
    const value = form[field];
    return (
      !value?.trim() || (field === "billing_email" && !isValidEmail(value))
    );
  });

  useEffect(() => {
    onChange({
      is_ready: Object.keys(validate(form)).length === 0,
      data: form,
    });

    const newErrors = validate();
    setErrors({...newErrors});
  }, [form, sameAsBilling]);

  useEffect(() => {
    console.log("[TEST] errors: ", errors)
  }, [errors]);

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Form
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Billing Fields */}
        <h2>Billing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "billing_first_name",
            "billing_last_name",
            "billing_email",
            "billing_phone",
            "billing_address",
            "billing_city",
            "billing_province",
            "billing_zip_code",
            "billing_country",
          ].map((field) => (
            <div key={field}>
              <label
                className="capitalize flex items-center gap-[7px]"
                htmlFor={field}
              >
                {required_fields.includes(field) && (
                  <span
                    title="required"
                    className={`${
                      errors[field] ? "text-red-500" : "text-green-500"
                    } text-xs`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.39 0-8-3.61-8-8s3.61-8 8-8s8 3.61 8 8s-3.61 8-8 8m1-9.73l2.83-1.64l1 1.74L14 12l2.83 1.63l-1 1.74L13 13.73V17h-2v-3.27l-2.83 1.64l-1-1.74L10 12l-2.83-1.63l1-1.74L11 10.27V7h2z"
                      />
                    </svg>
                  </span>
                )}
                {
                  field === "billing_province" ? 
                  "State"
                  :
                  field.replace("billing_", "").replaceAll("_", " ")
                }
              </label>
              <input
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field.includes("email") ? "email" : "text"}
                className="border p-2 w-full"
              />
              {/* {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )} */}
            </div>
          ))}
        </div>

        {/* Same as Billing Toggle */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={handleSameAsBillingChange}
            disabled={hasBillingErrors}
            className="mr-2"
          />
          <label htmlFor="sameAsBilling">
            Shipping address is the same as billing
          </label>
        </div>

        {/* Shipping Fields */}
        <h2>Shipping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "shipping_first_name",
            "shipping_last_name",
            "shipping_email",
            "shipping_phone",
            "shipping_address",
            "shipping_city",
            "shipping_province",
            "shipping_zip_code",
            "shipping_country",
          ].map((field) => (
            <div key={field}>
              <label
                className="capitalize flex items-center gap-[7px]"
                htmlFor={field}
              >
                {required_fields.includes(field) && (
                  <span
                    title="required"
                    className={`${
                      errors[field] ? "text-red-500" : "text-green-500"
                    } text-xs`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.39 0-8-3.61-8-8s3.61-8 8-8s8 3.61 8 8s-3.61 8-8 8m1-9.73l2.83-1.64l1 1.74L14 12l2.83 1.63l-1 1.74L13 13.73V17h-2v-3.27l-2.83 1.64l-1-1.74L10 12l-2.83-1.63l1-1.74L11 10.27V7h2z"
                      />
                    </svg>
                  </span>
                )}
                
                {
                  field === "shipping_province" ? 
                  "Shipping State"
                  :
                  field.replace("billing_", "").replaceAll("_", " ")
                }
              </label>
              <input
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field.includes("email") ? "email" : "text"}
                className="border p-2 w-full"
                disabled={sameAsBilling}
              />
            </div>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label className="block" htmlFor="notes">
            Notes
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes}</p>
          )}
        </div>
      </form>
    </div>
  );
}
