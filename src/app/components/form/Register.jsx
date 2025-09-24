"use client";

import Link from "next/link";
import { useState } from "react";
import { BASE_URL } from "@/app/lib/helpers";

function RegisterForm({toggleRegister}) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form?.password.length < 7) {
      e.preventDefault();

      setMessage({
        type: "error",
        text: "Password must be at least 7 characters long.",
      });
      return;
    }

    if (form?.password !== form?.password2) {
      e.preventDefault();
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage({ type: "success", text: "✅ Registration successful!" });
      window.location.href = "/login?success=1";
    } else {
      setMessage({
        type: "error",
        text: data?.error || data?.title || "❌ Registration failed.",
      });
    }
  };

  return (
    <div>
      <h2 className="font-extrabold mb-5">Ignite Your Journey</h2>
      <p className="mb-5 text-sm font-medium text-neutral-600">
        Join today to unlock exclusive offers, whether you're heating up the
        backyard or cozying up by the fire.
      </p>
      <div className="mb-10">
        <div className="text-sm font-bold mb-3">Benefits</div>
        <ul className="list-disc list-inside space-y-2 marker:text-red-500">
          <li className="text-xs">Earn 1 point per $1 spent</li>
          <li className="text-xs">Track your orders</li>
          <li className="text-xs">Save Favorite items</li>
          <li className="text-xs">Quick and easy checkout</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="first_name" className="text-xs font-bold">
            <span className="text-red-600">*</span> First Name
          </label>
          <input
            name="first_name"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="text-xs font-bold">
            <span className="text-red-600">*</span> Last Name
          </label>
          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-bold">
            <span className="text-red-600">*</span> Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-bold">
            <span className="text-red-600">*</span> Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password2" className="text-xs font-bold">
            <span className="text-red-600">*</span> Confirm Password
          </label>
          <input
            name="password2"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-start text-sm text-neutral-600">
            <input id="terms" name="terms" type="checkbox" required
            className="mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
            <label htmlFor="terms" className="text-sm">
            <span className="text-red-600" aria-hidden="true">*</span>{" "}By checking this box, I agree to SolanaFireplaces' <Link prefetch={false} href={`#`} className="underline">Terms and Conditions</Link>,{" and "}<Link prefetch={false} href={`${BASE_URL}/privacy-policy`} className="underline">Privacy Policy</Link>
            </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-2 px-4 text-white rounded transition-all ${
            loading
              ? "bg-theme-300 cursor-not-allowed"
              : "bg-theme-600 hover:bg-theme-700"
          }`}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
        
        {message && (
          <p
            className={`text-sm mb-4 text-center font-medium ${
              message.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
      <p className="mt-10 text-neutral-600 text-sm">Are you a <b>PRO</b>? Join our <Link prefetch={false} href={`${BASE_URL}/professional-program`} className="text-sm underline">SolanaFireplaces Professional Program</Link>{" "}for benefits and rewards.</p>
    </div>
  );
}

export default RegisterForm;
