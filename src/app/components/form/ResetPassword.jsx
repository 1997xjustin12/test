"use client";

import React, { useState, useEffect } from "react";
import { isValidPassword } from "@/app/lib/helpers";

function ResetPassword() {
  const _notif = {
    status: "",
    message: "",
  };

  const [form, setForm] = useState({
    password:"",
    password2:""
  });

  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(_notif);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validatePassword = isValidPassword(form?.password);
    
    if(!validatePassword?.valid){
        setNotif({
          status: "error",
          message: validatePassword?.message,
        });
        return;
    }

    if(form?.password !== form?.password2){
        setNotif({
          status: "error",
          message: "Password and confirmation do not match.",
        });
        return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: form?.password, token:"",  uidb64:"" }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotif({
          status: "success",
          message: data?.detail || "Reset password is successful",
        });
      } else {
        setNotif({
          status: "error",
          message: data?.detail || "Something went wrong.",
        });
      }
    } catch (err) {
      setNotif({
        status: "error",
        message: "Network error, please try again.",
      });
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setForm(prev=>({...prev, [name]: value}))
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[20px]">
      <div>
        <label htmlFor="password" className="text-xs font-bold">
          <span className="text-red-600">*</span> New password
        </label>
        <input
          placeholder="Password"
          name="password"
          type="password"
          value={form?.password || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password2" className="text-xs font-bold">
          <span className="text-red-600">*</span> Confirm new password
        </label>
        <input
          placeholder="Confirm Password"
          name="password2"
          type="password"
          value={form?.password2 || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`py-2 font-bold px-4  rounded transition-all shadow-md w-full ${
          loading
            ? "bg-theme-500 cursor-not-allowed text-theme-900"
            : "bg-theme-600 hover:bg-theme-700 text-white"
        }`}
      >
        { loading ? "Submitting..." : "Submit"}
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

export default ResetPassword;
