"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  LuSearch,
  LuMapPin,
  LuShieldCheck,
  LuZap,
  LuRotateCcw,
  LuChevronRight,
  LuClock,
  LuX,
  LuInfo,
} from "react-icons/lu";
import { CIRCLES, DEFAULT_CIRCLE, OPERATORS, PLAN_CATEGORIES, RECHARGE_LIVE, getOperator, getOperatorByName } from "@/config/recharge";
import OperatorBadge from "./OperatorBadge";
import PlanCard from "./PlanCard";
import Sheet from "./Sheet";
import { startRechargeCheckout } from "@/lib/recharge/client";

const MOBILE_RE = /^[6-9]\d{9}$/;
const RECENT_KEY = "jj:recentRecharges";
const mask = (n) => (n && n.length === 10 ? `${n.slice(0, 2)}••••••${n.slice(-2)}` : n);

function readRecents() {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function saveRecent(entry) {
  try {
    const next = [entry, ...readRecents().filter((r) => r.number !== entry.number)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

const SORTS = [
  { id: "relevance", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "validity", label: "Longest validity" },
];

/**
 * The whole recharge flow on one page:
 * number → operator + circle → browse plans → review → pay.
 * Phase 1: operator/circle are chosen by hand and plans come from config
 * (labelled "Preview"); payment is disabled until RECHARGE_LIVE is on.
 */
export default function RechargeExperience({ initialOperator = null }) {
  const params = useSearchParams();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [number, setNumber] = useState("");
  const [operatorSlug, setOperatorSlug] = useState(initialOperator);
  const [circle, setCircle] = useState(DEFAULT_CIRCLE);
  const [category, setCategory] = useState("popular");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevance");
  const [selected, setSelected] = useState(null);
  const [detailsPlan, setDetailsPlan] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const [recents, setRecents] = useState([]);
  const numberRef = useRef(null);
  const plansRef = useRef(null);

  const operator = getOperator(operatorSlug);
  const numberValid = MOBILE_RE.test(number);

  // Prefill from links like /recharge/jio?number=98...&amount=299
  useEffect(() => {
    setRecents(readRecents());
    const n = (params.get("number") || "").replace(/\D/g, "").slice(-10);
    if (n) setNumber(n);
    const opParam = params.get("operator");
    const op = getOperator(opParam) || getOperatorByName(opParam);
    const activeOp = op || getOperator(initialOperator);
    if (op) setOperatorSlug(op.slug);
    const amount = Number(params.get("amount"));
    if (activeOp && amount) {
      const match = activeOp.plans.find((p) => p.price === amount);
      if (match) {
        setSelected(match);
        setCategory(match.categories[0]);
      }
    }
  }, [params, initialOperator]);

  const plans = useMemo(() => {
    if (!operator) return [];
    const q = query.trim().toLowerCase();
    let list = operator.plans.filter((p) => (q ? true : p.categories.includes(category)));
    if (q) {
      list = list.filter((p) =>
        [String(p.price), p.validity, p.data, p.calls, ...(p.benefits || [])].join(" ").toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "validity") sorted.sort((a, b) => b.validityDays - a.validityDays);
    return sorted;
  }, [operator, category, query, sort]);

  const chooseOperator = useCallback(
    (slug) => {
      if (slug === operatorSlug) return;
      setOperatorSlug(slug);
      setSelected(null);
      setQuery("");
      setCategory("popular");
    },
    [operatorSlug]
  );

  const selectPlan = (plan) => {
    setSelected(plan);
    setDetailsPlan(null);
  };

  const proceed = () => {
    setTouched(true);
    if (!numberValid) {
      numberRef.current?.focus();
      numberRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Enter a valid 10-digit mobile number first.");
      return;
    }
    if (!operator) {
      toast.error("Choose your operator.");
      return;
    }
    if (!selected) {
      plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast.error("Pick a plan to continue.");
      return;
    }
    setReviewOpen(true);
  };

  const pay = async () => {
    setRecents(saveRecent({ number, operator: operator.slug, circle }));
    if (!RECHARGE_LIVE) {
      setReviewOpen(false);
      toast.success("Recharge is launching soon — we've saved this number for one-tap repeat.");
      return;
    }
    if (paying) return;
    setPaying(true);
    try {
      const result = await startRechargeCheckout({
        type: "mobile",
        operator: operator.slug,
        circle,
        number,
        amount: selected.price,
        planLabel: `₹${selected.price} · ${selected.validity} · ${selected.data}`,
      });
      if (result.txnId) router.push(`/recharge/status/${result.txnId}`);
    } catch (err) {
      toast.error(err.message || "Payment failed. You have not been charged.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      {/* ── Hero + number form ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-charge-600 via-charge-700 to-charge-900 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-charge-500/40 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:pb-16 lg:pt-10">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-charge-100">
              <Link href="/" className="hover:text-white">Home</Link>
              <LuChevronRight aria-hidden />
              {operator && initialOperator ? (
                <>
                  <Link href="/recharge" className="hover:text-white">Recharge</Link>
                  <LuChevronRight aria-hidden />
                  <span className="text-white">{operator.name}</span>
                </>
              ) : (
                <span className="text-white">Recharge</span>
              )}
            </nav>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charge-200">Mobile recharge</p>
              {!RECHARGE_LIVE && (
                <span className="rounded-full bg-offer-500 px-2.5 py-0.5 text-[11px] font-bold text-white">Launching soon</span>
              )}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {initialOperator && operator ? `${operator.name} recharge, done in seconds.` : "Recharge any number in seconds."}
            </h1>
            <p className="mt-3 max-w-lg text-sm text-charge-100 sm:text-base">
              {initialOperator && operator
                ? operator.tagline
                : "Jio, Airtel, Vi and BSNL prepaid. Pick a plan, pay with UPI, and you're done."}
            </p>

            {/* Refund / speed promises only appear once the live service guarantees them */}
            <ul className="mt-6 hidden flex-wrap gap-x-5 gap-y-2 text-sm text-charge-100 sm:flex">
              <li className="inline-flex items-center gap-1.5"><LuShieldCheck aria-hidden /> Secure Razorpay checkout</li>
              {RECHARGE_LIVE && (
                <>
                  <li className="inline-flex items-center gap-1.5"><LuRotateCcw aria-hidden /> Refund if a recharge fails</li>
                  <li className="inline-flex items-center gap-1.5"><LuZap aria-hidden /> Most recharges reflect in seconds</li>
                </>
              )}
            </ul>
          </div>

          {/* Form card */}
          <div className="rounded-3xl bg-white p-5 text-ink shadow-2xl shadow-charge-900/30 sm:p-6">
            <label htmlFor="recharge-number" className="text-sm font-semibold text-ink">
              Mobile number
            </label>
            <div
              className={`mt-2 flex h-14 items-center rounded-2xl border bg-cream px-4 transition focus-within:border-charge-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-charge-100 ${
                touched && !numberValid ? "border-red-400" : "border-black/10"
              }`}
            >
              <span className="mr-3 border-r border-black/10 pr-3 text-sm font-semibold text-ink-muted">+91</span>
              <input
                id="recharge-number"
                ref={numberRef}
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onBlur={() => number && setTouched(true)}
                aria-invalid={touched && !numberValid}
                aria-describedby="recharge-number-help"
                className="h-full w-full bg-transparent text-lg font-semibold tracking-wide text-ink outline-none placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-soft"
              />
              {number && (
                <button type="button" onClick={() => setNumber("")} className="text-ink-soft hover:text-ink" aria-label="Clear number">
                  <LuX aria-hidden />
                </button>
              )}
            </div>
            <p id="recharge-number-help" className={`mt-1.5 text-xs ${touched && !numberValid ? "text-red-600" : "text-ink-muted"}`}>
              {touched && !numberValid ? "Enter a valid 10-digit number starting with 6, 7, 8 or 9." : "Prepaid numbers only."}
            </p>

            {recents.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-ink-muted"><LuClock aria-hidden /> Recent:</span>
                {recents.map((r) => {
                  const op = getOperator(r.operator);
                  return (
                    <button
                      key={r.number}
                      type="button"
                      onClick={() => {
                        setNumber(r.number);
                        if (op) chooseOperator(op.slug);
                        if (r.circle) setCircle(r.circle);
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-ink hover:border-charge-300 hover:bg-charge-50"
                    >
                      {mask(r.number)}
                      {op && <span className="text-ink-muted">· {op.name}</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-ink">Operator</legend>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {OPERATORS.map((op) => {
                  const active = op.slug === operatorSlug;
                  return (
                    <button
                      key={op.slug}
                      type="button"
                      onClick={() => chooseOperator(op.slug)}
                      aria-pressed={active}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-xs font-semibold transition ${
                        active
                          ? "border-charge-500 bg-charge-50 text-charge-700 ring-2 ring-charge-500"
                          : "border-black/10 text-ink hover:border-charge-300 hover:bg-charge-50/50"
                      }`}
                    >
                      <OperatorBadge operator={op} size="sm" />
                      {op.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label htmlFor="recharge-circle" className="mt-5 block text-sm font-semibold text-ink">
              Circle (state)
            </label>
            <div className="relative mt-2">
              <LuMapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden />
              <select
                id="recharge-circle"
                value={circle}
                onChange={(e) => {
                  setCircle(e.target.value);
                  setSelected(null);
                }}
                className="h-12 w-full appearance-none rounded-2xl border border-black/10 bg-cream pl-11 pr-10 text-sm font-medium text-ink outline-none focus:border-charge-500 focus:bg-white focus:ring-4 focus:ring-charge-100"
              >
                {CIRCLES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <LuChevronRight className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-ink-muted" aria-hidden />
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">
              {RECHARGE_LIVE ? "Detected from your number — change it if it's wrong." : "Plans and prices can differ by circle."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Plans ──────────────────────────────────────────────────────── */}
      <section ref={plansRef} id="plans" className="scroll-mt-24 bg-cream py-10 lg:py-14">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="min-w-0">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  {operator ? `${operator.name} plans` : "Choose your operator"}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {operator ? `Showing plans for ${circle}.` : "Select Jio, Airtel, Vi or BSNL above to see plans."}
                </p>
              </div>
            </div>

            {!RECHARGE_LIVE && operator && (
              <p className="mt-4 flex items-start gap-2 rounded-2xl border border-offer-100 bg-offer-50 px-4 py-3 text-sm text-ink">
                <LuInfo className="mt-0.5 shrink-0 text-offer-600" aria-hidden />
                These are preview plans to show how the page works. Live prices from the operator will appear here when recharge launches.
              </p>
            )}

            {!operator ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {OPERATORS.map((op) => (
                  <button
                    key={op.slug}
                    type="button"
                    onClick={() => chooseOperator(op.slug)}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-charge-200 hover:shadow-lift"
                  >
                    <OperatorBadge operator={op} size="lg" />
                    <span className="font-display font-bold text-ink">{op.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {/* Category tabs */}
                <div role="tablist" aria-label="Plan type" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
                  {PLAN_CATEGORIES.map((c) => {
                    const active = !query && category === c.id;
                    return (
                      <button
                        key={c.id}
                        role="tab"
                        type="button"
                        aria-selected={active}
                        onClick={() => {
                          setCategory(c.id);
                          setQuery("");
                        }}
                        className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
                          active ? "bg-charge-600 text-white shadow-md shadow-charge-600/25" : "bg-white text-ink shadow-sm hover:bg-charge-50 hover:text-charge-700"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search + sort */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <div className="flex h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 focus-within:border-charge-500 sm:flex-1 focus-within:ring-4 focus-within:ring-charge-100">
                    <LuSearch className="text-ink-muted" aria-hidden />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder='Search plans, e.g. "2 GB" or "28 days"'
                      aria-label="Search plans"
                      className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
                    />
                  </div>
                  <label className="sr-only" htmlFor="plan-sort">Sort plans</label>
                  <select
                    id="plan-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-ink outline-none focus:border-charge-500 focus:ring-4 focus:ring-charge-100 sm:w-52"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                {plans.length ? (
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {plans.map((plan) => (
                      <li key={plan.id}>
                        <PlanCard
                          plan={plan}
                          preview={!RECHARGE_LIVE}
                          selected={selected?.id === plan.id}
                          onSelect={selectPlan}
                          onDetails={setDetailsPlan}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 rounded-2xl bg-white p-6 text-center text-sm text-ink-muted shadow-card">
                    No plans match “{query}”. Try another amount or validity.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Summary (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-black/5 bg-white p-6 shadow-lift">
              <h2 className="font-display text-lg font-bold text-ink">Recharge summary</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Number</dt>
                  <dd className="font-semibold text-ink">{numberValid ? `+91 ${number}` : "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Operator</dt>
                  <dd className="font-semibold text-ink">{operator ? operator.name : "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Circle</dt>
                  <dd className="text-right font-semibold text-ink">{circle}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">Plan</dt>
                  <dd className="text-right font-semibold text-ink">
                    {selected ? `${selected.validity} · ${selected.data}` : "—"}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 flex items-end justify-between border-t border-dashed border-black/10 pt-4">
                <span className="text-sm text-ink-muted">Amount</span>
                <span className="font-display text-3xl font-bold text-ink">{selected ? `₹${selected.price}` : "₹0"}</span>
              </div>
              <button
                type="button"
                onClick={proceed}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-offer-500 text-base font-bold text-white shadow-lg shadow-offer-500/30 transition hover:bg-offer-600"
              >
                <LuZap aria-hidden /> Continue
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                <LuShieldCheck aria-hidden /> Payments secured by Razorpay
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Sticky bottom bar (phones/tablets) — sits above the mobile tab bar */}
      {selected && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-black/5 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgb(0_0_0/0.08)] backdrop-blur sm:bottom-0 lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <div className="leading-tight">
              <p className="font-display text-xl font-bold text-ink">₹{selected.price}</p>
              <p className="text-xs text-ink-muted">
                {operator?.name} · {selected.validity}
              </p>
            </div>
            <button
              type="button"
              onClick={proceed}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-offer-500 px-6 text-sm font-bold text-white shadow-lg shadow-offer-500/30 hover:bg-offer-600"
            >
              <LuZap aria-hidden /> Continue
            </button>
          </div>
        </div>
      )}

      {/* Plan details */}
      <Sheet
        open={!!detailsPlan}
        onClose={() => setDetailsPlan(null)}
        title={detailsPlan ? `₹${detailsPlan.price} plan details` : ""}
        footer={
          detailsPlan && (
            <button
              type="button"
              onClick={() => selectPlan(detailsPlan)}
              className="h-12 w-full rounded-xl bg-charge-600 text-base font-bold text-white hover:bg-charge-700"
            >
              Select this plan
            </button>
          )
        }
      >
        {detailsPlan && (
          <dl className="space-y-3 text-sm">
            {[
              ["Operator", operator?.name],
              ["Circle", circle],
              ["Validity", detailsPlan.validity],
              ["Data", detailsPlan.data],
              ["Calls", detailsPlan.calls],
              ["SMS", detailsPlan.sms],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 rounded-xl bg-cream px-4 py-3">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="text-right font-semibold text-ink">{v}</dd>
              </div>
            ))}
            {detailsPlan.benefits?.length > 0 && (
              <div className="rounded-xl bg-cream px-4 py-3">
                <dt className="text-ink-muted">Other benefits</dt>
                <dd className="mt-1 font-semibold text-ink">{detailsPlan.benefits.join(" · ")}</dd>
              </div>
            )}
            {!RECHARGE_LIVE && (
              <p className="text-xs text-ink-muted">Preview plan — final benefits are confirmed by the operator before payment.</p>
            )}
          </dl>
        )}
      </Sheet>

      {/* Review */}
      <Sheet
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Review your recharge"
        footer={
          selected && (
            <>
              <button
                type="button"
                onClick={pay}
                disabled={paying}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-offer-500 text-base font-bold text-white shadow-lg shadow-offer-500/30 hover:bg-offer-600"
              >
                <LuZap aria-hidden /> {RECHARGE_LIVE ? (paying ? "Opening payment…" : `Pay ₹${selected.price}`) : `Pay ₹${selected.price} (launching soon)`}
              </button>
              <p className="mt-2 text-center text-xs text-ink-muted">
                Please check the number — recharges can&apos;t be moved to another number.
              </p>
            </>
          )
        }
      >
        {selected && operator && (
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-charge-50 p-4">
              <OperatorBadge operator={operator} />
              <div>
                <p className="font-display text-lg font-bold text-ink">+91 {number}</p>
                <p className="text-sm text-ink-muted">
                  {operator.name} prepaid · {circle}
                </p>
              </div>
            </div>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-ink-muted">Validity</dt><dd className="font-semibold text-ink">{selected.validity}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Data</dt><dd className="font-semibold text-ink">{selected.data}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Calls · SMS</dt><dd className="text-right font-semibold text-ink">{selected.calls} · {selected.sms}</dd></div>
              <div className="flex justify-between border-t border-dashed border-black/10 pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-display text-2xl font-bold text-ink">₹{selected.price}</dd>
              </div>
            </dl>
          </div>
        )}
      </Sheet>
    </>
  );
}
