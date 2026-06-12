"use client";
import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import NewGuestModal from "@/app/components/new-design/ui/GuestModal";
import BBQGuestModal from "@/app/components/bbq-design/ui/GuestModal";
import Image from "next/image";
import Link from "next/link";
import {
  BASE_URL,
  createSlug,
  formatPrice,
  parseRatingCount,
  ISBBQ
} from "@/app/lib/helpers";

function GuestEmailCaptureDialog() {
  const pathname = usePathname();
  const pathname_exclusion = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/cart",
    "/checkout",
    "/payment_success",
  ];
  const initial_info = {
    billing_first_name: null,
    billing_last_name: null,
    billing_email: null,
    billing_phone: null,
    billing_address: null,
    billing_city: null,
    billing_province: null,
    billing_zip_code: null,
    billing_country: null,
    shipping_first_name: null,
    shipping_last_name: null,
    shipping_email: null,
    shipping_phone: null,
    shipping_address: null,
    shipping_city: null,
    shipping_province: null,
    shipping_zip_code: null,
    shipping_country: null,
    notes: null,
    shipping_to_billing: true,
    store_domain: "https://www.solanafireplaces.com",
  };
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [forage, setForage] = useState(null);
  const [infoEmail, setInfoEmail] = useState(null);

  const handleLinkRedirect = (e) => {
    e.preventDefault();
    if (loading) return; // prevents redirecting when saving email is processing
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    router.push(href);
    setToggle(false);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!forage) {
      console.warn("[forage]", `value is ${forage}`);
      return;
    }
    setLoading(true);

    try {
      await forage.setItem("checkout_info", {
        ...initial_info,
        billing_email: email,
        shipping_email: email,
      });
      setInfoEmail(email);
      setToggle(false);
    } catch (err) {
      console.warn("[forage]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      const info = await module.getItem("checkout_info");
      setInfoEmail(info?.billing_email || null);
      setForage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleClose = () => {
    if (!infoEmail) {
      sessionStorage.setItem("guest_dialog_dismissed", "1");
    }
    setToggle(false);
  };

  useEffect(() => {
    const handler = () => {
      const dismissed = sessionStorage.getItem("guest_dialog_dismissed");
      if (!infoEmail && !dismissed && !pathname_exclusion.includes(pathname)) {
        setToggle(true);
      }
    };
    window.addEventListener("guestEmailRequired", handler);
    return () => window.removeEventListener("guestEmailRequired", handler);
  }, [infoEmail, pathname]);

  if(ISBBQ) return <BBQGuestModal isOpen={toggle} onClose={handleClose} />;
  
  return <NewGuestModal isOpen={toggle} onClose={handleClose} />;
}

export default GuestEmailCaptureDialog;
