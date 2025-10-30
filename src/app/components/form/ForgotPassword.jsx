"use client";

import React, { useState, useEffect } from "react";

function ForgotPassword() {
  const _notif = {
    status: "",
    message: "",
  };

  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(_notif);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(cooldown !== 0) return; 
    
    setCooldown(30);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotif({
          status: "success",
          message: data?.detail || "Check your email for reset instructions.",
        });
      } else {
        setNotif({
          status: "error",
          message: data?.detail || data?.email || "Something went wrong.",
        });
      }
    } catch (err) {
      setNotif({
        status: "error",
        message: "Network error, please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    if (name === "email") {
      setEmail(value);
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[20px]">
      <div>
        <label htmlFor="email" className="text-xs font-bold">
          <span className="text-red-600">*</span> Enter your email
        </label>
        <input
          placeholder="Email"
          name="email"
          value={email || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={cooldown || loading}
        className={`py-2 font-bold px-4  rounded transition-all shadow-md w-full ${
          cooldown || loading
            ? "bg-theme-500 cursor-not-allowed text-theme-900"
            : "bg-theme-600 hover:bg-theme-700 text-white"
        }`}
      >
        {cooldown > 0 ? `Try again in ${cooldown}s` : loading ? "Submitting..." : "Submit"}
      </button>
      <div className="mt-1 text-center min-h-[20px]">
        {notif?.message && (
          <p
            className={`text-sm mb-4 font-medium ${
              notif?.status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {notif?.message}
          </p>
        )}
      </div>
    </form>
  );
}

export default ForgotPassword;
