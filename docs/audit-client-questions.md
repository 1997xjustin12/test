# Client Questions — Audit Backlog Unblock

Six open items from the e-commerce audits can't move without a decision or an asset from the client. Everything else in [`audit-tasklist.md`](./audit-tasklist.md) is either done or buildable by us.

Sending these as one batch — answers convert most of the remaining backlog into buildable work.

---

## 1. Braintree production credentials — **blocks launch**

The payment integration currently runs against Braintree's **sandbox**. We removed the hardcoded sandbox keys from the source and moved them to environment variables, so the code is ready — but nothing can actually take a real payment until we have the production set.

**What we need:**
- Production `Merchant ID`
- Production `Public Key`
- Production `Private Key`

**Then we will:** set `BRAINTREE_ENV=production` on Vercel and run one live end-to-end transaction to confirm it settles.

> This is the only remaining P1. The site cannot go live without it.

---

## 2. Blogs — one shared blog, or one per brand?

Right now **both** Solana Fireplaces and BBQ Grill Outlet pull their `/blogs` articles from the same WordPress feed. The two sites style the articles differently, but the underlying content is identical — a fireplace article on the Solana site is the same article a BBQ shopper sees.

**Options:**
- **A — Keep it shared.** Simplest, one content pipeline. But BBQ visitors will see fireplace-oriented articles and vice versa.
- **B — Split per brand.** Each site gets its own category/feed, so content matches the storefront. Requires the client to sort existing posts into two buckets and to publish to the right one going forward.

**Which do you want?**

---

## 3. Social media — which accounts should we link?

Both footers currently link only **Facebook** and **Pinterest**.

**What we need:** the URLs for any other accounts you want linked — Instagram, YouTube, TikTok, X/Twitter, LinkedIn.

If accounts don't exist yet, tell us which ones you plan to create and we'll leave placeholders out until they're live (dead social links hurt more than missing ones).

---

## 4. Email marketing — dedicated platform, or the current backend?

The newsletter signup currently posts to our own backend, which stores the subscriber. It is **not** connected to a recognized email platform, so there's no campaign builder, no automated welcome series, no abandoned-cart email sequence, and no deliverability tooling.

**Options:**
- **A — Connect Klaviyo or Mailchimp.** Industry standard for e-commerce, gives you campaigns, automations, and segmentation out of the box. Monthly cost scales with list size.
- **B — Stay on the custom backend.** No extra cost, but someone has to build and maintain lifecycle emails, and you have no self-serve campaign tool.

**Which direction — and if A, which platform do you already have an account with?**

---

## 5. Loyalty / rewards program — do you want one?

Not currently built, not currently planned. Repeat-purchase incentives (points, tiers, referral credit) are a meaningful revenue lever in this category, but it's a real build and it needs a business decision first.

**What we need:** yes/no, and if yes, roughly what shape — points on purchase, tiered discounts, referral credit, or something else. We'll scope it from there.

---

## 6. Legacy brand microsite pages — keep, migrate, or retire?

Two pages predate the current two-brand architecture and sit outside it entirely, with their own hardcoded metadata:

- `/brand/bbq-grill-outlet`
- `/brand/solana-bbq-grills`

They still work, but they don't follow the current theming and won't pick up brand changes automatically. Every future branding update has to be applied to them by hand.

**Options:**
- **A — Retire them** and redirect to the equivalent current pages. Cleanest.
- **B — Rebuild them** inside the current architecture so they stay consistent going forward.
- **C — Leave as-is** and accept that they'll drift out of sync.

**Do these pages still get traffic or serve a campaign we should know about?** That answer probably decides it.

---

*Source: `solana_ecommerce_audit_2026-07-22.pdf`, `bbq_ecommerce_audit_2026-07-22.pdf`. Tracking: [`audit-tasklist.md`](./audit-tasklist.md).*
