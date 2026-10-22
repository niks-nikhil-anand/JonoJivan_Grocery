// Commission we earn from LinerPay per operator (from their operator list).
// "Discount" type: we pay LinerPay amount − commission; the customer pays face value.
import { OPERATOR_CODES } from "@/lib/linerpay";

export const COMMISSION = {
  jio: { rate: 1.3, type: "percent" },
  airtel: { rate: 1.5, type: "percent" },
  vi: { rate: 3.8, type: "percent" },
  bsnl: { rate: 3.5, type: "percent" },
  "tata-play": { rate: 3.8, type: "percent" },
  "airtel-digital-tv": { rate: 4.3, type: "percent" },
  "dish-tv": { rate: 4.0, type: "percent" },
  d2h: { rate: 4.1, type: "percent" },
  "sun-direct": { rate: 3.3, type: "percent" },
};

/** { commissionRate, commissionAmount } in rupees (2 dp), or null if unknown operator. */
export function commissionFor(slug, amount) {
  const c = COMMISSION[slug];
  if (!c) return null;
  const amountEarned = c.type === "flat" ? c.rate : (Number(amount) * c.rate) / 100;
  return { commissionRate: c.rate, commissionAmount: Math.round(amountEarned * 100) / 100 };
}

// Every operator we sell must have both an OpId and a commission entry.
export const missingOperatorConfig = () =>
  Object.keys(OPERATOR_CODES).filter((slug) => !COMMISSION[slug] || OPERATOR_CODES[slug] === "TODO");
