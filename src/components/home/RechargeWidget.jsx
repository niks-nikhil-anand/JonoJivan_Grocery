"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LuSmartphone, LuTv, LuZap, LuCheckCircle2, LuShieldCheck, LuClock } from "react-icons/lu";
import { Container } from "./ui/Section";
import { recharge } from "@/config/home";
import { getOperatorByName } from "@/config/recharge";

export const RECHARGE_PICK_EVENT = "jj:recharge-pick";

const MOBILE_RE = /^[6-9]\d{9}$/;

/** ③ Proof of ease — recharge right on the homepage. */
export default function RechargeWidget() {
  const [service, setService] = useState("mobile");
  const [number, setNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const formRef = useRef(null);
  const router = useRouter();

  // Deep links: #recharge-dth opens the DTH tab; plan cards pre-fill the form.
  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#recharge-dth") setService("dth");
    };
    const onPick = (e) => {
      const { operator: op, price } = e.detail || {};
      setService("mobile");
      if (op) setOperator(op);
      if (price) setAmount(String(price));
      formRef.current?.querySelector("input")?.focus({ preventScroll: true });
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener(RECHARGE_PICK_EVENT, onPick);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener(RECHARGE_PICK_EVENT, onPick);
    };
  }, []);

  const isMobile = service === "mobile";
  const operators = isMobile ? recharge.mobileOperators : recharge.dthOperators;
  const numberValid = isMobile ? MOBILE_RE.test(number) : number.trim().length >= 6;
  const amountValid = Number(amount) >= 10;
  const canSubmit = numberValid && operator && amountValid;

  const switchService = (next) => {
    setService(next);
    setNumber("");
    setOperator("");
    setTouched(false);
  };

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    if (isMobile) {
      // Continue on the full recharge page with everything pre-filled.
      const op = getOperatorByName(operator);
      const qs = new URLSearchParams({ number, amount: String(amount) });
      router.push(`${op ? `/recharge/${op.slug}` : "/recharge"}?${qs.toString()}`);
      return;
    }
    toast.success("DTH recharge is launching soon — thanks for checking it out!");
  };

  return (
    <section id="recharge" className="scroll-mt-24 py-12 lg:py-20">
      <span id="recharge-dth" className="block scroll-mt-24" aria-hidden />
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-charge-600 via-charge-700 to-charge-900 p-5 text-white shadow-lift sm:p-8 lg:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            {/* Copy + form */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charge-200">Mobile & DTH recharge</p>
                {!recharge.live && (
                  <span className="rounded-full bg-offer-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Launching soon</span>
                )}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Never run out of balance mid-call.
              </h2>
              <p className="mt-2 text-sm text-charge-100 sm:text-base">
                Enter your number, pick a plan, pay with UPI. Done in about 10 seconds.
              </p>

              {/* service tabs */}
              <div role="tablist" aria-label="Recharge type" className="mt-6 inline-flex rounded-xl bg-white/10 p-1">
                {[
                  { id: "mobile", label: "Mobile", icon: LuSmartphone },
                  { id: "dth", label: "DTH", icon: LuTv },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    role="tab"
                    type="button"
                    aria-selected={service === id}
                    onClick={() => switchService(id)}
                    className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                      service === id ? "bg-white text-charge-700 shadow" : "text-white/80 hover:text-white"
                    }`}
                  >
                    <Icon aria-hidden /> {label}
                  </button>
                ))}
              </div>

              <form ref={formRef} onSubmit={submit} noValidate className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="sr-only">{isMobile ? "Mobile number" : "Subscriber ID"}</span>
                  <div className="flex h-12 items-center rounded-xl bg-white px-3 text-ink focus-within:ring-4 focus-within:ring-white/30">
                    {isMobile && <span className="mr-2 border-r border-gray-200 pr-2 text-sm font-semibold text-ink-muted">+91</span>}
                    <input
                      inputMode={isMobile ? "numeric" : "text"}
                      autoComplete={isMobile ? "tel-national" : "off"}
                      maxLength={isMobile ? 10 : 20}
                      placeholder={isMobile ? "10-digit mobile number" : "Subscriber / Customer ID"}
                      value={number}
                      onChange={(e) => setNumber(isMobile ? e.target.value.replace(/\D/g, "") : e.target.value)}
                      className="h-full w-full bg-transparent text-base outline-none placeholder:text-ink-soft"
                      aria-invalid={touched && !numberValid}
                    />
                  </div>
                  {touched && !numberValid && (
                    <span className="mt-1 block text-xs text-offer-100">
                      {isMobile ? "Enter a valid 10-digit mobile number." : "Enter your subscriber ID."}
                    </span>
                  )}
                </label>

                <label>
                  <span className="sr-only">Operator</span>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="h-12 w-full rounded-xl bg-white px-3 text-base text-ink outline-none focus:ring-4 focus:ring-white/30"
                    aria-invalid={touched && !operator}
                  >
                    <option value="">{isMobile ? "Select operator" : "Select DTH provider"}</option>
                    {operators.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="sr-only">Amount</span>
                  <div className="flex h-12 items-center rounded-xl bg-white px-3 text-ink focus-within:ring-4 focus-within:ring-white/30">
                    <span className="mr-1 font-semibold text-ink-muted">₹</span>
                    <input
                      inputMode="numeric"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="h-full w-full bg-transparent text-base outline-none placeholder:text-ink-soft"
                      aria-invalid={touched && !amountValid}
                    />
                  </div>
                </label>

                {isMobile && (
                  <div className="flex flex-wrap gap-2 sm:col-span-2" aria-label="Quick amounts">
                    {recharge.quickAmounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAmount(String(a))}
                        className={`h-9 rounded-full border px-3.5 text-sm font-semibold transition ${
                          String(a) === amount
                            ? "border-white bg-white text-charge-700"
                            : "border-white/30 text-white hover:border-white"
                        }`}
                      >
                        ₹{a}
                      </button>
                    ))}
                    <a href="/recharge" className="inline-flex h-9 items-center px-2 text-sm font-semibold text-charge-100 underline-offset-4 hover:underline">
                      Browse all plans
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-offer-500 px-6 text-base font-bold text-white shadow-lg shadow-black/20 transition hover:bg-offer-600 disabled:opacity-60 sm:col-span-2 sm:h-14"
                >
                  <LuZap aria-hidden />
                  {amountValid ? `Proceed to pay ₹${amount}` : "Proceed to pay"}
                </button>
              </form>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-charge-100">
                <li className="inline-flex items-center gap-1.5"><LuShieldCheck aria-hidden /> Secure UPI & card payments</li>
                <li className="inline-flex items-center gap-1.5"><LuClock aria-hidden /> Available 24×7</li>
              </ul>
            </div>

            {/* Phone illustration */}
            <div className="hidden justify-center lg:flex" aria-hidden>
              <div className="relative w-64 rounded-[2.5rem] border-[10px] border-charge-900/60 bg-white p-4 text-ink shadow-2xl">
                <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-gray-200" />
                <div className="flex flex-col items-center rounded-2xl bg-brand-50 px-4 py-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-3xl text-white">
                    <LuCheckCircle2 />
                  </span>
                  <p className="mt-3 font-display text-lg font-bold">Recharge successful</p>
                  <p className="mt-1 text-xs text-ink-muted">+91 98•••• ••10</p>
                </div>
                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-ink-muted">Plan</span><span className="font-semibold">₹299 · 28 days</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Data</span><span className="font-semibold">1.5 GB/day</span></div>
                  <div className="flex justify-between"><span className="text-ink-muted">Paid via</span><span className="font-semibold">UPI</span></div>
                </div>
                <div className="mt-5 h-10 rounded-xl bg-charge-600" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
