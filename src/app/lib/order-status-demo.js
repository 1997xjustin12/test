/**
 * Dummy orders for /order-status/demo — what a guest would see, for showing
 * the page before real links are in the order emails. Already in the
 * normalised shape (see normalizeOrder in lib/order-status.js), so the demo
 * exercises the same components as the real page.
 *
 * One order per interesting state: awaiting payment (with a pay button),
 * preparing, shipped (with tracking), delivered, and cancelled. The page shows
 * one at a time, as the real page does — ?status= picks which.
 */

// No street: GET /api/orders/status leaves it out, because the link to the
// page is emailed and may be forwarded.
const address = {
  name: "Jordan Rivera",
  city: "Austin",
  state: "TX",
  zip: "78704",
  country: "United States",
};

export const DEMO_ORDERS = [
  {
    orderNumber: "SF-20261014-4821",
    createdAt: "2026-10-14T16:20:00Z",
    status: "unpaid",
    items: [
      {
        title: "36\" Premium Built-In Gas Grill with Rotisserie",
        image: "/images/categories/grills-and-smokers.webp",
        quantity: 1,
        price: 3499,
        total: 3499,
      },
      {
        title: "Stainless Steel Double Access Doors",
        image: "/images/categories/outdoor-kitchen-components.webp",
        quantity: 1,
        price: 489,
        total: 489,
      },
    ],
    subTotal: 3988,
    shipping: 0,
    tax: 329.01,
    discount: null,
    total: 4317.01,
    shippingAddress: address,
    shippingMethod: "tilt_bed",
    estimatedDelivery: null,
    tracking: null,
    // Not a real payment page — the demo button goes nowhere useful on purpose.
    paymentLink: "https://example.com/pay/demo",
  },
  {
    orderNumber: "SF-20261009-3307",
    createdAt: "2026-10-09T14:05:00Z",
    status: "preparing",
    items: [
      {
        title: "Outdoor Rated Stainless Steel Refrigerator, 24\"",
        image: "/images/categories/outdoor-refrigeration.webp",
        quantity: 1,
        price: 1899,
        total: 1899,
      },
    ],
    subTotal: 1899,
    shipping: 149,
    tax: 156.67,
    discount: null,
    total: 2204.67,
    shippingAddress: address,
    shippingMethod: "flat_bed",
    estimatedDelivery: "2026-10-22T00:00:00Z",
    tracking: null,
    paymentLink: null,
  },
  {
    orderNumber: "SF-20261002-2194",
    createdAt: "2026-10-02T19:42:00Z",
    status: "shipped",
    items: [
      {
        title: "Linear Gas Fireplace Insert with Glass Media",
        image: "/images/categories/heating-and-fire.webp",
        quantity: 1,
        price: 2749,
        total: 2749,
      },
      {
        title: "Grill Cover — Heavy Duty, Weatherproof",
        image: "/images/categories/accessories.webp",
        quantity: 2,
        price: 89,
        total: 178,
      },
    ],
    subTotal: 2927,
    shipping: 0,
    tax: 241.48,
    discount: 50,
    total: 3118.48,
    shippingAddress: address,
    shippingMethod: "tilt_bed",
    estimatedDelivery: "2026-10-17T00:00:00Z",
    tracking: {
      carrier: "FedEx Freight",
      number: "7489 2201 5534",
      url: "https://www.fedex.com/fedextrack/",
    },
    paymentLink: null,
  },
  {
    orderNumber: "SF-20260918-1046",
    createdAt: "2026-09-18T11:15:00Z",
    status: "delivered",
    items: [
      {
        title: "Replacement Burner Kit — Stainless Steel",
        image: "/images/categories/replacement-parts.webp",
        quantity: 3,
        price: 64.5,
        total: 193.5,
      },
    ],
    subTotal: 193.5,
    shipping: 24.95,
    tax: 15.96,
    discount: null,
    total: 234.41,
    shippingAddress: address,
    shippingMethod: null,
    estimatedDelivery: null,
    tracking: {
      carrier: "UPS",
      number: "1Z 999 AA1 01 2345 6784",
      url: "https://www.ups.com/track",
    },
    paymentLink: null,
  },
  {
    orderNumber: "SF-20260830-0712",
    createdAt: "2026-08-30T09:30:00Z",
    status: "cancelled",
    items: [
      {
        title: "Installation Kit — Natural Gas Conversion",
        image: "/images/categories/installation-and-parts.webp",
        quantity: 1,
        price: 129,
        total: 129,
      },
    ],
    subTotal: 129,
    shipping: 14.95,
    tax: 10.64,
    discount: null,
    total: 154.59,
    shippingAddress: address,
    shippingMethod: null,
    estimatedDelivery: null,
    tracking: null,
    paymentLink: null,
  },
];
