"use client";

import { useState } from "react";

export default function CheckoutForm({ items }) {
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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.billing_first_name.trim())
      newErrors.billing_first_name = "Required";
    if (!form.billing_last_name.trim())
      newErrors.billing_last_name = "Required";
    if (!form.billing_email.trim()) newErrors.billing_email = "Required";
    if (!form.billing_phone.trim()) newErrors.billing_phone = "Required";
    if (!form.billing_address.trim()) newErrors.billing_address = "Required";
    if (!form.shipping_first_name.trim() && !sameAsBilling)
      newErrors.shipping_first_name = "Required";
    if (!form.shipping_last_name.trim() && !sameAsBilling)
      newErrors.shipping_last_name = "Required";
    if (!form.shipping_email.trim() && !sameAsBilling)
      newErrors.shipping_email = "Required";
    if (!form.shipping_phone.trim() && !sameAsBilling)
      newErrors.shipping_phone = "Required";
    if (!form.shipping_address.trim() && !sameAsBilling)
      newErrors.shipping_address = "Required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items) return;

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formattedItems = items.map(item=> ({product_id: item?.product_id, price: item?.variants?.[0]?.price, quantity:item.count, total: Number((item?.variants?.[0]?.price * item.count).toFixed(2))  }));
      console.log("[TEST] handleSubmit", formattedItems);
      const newForm = form;
      newForm["items"] = formattedItems;
      const response = await createOrder(form);
      console.log("[TEST] createOrder", response);
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

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <p className="text-xl font-semibold text-gray-900 dark:text-white">
        Checkout Form
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status */}
        <div>
          <label className="block" htmlFor="status">
            Status
          </label>
          <select
            name="status"
            value={form.status || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block" htmlFor="payment_method">
            Payment Method
          </label>
          <select
            name="payment_method"
            value={form.payment_method || ""}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select method</option>
            <option value="cod">Cash on Delivery</option>
            <option value="paypal">Paypal</option>
            <option value="stripe">Stripe</option>
            <option value="gcash">GCash</option>
          </select>
          {errors.payment_method && (
            <p className="text-red-500 text-sm">{errors.payment_method}</p>
          )}
        </div>

        {/* Payment Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="payment_status"
            checked={form.payment_status}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="payment_status">Payment Status</label>
        </div>
        {errors.payment_status && (
          <p className="text-red-500 text-sm">{errors.payment_status}</p>
        )}

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
              <label className="block capitalize" htmlFor={field}>
                {field.replace("billing_", "").replaceAll("_", " ")}
              </label>
              <input
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field.includes("email") ? "email" : "text"}
                className="border p-2 w-full"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
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
              <label className="block capitalize" htmlFor={field}>
                {field.replace("shipping_", "").replaceAll("_", " ")}
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
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
