// ─────────────────────────────────────────────────────────────────────────────
// Recharge configuration: operators, circles, plan categories, SEO text, FAQs.
//
// PHASE 1 (preview): plans below are PLACEHOLDER data for layout only and are
// labelled "Preview" on screen. In Phase 2 they are replaced by live plans from
// the recharge provider (per operator + circle) via /api/recharge/plans.
// ─────────────────────────────────────────────────────────────────────────────

export const RECHARGE_LIVE = process.env.NEXT_PUBLIC_RECHARGE_LIVE === "true";

export const DEFAULT_CIRCLE = "Assam";

// The 22 telecom circles. Plans and prices differ by circle.
export const CIRCLES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar & Jharkhand",
  "Chennai",
  "Delhi NCR",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Karnataka",
  "Kerala",
  "Kolkata",
  "Madhya Pradesh & Chhattisgarh",
  "Maharashtra & Goa",
  "Mumbai",
  "North East",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "UP East",
  "UP West & Uttarakhand",
  "West Bengal",
];

export const PLAN_CATEGORIES = [
  { id: "popular", label: "Popular" },
  { id: "unlimited", label: "Unlimited" },
  { id: "data", label: "Data packs" },
  { id: "talktime", label: "Talktime" },
  { id: "annual", label: "Long validity" },
];

const p = (id, price, validityDays, data, categories, extra = {}) => ({
  id,
  price,
  validityDays,
  validity: validityDays ? `${validityDays} days` : "Existing pack",
  data,
  calls: extra.calls ?? "Unlimited calls",
  sms: extra.sms ?? "100 SMS/day",
  benefits: extra.benefits ?? [],
  tag: extra.tag ?? null,
  categories,
});

// Operator display data. Colours are JonoJivan accents, not operator brand assets.
// Logos: only add official logos from your recharge provider's brand kit.
export const OPERATORS = [
  {
    slug: "jio",
    name: "Jio",
    short: "J",
    accent: { bg: "bg-[#E8EEFF]", text: "text-[#1E40AF]", ring: "ring-[#BFD0FF]", solid: "bg-[#1E40AF]" },
    tagline: "Unlimited 4G/5G data plans, recharged in seconds.",
    seo: {
      title: "Jio Recharge Online — Prepaid Plans | JonoJivan",
      description:
        "Recharge your Jio prepaid number online. Browse unlimited, data and long-validity plans and pay securely with UPI or cards on JonoJivan.",
    },
    plans: [
      p("jio-299", 299, 28, "1.5 GB/day", ["popular", "unlimited"], { tag: "Most picked" }),
      p("jio-349", 349, 28, "2 GB/day", ["popular", "unlimited"]),
      p("jio-399", 399, 28, "2.5 GB/day", ["unlimited"]),
      p("jio-899", 899, 90, "2 GB/day", ["popular", "unlimited", "annual"], { tag: "Best value" }),
      p("jio-3599", 3599, 365, "2.5 GB/day", ["annual"]),
      p("jio-19", 19, 0, "1 GB", ["data"], { calls: "—", sms: "—", benefits: ["Valid till existing pack"] }),
      p("jio-69", 69, 0, "6 GB", ["data"], { calls: "—", sms: "—", benefits: ["Valid till existing pack"] }),
      p("jio-10", 10, 0, "—", ["talktime"], { calls: "₹7.47 talktime", sms: "—" }),
    ],
    faqs: [
      { q: "How do I recharge my Jio number?", a: "Enter your Jio number, pick a plan and pay with UPI, cards or net banking. The plan is applied to your number once the operator confirms it." },
      { q: "Do Jio plans differ by state?", a: "Yes. Plans and prices can differ by telecom circle. We show plans for the circle of your number before you pay." },
    ],
  },
  {
    slug: "airtel",
    name: "Airtel",
    short: "A",
    accent: { bg: "bg-[#FDECEC]", text: "text-[#B91C1C]", ring: "ring-[#F8C4C4]", solid: "bg-[#B91C1C]" },
    tagline: "Prepaid packs with data, calls and extras.",
    seo: {
      title: "Airtel Recharge Online — Prepaid Plans | JonoJivan",
      description:
        "Recharge your Airtel prepaid number online. Compare unlimited, data and long-validity packs and pay securely on JonoJivan.",
    },
    plans: [
      p("airtel-299", 299, 28, "1 GB/day", ["popular", "unlimited"], { tag: "Most picked" }),
      p("airtel-349", 349, 28, "1.5 GB/day", ["popular", "unlimited"]),
      p("airtel-409", 409, 28, "2.5 GB/day", ["unlimited"]),
      p("airtel-979", 979, 84, "2 GB/day", ["popular", "unlimited", "annual"], { tag: "Best value" }),
      p("airtel-3599", 3599, 365, "2 GB/day", ["annual"]),
      p("airtel-22", 22, 1, "1 GB", ["data"], { calls: "—", sms: "—" }),
      p("airtel-77", 77, 0, "5 GB", ["data"], { calls: "—", sms: "—", benefits: ["Valid till existing pack"] }),
      p("airtel-20", 20, 0, "—", ["talktime"], { calls: "₹14.95 talktime", sms: "—" }),
    ],
    faqs: [
      { q: "How do I recharge my Airtel number?", a: "Enter your Airtel number, choose a pack and pay securely. You'll see the result on the status screen right after payment." },
      { q: "Can I recharge someone else's Airtel number?", a: "Yes — enter any Airtel prepaid number. Double-check the number before paying; recharges can't be moved to another number." },
    ],
  },
  {
    slug: "vi",
    name: "Vi",
    short: "Vi",
    accent: { bg: "bg-[#FDECF4]", text: "text-[#9D174D]", ring: "ring-[#F5C2DA]", solid: "bg-[#9D174D]" },
    tagline: "Vi prepaid plans with data, calls and night data benefits.",
    seo: {
      title: "Vi Recharge Online — Prepaid Plans | JonoJivan",
      description:
        "Recharge your Vi (Vodafone Idea) prepaid number online. Browse popular, data and long-validity plans and pay securely on JonoJivan.",
    },
    plans: [
      p("vi-299", 299, 28, "1 GB/day", ["popular", "unlimited"], { tag: "Most picked" }),
      p("vi-349", 349, 28, "1.5 GB/day", ["popular", "unlimited"]),
      p("vi-409", 409, 28, "2.5 GB/day", ["unlimited"]),
      p("vi-979", 979, 84, "2 GB/day", ["popular", "unlimited", "annual"], { tag: "Best value" }),
      p("vi-3599", 3599, 365, "2 GB/day", ["annual"]),
      p("vi-24", 24, 1, "1 GB", ["data"], { calls: "—", sms: "—" }),
      p("vi-75", 75, 0, "6 GB", ["data"], { calls: "—", sms: "—", benefits: ["Valid till existing pack"] }),
      p("vi-20", 20, 0, "—", ["talktime"], { calls: "₹14.95 talktime", sms: "—" }),
    ],
    faqs: [
      { q: "Is Vi the same as Vodafone Idea?", a: "Yes. Vi is the brand name of Vodafone Idea. Any Vi prepaid number can be recharged here." },
      { q: "How long does a Vi recharge take?", a: "Most recharges reflect within a few seconds. If it takes longer, the status page keeps checking for you." },
    ],
  },
  {
    slug: "bsnl",
    name: "BSNL",
    short: "B",
    accent: { bg: "bg-[#FFF4E5]", text: "text-[#B45309]", ring: "ring-[#FCD9A8]", solid: "bg-[#B45309]" },
    tagline: "Affordable BSNL prepaid plans with long validity.",
    seo: {
      title: "BSNL Recharge Online — Prepaid Plans | JonoJivan",
      description:
        "Recharge your BSNL prepaid number online. Find affordable, long-validity and data plans and pay securely on JonoJivan.",
    },
    plans: [
      p("bsnl-199", 199, 30, "2 GB/day", ["popular", "unlimited"], { tag: "Most picked" }),
      p("bsnl-229", 229, 30, "2 GB/day", ["unlimited"]),
      p("bsnl-485", 485, 80, "1.5 GB/day", ["popular", "unlimited"]),
      p("bsnl-997", 997, 160, "2 GB/day", ["popular", "unlimited", "annual"], { tag: "Best value" }),
      p("bsnl-1999", 1999, 365, "600 GB total", ["annual"]),
      p("bsnl-98", 98, 18, "2 GB/day", ["data"], { calls: "—", sms: "—" }),
      p("bsnl-151", 151, 30, "40 GB", ["data"], { calls: "—", sms: "—" }),
      p("bsnl-50", 50, 0, "—", ["talktime"], { calls: "₹39.37 talktime", sms: "—" }),
    ],
    faqs: [
      { q: "Do BSNL plans depend on my state?", a: "Yes. BSNL plans differ by circle. We show plans for your number's circle before you pay." },
      { q: "Can I recharge a BSNL postpaid number?", a: "Not yet — this page is for BSNL prepaid recharges. Postpaid bill payment is planned for later." },
    ],
  },
];

export const getOperator = (slug) => OPERATORS.find((o) => o.slug === String(slug || "").toLowerCase());
export const getOperatorByName = (name) => OPERATORS.find((o) => o.name.toLowerCase() === String(name || "").toLowerCase());

export const GENERAL_FAQS = [
  { q: "What if my recharge fails?", a: "If the operator can't apply the recharge, the full amount is refunded to your original payment method. You'll see the refund on the status screen." },
  { q: "I entered the wrong number. What now?", a: "Recharges go straight to the operator and can't be moved to another number. Please check the number on the review screen before you pay." },
  { q: "How long does a recharge take?", a: "Most recharges reflect within seconds. If the operator is slow, your recharge shows as “Processing” and updates automatically." },
  { q: "Which payment methods can I use?", a: "UPI, debit and credit cards, and net banking through Razorpay's secure checkout." },
  { q: "Is JonoJivan part of Jio, Airtel, Vi or BSNL?", a: "No. JonoJivan is an independent recharge service. Operator names are used only to identify the network you're recharging." },
];

export const DISCLAIMER =
  "JonoJivan is an independent service and is not affiliated with Jio, Airtel, Vi (Vodafone Idea) or BSNL. Operator names are used only to identify networks. Plans and prices are set by the operators and may change.";
