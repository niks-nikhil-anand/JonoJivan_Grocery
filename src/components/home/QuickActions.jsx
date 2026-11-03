import Link from "next/link";
import { LuArrowRight, LuCalendarDays, LuCar, LuDroplets, LuFlame, LuPhone, LuShieldCheck, LuSmartphone, LuTv, LuWifi, LuZap } from "react-icons/lu";
import { Container } from "./ui/Section";
import { HOME_SERVICES } from "@/config/homeServices";

const icons = { mobile: LuSmartphone, tv: LuTv, car: LuCar, phone: LuPhone, bolt: LuZap, flame: LuFlame, wifi: LuWifi, droplets: LuDroplets, cable: LuTv, calendar: LuCalendarDays, shield: LuShieldCheck };

/** ② Service shortcuts — grocery stays in the hero; bills and recharges scan separately. */
export default function QuickActions() {
  const recharge = HOME_SERVICES.filter((service) => service.group === "recharge");
  const bills = HOME_SERVICES.filter((service) => service.group === "bills");
  return (
    <section aria-label="Recharge and bill payment services" className="relative z-[2] -mt-2 pb-2 lg:-mt-8">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-card sm:p-6">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-charge-600">Recharge</p><h2 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">Your everyday top-ups</h2></div><Link href="/recharge" className="hidden items-center gap-1 text-sm font-bold text-charge-700 hover:text-charge-900 sm:inline-flex">All recharge <LuArrowRight aria-hidden /></Link></div>
          <ul className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
            {recharge.map((service) => <ServiceTile key={service.id} service={service} tone="recharge" />)}
          </ul>
          <div className="mt-8 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">Bills & utilities</p><h2 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">Pay the bills that matter</h2></div><Link href="/recharge/bills" className="hidden items-center gap-1 text-sm font-bold text-brand-700 hover:text-brand-800 sm:inline-flex">View all <LuArrowRight aria-hidden /></Link></div>
          <ul className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-8">
            {bills.map((service) => <ServiceTile key={service.id} service={service} tone="bill" />)}
            <li><Link href="/recharge/bills" className="group flex h-full min-h-[108px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-2 text-center transition hover:border-brand-600 hover:bg-brand-100"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm"><LuArrowRight aria-hidden /></span><span className="text-xs font-bold text-brand-800">View all</span></Link></li>
          </ul>
        </div>
      </Container>
    </section>
  );
}

function ServiceTile({ service, tone }) {
  const Icon = icons[service.icon];
  const visual = tone === "recharge" ? "bg-charge-100 text-charge-700 group-hover:bg-charge-600" : "bg-brand-100 text-brand-700 group-hover:bg-brand-600";
  return <li><Link href={service.route} className="group relative flex h-full min-h-[108px] flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center transition hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charge-600 sm:min-h-[124px] sm:p-3"><span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg transition-colors group-hover:text-white sm:h-12 sm:w-12 sm:text-xl ${visual}`}><Icon aria-hidden /></span>{service.badge && <span className="absolute right-1 top-1 rounded-full bg-offer-100 px-1.5 py-0.5 text-[9px] font-bold text-offer-600">{service.badge}</span>}<span className="line-clamp-2 text-xs font-semibold leading-tight text-ink sm:text-sm">{service.label}</span><span className="hidden text-[11px] leading-tight text-ink-muted lg:block">{service.subtitle}</span></Link></li>;
}
