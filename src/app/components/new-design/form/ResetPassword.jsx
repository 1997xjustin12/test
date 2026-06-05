"use client";

import React, { useState, useEffect } from "react";
import { isValidPassword } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import FormCard from "@/app/components/new-design/form/FormCard";

const inputClass =
  "w-full px-3.5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-charcoal dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 transition-colors";

const labelClass =
  "block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5";

const buttonClass = "w-full py-2.5 bg-theme-600 hover:bg-theme-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed";


function ResetPassword({token, uid}) {
  const router = useRouter();
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
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: form?.password, token:token,  uidb64:uid }),
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
          message: data?.error?.new_password || "Something went wrong.",
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setNotif({
        status: "error",
        message: "Network error, please try again.",
      });
      console.log("err", err);
    } 
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setForm(prev=>({...prev, [name]: value}))
  };

  return (
    <FormCard>
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[20px] p-8 lg:p-10">
      <div>
        <label htmlFor="password" className={labelClass}>
          <span className="text-theme-600">*</span> New password
        </label>
        <input
          placeholder="Password"
          name="password"
          type="password"
          value={form?.password || ""}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password2" className={labelClass}>
          <span className="text-theme-600">*</span> Confirm new password
        </label>
        <input
          placeholder="Confirm Password"
          name="password2"
          type="password"
          value={form?.password2 || ""}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`${buttonClass} ${
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
              notif?.status === "success" ? "text-green-600" : "text-theme-600"
            }`}
          >
            {notif?.message}
          </p>
        )}
      </div>
    </form>
    </FormCard>
  );
}

export default ResetPassword;
