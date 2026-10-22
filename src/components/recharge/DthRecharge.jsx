"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LuChevronRight, LuShieldCheck, LuTv, LuZap } from "react-icons/lu";
import { DTH_AMOUNT_MAX, DTH_OPERATORS, RECHARGE_LIVE, getDthOperator, validateRecharge } from "@/config/recharge";
import Sheet from "./Sheet";
import { startRechargeCheckout } from "@/lib/recharge/client";

const QUICK_AMOUNTS = [200, 300, 500, 800];

/** DTH recharge: operator → customer ID → amount → review → pay. */
export default function DthRecharge({ initialOperator = null }) {
  const router = useRouter();
  const params = useSearchParams();
  const [operatorSlug, setOperatorSlug] = useState(initialOperator || "");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const idRef = useRef(null);

  const operator = getDthOperator(operatorSlug);

  // Prefill from /recharge/dth/tata-play?number=…&amount=…
  useEffect(() => {
    const n = (params.get("number") || "").replace(/\D/g, "");
    if (n) setCustomerId(n);
    const a = Number(params.get("amount"));
    if (a) setAmount(String(a));
  }, [params]);

  const error = operator ? validateRecharge({ type: "dth", operator: operator.slug, number: customerId, amount }) : "Choose your DTH operator.";
  const idError = operator && !operator.idRe.test(customerId) ? `Enter a valid ${operator.idLabel}.` : "";
  const amountError = operator && error && !idError ? error : "";

  const proceed = (e) => {
    e.preventDefault();
    setTouched(true);
    if (error) {
      if (idError) idRef.current?.focus();
      toast.error(error);
      return;
    }
    setReviewOpen(true);
  };

  const pay = async () => {
    if (!RECHARGE_LIVE) {
      setReviewOpen(false);
      toast.success("DTH recharge is launching soon — thanks for checking it out!");
      return;
    }
    if (paying) return;
    setPaying(true);
    try {
      const r = await startRechargeCheckout({
        type: "dth",
        operator: operator.slug,
        number: customerId,
        amount: Number(amount),
        planLabel: `${operator.name} DTH recharge`,
      });
      if (r.txnId) router.push(`/recharge/status/${r.txnId}`);
    } catch (err) {
      toast.error(err.message || "Payment failed. You have not been charged.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-charge-600 via-charge-700 to-charge-900 text-white">
      <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-6 sm:px-6 lg:pt-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-charge-100">
          <Link href="/" className="hover:text-white">Home</Link>
          <LuChevronRight aria-hidden />
          <Link href="/recharge" className="hover:text-white">Recharge</Link>
          <LuChevronRight aria-hidden />
          <span className="text-white">DTH</span>
        </nav>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charge-200">DTH recharge</p>
          {!RECHARGE_LIVE && <span className="rounded-full bg-offer-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Launching soon</span>}
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {operator ? `${operator.name} recharge, done in seconds.` : "Recharge your DTH in seconds."}
        </h1>
        <p className="mt-3 text-sm text-charge-100 sm:text-base">Pick your operator, enter your ID and amount, pay with UPI.</p>

        <form onSubmit={proceed} noValidate className="mt-6 rounded-2xl bg-white p-4 text-ink shadow-lift sm:p-6">
          <fieldset>
            <legend className="text-sm font-semibold">Operator</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DTH_OPERATORS.map((o) => (
                <button
                  key={o.slug}
                  type="button"
                  aria-pressed={operatorSlug === o.slug}
                  onClick={() => setOperatorSlug(o.slug)}
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 text-left text-sm font-semibold transition ${
                    operatorSlug === o.slug ? "border-charge-600 bg-charge-50 text-charge-800" : "border-black/10 hover:bg-cream"
                  }`}
                >
                  <LuTv aria-hidden className="shrink-0" /> <span className="truncate">{o.name}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block text-sm font-semibold" htmlFor="dth-id">
            {operator ? operator.idLabel : "Customer ID"}
          </label>
          <input
            id="dth-id"
            ref={idRef}
            inputMode="numeric"
            autoComplete="off"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value.replace(/\D/g, "").slice(0, 11))}
            aria-invalid={touched && !!idError}
            placeholder={operator ? operator.idLabel : "Select an operator first"}
            className="mt-1.5 h-12 w-full rounded-xl border border-black/10 px-4 text-base outline-none focus:border-charge-600 focus:ring-2 focus:ring-charge-200"
          />
          <p className={`mt-1 text-xs ${touched && idError ? "text-red-600" : "text-ink-muted"}`}>
            {touched && idError ? idError : operator?.idHint || "We'll show where to find it once you pick an operator."}
          </p>

          <label className="mt-5 block text-sm font-semibold" htmlFor="dth-amount">Amount (₹)</label>
          <input
            id="dth-amount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 5))}
            aria-invalid={touched && !!amountError}
            placeholder={operator ? `Min ₹${operator.min}` : "Amount"}
            className="mt-1.5 h-12 w-full rounded-xl border border-black/10 px-4 text-base outline-none focus:border-charge-600 focus:ring-2 focus:ring-charge-200"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button key={a} type="button" onClick={() => setAmount(String(a))} className="h-9 rounded-full border border-black/10 px-4 text-sm font-semibold hover:bg-cream">
                ₹{a}
              </button>
            ))}
          </div>
          {touched && amountError && <p className="mt-1 text-xs text-red-600">{amountError}</p>}
          <p className="mt-1 text-xs text-ink-muted">Maximum ₹{DTH_AMOUNT_MAX}. Pick an amount that covers your pack — check your operator app for the exact price.</p>

          <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-offer-500 text-base font-bold text-white shadow-lg shadow-offer-500/30 hover:bg-offer-600">
            Continue
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted"><LuShieldCheck aria-hidden /> Secure Razorpay checkout</p>
        </form>
      </div>

      <Sheet
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Review your recharge"
        footer={
          <>
            <button type="button" onClick={pay} disabled={paying} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-offer-500 text-base font-bold text-white hover:bg-offer-600 disabled:opacity-60">
              <LuZap aria-hidden /> {RECHARGE_LIVE ? (paying ? "Opening payment…" : `Pay ₹${amount}`) : `Pay ₹${amount} (launching soon)`}
            </button>
            <p className="mt-2 text-center text-xs text-ink-muted">Please check the ID — recharges can&apos;t be moved to another account.</p>
          </>
        }
      >
        {operator && (
          <dl className="space-y-2.5 text-sm text-ink">
            <div className="flex justify-between"><dt className="text-ink-muted">Operator</dt><dd className="font-semibold">{operator.name}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">{operator.idLabel}</dt><dd className="font-semibold">{customerId}</dd></div>
            <div className="flex justify-between border-t border-dashed border-black/10 pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display text-2xl font-bold">₹{amount}</dd>
            </div>
          </dl>
        )}
      </Sheet>
    </section>
  );
}
