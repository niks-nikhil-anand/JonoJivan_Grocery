"use client";
import { useState } from "react";
import { LuWifi, LuCalendar, LuPhone } from "react-icons/lu";
import Section from "./ui/Section";
import { recharge } from "@/config/home";
import { useRouter } from "next/navigation";
import { getOperatorByName } from "@/config/recharge";

/** ⑥ Choice for the second service — plans people actually pick. */
export default function RechargePlans() {
  const operators = Object.keys(recharge.popularPlans);
  const [active, setActive] = useState(operators[0]);
  const plans = recharge.popularPlans[active] || [];

  const router = useRouter();
  const activeSlug = getOperatorByName(active)?.slug;

  // Open the operator's recharge page with this plan pre-selected.
  const pick = (plan) => router.push(`/recharge/${activeSlug}?amount=${plan.price}`);

  return (
    <Section
      id="plans"
      tone="charge"
      eyebrow="Popular recharge plans"
      title="Plans people pick most."
      subtitle={
        recharge.live
          ? "Live prices from your operator. Tap a plan to recharge."
          : "Preview of plans — live prices will load once recharge launches."
      }
      className="bg-charge-50/50"
      action={{ href: activeSlug ? `/recharge/${activeSlug}` : "/recharge", label: `All ${active} plans` }}
    >
      <div role="tablist" aria-label="Operator" className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
        {operators.map((op) => (
          <button
            key={op}
            role="tab"
            type="button"
            aria-selected={active === op}
            onClick={() => setActive(op)}
            className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
              active === op ? "bg-charge-600 text-white shadow" : "bg-white text-ink hover:bg-charge-100"
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {plans.map((plan) => (
          <li
            key={`${active}-${plan.price}`}
            className="relative flex flex-col rounded-2xl border border-charge-100 bg-white p-5 shadow-card"
          >
            {plan.tag && (
              <span className="absolute right-4 top-4 rounded-full bg-charge-100 px-2.5 py-0.5 text-[11px] font-bold text-charge-700">
                {plan.tag}
              </span>
            )}
            {!recharge.live && (
              <span className="mb-2 w-fit rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                Preview
              </span>
            )}
            <p className="font-display text-3xl font-bold text-ink">₹{plan.price}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <LuCalendar className="text-charge-600" aria-hidden />
                <dt className="sr-only">Validity</dt>
                <dd>{plan.validity}</dd>
              </div>
              <div className="flex items-center gap-2">
                <LuWifi className="text-charge-600" aria-hidden />
                <dt className="sr-only">Data</dt>
                <dd>{plan.data}</dd>
              </div>
              <div className="flex items-center gap-2">
                <LuPhone className="text-charge-600" aria-hidden />
                <dt className="sr-only">Calls and SMS</dt>
                <dd className="text-ink-muted">{plan.extras}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => pick(plan)}
              className="mt-5 h-11 rounded-xl border border-charge-600 text-sm font-bold text-charge-700 transition hover:bg-charge-600 hover:text-white"
            >
              Choose plan
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}
