"use client";

import { useMemo, useState } from "react";
import {
  LuArrowDownRight,
  LuArrowUpRight,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import {
  ADMIN_DEMO_EXPENSES,
  ADMIN_DEMO_REFUNDS,
  ADMIN_DEMO_SETTLEMENTS,
  ADMIN_DEMO_TRANSACTIONS,
} from "@/lib/adminDemoData";

const financeDemoData = {
  transactions: ADMIN_DEMO_TRANSACTIONS,
  refunds: ADMIN_DEMO_REFUNDS,
  settlements: ADMIN_DEMO_SETTLEMENTS,
  expenses: ADMIN_DEMO_EXPENSES,
};

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--v-border)] bg-[var(--v-blue-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--v-blue)]">
      <LuSparkles aria-hidden="true" /> Demo data
    </span>
  );
}

function StatusPill({ status }) {
  const tone = /paid|settled|processed|active|recorded|delivered|healthy/i.test(
    status,
  )
    ? "bg-[var(--v-green-soft)] text-[var(--v-green)] ring-[var(--v-border)]"
    : /pending|processing|review|attention|low stock|new/i.test(status)
      ? "bg-[var(--v-warning-soft)] text-[var(--v-warning)] ring-[var(--v-border)]"
      : "bg-[var(--v-soft)] text-[var(--v-text)] ring-[var(--v-border)]";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}
    >
      {status}
    </span>
  );
}

const financeConfig = {
  overview: {
    eyebrow: "Finance",
    title: "Finance overview",
    description:
      "An overview of sample sales, collections, refunds, and operating costs.",
    columns: [],
    rows: "overview",
  },
  transactions: {
    eyebrow: "Finance",
    title: "Transactions",
    description: "A sample ledger for grocery orders and digital recharges.",
    columns: [
      "Reference",
      "Date",
      "Type",
      "Customer",
      "Payment method",
      "Amount",
      "Status",
    ],
    rows: "transactions",
  },
  refunds: {
    eyebrow: "Finance",
    title: "Refunds",
    description: "Review sample refund requests and completed reversals.",
    columns: [
      "Refund ID",
      "Date",
      "Customer",
      "Reference",
      "Reason",
      "Amount",
      "Status",
    ],
    rows: "refunds",
  },
  settlements: {
    eyebrow: "Finance",
    title: "Settlements & payouts",
    description:
      "Example settlement batches, processing fees, and net payouts.",
    columns: [
      "Batch",
      "Period",
      "Channel",
      "Transactions",
      "Gross",
      "Fees",
      "Net payout",
      "Status",
    ],
    rows: "settlements",
  },
  expenses: {
    eyebrow: "Finance",
    title: "Expenses",
    description:
      "Sample operating costs for delivery, packaging, and store operations.",
    columns: [
      "Expense ID",
      "Date",
      "Category",
      "Description",
      "Vendor",
      "Amount",
      "Status",
    ],
    rows: "expenses",
  },
  reports: {
    eyebrow: "Finance",
    title: "Financial reports",
    description:
      "Illustrative monthly sales and payment mix. Figures are simulated.",
    columns: [],
    rows: "reports",
  },
};

const listDefinitions = {
  transactions: {
    data: "ADMIN_DEMO_TRANSACTIONS",
    fields: ["id", "date", "source", "customer", "method", "amount", "status"],
    searchable: ["id", "source", "customer", "method", "status"],
  },
  refunds: {
    data: "ADMIN_DEMO_REFUNDS",
    fields: [
      "id",
      "date",
      "customer",
      "reference",
      "reason",
      "amount",
      "status",
    ],
    searchable: ["id", "customer", "reference", "reason", "status"],
  },
  settlements: {
    data: "ADMIN_DEMO_SETTLEMENTS",
    fields: [
      "id",
      "period",
      "channel",
      "transactions",
      "gross",
      "fees",
      "net",
      "status",
    ],
    searchable: ["id", "period", "channel", "status"],
  },
  expenses: {
    data: "ADMIN_DEMO_EXPENSES",
    fields: [
      "id",
      "date",
      "category",
      "description",
      "vendor",
      "amount",
      "status",
    ],
    searchable: ["id", "category", "description", "vendor", "status"],
  },
};

function valueFor(key, value) {
  if (["amount", "gross", "fees", "net"].includes(key)) return formatINR(value);
  if (key === "transactions") return value.toLocaleString("en-IN");
  return value;
}

function FinanceOverview() {
  const monthBars = [38, 52, 47, 66, 73, 88];
  const summary = [
    {
      label: "Gross sales",
      amount: "₹8,42,650",
      change: "+12.8%",
      up: true,
      note: "vs previous month",
    },
    {
      label: "Successful payments",
      amount: "₹7,96,420",
      change: "+9.4%",
      up: true,
      note: "94.5% collection rate",
    },
    {
      label: "Refunds",
      amount: "₹18,740",
      change: "−2.1%",
      up: false,
      note: "across 12 requests",
    },
    {
      label: "Operating expenses",
      amount: "₹1,26,800",
      change: "+4.6%",
      up: true,
      note: "sample monthly costs",
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card"
          >
            <p className="text-sm font-medium text-[var(--v-muted)]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--v-text)]">
              {item.amount}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--v-muted)]">
              {item.up ? (
                <LuArrowUpRight
                  className="text-[var(--v-green)]"
                  aria-hidden="true"
                />
              ) : (
                <LuArrowDownRight
                  className="text-[var(--v-green)]"
                  aria-hidden="true"
                />
              )}
              <span className="font-semibold text-[var(--v-green)]">
                {item.change}
              </span>{" "}
              {item.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--v-text)]">
                Sales trend
              </h2>
              <p className="mt-1 text-sm text-[var(--v-muted)]">
                Demo gross sales · Jun–Nov 2026
              </p>
            </div>
            <span className="rounded-lg bg-[var(--v-green-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--v-green)]">
              Last 6 months
            </span>
          </div>
          <div className="mt-8 grid h-48 grid-cols-6 items-end gap-3 border-b border-dashed border-[var(--v-border)] px-2 sm:gap-6">
            {monthBars.map((height, index) => (
              <div
                key={index}
                className="flex h-full flex-col items-center justify-end gap-2"
              >
                <div
                  className={`w-full max-w-12 rounded-t-lg ${index === monthBars.length - 1 ? "bg-charge-600" : "bg-[var(--v-chart-green)]"}`}
                  style={{ height: `${height}%` }}
                  title={`Demo sales index ${height}`}
                />
                <span className="mb-[-24px] text-xs text-[var(--v-muted)]">
                  {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-9 flex items-center justify-between text-xs text-[var(--v-muted)]">
            <span>Illustrative monthly trend</span>
            <span>Not live financial reporting</span>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
          <h2 className="text-lg font-bold text-[var(--v-text)]">
            Payment mix
          </h2>
          <p className="mt-1 text-sm text-[var(--v-muted)]">
            Sample collected sales
          </p>
          <div className="mt-6 space-y-5">
            {[
              {
                label: "UPI",
                amount: "₹4,42,500",
                share: 56,
                color: "bg-charge-600",
              },
              {
                label: "Cards",
                amount: "₹2,21,600",
                share: 28,
                color: "bg-brand-600",
              },
              {
                label: "Cash on delivery",
                amount: "₹1,32,320",
                share: 16,
                color: "bg-offer-500",
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-[var(--v-text)]">
                    {row.label}
                  </span>
                  <span className="text-[var(--v-muted)]">
                    {row.amount} · {row.share}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--v-soft)]">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-xl bg-[var(--v-blue-soft)] p-4 text-sm leading-6 text-[var(--v-blue)]">
            These figures are examples for layout review. Connect approved
            finance sources before using them for business decisions.
          </div>
        </section>
      </div>
    </>
  );
}

function ReportsPreview() {
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const bars = [38, 52, 47, 66, 73, 88];
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-bold text-[var(--v-text)]">
          Monthly gross sales
        </h2>
        <p className="mt-1 text-sm text-[var(--v-muted)]">
          Illustrative report preview · ₹ thousands
        </p>
        <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3 border-b border-[var(--v-border)] px-2 sm:gap-6">
          {bars.map((height, i) => (
            <div
              key={months[i]}
              className="flex h-full flex-col items-center justify-end gap-2"
            >
              <span className="text-[10px] text-[var(--v-muted)]">
                ₹{Math.round(height * 9.6)}k
              </span>
              <div
                className={`w-full max-w-12 rounded-t-lg ${i === bars.length - 1 ? "bg-charge-600" : "bg-[var(--v-chart-green)]"}`}
                style={{ height: `${height}%` }}
              />
              <span className="mb-[-24px] text-xs text-[var(--v-muted)]">
                {months[i]}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-9 text-xs text-[var(--v-muted)]">
          Sample data only · export/report generation is not connected.
        </p>
      </section>
      <section className="rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] p-5 shadow-card sm:p-6">
        <h2 className="text-lg font-bold text-[var(--v-text)]">
          Demo report catalogue
        </h2>
        <div className="mt-4 divide-y divide-[var(--v-border)]">
          {[
            { n: "Sales summary", d: "Gross sales, discounts, and refunds" },
            {
              n: "Payment collection",
              d: "UPI, card, cash, and pending amounts",
            },
            { n: "Recharge commissions", d: "Sample commission by operator" },
            {
              n: "Expense summary",
              d: "Illustrative operating costs by category",
            },
          ].map((row) => (
            <div key={row.n} className="py-4">
              <p className="text-sm font-semibold text-[var(--v-text)]">
                {row.n}
              </p>
              <p className="mt-1 text-xs text-[var(--v-muted)]">{row.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function FinanceDemoPage({ section = "overview" }) {
  const [query, setQuery] = useState("");
  const config = financeConfig[section] || financeConfig.transactions;
  const definition = listDefinitions[section];
  const data = useMemo(() => {
    if (!definition) return [];
    const source = financeDemoData[section] || [];
    const term = query.trim().toLowerCase();
    return source.filter(
      (row) =>
        !term ||
        definition.searchable.some((key) =>
          String(row[key]).toLowerCase().includes(term),
        ),
    );
  }, [definition, query, section]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[var(--v-bg)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--v-green)]">
              {config.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--v-text)] sm:text-3xl">
              {config.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--v-muted)]">
              {config.description}
            </p>
          </div>
          <DemoBadge />
        </header>

        {section === "overview" && <FinanceOverview />}
        {section === "reports" && <ReportsPreview />}

        {definition && (
          <section className="overflow-hidden rounded-2xl border border-[var(--v-border)] bg-[var(--v-panel)] shadow-card">
            <div className="flex flex-col gap-4 border-b border-[var(--v-border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <h2 className="font-semibold text-[var(--v-text)]">
                  {config.title} ledger
                </h2>
                <p className="mt-1 text-xs text-[var(--v-muted)]">
                  {data.length} demo records
                </p>
              </div>
              <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[var(--v-border)] bg-[var(--v-panel)] px-3 text-[var(--v-muted)] sm:max-w-xs">
                <LuSearch aria-hidden="true" />
                <span className="sr-only">
                  Search {config.title.toLowerCase()}
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search records…"
                  className="min-w-0 flex-1 bg-transparent text-sm text-[var(--v-text)] outline-none placeholder:text-[var(--v-muted)]"
                />
              </label>
            </div>
            <div
              className="overflow-x-auto"
              role="region"
              aria-label="Records table"
              tabIndex={0}
            >
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-[var(--v-soft)]">
                    {config.columns.map((column) => (
                      <th
                        key={column}
                        className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-[var(--v-muted)] sm:px-5"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v-border)]">
                  {data.map((row) => (
                    <tr
                      key={row.id}
                      className="transition hover:bg-[var(--v-soft)]"
                    >
                      {definition.fields.map((field) => (
                        <td
                          key={field}
                          className="whitespace-nowrap px-4 py-4 text-[var(--v-text)] sm:px-5"
                        >
                          {field === "status" ? (
                            <StatusPill status={row[field]} />
                          ) : [
                              "amount",
                              "gross",
                              "fees",
                              "net",
                              "transactions",
                            ].includes(field) ? (
                            <span className="font-semibold tabular-nums">
                              {valueFor(field, row[field])}
                            </span>
                          ) : field === "id" ? (
                            <span className="font-semibold text-[var(--v-green)]">
                              {row[field]}
                            </span>
                          ) : (
                            row[field]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {!data.length && (
                    <tr>
                      <td
                        colSpan={config.columns.length}
                        className="px-5 py-12 text-center text-sm text-[var(--v-muted)]"
                      >
                        No demo records match “{query}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 border-t border-[var(--v-border)] px-4 py-3 text-xs text-[var(--v-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span>
                Sample records for interface preview · no live financial action
                is available here.
              </span>
              <span>Amounts shown in INR</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
