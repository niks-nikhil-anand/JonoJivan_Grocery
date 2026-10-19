import { LuSmartphone, LuListChecks, LuWallet, LuCheckCircle2 } from "react-icons/lu";

const steps = [
  { icon: LuSmartphone, title: "Enter number", text: "Type the 10-digit prepaid number you want to recharge." },
  { icon: LuListChecks, title: "Pick a plan", text: "Browse plans for your operator and circle, or search by data or validity." },
  { icon: LuWallet, title: "Pay securely", text: "UPI, cards or net banking through Razorpay's checkout." },
  { icon: LuCheckCircle2, title: "Done", text: "Your plan is applied once the operator confirms it — the status screen shows the result." },
];

/** Four-step explainer for the recharge pages. */
export default function RechargeSteps() {
  return (
    <section aria-labelledby="recharge-steps-title" className="bg-white py-12 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-charge-600">How it works</p>
        <h2 id="recharge-steps-title" className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Four steps, under a minute.
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-black/5 bg-cream p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="absolute right-5 top-5 font-display text-3xl font-bold text-charge-100" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-charge-600 text-xl text-white shadow-lg shadow-charge-600/25">
                <Icon aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
