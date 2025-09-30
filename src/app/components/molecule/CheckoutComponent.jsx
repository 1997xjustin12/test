"use client";
//react
import React, { useState, useEffect, useMemo, useRef, use } from "react";
import { useRouter } from "next/navigation";
// components
import dropin from "braintree-web-drop-in";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import LoginForm from "@/app/components/form/Login";
// context
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
// helpers
import {
  BASE_URL,
  mapOrderItems,
  formatPrice,
  createSlug,
  debounce,
  store_domain,
} from "@/app/lib/helpers";
// variables
const initialForm = {
  status: null,
  payment_method: "braintree",
  payment_status: false,
  billing_first_name: "",
  billing_last_name: "",
  billing_email: "",
  billing_phone: "",
  billing_address: "",
  billing_city: "",
  billing_province: "",
  billing_zip_code: "",
  billing_country: "",
  is_valid_billing_zip: false,
  shipping_first_name: "",
  shipping_last_name: "",
  shipping_email: "",
  shipping_phone: "",
  shipping_address: "",
  shipping_city: "",
  shipping_province: "",
  shipping_zip_code: "",
  shipping_country: "",
  is_valid_shipping_zip: false,
  notes: "",
  items: [],
  // font end form fields
  newsletter: false,
  save_information: false,
  shipping_to_billing: false,
};

// components
const ItemsList = ({ items }) => {
  return (
    <ul className="flex flex-col gap-[20px]">
      {/* items */}
      {items &&
        Array.isArray(items) &&
        items.length > 0 &&
        items.map((item, index) => (
          <li
            key={`mob-os-item-${index}`}
            className="flex gap-[10px] items-center"
          >
            {/* image */}
            <div className="w-16 h-16 bg-white rounded relative border-[2px] border-gray-200 shadow">
              {/* badge */}
              <div className="absolute z-10 text-xs top-[-10px] right-[-10px] w-[24px] h-[24px] flex items-center justify-center bg-stone-950 rounded-md text-white border border-white">
                {item?.count || 0}
              </div>
              {item?.images &&
                Array.isArray(item.images) &&
                item.images.length > 0 &&
                item.images.find((img) => img?.position === 1) &&
                item.images.find((img) => img?.position === 1)?.src && (
                  <Image
                    src={item.images.find((img) => img?.position === 1).src}
                    title={`${item.title}`}
                    alt={`${createSlug(item.title)}-image`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                )}
            </div>
            {/* label */}
            <div className="w-[calc(100%-164px)]">
              <div className="line-clamp-2 text-xs" title={item?.title}>
                {item?.title}
              </div>
            </div>
            {/* price */}
            <div className="w-[100px] text-right text-xs">
              ${formatPrice(item?.count * item?.variants?.[0]?.price || 0)}
            </div>
          </li>
        ))}
    </ul>
  );
};

const ComputationSection = ({ data }) => {
  return (
    <>
      <div className="text-xs flex items-center justify-between">
        <div>Subtotal · {data?.items_count || 0} items</div>
        <div>${formatPrice(data?.sub_total || 0)}</div>
      </div>
      <div className="text-xs flex items-center justify-between mt-3">
        <div
          className="flex gap-[5px] items-center"
          title="Enter valid shipping postal code for the shipping total"
        >
          Shipping{" "}
          <svg
            className="text-neutral-600"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <g fill="none">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="currentColor"
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-9.5a3.625 3.625 0 0 1 1.348 6.99a.8.8 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5"
              />
            </g>
          </svg>
        </div>
        {data?.allowPay ? (
          data?.total_shipping === 0 ? (
            <div className="text-green-600 font-bold">FREE</div>
          ) : (
            <div className="text-neutral-900">
              {formatPrice(data?.total_shipping)}
            </div>
          )
        ) : (
          <div className="text-neutral-500">Enter Shipping Postal Code</div>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-[5px] items-center font-bold">Total</div>
        <div className="font-bold">${formatPrice(data?.total_price || 0)}</div>
      </div>
      <p className="text-xs text-neutral-500">
        Including ${formatPrice(data?.total_tax || 0)} in taxes
      </p>
    </>
  );
};

const MobileOrderSummary = ({ data }) => {
  const [expandOrderSummary, setExpandOrderSummary] = useState(false);

  if (!data) return;

  return (
    <>
      <button
        type="button"
        onClick={() => setExpandOrderSummary((prev) => !prev)}
        className="h-[64px] md:hidden bg-neutral-200 border-b border-neutral-300 flex items-center w-full"
      >
        <div className="flex justify-between items-center container mx-auto px-[20px]">
          <div className="flex gap-[20px] items-center">
            <span className="font-light">Order Summary</span>
            <span>
              {expandOrderSummary ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          </div>
          <div>${formatPrice(data?.total_price || 0)}</div>
        </div>
      </button>
      <div
        className={`md:hidden container mx-auto px-[20px]  transition-all delay-300 overflow-hidden ${
          expandOrderSummary ? "h-auto" : "h-[0px]"
        }`}
      >
        <div className="py-[30px]">
          <ItemsList items={data?.items} />
        </div>
        <ComputationSection data={data} />
      </div>
    </>
  );
};

const ReviewOrderButton = () => {
  return (
    <button
      type="submit"
      className="bg-yellow-500 text-black text-xs font-semibold w-full py-3 rounded mt-3"
    >
      Complete Payment
    </button>
  );
};

const LoginModal = ({ isOpen, setOpen, loginSuccess }) => {
  const handleSuccessLogin = (data) => {
    setOpen(false);
    loginSuccess();
  };
  return (
    <Dialog open={isOpen} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto overflow-x-hidden">
        <div className="w-screen h-full relative">
          <div className="absolute top-10 left-0 right-0 flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="w-full relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[500px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto rounded-lg"
            >
              <div className=" flex items-center justify-center p-5">
                <LoginForm successLogin={handleSuccessLogin} />
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const LogoutDropDown = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="text-neutral-500 flex items-center justify-center relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[100%] right-0 bg-white shadow rounded-[10px] border min-w-[80px] min-h-[30px]">
          <button
            type="button"
            className="text-xs text-neutral-700 w-full text-center hover:text-neutral-900"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const QuestionIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <g fill="none">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-9.5a3.625 3.625 0 0 1 1.348 6.99a.8.8 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5"
        />
      </g>
    </svg>
  );
};

const FormLoader = () => {
  return (
    <div className="w-full md:max-w-[500px] flex flex-col gap-2 md:py-5 px-5">
      <div className="w-full h-[78px]">
        <div className="flex justify-between">
          <div className="h-[24px]"></div>
          <div className="flex gap-[5px]">
            <div className="h-[16px] w-[40px] bg-neutral-300 rounded"></div>
            <div className="h-[16px] w-[40px] bg-neutral-300 rounded"></div>
          </div>
        </div>
        <div className="h-[37.8px] w-full bg-neutral-200 rounded mt-2"></div>
      </div>
      <div className="pb-2 mt-[49px]">
        <label className="font-semibold">Delivery</label>
        <div className="flex flex-col gap-[10px] mt-2">
          <div className="flex gap-[10px]">
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          </div>
          <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          <div className="flex gap-[10px]">
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          </div>
          <div className="flex gap-[10px]">
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          </div>
          <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
        </div>
      </div>

      <div className="border rounded bg-neutral-200 w-full min-h-[330px] mt-[35px]"></div>

      <div className="pb-2 mt-[55px] ">
        <label className="font-semibold">Billing</label>
        <div className="flex flex-col gap-[10px] mt-2">
          <div className="flex gap-[10px]">
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          </div>
          <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          <div className="flex gap-[10px]">
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          </div>
          <div className="flex gap-[10px]">
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
            <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
          </div>
          <div className="w-full h-[37.8px] bg-neutral-200 rounded"></div>
        </div>
      </div>

      <div className="hidden md:flex">
        <div className="w-full h-[40px] bg-neutral-300 rounded mt-3"></div>
      </div>
    </div>
  );
};

//  main component
function CheckoutComponent() {
  const [cartTotal, setCartTotal] = useState({});
  const [expandOrderSummary, setExpandOrderSummary] = useState(false);
  const {
    clearCartItems,
    formattedCart,
    fetchOrderTotal,
    loadCart,
    cartItems,
    loadingCartItems,
  } = useCart();
  // braintree
  const dropinContainer = useRef(null);
  const [instance, setInstance] = useState(null);
  // checkout form
  const [form, setForm] = useState(initialForm);
  // forage
  const [forage, setForage] = useState(null);
  // auth
  const { isLoggedIn, user, loading, updateProfile } = useAuth();
  // login modal
  const [openLogin, setOpenLogin] = useState(false);

  const [successPayment, setSuccessPayment] = useState(false);
  
  const router = useRouter();

  const getOrderTotal = async (newForm) => {
    const items = mapOrderItems(newForm?.items);
    if (items.length > 0) {
      const response = await fetchOrderTotal({ ...newForm, items });

      const hasCompleteShipping = Boolean(
        newForm?.shipping_zip_code && newForm?.is_valid_shipping_zip
      );

      if (response?.success) {
        const updatedCartTotal = {
          ...response.data,
          allowPay: hasCompleteShipping,
        };

        setCartTotal(updatedCartTotal);
      }
    }
  };

  async function createOrder(orderData) {
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : { success: false, message: "Invalid JSON response from server" };

      if (!response.ok || result.success === false) {
        return {
          success: false,
          message: result.message || "Failed to create order",
        };
      }

      return {
        success: true,
        data: result.data || result.order || result,
      };
    } catch (error) {
      console.error("Order creation failed:", error.message || error);
      return {
        success: false,
        message: error.message || "Unexpected error while creating order",
      };
    }
  }

  const debouncedGetOrderTotal = useMemo(
    () => debounce(getOrderTotal, 300),
    []
  );

  const zipQuery = async (zip) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!response.ok) {
        return { error: "Invalid Zip Code" };
      }

      const data = await response.json();
      const place = data.places[0];

      return {
        error: false,
        data: {
          city: place["place name"],
          state: place["state"],
          province: place["state abbreviation"],
          country: data["country"],
          country_abbr: data["country abbreviation"],
        },
      };
    } catch (err) {
      return { error: err };
    }
  };

  const debouncedZipQuery = useMemo(
    () =>
      debounce(async (zip, callback) => {
        const result = await zipQuery(zip);
        callback(result);
      }, 500),
    []
  );

  const saveInformation = (condition) => {
    if (loading) return;
    if (!condition) return;
    const {
      items,
      newsletter,
      save_information,
      shipping_to_billing,
      notes,
      payment_details,
      payment_status,
      payment_method,
      status,
      ...toSave
    } = form;
    console.log("[toSAVE]", toSave);

    if (isLoggedIn) {
      const data = {
        ...user,
        profile: {
          phone: toSave?.shipping_phone,
          billing_address: toSave?.billing_address,
          billing_country: toSave?.billing_country,
          billing_city: toSave?.billing_city,
          billing_state: toSave?.billing_province,
          billing_zip: toSave?.billing_zip_code,
          shipping_address: toSave?.shipping_address,
          shipping_country: toSave?.shipping_country,
          shipping_city: toSave?.shipping_city,
          shipping_state: toSave?.shipping_province,
          shipping_zip: toSave?.shipping_zip_code,
        },
      };

      updateProfile(data);
    } else {
      forage.setItem("checkout_info", toSave);
    }
  };

  const shippingAsBilling = (condition, newForm) => {
    // shipping and billing info only
    return {
      ...newForm,
      billing_first_name: condition ? newForm?.shipping_first_name : "",
      billing_last_name: condition ? newForm?.shipping_last_name : "",
      billing_phone: condition ? newForm?.shipping_phone : "",
      billing_address: condition ? newForm?.shipping_address : "",
      billing_city: condition ? newForm?.shipping_city : "",
      billing_province: condition ? newForm?.shipping_province : "",
      billing_zip_code: condition ? newForm?.shipping_zip_code : "",
      billing_country: condition ? newForm?.shipping_country : "",
    };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      let updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // sync billing fields if shipping_to_billing is checked
      if (
        updatedForm.shipping_to_billing &&
        name.startsWith("shipping_") &&
        !["shipping_to_billing", "shipping_email"].includes(name)
      ) {
        const [, ...fieldParts] = name.split("_");
        const billingField = `billing_${fieldParts.join("_")}`;
        updatedForm[billingField] = value;
      }

      // keep billing_email synced
      if (name === "shipping_email") {
        updatedForm.billing_email = updatedForm.shipping_email;
      }

      // handle shipping_to_billing toggle
      if (name === "shipping_to_billing") {
        updatedForm = shippingAsBilling(checked, updatedForm);
      }

      return updatedForm;
    });

    // handle ZIP async lookup separately
    if (name === "shipping_zip_code" || name === "billing_zip_code") {
      debouncedZipQuery(value, (result) => {
        updateOnZipChange(name, result);
      });
    }
  };

  const updateOnZipChange = (name, result) => {
    const { error, data } = result;

    setForm((prev) => {
      const updatedForm = { ...prev };

      if (name === "shipping_zip_code") {
        // shipping ZIP update + optionally update billing if synced
        updatedForm.shipping_country = error ? "" : data?.country;
        updatedForm.shipping_city = error ? "" : data?.city;
        updatedForm.shipping_province = error ? "" : data?.province;
        updatedForm.is_valid_shipping_zip = !Boolean(error);

        // update billing fields if shipping_to_billing is true
        if (prev.shipping_to_billing) {
          updatedForm.billing_country = error ? "" : data?.country;
          updatedForm.billing_city = error ? "" : data?.city;
          updatedForm.billing_province = error ? "" : data?.province;
          updatedForm.is_valid_billing_zip = !Boolean(error);
        }

        // trigger order total only for shipping
        debouncedGetOrderTotal(updatedForm);
      } else if (name === "billing_zip_code") {
        // billing ZIP update only, no order total
        updatedForm.billing_country = error ? "" : data?.country;
        updatedForm.billing_city = error ? "" : data?.city;
        updatedForm.billing_province = error ? "" : data?.province;
        updatedForm.is_valid_billing_zip = !Boolean(error);
      }

      return updatedForm;
    });
  };

  const handleLogin = () => {
    setOpenLogin(true);
  };

  const fillUserToForm = (user) => {
    if (!user) return;
    setForm((prev) => {
      const updated = {
        ...prev,
        billing_first_name: user?.first_name,
        billing_last_name: user?.last_name,
        billing_email: user?.email,
        billing_phone: user?.profile?.phone,
        billing_address: user?.profile?.billing_address,
        billing_city: user?.profile?.billing_city,
        billing_province: user?.profile?.billing_state,
        billing_zip_code: user?.profile?.billing_zip,
        billing_country: user?.profile?.billing_country,
        shipping_first_name: user?.first_name,
        shipping_last_name: user?.last_name,
        shipping_email: user?.email,
        shipping_phone: user?.profile?.phone,
        shipping_address: user?.profile?.shipping_address,
        shipping_city: user?.profile?.shipping_city,
        shipping_province: user?.profile?.shipping_state,
        shipping_zip_code: user?.profile?.shipping_zip,
        shipping_country: user?.profile?.shipping_country,
        is_valid_shipping_zip: false,
        is_valid_billing_zip: false,
        newsletter: false,
        save_information: false,
        shipping_to_billing: false,
      };
      debouncedZipQuery(updated.shipping_zip_code, (result) => {
        updateOnZipChange("shipping_zip_code", result);
      });
      // debouncedZipQuery(updated.billing_zip_code, (result) => {
      //   updateOnZipChange("billing_zip_code", result);
      // });
      return updated;
    });
  };

  const handleLoginSuccess = () => {
    //   fillUserToForm(user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartTotal?.allowPay) {
      alert(
        "Please Make Sure You Fillout Neccessary shipping information for us to recalculate your shipping total."
      );
    }

    if (!instance) {
      alert("Drop-in UI is not initialized");
      return;
    }

    try {
      const { nonce } = await instance.requestPaymentMethod();
      console.log("Generated Nonce:", nonce);

      if (!nonce) {
        alert("Error: No nonce received. Try again.");
        return;
      }

      const total_amount = parseFloat(cartTotal?.total_price || 0).toFixed(2);

      const response = await fetch("/api/braintree_checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount: `${total_amount}` }),
      });

      const result = await response.json();

      if (result.success) {
        const orders = form;
        orders["status"] = "paid";
        orders["payment_status"] = true;
        orders["payment_details"] = result?.transaction?.id;
        orders["store_domain"] = store_domain;
        orders["items"] = mapOrderItems(formattedCart);

        const order_response = await createOrder(orders);

        if (order_response.success) {
          instance.teardown();
          setInstance(null);
          clearCartItems();
          saveInformation(form?.save_information);
          setSuccessPayment(true);
          router.push(`${BASE_URL}/payment_success`);
        } else {
          setSuccessPayment(false);
          alert("Something went wrong! Please try again.");
        }
      } else {
        setSuccessPayment(false);
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      setSuccessPayment(false);
      console.error("Payment Error:", error);
      alert("Payment error. Try again.");
    }
  };

  useEffect(() => {
    if (
      formattedCart &&
      Array.isArray(formattedCart) &&
      formattedCart.length > 0
    ) {
      let newForm = { ...form, items: formattedCart };
      setForm((prev) => ({ ...newForm }));
      getOrderTotal(newForm);
    }
  }, [formattedCart]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      setForage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fillGuestInfo = async () => {
      const checkout_info = await forage.getItem("checkout_info");
      setForm((prev) => {
        const updated = {
          ...prev,
          ...checkout_info,
          is_valid_shipping_zip: false,
          is_valid_billing_zip: false,
          newsletter: false,
          save_information: false,
          shipping_to_billing: false,
        };
        debouncedZipQuery(updated.shipping_zip_code, (result) => {
          updateOnZipChange("shipping_zip_code", result);
        });
        // debouncedZipQuery(updated.billing_zip_code, (result) => {
        //   updateOnZipChange("billing_zip_code", result);
        // });
        return updated;
      });
    };

    const reloadCart = async() => {
      const status = await loadCart();
      // console.log("[reloadCartStatus]", status);
      // // if(status==="redirect"){
      // //   router.push(BASE_URL);
      // // }
    }

    if (loading && !forage) return;

    if (isLoggedIn) {
      fillUserToForm(user);
    } else {
      fillGuestInfo();
    }

    reloadCart();
  }, [loading, forage, isLoggedIn, user]);

  // useEffect(() => {
  //   if (!loading && isLoggedIn && cartItems.length === 0 && !loadingCartItems && !successPayment) {
  //      router.push(`${BASE_URL}`);
  //   }
  // }, [loading, isLoggedIn, cartItems, loadingCartItems, successPayment]);

  useEffect(() => {
    async function initializeDropIn() {
      if (loading) return;
      if (!dropinContainer.current) return;

      try {
        const res = await fetch("/api/braintree_token");
        const data = await res.json();
        // setClientToken(data.clientToken);

        if (!data.clientToken) {
          alert("Error: No client token received");
          return;
        }

        if (instance) {
          await instance.teardown();
          setInstance(null);
        }

        const dropinInstance = await dropin.create({
          authorization: data.clientToken,
          container: dropinContainer.current,
          vaultManager: false, // Disable stored payment methods
          card: {
            cardholderName: { required: true },
            overrides: {
              fields: {
                number: { placeholder: "4111 1111 1111 1111" },
                cvv: { required: true, placeholder: "123" }, // ✅ Force CVV
                expirationDate: { placeholder: "MM/YY" },
              },
            },
          },
        });

        setInstance(dropinInstance);
      } catch (error) {
        console.log("[BRAINTREEINIT] ERROR", error);
        // alert("Payment UI failed to load.");
      }
    }

    initializeDropIn();
  }, [loading]);

  return (
    <section className="bg-white">
      <MobileOrderSummary data={{ ...cartTotal, items: formattedCart }} />
      {/* desktop */}
      <div className="container mx-auto">
        {/* <div><button onClick={mergeGuestToLoggedInUser} className="mt-[20px] px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold">TEST MERGE</button></div> */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-0 md:gap-[20px] flex-col md:flex-row py-5 md:py-0">
            {/* form section */}
            <div className="w-full flex md:justify-end">
              {loading ? (
                <FormLoader />
              ) : (
                <div className="w-full md:max-w-[500px] flex flex-col gap-2 md:py-5 px-5">
                  {isLoggedIn ? (
                    <div className="border-b border-neutral-300 pb-2 flex items-center justify-between">
                      {user && (
                        <>
                          <div className="flex items-center gap-[10px]">
                            <div className="rounded-full w-[32px] h-[32px] bg-neutral-200 flex items-center justify-center text-xs">
                              {user?.name_initials && user.name_initials}
                            </div>
                            <div className="font-medium text-neutral-700 text-sm">
                              {user?.email && user.email}
                            </div>
                          </div>
                          <LogoutDropDown />
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="border-b border-neutral-300 pb-2">
                        <label
                          htmlFor="email"
                          className="font-semibold flex items-center justify-between"
                        >
                          <span>Contact</span>
                          <div className="flex gap-[5px]">
                            <button
                              type="button"
                              className="underline font-light text-xs"
                              onClick={handleLogin}
                            >
                              Sign In
                            </button>
                            <Link
                              href={`${BASE_URL}/login`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-light text-xs"
                            >
                              Register
                            </Link>
                          </div>
                        </label>
                        <input
                          type="email"
                          name="shipping_email"
                          placeholder="Email"
                          value={form?.shipping_email || ""}
                          onChange={handleChange}
                          required
                          className="text-sm  w-full mt-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                        />
                      </div>
                      <div className="flex items-start text-sm text-neutral-700 py-1">
                        <input
                          id="newsletter"
                          name="newsletter"
                          type="checkbox"
                          value={form?.newsletter}
                          checked={form?.newsletter}
                          onChange={handleChange}
                          className="text-sm mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="newsletter" className="text-sm">
                          Email me with news and offers
                        </label>
                      </div>
                    </>
                  )}
                  <div className="pb-2 mt-3">
                    <label className="font-semibold">Delivery</label>
                    <div className="flex flex-col gap-[10px] mt-2">
                      <div className="flex gap-[10px]">
                        <input
                          type="text"
                          name="shipping_first_name"
                          placeholder="First Name"
                          value={form?.shipping_first_name || ""}
                          onChange={handleChange}
                          required
                          className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                        />
                        <input
                          type="text"
                          name="shipping_last_name"
                          placeholder="Last Name"
                          value={form?.shipping_last_name || ""}
                          onChange={handleChange}
                          required
                          className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                        />
                      </div>
                      <input
                        type="text"
                        name="shipping_address"
                        placeholder="Address"
                        value={form?.shipping_address || ""}
                        onChange={handleChange}
                        required
                        className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                      />
                      <div className="flex gap-[10px]">
                        <div className="w-full">
                          <input
                            type="text"
                            name="shipping_zip_code"
                            placeholder="Postal code"
                            value={form?.shipping_zip_code || ""}
                            onChange={handleChange}
                            required
                            className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                          />
                        </div>
                        <div className="w-full relative">
                          <input
                            type="text"
                            name="shipping_country"
                            placeholder="Country"
                            disabled
                            value={form?.shipping_country || ""}
                            onChange={handleChange}
                            required
                            className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 right-1 text-stone-500"
                            title="Auto-filled on valid zipcode entry"
                          >
                            <QuestionIcon />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-[10px]">
                        <div className="w-full relative">
                          <input
                            type="text"
                            name="shipping_city"
                            placeholder="City"
                            disabled
                            title="Autopopulated on valid zipcode entry"
                            value={form?.shipping_city || ""}
                            onChange={handleChange}
                            required
                            className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 right-1 text-stone-500"
                            title="Auto-filled on valid zipcode entry"
                          >
                            <QuestionIcon />
                          </div>
                        </div>
                        <div className="w-full relative">
                          <input
                            type="text"
                            name="shipping_province"
                            placeholder="State"
                            disabled
                            title="Autopopulated on valid zipcode entry"
                            value={form?.shipping_province || ""}
                            onChange={handleChange}
                            required
                            className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 right-1 text-stone-500"
                            title="Auto-filled on valid zipcode entry"
                          >
                            <QuestionIcon />
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="shipping_phone"
                        placeholder="Phone"
                        value={form?.shipping_phone || ""}
                        onChange={handleChange}
                        required
                        className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                      />
                      <input
                        type="text"
                        name="notes"
                        placeholder="Notes: Give me a call, and etc (optional)"
                        value={form?.notes || ""}
                        onChange={handleChange}
                        className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                      />{" "}
                    </div>
                    <div className="flex items-start text-sm text-neutral-700 py-1 mt-2">
                      <input
                        id="save_information"
                        name="save_information"
                        type="checkbox"
                        value={form?.save_information}
                        checked={form?.save_information}
                        onChange={handleChange}
                        className="text-sm mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <label htmlFor="save_information" className="text-sm">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                  {/* braintree form */}
                  <div className="border rounded bg-neutral-200 w-full min-h-[330px]">
                    <div ref={dropinContainer}></div>
                  </div>
                  <div className="flex items-start text-sm text-neutral-700 py-1 mt-2">
                    <input
                      id="shipping_to_billing"
                      name="shipping_to_billing"
                      type="checkbox"
                      value={form?.shipping_to_billing}
                      checked={form?.shipping_to_billing}
                      onChange={handleChange}
                      className="text-sm mt-1 mr-2 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <label htmlFor="shipping_to_billing" className="text-sm">
                      Use shipping address as billing address
                    </label>
                  </div>
                  {!form?.shipping_to_billing ? (
                    <div className="pb-2 mt-3 ">
                      <label className="font-semibold">Billing</label>

                      <div className="flex flex-col gap-[10px] mt-2">
                        <div className="flex gap-[10px]">
                          <input
                            type="text"
                            name="billing_first_name"
                            placeholder="First Name"
                            value={form?.billing_first_name || ""}
                            onChange={handleChange}
                            required
                            className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                          />
                          <input
                            type="text"
                            name="billing_last_name"
                            placeholder="Last Name"
                            value={form?.billing_last_name || ""}
                            onChange={handleChange}
                            required
                            className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                          />
                        </div>
                        <input
                          type="text"
                          name="billing_address"
                          placeholder="Address"
                          value={form?.billing_address || ""}
                          onChange={handleChange}
                          required
                          className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                        />
                        <div className="flex gap-[10px]">
                          <div className="w-full">
                            <input
                              type="text"
                              name="billing_zip_code"
                              placeholder="Postal code"
                              value={form?.billing_zip_code || ""}
                              onChange={handleChange}
                              required
                              className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                            />
                          </div>
                          <div className="w-full relative">
                            <input
                              type="text"
                              name="billing_country"
                              placeholder="Country"
                              disabled
                              value={form?.billing_country || ""}
                              onChange={handleChange}
                              required
                              className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 right-1 text-stone-500"
                              title="Auto-filled on valid zipcode entry"
                            >
                              <QuestionIcon />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-[10px]">
                          <div className="w-full relative">
                            <input
                              type="text"
                              name="billing_city"
                              placeholder="City"
                              disabled
                              title="Autopopulated on valid zipcode entry"
                              value={form?.billing_city || ""}
                              onChange={handleChange}
                              required
                              className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 right-1 text-stone-500"
                              title="Auto-filled on valid zipcode entry"
                            >
                              <QuestionIcon />
                            </div>
                          </div>
                          <div className="w-full relative">
                            <input
                              type="text"
                              name="billing_province"
                              placeholder="State"
                              disabled
                              title="Autopopulated on valid zipcode entry"
                              value={form?.billing_province || ""}
                              onChange={handleChange}
                              required
                              className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                            />
                            <div
                              className="absolute top-1/2 -translate-y-1/2 right-1 text-stone-500"
                              title="Auto-filled on valid zipcode entry"
                            >
                              <QuestionIcon />
                            </div>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="billing_phone"
                          placeholder="Phone"
                          value={form?.billing_phone || ""}
                          onChange={handleChange}
                          required
                          className="text-sm w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-stone-600"
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="hidden md:flex">
                    <ReviewOrderButton />
                  </div>
                </div>
              )}
            </div>
            {/* divider */}
            <div className="border-l border-neutral-300 hidden md:block"></div>
            {/* items section */}
            <div className="w-full flex md:justify-start">
              <div className="w-full md:max-w-[500px] flex flex-col gap-2 md:py-5 px-5">
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => setExpandOrderSummary((prev) => !prev)}
                    className="w-full flex items-center justify-between py-[10px]"
                  >
                    <span className="font-semibold">Order Summary</span>
                    <span className="font-light text-xs flex items-center gap-[4px]">
                      {expandOrderSummary ? (
                        <>
                          <span>Hide</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M16.53 14.03a.75.75 0 0 1-1.06 0L12 10.56l-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Show</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                  <div
                    className={`${
                      expandOrderSummary ? "" : "hidden"
                    } py-[20px]`}
                  >
                    <ItemsList items={formattedCart} />
                  </div>
                </div>
                <div className="hidden md:block mb-5">
                  <ItemsList items={formattedCart} />
                </div>
                <ComputationSection data={cartTotal} />
                <div className="md:hidden">
                  <ReviewOrderButton />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <style jsx>{`
        :global(.braintree-placeholder) {
          display: none !important;
        }
        :global(.braintree-sheet__container.braintree-sheet--active) {
          margin: 0px;
        }
      `}</style>
      <LoginModal
        isOpen={openLogin}
        setOpen={setOpenLogin}
        loginSuccess={handleLoginSuccess}
      />
    </section>
  );
}

export default CheckoutComponent;
