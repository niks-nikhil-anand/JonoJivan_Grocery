"use client";
import { LuCalendar, LuWifi, LuPhone, LuCheck } from "react-icons/lu";

export default function PlanCard({ plan, selected, preview, onSelect, onDetails }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-5 transition-all duration-200 ${
        selected
          ? "border-charge-500 shadow-[0_16px_36px_-12px_rgb(79_70_229/0.35)] ring-2 ring-charge-500"
          : "border-black/5 shadow-card hover:-translate-y-0.5 hover:border-charge-200 hover:shadow-lift"
      }`}
    >
      <div className="flex min-h-[22px] items-start justify-between gap-2">
        {preview ? (
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            Preview
          </span>
        ) : (
          <span />
        )}
        {plan.tag && (
          <span className="rounded-full bg-charge-100 px-2.5 py-0.5 text-[11px] font-bold text-charge-700">{plan.tag}</span>
        )}
      </div>

      <p className="mt-2 font-display text-3xl font-bold text-ink">₹{plan.price}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <LuCalendar className="shrink-0 text-charge-600" aria-hidden />
          <dt className="sr-only">Validity</dt>
          <dd className="text-ink">{plan.validity}</dd>
        </div>
        <div className="flex items-center gap-2">
          <LuWifi className="shrink-0 text-charge-600" aria-hidden />
          <dt className="sr-only">Data</dt>
          <dd className="text-ink">{plan.data}</dd>
        </div>
        <div className="flex items-center gap-2">
          <LuPhone className="shrink-0 text-charge-600" aria-hidden />
          <dt className="sr-only">Calls and SMS</dt>
          <dd className="text-ink-muted">
            {plan.calls}
            {plan.sms !== "—" ? ` · ${plan.sms}` : ""}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <button
          type="button"
          onClick={() => onDetails(plan)}
          className="h-11 rounded-xl px-3 text-sm font-semibold text-charge-700 hover:bg-charge-50"
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => onSelect(plan)}
          aria-pressed={selected}
          className={`inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition ${
            selected
              ? "bg-charge-600 text-white shadow-md shadow-charge-600/30"
              : "border border-charge-600 text-charge-700 hover:bg-charge-600 hover:text-white"
          }`}
        >
          {selected ? (
            <>
              <LuCheck aria-hidden /> Selected
            </>
          ) : (
            "Select"
          )}
        </button>
      </div>
    </article>
  );
}
