"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "@/app/context/recaptcha";
import { BASE_URL } from "@/app/lib/helpers";
import { useAuth } from "@/app/context/auth";
import { isValidPassword } from "@/app/lib/helpers";
import { STORE_NAME2 } from "@/app/lib/store_constants";

const inputClass =
  "w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light transition-colors";

const labelClass =
  "block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5";

const buttonClass =
  "w-full py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
const UsernameGuide = () => {
  return (
    <section className="font-inter text-[13px] leading-[1.55] ml-1">
      <p className="text-oko-char-soft dark:text-oko-ondark">
        Follow these rules when choosing a username.
      </p>
      <ul className="mt-3 list-disc list-inside space-y-2 marker:text-oko-barn text-oko-char-soft dark:text-oko-ondark">
        <li>Must be 3-20 characters long.</li>
        <li>Can contain letters, numbers, dots (.), or underscores (_).</li>
        <li>Must start with a letter or number.</li>
        <li>No spaces or special characters (like -, @, #, !, etc.).</li>
        <li>
          Avoid consecutive dots or underscores for best readability (e.g.,
          prefer john_doe over john__doe).
        </li>
      </ul>
    </section>
  );
};

function RegisterForm() {
  const { accountBenefits } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("register_prefill");
      if (!raw) return;
      const prefill = JSON.parse(raw);
      sessionStorage.removeItem("register_prefill");
      setForm((prev) => ({
        ...prev,
        email: prefill.email || prev.email,
        first_name: prefill.first_name || prev.first_name,
        last_name: prefill.last_name || prev.last_name,
      }));
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidUsername = (username) => {
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9._]{2,19}$/;
    return regex.test(username);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate reCAPTCHA v3
    if (!executeRecaptcha) {
      setMessage({
        type: "error",
        text: "reCAPTCHA not available. Please try again.",
      });
      return;
    }

    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha("register");
    } catch (error) {
      setMessage({
        type: "error",
        text: "reCAPTCHA verification failed. Please try again.",
      });
      return;
    }

    if (!isValidUsername(form?.username)) {
      setMessage({
        type: "error",
        text: "Invalid username. Please follow the guidelines.",
      });
      return;
    }

    const validatePassword = isValidPassword(form?.password);

    if (!validatePassword?.valid) {
      setMessage({
        type: "error",
        text: validatePassword?.message,
      });
      return;
    }

    if (form?.password !== form?.password2) {
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
      body: JSON.stringify({ ...form, recaptchaToken }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage({ type: "success", text: "Registration successful!" });
      window.location.href = "/login?success=1";
    } else {
      // Handle field-specific errors (e.g., {email: ["This field must be unique."]})
      let errorMessage = "Registration failed.";

      if (data?.email) {
        const emailError = Array.isArray(data.email)
          ? data.email[0]
          : data.email;
        if (emailError.toLowerCase().includes("unique")) {
          errorMessage = "Email is already been used, please try another.";
        } else {
          errorMessage = emailError;
        }
      } else if (data?.username) {
        const usernameError = Array.isArray(data.username)
          ? data.username[0]
          : data.username;
        if (usernameError.toLowerCase().includes("unique")) {
          errorMessage = "Username is already taken, please choose another.";
        } else {
          errorMessage = usernameError;
        }
      } else if (data?.error) {
        errorMessage = data.error;
      } else if (data?.title) {
        errorMessage = data.title;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      <h2 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream mb-1">
        Create your account.
      </h2>
      <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mb-7">
        Join today to unlock exclusive offers, whether you&apos;re building out
        the backyard kitchen or gearing up for grilling season.
      </p>
      <div className="mb-10">
        <div className="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-3">
          Benefits
        </div>
        <ul className="list-disc list-inside space-y-2 marker:text-oko-barn">
          {accountBenefits &&
            Array.isArray(accountBenefits) &&
            accountBenefits.length > 0 &&
            accountBenefits.map((item, index) => (
              <li
                key={`li-acc-benefit-${index}`}
                className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark"
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="first_name" className={labelClass}>
            First name <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            name="first_name"
            placeholder="First name"
            value={form.first_name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="last_name" className={labelClass}>
            Last name <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            name="last_name"
            placeholder="Last name"
            value={form.last_name}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="username" className={labelClass}>
            Username <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <UsernameGuide />
        <div>
          <label htmlFor="password" className={labelClass}>
            Password <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password2" className={labelClass}>
            Confirm password <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            name="password2"
            type="password"
            placeholder="Confirm password"
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="flex items-start font-inter text-[13px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 mr-2 h-4 w-4 rounded-[2px] border-oko-stone-line accent-oko-barn"
          />
          <label
            htmlFor="terms"
            className="font-inter text-[13px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark"
          >
            <span className="text-oko-barn dark:text-oko-barn-light" aria-hidden="true">
              *
            </span>{" "}
            By checking this box, I agree to {STORE_NAME2}&apos;{" "}
            <Link prefetch={false} href={`#`} className="text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light underline transition-colors">
              Terms and conditions
            </Link>
            ,{" and "}
            <Link
              prefetch={false}
              href={`${BASE_URL}/privacy-policy`}
              className="text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light underline transition-colors"
            >
              Privacy policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        {message && (
          <div
            className={`flex items-start gap-2.5 px-4 py-3 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 ${
              message.type === "error"
                ? "border-l-oko-barn dark:border-l-oko-barn-light"
                : "border-l-oko-sage dark:border-l-oko-sage"
            }`}
          >
            <p className="font-inter text-[13.5px] leading-[1.5] text-oko-char-soft dark:text-oko-ondark">
              {message.text}
            </p>
          </div>
        )}
      </form>
      <p className="mt-10 font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">
        Are you a <b>PRO</b>? Join our{" "}
        <Link
          prefetch={false}
          href={`${BASE_URL}/professional-program`}
          className="text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light underline transition-colors"
        >
          {STORE_NAME2} Professional Program
        </Link>{" "}
        for benefits and rewards.
      </p>
    </div>
  );
}

export default RegisterForm;
