"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/auth";
import { isValidPassword } from "@/app/lib/helpers";

const EyeClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5"
    />
  </svg>
);
const EyeOpen = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
    />
  </svg>
);

export default function ChangePasswordPage() {
  const { isLoggedIn, changePassword } = useAuth();
  const [notif, setNotif] = useState({ message: "", status: "success" });
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [viewPass1, setViewPass1] = useState(false);
  const [viewPass2, setViewPass2] = useState(false);
  const [viewPass3, setViewPass3] = useState(false);

  if (!isLoggedIn) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("[CHANGEPASS] form", form);

    const validatePassword = isValidPassword(form?.new_password);
    if (!validatePassword?.valid) {
      setNotif({ status: "error", message: validatePassword?.message });
      return;
    }
    // check if password 1 and 2 are the same
    if (form?.new_password?.trim() !== form?.new_password2?.trim()) {
      setNotif({ status: "error", message: "New password doesn't match!" });
      return;
    }

    try {
      const response = await changePassword(form);

      const data = await response.json();

      if (!response?.ok) {
        const error_field = Object.keys(data);
        const error_message = Array.isArray(data?.[error_field])
          ? data?.[error_field]?.[0]
          : data?.[error_field];
        if (error_field && error_message) {
          setNotif({ message: error_message, status: "error" });
          return;
        }
        setNotif({
          message: "Not Saved! Something went wrong.",
          status: "error",
        });
        return;
      }
      setNotif({
        message: "Password successfully updated.",
        status: "success",
      });
    } catch (err) {
      setNotif({ message: err, status: "error" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg">
      <h3>ChangePassword</h3>

      {form && (
        <div className="pt-[20px]">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white p-6 space-y-4"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={viewPass1 ? "text" : "password"}
                    name="old_password"
                    value={form?.old_password || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none relative"
                  ></input>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    onMouseDown={() => setViewPass1(true)}
                    onMouseUp={() => setViewPass1(false)}
                    type="button"
                  >
                    {viewPass1 ? <EyeOpen /> : <EyeClose />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={viewPass2 ? "text" : "password"}
                    name="new_password"
                    value={form?.new_password || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none relative"
                  ></input>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    onMouseDown={() => setViewPass2(true)}
                    onMouseUp={() => setViewPass2(false)}
                    type="button"
                  >
                    {viewPass2 ? <EyeOpen /> : <EyeClose />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={viewPass3 ? "text" : "password"}
                    name="new_password2"
                    value={form?.new_password2 || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none relative"
                  ></input>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    onMouseDown={() => setViewPass3(true)}
                    onMouseUp={() => setViewPass3(false)}
                    type="button"
                  >
                    {viewPass3 ? <EyeOpen /> : <EyeClose />}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-end gap-3 pt-4">
              <div
                className={`${
                  notif?.status === "error" ? "text-red-700" : "text-green-700"
                }`}
              >
                {notif?.message}
              </div>
              <button
                type="submit"
                className="rounded-lg bg-theme-600 px-4 py-2 text-white hover:bg-theme-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
