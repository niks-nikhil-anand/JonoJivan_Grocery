import Link from "next/link";
import {
  LuArrowDownRight,
  LuArrowUpRight,
  LuBox,
  LuCreditCard,
  LuIndianRupee,
  LuPackageCheck,
  LuReceipt,
  LuUsers,
} from "react-icons/lu";
import {
  ADMIN_DEMO_MONTHS,
  ADMIN_DEMO_ORDERS,
  ADMIN_DEMO_PRODUCTS,
} from "@/lib/adminDemoData";
import { DemoBadge } from "@/components/adminPanel/DemoDataPage";

const summary = [
  {
    label: "Gross sales",
    value: "₹8,42,650",
    trend: "+12.8%",
    up: true,
    icon: LuIndianRupee,
    color: "brand",
  },
  {
    label: "Orders",
    value: "1,284",
    trend: "+8.2%",
    up: true,
    icon: LuPackageCheck,
    color: "charge",
  },
  {
    label: "Customers",
    value: "946",
    trend: "+5.6%",
    up: true,
    icon: LuUsers,
    color: "offer",
  },
  {
    label: "Pending payments",
    value: "₹46,230",
    trend: "18 orders",
    up: false,
    icon: LuCreditCard,
    color: "rose",
  },
];

const colorClasses = {
  brand: "bg-[var(--v-green-soft)] text-[var(--v-green)]",
  charge: "bg-[var(--v-blue-soft)] text-[var(--v-blue)]",
  offer: "bg-[var(--v-warning-soft)] text-[var(--v-warning)]",
  rose: "bg-[var(--v-danger-soft)] text-[var(--v-danger)]",
};

function Status({ children }) {
  const tone =
    children === "Delivered"
      ? "bg-[var(--v-green-soft)] text-[var(--v-green)]"
      : children === "Pending"
        ? "bg-[var(--v-warning-soft)] text-[var(--v-warning)]"
        : children === "Cancelled"
          ? "bg-[var(--v-danger-soft)] text-[var(--v-danger)]"
          : "bg-[var(--v-blue-soft)] text-[var(--v-blue)]";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {children}
    </span>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--v-bg)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--v-green)]">
              Store overview
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--v-text)] sm:text-3xl">
              Good morning, Admin
            </h1>
            <p className="mt-2 text-sm text-[var(--v-muted)]">
              Here’s a snapshot of your JonoJivan store.
            </p>
          </div>
          <DemoBadge />
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => {
            const Icon = item.icon;
            const Trend = item.up ? LuArrowUpRight : LuArrowDownRight;
            return (
              <article
                key={item.label}
                className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--v-muted)]">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--v-text)]">
                      {item.value}
                    </p>
                  </div>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${colorClasses[item.color]}`}
                  >
                    <Icon aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--v-muted)]">
                  <Trend className="text-[var(--v-green)]" aria-hidden="true" />
                  <span className="font-semibold text-[var(--v-green)]">
                    {item.trend}
                  </span>
                  <span>vs previous month</span>
                </p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
          <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--v-text)]">
                  Sales overview
                </h2>
                <p className="mt-1 text-sm text-[var(--v-muted)]">
                  Monthly demo sales · Jun–Nov 2026
                </p>
              </div>
              <Link
                href="/admin/dashboard/finance"
                className="text-sm font-semibold text-[var(--v-green)] hover:text-[var(--v-green)]"
              >
                Open finance →
              </Link>
            </div>
            <div className="mt-7 grid h-48 grid-cols-6 items-end gap-3 border-b border-dashed border-[var(--v-border)] px-2 sm:gap-6">
              {ADMIN_DEMO_MONTHS.map((month, i) => (
                <div
                  key={month.label}
                  className="flex h-full flex-col items-center justify-end gap-2"
                >
                  <div
                    className={`w-full max-w-12 rounded-t-lg ${i === ADMIN_DEMO_MONTHS.length - 1 ? "bg-charge-600" : "bg-[var(--v-chart-green)]"}`}
                    style={{ height: `${month.sales}%` }}
                  />
                  <span className="mb-[-24px] text-xs text-[var(--v-muted)]">
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-9 text-xs text-[var(--v-muted)]">
              Sales values are simulated for the admin preview.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--v-text)]">
                  Inventory watch
                </h2>
                <p className="mt-1 text-sm text-[var(--v-muted)]">
                  Sample stock alerts
                </p>
              </div>
              <LuBox
                className="text-xl text-[var(--v-green)]"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 space-y-3">
              {ADMIN_DEMO_PRODUCTS.filter((item) => item.stock < 10).map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[var(--v-soft)] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--v-text)]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--v-muted)]">
                        {item.id}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${item.stock === 0 ? "bg-[var(--v-danger-soft)] text-[var(--v-danger)]" : "bg-[var(--v-warning-soft)] text-[var(--v-warning)]"}`}
                    >
                      {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--v-border)] px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--v-text)]">
                Recent orders
              </h2>
              <p className="mt-1 text-sm text-[var(--v-muted)]">
                A sample of your latest activity
              </p>
            </div>
            <Link
              href="/admin/dashboard/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--v-green)] hover:text-[var(--v-green)]"
            >
              <LuReceipt aria-hidden="true" /> All orders
            </Link>
          </div>
          <div
            className="overflow-x-auto"
            role="region"
            aria-label="Records table"
            tabIndex={0}
          >
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-[var(--v-soft)]">
                  {[
                    "Order",
                    "Customer",
                    "Date",
                    "Payment",
                    "Amount",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--v-muted)]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v-border)]">
                {ADMIN_DEMO_ORDERS.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--v-soft)]">
                    <td className="px-5 py-4 font-semibold text-[var(--v-green)]">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 font-medium text-[var(--v-text)]">
                      {order.customer}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--v-muted)]">
                      {order.date}
                    </td>
                    <td className="px-5 py-4 text-[var(--v-muted)]">
                      {order.payment}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[var(--v-text)]">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      <Status>{order.status}</Status>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[var(--v-border)] px-5 py-3 text-xs text-[var(--v-muted)]">
            Demo dashboard data · live orders remain available in All Orders.
          </div>
        </section>
      </div>
    </div>
  );
}
