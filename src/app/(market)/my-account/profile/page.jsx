"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth";
export default function ProfilePage() {
  const { isLoggedIn, user, updateProfile } = useAuth();

  const [form, setForm] = useState(user || {});
  const [notif, setNotif] = useState({message:"", status:"success"});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const rootFields = ["first_name", "last_name"];

    setForm((prev) => {
      if (!prev) return prev;

      if (rootFields.includes(name)) {
        // update top-level fields
        return { ...prev, [name]: value };
      } else {
        // update nested profile object
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [name]: value,
          },
        };
      }
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    const response = await updateProfile(form);

    if(!response.ok){
        setNotif({message: "Not Saved! Something went wrong.", status:"error"})
        return;
    }

    setNotif({message: "Successfully Updated.", status:"success"})

    }catch(err){
        setNotif({message: err, status: "error"})
    }
  };

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!isLoggedIn && !user) return null;

  return (
    <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg">
      <h3>Profile Page</h3>
      {form && (
        <div className="pt-[20px]">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={form?.first_name || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                />
              </div>
              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={form?.last_name || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form?.profile?.phone || ""}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-[30px] pt-[20px]">
              <div className="w-full">
                <h3 className="font-bold">Billing</h3>
                <div className="pt-[20px] flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <input
                      name="billing_address"
                      value={form?.profile?.billing_address || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Country
                    </label>
                    <input
                      name="billing_country"
                      value={form?.profile?.billing_country || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      City
                    </label>
                    <input
                      name="billing_city"
                      value={form?.profile?.billing_city || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      State
                    </label>
                    <input
                      name="billing_state"
                      value={form?.profile?.billing_state || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Zipcode
                    </label>
                    <input
                      name="billing_zip"
                      value={form?.profile?.billing_zip || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="border"></div>
              <div className="w-full">
                <h3 className="font-bold">Shipping</h3>
                <div className="pt-[20px] flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <input
                      name="shipping_address"
                      value={form?.profile?.shipping_address || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Country
                    </label>
                    <input
                      name="shipping_country"
                      value={form?.profile?.shipping_country || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      City
                    </label>
                    <input
                      name="shipping_city"
                      value={form?.profile?.shipping_city || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      State
                    </label>
                    <input
                      name="shipping_state"
                      value={form?.profile?.shipping_state || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Zipcode
                    </label>
                    <input
                      name="shipping_zip"
                      value={form?.profile?.shipping_zip || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-theme-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-end gap-3 pt-4">
              <div className={`${notif?.status === "error"? "text-red-700":"text-green-700"}`}>
                { notif?.message }
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
