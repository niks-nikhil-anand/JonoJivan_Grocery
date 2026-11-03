import Link from "next/link";
import {
  LuArrowRight, LuCalendarDays, LuCar, LuDroplets, LuFlame,
  LuPhone, LuShieldCheck, LuTv, LuWifi, LuZap,
} from "react-icons/lu";
import { BILL_SERVICES } from "@/config/billPayments";

const icons = { bolt: LuZap, car: LuCar, phone: LuPhone, flame: LuFlame, calendar: LuCalendarDays, shield: LuShieldCheck, wifi: LuWifi, droplets: LuDroplets, tv: LuTv };

export default function BillPaymentsHub({ compact = false }) {
  const list = compact ? BILL_SERVICES.slice(0, 4) : BILL_SERVICES;
  return (
    <section aria-labelledby="bill-payments-title" className={compact ? "py-12" : "min-h-screen bg-cream pb-14"}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {!compact && (
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-charge-600 via-charge-700 to-charge-900 px-6 py-10 text-white shadow-lift sm:px-10 sm:py-14">
            <div aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute bottom-0 left-1/3 h-32 w-80 rounded-full bg-offer-500/20 blur-3xl" />
            <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-charge-200">Everyday payments</p>
            <h1 id="bill-payments-title" className="relative mt-3 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-5xl">Recharge &amp; Bill Payments</h1>
            <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-charge-100 sm:text-base">Pay the bills that keep your home and life running—clearly, securely, and in a few taps.</p>
            <div className="relative mt-7 flex flex-wrap gap-3 text-sm text-charge-100"><span className="inline-flex items-center gap-1.5"><LuShieldCheck aria-hidden /> Secure checkout</span><span className="inline-flex items-center gap-1.5"><LuZap aria-hidden /> Quick status updates</span></div>
          </div>
        )}
        <div className={compact ? "" : "mt-10"}>
          <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-charge-600">Choose a service</p><h2 id={compact ? "bill-payments-title" : undefined} className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">{compact ? "Pay a bill, your way." : "What would you like to pay?"}</h2></div>{compact && <Link href="/recharge/bills" className="hidden items-center gap-1 text-sm font-bold text-charge-600 hover:text-charge-700 sm:inline-flex">See all <LuArrowRight aria-hidden /></Link>}</div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((service) => { const Icon = icons[service.icon]; return <li key={service.slug}><Link href={`/recharge/bills/${service.slug}`} className="group flex h-full min-h-40 flex-col rounded-2xl border border-black/5 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-charge-200 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charge-600 sm:p-5"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-charge-50 text-xl text-charge-600 transition group-hover:bg-charge-600 group-hover:text-white"><Icon aria-hidden /></span><h3 className="mt-4 font-display text-sm font-bold text-ink sm:text-base">{service.name}</h3><p className="mt-1 text-xs leading-relaxed text-ink-muted">{service.action}</p><span className="mt-auto pt-3 text-xs font-bold text-charge-600">Continue <LuArrowRight className="inline" aria-hidden /></span></Link></li>; })}
          </ul>
          {compact && <Link href="/recharge/bills" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-charge-600 sm:hidden">See all bill payments <LuArrowRight aria-hidden /></Link>}
        </div>
      </div>
    </section>
  );
}
