import { OPERATORS, RECHARGE_LIVE } from "./recharge";

// ─────────────────────────────────────────────────────────────────────────────
// Homepage content & feature switches.
// Everything a non-developer may need to change lives here, so sections never
// hard-code business claims.
// ─────────────────────────────────────────────────────────────────────────────

export const business = {
  name: "JonoJivan",
  legalName: "JONOJIVAN GROCERY DISTRIBUTION PVT LTD",
  phone: "9435266783",
  // International format, digits only. CONFIRM this number is on WhatsApp
  // before launch; set to null to hide WhatsApp buttons.
  whatsappNumber: "919435266783",
  address: ["Uttar Khatowal, Rupahihat", "Nagaon, Assam", "PIN 782124"],
  // Add real profile URLs to show social icons in the footer.
  social: {
    facebook: null,
    instagram: null,
  },
};

// ── Recharge ────────────────────────────────────────────────────────────────
// Single source of truth lives in src/config/recharge.js; the homepage teaser
// (widget + "Plans people pick most") reads the same operators and plans.
// `live` stays false until the recharge provider API is connected.
export const recharge = {
  live: RECHARGE_LIVE,
  mobileOperators: OPERATORS.map((o) => o.name),
  dthOperators: ["Tata Play", "Airtel Digital TV", "Dish TV", "d2h", "Sun Direct"],
  quickAmounts: [199, 299, 349, 499],
  // PREVIEW DATA – top 3 "popular" plans per operator from config/recharge.js.
  popularPlans: Object.fromEntries(
    OPERATORS.map((o) => [
      o.name,
      o.plans
        .filter((pl) => pl.categories.includes("popular"))
        .slice(0, 3)
        .map((pl) => ({ price: pl.price, validity: pl.validity, data: pl.data, extras: `${pl.calls} · ${pl.sms}`, tag: pl.tag })),
    ])
  ),
};

// ── Cross-sell banner (grocery ⇄ recharge) ─────────────────────────────────
// Only switch on when the business has approved and funded the offer.
export const crossSell = {
  enabled: false,
  headline: "Recharge ₹299+ and get ₹30 off your next grocery order",
  subline: "Coupon is sent to your account right after a successful recharge.",
};

// ── Customer reviews ───────────────────────────────────────────────────────
// Real customers only (first name + area). Section stays hidden until there
// are at least `minToShow` reviews.
export const reviews = {
  minToShow: 6,
  items: [
    // { name: "Rina", area: "Nagaon", rating: 5, text: "…" },
  ],
};

// ── FAQ ─────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Where do you deliver?",
    a: "Delivery availability is confirmed at checkout once you enter your address. If we can't reach you yet, you'll know before you pay.",
  },
  {
    q: "How can I pay?",
    a: "Pay online with UPI, debit/credit cards or net banking through Razorpay's secure checkout — or choose Cash on Delivery for grocery orders.",
  },
  {
    q: "What if a recharge fails?",
    // CONFIRM against the recharge provider's refund terms before going live.
    a: "If a recharge doesn't go through, the amount is refunded to your original payment method.",
  },
  {
    q: "Can I return a product?",
    a: "Yes — eligible items can be returned as per our Return Policy.",
    link: { href: "/returnPolicy", label: "Read the Return Policy" },
  },
  {
    q: "Do I need an account to order?",
    a: "No — you can check out as a guest. Signing in lets you save addresses and see your order history.",
  },
];
