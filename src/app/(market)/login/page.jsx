"use client";

import { useState } from "react"; 
import LoginForm from "@/app/components/form/Login";
import RegisterForm from "@/app/components/form/Register";

export default function LoginPage() {
  const [toggleLogin, setToggleLogin] = useState(true);

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-[20px]">
        <div className={`w-full py-[50px] justify-center ${toggleLogin ? "flex md:flex": "hidden md:flex"}`}>
          <div className="max-w-[400]">
            <LoginForm />
            <div className="md:hidden text-sm text-center mt-4 space-y-2">
              <p className="text-neutral-600">
                Don’t have an account?{" "}
                <button type="button" className="text-theme-600 hover:underline" onClick={()=>setToggleLogin(false)}>
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="border-l border-stone-500 hidden md:block"></div>
        <div className={`w-full py-[50px] md:flex justify-center ${toggleLogin ? "hidden md:flex": "flex md:flex"}`}>
          <div className="max-w-[400px]">
            <RegisterForm />
            <div className="md:hidden text-sm text-center mt-10 space-y-2">
              <p className="text-neutral-600">
                Already have an account?{" "}
                <button type="button" className="text-theme-600 hover:underline" onClick={()=>setToggleLogin(true)}>
                  Login.
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
