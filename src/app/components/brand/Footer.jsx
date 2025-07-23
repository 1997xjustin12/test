import React from "react";
import Link from "next/link";
import Image from "next/image";
function Footer() {
  const footer_nav = [
    {
      label: "Company",
      links: [
        { label: "About", link: "#" },
        { label: "Features", link: "#" },
        { label: "Works", link: "#" },
        { label: "Career", link: "#" },
      ],
    },
    {
      label: "Help",
      links: [
        { label: "Customer Support", link: "#" },
        { label: "Delivery Details", link: "#" },
        { label: "Terms & Conditions", link: "#" },
        { label: "Privacy Policy", link: "#" },
      ],
    },
    {
      label: "FAQ",
      links: [
        { label: "Account", link: "#" },
        { label: "Manage Deliveries", link: "#" },
        { label: "Orders", link: "#" },
        { label: "Payments", link: "#" },
      ],
    },
    {
      label: "Resources",
      links: [
        { label: "Free eBooks", link: "#" },
        { label: "How to - Blog", link: "#" },
        { label: "Youtube Playlist", link: "#" },
      ],
    },
  ];

  // icons from iconify under fa6
  const socials = [
    {
      title: "X",
      href: "#",
      button_bg_color: "",
      button_text_color: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z"
          />
        </svg>
      ),
    },
    {
      title: "Facebook",
      href: "#",
      button_bg_color: "bg-black",
      button_text_color: "text-white",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="24"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8z"
          />
        </svg>
      ),
    },
    {
      title: "Instagram",
      href: "#",
      button_bg_color: "",
      button_text_color: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="24"
          viewBox="0 0 448 512"
        >
          <path
            fill="currentColor"
            d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9S287.7 141 224.1 141m0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7s74.7 33.5 74.7 74.7s-33.6 74.7-74.7 74.7m146.4-194.3c0 14.9-12 26.8-26.8 26.8c-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8s26.8 12 26.8 26.8m76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9c-26.2-26.2-58-34.4-93.9-36.2c-37-2.1-147.9-2.1-184.9 0c-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9c1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0c35.9-1.7 67.7-9.9 93.9-36.2c26.2-26.2 34.4-58 36.2-93.9c2.1-37 2.1-147.8 0-184.8M398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6c-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6c-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6c29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6c11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1"
          />
        </svg>
      ),
    },
  ];

  const payments = [
    { title: "Visa", img: "/images/grandeur/payment/visa-logo.webp" },
    {
      title: "MasterCard",
      img: "/images/grandeur/payment/mastercard-logo.webp",
    },
    { title: "Paypal", img: "/images/grandeur/payment/paypal-logo.webp" },
    { title: "Apple Pay", img: "/images/grandeur/payment/apple-pay-logo.webp" },
    {
      title: "Google Pay",
      img: "/images/grandeur/payment/google-pay-logo.webp",
    },
  ];
  return (
    <section className="mb-[100px]">
      <div className="container mx-auto flex flex-col gap-[30px]">
        <div className="flex items-center gap-[100px]">
          <div className="w-[320px]">
            <div className="w-full aspect-w-2 aspect-h-1 flex items-center justify-center relative">
              {/* LOGO */}
              <Image
                src="/images/grandeur/grandeur-logo.webp"
                alt="Grandeur Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              Discover premium outdoor grills and kitchen solutions built for
              durability, precision, and the ultimate BBQ experience.
            </div>
          </div>
          <div className="w-full flex justify-between">
            {footer_nav.map((item, index) => (
              <div
                key={`footer-nav-cols-${index}`}
                className="flex flex-col gap-[30px]"
              >
                <div className="font-bold uppercase">{item.label}</div>
                <div className="flex flex-col gap-[15px]">
                  {item.links.map((item1, index1) => (
                    <Link
                      prefetch={false}
                      href={item1.link}
                      key={`footer-nav-cols-links-${index}-${index1}`}
                    >
                      <div className="text-neutral-800">{item1.label}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex relative items-center gap-[20px]">
          {socials.map((item, index) => (
            <Link
              key={`footer-socials-${index}`}
              title={item.title}
              prefetch={false}
              href={item.href}
              className={`h-[50px] w-[50px] rounded-full border-[3px] border-neutral-500 flex items-center justify-center ${
                item.button_bg_color || "bg-white"
              } ${item.button_text_color || "text-black"}`}
              style={{ zIndex: 1 }}
            >
              {item.icon}
            </Link>
          ))}
          <div
            className="absolute top-1/2 left-0 w-full h-[3px] bg-neutral-500 -translate-y-1/2"
            style={{ zIndex: 0 }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <div>Gradeur @ 2025</div>
          <div className="flex gap-[10px] items-center">
            {payments.map((item, index) => (
              <div
                key={`footer-payment-${index}`}
                title={item.title}
                className="w-[70px] h-[40px] shadow bg-center bg-contain bg-no-repeat bg-white rounded"
                style={{ backgroundImage: `url(${item.img})` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
