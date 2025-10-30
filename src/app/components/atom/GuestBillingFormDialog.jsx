"use client";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  BASE_URL,
  createSlug,
  formatPrice,
  parseRatingCount,
} from "@/app/lib/helpers";

function GuestBillingFormDialog({ open, onClose, onSave }) {
  const [toggle, setToggle] = useState(true);
  const [billingStorage, setBillingStorage] = useState(null);
  const [formData, setFormData] = useState({
    // billing_first_name: "Justin",
    // billing_last_name: "Cedeno  ",
    // billing_email: "justin@onsitestorage.com",
    // billing_phone: "0999-1234-123",
    // billing_address: "Toril District, Davao City",
    // billing_city: "Davao City",
    // billing_province: "Davao Del Sur",
    // billing_zip_code: "8000",
    // billing_country: "Philippines",
    billing_first_name: "",
    billing_last_name: "",
    billing_email: "",
    billing_phone: "",
    billing_address: "",
    billing_city: "",
    billing_province: "",
    billing_zip_code: "",
    billing_country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(billingStorage){
        billingStorage.set(formData);
        onSave(formData);
    }else{
    }
  };

  useEffect(() => {
    if (open) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [open]);

  const handleClose = () => {
    setToggle(false);
    onClose();
  };

  useEffect(() => {
      if (typeof window === "undefined") return;
  
      let mounted = true;
  
      import("@/app/lib/billingStorage").then(async (module) => {
        if (!mounted) return;
        // const billing_info = await module.get();
        // console.log("[INIT] BillingInfo", billing_info);
        // setFormData(billing_info);
        setBillingStorage(module);
      });
  
      return () => {
        mounted = false;
      };
    }, []);


  return (
    <Dialog open={toggle} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="w-screen h-screen relative">
          <div className="absolute inset-0  flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="w-full relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto rounded-lg"
            >
              <div className="flex flex-col p-[25px]">
                <h2 className="font-bold text-neutral-700 text-4xl">
                  Before we add this to your cart…
                </h2>
                <div className="font-medium text-neutral-700 text-md">
                  Please share your billing details so we can prepare your order smoothly.
                </div>
              </div>
              <div className="flex flex-col p-[25px]">
                <h4 className="font-bold text-neutral-700 text-lg">
                  Billing Information
                </h4>
                <form
                  onSubmit={handleSubmit}
                  className="w-full bg-white p-6 space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="billing_first_name"
                        value={formData?.billing_first_name || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="billing_last_name"
                        value={formData?.billing_last_name || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Email
                      </label>
                      <input
                        type="email"
                        name="billing_email"
                        value={formData?.billing_email || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="billing_phone"
                        value={formData?.billing_phone || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <input
                      type="text"
                      name="billing_address"
                      value={formData?.billing_address || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Country
                    </label>
                    <input
                      type="text"
                      name="billing_country"
                      value={formData?.billing_country || ""}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        City
                      </label>
                      <input
                        type="text"
                        name="billing_city"
                        value={formData?.billing_city || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        State
                      </label>
                      <input
                        type="text"
                        name="billing_province"
                        value={formData?.billing_province || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Zip */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Zipcode
                      </label>
                      <input
                        type="text"
                        name="billing_zip_code"
                        value={formData?.billing_zip_code || ""}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default GuestBillingFormDialog;
