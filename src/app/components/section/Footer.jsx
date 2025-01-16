import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  PinterestIcon,
} from "../icons/lib";

const footer = [
  {
    name: "Customer Support",
    url: "",
    child: [
      {
        name: "Contact Us",
        url: "",
      },
      {
        name: "Track My Order",
        url: "",
      },
      {
        name: "FAQ's",
        url: "",
      },
      {
        name: "Refund & Return Policy",
        url: "",
      },
      {
        name: "Privacy Policy",
        url: "",
      },
      {
        name: "Shipping policy",
        url: "",
      },
    ],
  },
  {
    name: "Our Team",
    url: "",
    child: [
      {
        name: "About Us",
        url: "",
      },
      {
        name: "Contact Us",
        url: "",
      },
      {
        name: "Our Brands",
        url: "",
      },
      {
        name: "Customer Reviews",
        url: "",
      },
    ],
  },
  {
    name: "Resources",
    url: "",
    child: [
      {
        name: "Blogs",
        url: "",
      },
      {
        name: "Recipes",
        url: "",
      },
      {
        name: "Comparison Guides",
        url: "",
      },
      {
        name: "Videos",
        url: "",
      },
    ],
  },
  {
    name: "Deals & Promotions",
    url: "",
    child: [
      {
        name: "Open Box",
        url: "",
      },
      {
        name: "Close Out Deals",
        url: "",
      },
      {
        name: "Package Deals",
        url: "",
      },
      {
        name: "Clearance Sale",
        url: "",
      },
      {
        name: "Free Shipping",
        url: "",
      },
      {
        name: "Free Accessories",
        url: "",
      },
      {
        name: "Contractor Discount Program",
        url: "",
      },
    ],
  },
  {
    name: "Follow us",
    url: "",
    child: [
      {
        name: "Facebook",
        url: "",
      },
      {
        name: "Instagram",
        url: "",
      },
      {
        name: "Youtube",
        url: "",
      },
      {
        name: "Pinterest",
        url: "",
      },
    ],
  },
];

const payments = [
  { img: "/images/footer/amex.webp", alt: "AMEX" },
  { img: "/images/footer/apple-pay.webp", alt: "ApplePay" },
  { img: "/images/footer/master-card.webp", alt: "MasterCard" },
  { img: "/images/footer/visa.webp", alt: "VISA" },
  { img: "/images/footer/paypal.webp", alt: "Paypal" },
  { img: "/images/footer/payment-6.webp", alt: "" },
  { img: "/images/footer/fb-pay.webp", alt: "FBPay" },
  { img: "/images/footer/jcb.webp", alt: "JCB" },
  { img: "/images/footer/g-pay.webp", alt: "GPay" },
];

export default function Footer() {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto pt-[60px] pb-[30px]">
        <div className="flex flex-col gap-[50px]">
          <div className="flex gap-[20px]">
            {footer.map((i, idx) => (
              <div key={`footer-section-${idx}`} className="w-full">
                <div className="text-lg font-light">{i.name}</div>
                {i.name !== "Follow us" ? (
                  <div className="mt-[20px] flex flex-col gap-[8px]">
                    {i.child.map((i1, idx1) => (
                      <div
                        key={`footer-section-${idx}-item-${idx1}`}
                        className="font-light">
                        <div className=" cursor-pointer w-[auto] inline-block">
                          {i1.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-[20px] flex gap-[8px]">
                    {i.child.map((i1, idx1) => (
                      <div
                        key={`footer-section-${idx}-item-${idx1}`}
                        className="cursor-pointer">
                        {i1.name === "Facebook" && (
                          <FacebookIcon color="white" width={48} height={48} />
                        )}
                        {i1.name === "Instagram" && (
                          <InstagramIcon color="white" width={48} height={48} />
                        )}
                        {i1.name === "Youtube" && (
                          <YoutubeIcon color="white" width={48} height={48} />
                        )}
                        {i1.name === "Pinterest" && (
                          <PinterestIcon color="white" width={48} height={48} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center">
            <div className="mr-[20px]">We Accept: </div>
            <div className="flex items-center gap-[20px]">
              {payments.map((i, idx) => (
                <div>
                  <img src={i.img} alt={i.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
