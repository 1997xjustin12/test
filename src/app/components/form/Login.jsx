"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

function LoginForm({successLogin = null}) {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data?.error || data?.detail || "Login failed.");
      setLoading(false);
      return;
    }

    const isLogin = await login(data);

    setLoading(false);

    if(!isLogin){
      console.log("Login Error")
    }

    if(successLogin){
      successLogin(true);
    }else{
      router.push(`${BASE_URL}/my-account`)
    }
  };

  return (
    <div className="max-w-[400px]">
      <h2 className="font-extrabold mb-5">Fire Up Your Account</h2>
      <p className="mb-5 text-sm font-medium text-neutral-600">
        Stay fired up with quick checkout, order history, and more.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="text-xs font-bold">
            <span className="text-red-600">*</span> Username
          </label>
          <input
            placeholder="Username"
            name="username"
            value={form?.username || ""}
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
            type="password"
            name="password"
            placeholder="Password"
            value={form?.password || ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`py-2 font-bold px-4 text-white rounded transition-all shadow-md ${
              loading
                ? "bg-theme-300 cursor-not-allowed"
                : "bg-theme-600 hover:bg-theme-700"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <Link
            prefetch={false}
            href={`${BASE_URL}/forgot-password`}
            className="text-theme-600 hover:underline block text-sm font-bold"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="mt-10">
          {error && (
            <p className={`text-sm mb-4 font-medium text-red-600`}>{error}</p>
          )}
        </div>
      </form>

      {/* <div className="text-sm text-center mt-4 space-y-2">
        <p>
          Don’t have an account?{" "}
          <button type="button" className="text-theme-600 hover:underline" onClick={()=>toggleRegister(true)}>
            Register here
          </button>
        </p>
      </div> */}
    </div>
  );
}

export default LoginForm;
