import Link from "next/link";
import { LuArrowRight, LuFileCheck2, LuReceipt, LuShieldCheck } from "react-icons/lu";
import { Container } from "./ui/Section";

/** Trust banner for the forthcoming BBPS-powered bill-payment rollout. */
export default function BbpsBanner() {
  return (
    <section aria-labelledby="bbps-banner-title" className="py-8 sm:py-10">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-charge-100 bg-gradient-to-br from-charge-50 via-white to-brand-50 p-5 shadow-card sm:p-8 lg:p-10">
          <div aria-hidden className="absolute -right-12 -top-16 h-52 w-52 rounded-full bg-charge-100/70 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-brand-100/70 blur-3xl" />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-charge-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-charge-700">Coming soon</span><span className="text-xs font-semibold text-ink-muted">A planned BBPS bill-payment experience</span></div>
              <h2 id="bbps-banner-title" className="mt-3 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">Bharat Bill Payment System (BBPS)</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">JonoJivan is preparing a more reliable way to fetch, review, pay, and track everyday bills—with clear payment status and digital receipts.</p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink"><li className="inline-flex items-center gap-1.5"><LuFileCheck2 className="text-charge-600" aria-hidden /> Review before you pay</li><li className="inline-flex items-center gap-1.5"><LuReceipt className="text-charge-600" aria-hidden /> Clear digital receipts</li><li className="inline-flex items-center gap-1.5"><LuShieldCheck className="text-charge-600" aria-hidden /> Track payment status</li></ul>
            </div>
            <Link href="/recharge/bills" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-charge-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-charge-600/25 transition hover:bg-charge-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charge-600">Explore bill payments <LuArrowRight aria-hidden /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
