import Link from "next/link";
import { LuArrowDownRight, LuArrowUpRight, LuBox, LuCreditCard, LuIndianRupee, LuPackageCheck, LuReceipt, LuUsers } from "react-icons/lu";
import { ADMIN_DEMO_MONTHS, ADMIN_DEMO_ORDERS, ADMIN_DEMO_PRODUCTS } from "@/lib/adminDemoData";
import { DemoBadge } from "@/components/adminPanel/DemoDataPage";

const summary = [
  { label: "Gross sales", value: "₹8,42,650", trend: "+12.8%", up: true, icon: LuIndianRupee, color: "brand" },
  { label: "Orders", value: "1,284", trend: "+8.2%", up: true, icon: LuPackageCheck, color: "charge" },
  { label: "Customers", value: "946", trend: "+5.6%", up: true, icon: LuUsers, color: "offer" },
  { label: "Pending payments", value: "₹46,230", trend: "18 orders", up: false, icon: LuCreditCard, color: "rose" },
];

const colorClasses = {
  brand: "bg-brand-50 text-brand-700",
  charge: "bg-charge-50 text-charge-700",
  offer: "bg-offer-100 text-offer-600",
  rose: "bg-rose-50 text-rose-600",
};

function Status({ children }) {
  const tone = children === "Delivered" ? "bg-brand-50 text-brand-800" : children === "Pending" ? "bg-offer-100 text-amber-800" : children === "Cancelled" ? "bg-rose-50 text-rose-700" : "bg-charge-50 text-charge-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{children}</span>;
}

export default function AdminDashboard() {
  return <div className="min-h-[calc(100vh-72px)] bg-[#f7f8f5] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Store overview</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Good morning, Admin</h1><p className="mt-2 text-sm text-ink-muted">Here’s a snapshot of your JonoJivan store.</p></div><DemoBadge /></header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{summary.map((item) => {
        const Icon = item.icon;
        const Trend = item.up ? LuArrowUpRight : LuArrowDownRight;
        return <article key={item.label} className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-card"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-ink-muted">{item.label}</p><p className="mt-3 text-2xl font-bold tracking-tight text-ink">{item.value}</p></div><span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colorClasses[item.color]}`}><Icon aria-hidden="true" /></span></div><p className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted"><Trend className="text-brand-700" aria-hidden="true" /><span className="font-semibold text-brand-800">{item.trend}</span><span>vs previous month</span></p></article>;
      })}</div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-card sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-ink">Sales overview</h2><p className="mt-1 text-sm text-ink-muted">Monthly demo sales · Jun–Nov 2026</p></div><Link href="/admin/dashboard/finance" className="text-sm font-semibold text-brand-800 hover:text-brand-900">Open finance →</Link></div><div className="mt-7 grid h-48 grid-cols-6 items-end gap-3 border-b border-dashed border-gray-200 px-2 sm:gap-6">{ADMIN_DEMO_MONTHS.map((month, i) => <div key={month.label} className="flex h-full flex-col items-center justify-end gap-2"><div className={`w-full max-w-12 rounded-t-lg ${i === ADMIN_DEMO_MONTHS.length - 1 ? "bg-charge-600" : "bg-brand-200"}`} style={{ height: `${month.sales}%` }} /><span className="mb-[-24px] text-xs text-ink-muted">{month.label}</span></div>)}</div><p className="mt-9 text-xs text-ink-soft">Sales values are simulated for the admin preview.</p></section>

        <section className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-card sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-ink">Inventory watch</h2><p className="mt-1 text-sm text-ink-muted">Sample stock alerts</p></div><LuBox className="text-xl text-brand-700" aria-hidden="true" /></div><div className="mt-4 space-y-3">{ADMIN_DEMO_PRODUCTS.filter((item) => item.stock < 10).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#fafaf7] p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{item.name}</p><p className="mt-1 text-xs text-ink-muted">{item.id}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${item.stock === 0 ? "bg-rose-50 text-rose-700" : "bg-offer-100 text-amber-800"}`}>{item.stock === 0 ? "Out of stock" : `${item.stock} left`}</span></div>)}</div></section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-card"><div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4"><div><h2 className="text-lg font-bold text-ink">Recent orders</h2><p className="mt-1 text-sm text-ink-muted">A sample of your latest activity</p></div><Link href="/admin/dashboard/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-900"><LuReceipt aria-hidden="true" /> All orders</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="bg-[#fafaf7]">{["Order", "Customer", "Date", "Payment", "Amount", "Status"].map((heading) => <th key={heading} className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-ink-muted">{heading}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{ADMIN_DEMO_ORDERS.slice(0, 4).map((order) => <tr key={order.id} className="hover:bg-brand-50/30"><td className="px-5 py-4 font-semibold text-brand-800">{order.id}</td><td className="px-5 py-4 font-medium text-ink">{order.customer}</td><td className="whitespace-nowrap px-5 py-4 text-ink-muted">{order.date}</td><td className="px-5 py-4 text-ink-muted">{order.payment}</td><td className="px-5 py-4 font-semibold text-ink">₹{order.amount.toLocaleString("en-IN")}</td><td className="px-5 py-4"><Status>{order.status}</Status></td></tr>)}</tbody></table></div><div className="border-t border-gray-100 px-5 py-3 text-xs text-ink-soft">Demo dashboard data · live orders remain available in All Orders.</div></section>
    </div>
  </div>;
}
