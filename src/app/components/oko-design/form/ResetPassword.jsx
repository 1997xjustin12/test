"use client";

import React, { useState, useEffect } from "react";
import { isValidPassword } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import FormCard from "@/app/components/oko-design/form/FormCard";

const inputClass =
  "w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light transition-colors";

const labelClass =
  "block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5";

const buttonClass =
  "w-full py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";


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
          New password <span className="text-oko-barn dark:text-oko-barn-light">*</span>
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
          Confirm new password <span className="text-oko-barn dark:text-oko-barn-light">*</span>
        </label>
        <input
          placeholder="Confirm password"
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
        className={buttonClass}
      >
        { loading ? "Submitting…" : "Submit"}
      </button>
      {notif?.message && (
        <div
          className={`flex items-start gap-2.5 px-4 py-3 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 ${
            notif?.status === "success"
              ? "border-l-oko-sage dark:border-l-oko-sage"
              : "border-l-oko-barn dark:border-l-oko-barn-light"
          }`}
        >
          <p className="font-inter text-[13.5px] leading-[1.5] text-oko-char-soft dark:text-oko-ondark">
            {notif?.message}
          </p>
        </div>
      )}
    </form>
    </FormCard>
  );
}

export default ResetPassword;
