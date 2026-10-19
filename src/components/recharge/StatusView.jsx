import Link from "next/link";
import { LuCheckCircle2, LuLoader2, LuXCircle, LuArrowLeft, LuShoppingBasket } from "react-icons/lu";

const STATES = {
  success: {
    icon: LuCheckCircle2,
    tone: "bg-brand-100 text-brand-700",
    title: "Recharge successful",
    text: "Your plan has been applied to the number. You'll also get a confirmation SMS from your operator.",
  },
  processing: {
    icon: LuLoader2,
    tone: "bg-offer-100 text-offer-600",
    title: "Recharge processing",
    text: "The operator is confirming your recharge. This page updates automatically — you don't need to pay again.",
    spin: true,
  },
  failed: {
    icon: LuXCircle,
    tone: "bg-red-100 text-red-600",
    title: "Recharge failed",
    text: "The operator couldn't apply this recharge. A refund to your original payment method has been started.",
  },
};

/**
 * Result screen for a recharge.
 * Phase 2 will load the transaction from /api/recharge/status/[id] and poll
 * while it is "processing".
 */
export default function StatusView({ state = "processing", txnId, details }) {
  const s = STATES[state] || STATES.processing;
  const Icon = s.icon;
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-black/5 bg-white p-6 text-center shadow-lift sm:p-8">
      <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${s.tone}`}>
        <Icon className={s.spin ? "animate-spin" : ""} aria-hidden />
      </span>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">{s.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">{s.text}</p>

      {details && (
        <dl className="mt-6 space-y-2.5 rounded-2xl bg-cream p-4 text-left text-sm">
          {details.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-ink-muted">{k}</dt>
              <dd className="font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {txnId && <p className="mt-4 text-xs text-ink-soft">Reference: {txnId}</p>}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/recharge"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-charge-600 text-sm font-bold text-white hover:bg-charge-700"
        >
          <LuArrowLeft aria-hidden /> Recharge again
        </Link>
        <Link
          href="/product/shopAllProducts"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-bold text-ink hover:bg-cream"
        >
          <LuShoppingBasket aria-hidden /> Shop groceries
        </Link>
      </div>
    </div>
  );
}
