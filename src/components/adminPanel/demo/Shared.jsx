"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  LuArrowDownToLine,
  LuSearch,
  LuX,
  LuArrowUpRight,
  LuInbox,
} from "react-icons/lu";
import { useWorkspaceTheme } from "@/components/workspace/WorkspaceTheme";
import { AdminStatus } from "../AdminPage";
import { money, dateLabel, balance } from "@/lib/admin/demo/store";
import { BASE, detailHref } from "@/lib/admin/demo/routes";
export function exportCSV(name, rows, columns) {
  const cell = (value) => {
    let text = String(value ?? "");
    if (/^[=+@\-\t\r]/.test(text) && !/^-?\d+(\.\d+)?$/.test(text))
      text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const contents = [
    columns.map((c) => cell(c.label)).join(","),
    ...rows.map((r) =>
      columns.map((c) => cell(c.export ? c.export(r) : r[c.key])).join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff", contents], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}-demo.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
export function Modal({ title, children, close }) {
  const { theme } = useWorkspaceTheme();
  return (
    <Dialog open onClose={close} className="fixed inset-0 z-[80]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            data-theme={theme}
            className="workspace-theme admin-workspace demo-modal w-full max-w-xl rounded-2xl p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <DialogTitle className="text-xl font-semibold">
                {title}
              </DialogTitle>
              <button
                onClick={close}
                aria-label="Close dialog"
                className="v-button secondary !p-2"
              >
                <LuX />
              </button>
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
export function Cards({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value, hint], i) => (
        <div
          className={`v-panel p-5 ${i === 0 ? "demo-feature-card" : ""}`}
          key={label}
        >
          <p className="text-xs font-semibold uppercase tracking-wider v-muted">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {value}
          </p>
          <p className="mt-3 text-xs v-muted">
            {hint || "Calculated from demo records"}
          </p>
        </div>
      ))}
    </div>
  );
}
export function Empty({
  title = "No records found",
  description = "Try another search or clear your filters.",
}) {
  return (
    <div className="py-14 text-center">
      <LuInbox className="mx-auto text-3xl v-muted" />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm v-muted">{description}</p>
    </div>
  );
}
export function RecordLink({ entity, id, label }) {
  const href = detailHref(entity, id);
  return href ? (
    <Link className="demo-link" href={href}>
      {label || id}
    </Link>
  ) : (
    <span>{label || id || "—"}</span>
  );
}
export function SourceLink({ id }) {
  const prefix = String(id || "").split("-")[0];
  const entities = {
    ORD: "orders",
    SET: "settlements",
    LED: "entries",
    SVC: "services",
    WD: "withdrawals",
    CUS: "customers",
    VEN: "vendors",
  };
  if (entities[prefix]) return <RecordLink entity={entities[prefix]} id={id} />;
  const lists = {
    REF: "/finance/refunds",
    TOP: "/wallet/topups",
    ADJ: "/wallet/adjustments",
    PAY: "/finance/transactions",
  };
  return lists[prefix] ? (
    <Link
      className="demo-link"
      href={`${BASE}${lists[prefix]}?q=${encodeURIComponent(id)}`}
    >
      {id}
    </Link>
  ) : (
    <span>{id || "—"}</span>
  );
}
export function Table({
  rows,
  columns,
  title = "Records",
  actions,
  initialQuery = "",
  dateKey = "createdAt",
}) {
  const [query, setQuery] = useState(initialQuery),
    [status, setStatus] = useState(""),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [sort, setSort] = useState("newest"),
    [page, setPage] = useState(1);
  const statuses = [...new Set(rows.map((r) => r.status).filter(Boolean))];
  const filtered = rows
    .filter(
      (r) =>
        (!query ||
          JSON.stringify(r).toLowerCase().includes(query.toLowerCase())) &&
        (!status || r.status === status) &&
        (!from || r[dateKey]?.slice(0, 10) >= from) &&
        (!to || r[dateKey]?.slice(0, 10) <= to),
    )
    .sort((a, b) =>
      sort === "amount"
        ? Math.abs(b.amount ?? b.price ?? 0) -
          Math.abs(a.amount ?? a.price ?? 0)
        : sort === "name"
          ? String(a.name || a.id).localeCompare(String(b.name || b.id))
          : String(b[dateKey] || "").localeCompare(String(a[dateKey] || "")),
    );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 8)),
    currentPage = Math.min(page, totalPages);
  const change = (fn) => (event) => {
    fn(event.target.value);
    setPage(1);
  };
  return (
    <section className="v-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--v-border)] p-5">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs v-muted">
            {filtered.length} of {rows.length} records
          </p>
        </div>
        <button
          className="v-button secondary"
          onClick={() =>
            exportCSV(
              title.toLowerCase().replaceAll(" ", "-"),
              filtered,
              columns,
            )
          }
        >
          <LuArrowDownToLine /> Export CSV
        </button>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <label className="relative block xl:col-span-1">
          <span className="sr-only">Search {title}</span>
          <LuSearch className="absolute left-3 top-3.5 v-muted" />
          <input
            className="v-input !pl-9"
            placeholder="Search records…"
            value={query}
            onChange={change(setQuery)}
          />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select
            className="v-input"
            value={status}
            onChange={change(setStatus)}
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs v-muted">
          From
          <input
            aria-label="From date"
            className="v-input min-w-0"
            type="date"
            value={from}
            onChange={change(setFrom)}
          />
        </label>
        <label className="flex items-center gap-2 text-xs v-muted">
          To
          <input
            aria-label="To date"
            className="v-input min-w-0"
            type="date"
            value={to}
            onChange={change(setTo)}
          />
        </label>
        <label>
          <span className="sr-only">Sort records</span>
          <select className="v-input" value={sort} onChange={change(setSort)}>
            <option value="newest">Newest first</option>
            <option value="amount">Highest amount</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>
      {(query || status || from || to) && (
        <button
          className="mx-4 mb-3 text-sm demo-link"
          onClick={() => {
            setQuery("");
            setStatus("");
            setFrom("");
            setTo("");
            setPage(1);
          }}
        >
          Clear filters
        </button>
      )}
      {filtered.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">{title}</caption>
              <thead className="v-soft text-xs uppercase tracking-wide v-muted">
                <tr>
                  {columns.map((c) => (
                    <th
                      className="whitespace-nowrap px-5 py-3 font-semibold"
                      key={c.key}
                    >
                      {c.label}
                    </th>
                  ))}
                  {actions && <th className="px-5 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((currentPage - 1) * 8, currentPage * 8)
                  .map((row) => (
                    <tr
                      className="demo-table-row border-t border-[var(--v-border)]"
                      key={row.id}
                    >
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className="max-w-xs px-5 py-4 align-top"
                        >
                          {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-5 py-3 align-top">{actions(row)}</td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[var(--v-border)] p-4 text-xs v-muted">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                className="v-button secondary"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="v-button secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <Empty />
      )}
    </section>
  );
}
export function columnsFor(entity, state) {
  const nameOf = (collection, id) =>
    state[collection].find((r) => r.id === id)?.name || id;
  const ref = {
    key: "id",
    label: "Reference",
    render: (r) => <RecordLink entity={entity} id={r.id} />,
  };
  const name = { key: "name", label: "Description" };
  const status = {
    key: "status",
    label: "Status",
    render: (r) => <AdminStatus status={r.status} />,
  };
  const amount = {
    key: "amount",
    label: "Amount",
    render: (r) => (
      <span className="font-semibold tabular-nums whitespace-nowrap">
        {money(r.amount)}
      </span>
    ),
    export: (r) => (r.amount / 100).toFixed(2),
  };
  const date = {
    key: "createdAt",
    label: "Date",
    render: (r) => (
      <span className="whitespace-nowrap v-muted">
        {dateLabel(r.createdAt)}
      </span>
    ),
  };
  const wallet = {
    key: "walletId",
    label: "Account",
    render: (r) => (
      <RecordLink
        entity="accounts"
        id={r.walletId}
        label={nameOf("accounts", r.walletId)}
      />
    ),
  };
  if (entity === "accounts")
    return [
      ref,
      name,
      { key: "type", label: "Owner type" },
      {
        key: "available",
        label: "Available",
        render: (r) => money(balance(state, r.id).available),
        export: (r) => balance(state, r.id).available / 100,
      },
      {
        key: "reserved",
        label: "Reserved",
        render: (r) => money(balance(state, r.id).reserved),
        export: (r) => balance(state, r.id).reserved / 100,
      },
      status,
    ];
  if (entity === "entries")
    return [
      ref,
      wallet,
      { key: "kind", label: "Type" },
      amount,
      {
        key: "sourceId",
        label: "Source",
        render: (r) => <SourceLink id={r.sourceId} />,
      },
      date,
    ];
  if (["withdrawals", "topups", "adjustments", "cashback"].includes(entity))
    return [ref, wallet, amount, status, date];
  if (entity === "refunds")
    return [
      ref,
      {
        key: "paymentId",
        label: "Payment",
        render: (r) => <SourceLink id={r.paymentId} />,
      },
      { key: "destination", label: "Destination" },
      amount,
      status,
      date,
    ];
  if (entity === "payments")
    return [
      ref,
      name,
      {
        key: "sourceId",
        label: "Source",
        render: (r) => (
          <RecordLink
            entity={r.sourceId.startsWith("ORD-") ? "orders" : "services"}
            id={r.sourceId}
          />
        ),
      },
      { key: "method", label: "Method" },
      amount,
      {
        key: "matched",
        label: "Reconciled",
        render: (r) => (
          <AdminStatus status={r.matched ? "Matched" : "Unmatched"} />
        ),
      },
      status,
    ];
  if (entity === "products")
    return [
      ref,
      {
        ...name,
        label: "Product",
        render: (r) => (
          <div className="flex min-w-44 items-center gap-3">
            <Image
              alt=""
              src={r.image}
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span>{r.name}</span>
          </div>
        ),
      },
      {
        key: "price",
        label: "Price",
        render: (r) => money(r.price),
        export: (r) => r.price / 100,
      },
      {
        key: "stock",
        label: "Stock",
        render: (r) => (
          <span>
            {r.stock}{" "}
            <span className="text-xs v-muted">
              {r.stock === 0
                ? "· Out of stock"
                : r.stock <= 8
                  ? "· Low stock"
                  : "· In stock"}
            </span>
          </span>
        ),
      },
      status,
    ];
  if (entity === "orders")
    return [
      ref,
      {
        key: "customerId",
        label: "Customer",
        render: (r) => (
          <RecordLink
            entity="customers"
            id={r.customerId}
            label={nameOf("customers", r.customerId)}
          />
        ),
      },
      amount,
      { key: "method", label: "Payment" },
      status,
      date,
    ];
  if (entity === "categories")
    return [
      ref,
      name,
      {
        key: "parentId",
        label: "Parent category",
        render: (r) =>
          r.parentId ? (
            <RecordLink
              entity="categories"
              id={r.parentId}
              label={nameOf("categories", r.parentId)}
            />
          ) : (
            "Top level"
          ),
      },
      status,
    ];
  if (["customers", "vendors"].includes(entity))
    return [ref, name, { key: "email", label: "Email" }, status, date];
  if (entity === "settlements")
    return [
      ref,
      {
        key: "vendorId",
        label: "Vendor",
        render: (r) => (
          <RecordLink
            entity="vendors"
            id={r.vendorId}
            label={nameOf("vendors", r.vendorId)}
          />
        ),
      },
      { ...amount, label: "Gross" },
      {
        key: "fee",
        label: "Fee",
        render: (r) => money(r.fee),
        export: (r) => r.fee / 100,
      },
      {
        key: "net",
        label: "Net",
        render: (r) => money(r.amount - r.fee),
        export: (r) => (r.amount - r.fee) / 100,
      },
      status,
    ];
  if (entity === "expenses") return [ref, name, amount, date];
  if (entity === "services")
    return [
      ref,
      name,
      { key: "provider", label: "Provider" },
      amount,
      status,
      date,
    ];
  if (entity === "reviews")
    return [
      ref,
      name,
      { key: "rating", label: "Rating", render: (r) => `${r.rating} / 5` },
      {
        key: "productId",
        label: "Product",
        render: (r) => <RecordLink entity="products" id={r.productId} />,
      },
      status,
    ];
  if (entity === "coupons")
    return [
      ref,
      name,
      { key: "discount", label: "Discount %" },
      { key: "limit", label: "Usage limit" },
      { key: "expiresAt", label: "Expires" },
      status,
    ];
  if (entity === "tickets")
    return [
      ref,
      name,
      { key: "priority", label: "Priority" },
      { key: "assignee", label: "Assigned to" },
      status,
      date,
    ];
  if (entity === "audit")
    return [
      ref,
      name,
      { key: "actor", label: "Actor" },
      { key: "reason", label: "Reason" },
      date,
    ];
  if (entity === "messages")
    return [
      ref,
      name,
      { key: "message", label: "Message" },
      { key: "email", label: "From" },
      status,
    ];
  return [ref, name, status, date];
}
export function SectionLink({ href, title, children }) {
  return (
    <Link
      className="v-panel flex items-start justify-between gap-4 p-5 demo-tile"
      href={`${BASE}${href}`}
    >
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-2 text-sm v-muted">{children}</p>
      </div>
      <LuArrowUpRight className="shrink-0 v-green" />
    </Link>
  );
}
