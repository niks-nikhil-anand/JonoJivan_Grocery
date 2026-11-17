"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { LuBox, LuArrowLeft, LuArrowRight, LuSearch } from "react-icons/lu";
export const base = "/vendor/dashboard";
export const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
export const date = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
export const label = (value) =>
  String(value || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
export async function api(path, options = {}) {
  const res = await fetch(`/api/vendor/workspace/${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong.");
    error.status = res.status;
    throw error;
  }
  return data;
}
export function useData(path) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: null, loading: true });
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== "AbortError")
          setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
  }, [path, version]);
  return { ...state, reload: useCallback(() => setVersion((v) => v + 1), []) };
}
export function PageHeader({ title, description, action, parent }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs v-muted">
          <Link href={base} className="hover:underline">
            Workspace
          </Link>
          <span>/</span>
          {parent && (
            <>
              <Link href={parent.href} className="hover:underline">
                {parent.label}
              </Link>
              <span>/</span>
            </>
          )}
          <span>{title}</span>
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 v-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
export function Badge({ value }) {
  return (
    <span
      className={`v-badge ${["ACTIVE", "DELIVERED", "PAID", "RESOLVED"].includes(value) ? "good" : ["CANCELLED", "BLOCKED", "INACTIVE", "OUT_OF_STOCK"].includes(value) ? "bad" : "info"}`}
    >
      {label(value)}
    </span>
  );
}
export function Empty({
  title = "Nothing here yet",
  description = "New activity will appear here.",
  action,
}) {
  return (
    <div className="flex flex-col items-center px-5 py-14 text-center">
      <span className="mb-4 rounded-2xl p-4 v-soft v-green">
        <LuBox size={28} aria-hidden />
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 v-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function Loading() {
  return (
    <div role="status" aria-label="Loading workspace" className="space-y-5">
      <span className="sr-only">Loading…</span>
      <div className="h-10 w-52 animate-pulse rounded-xl v-soft" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl v-soft" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl v-soft" />
    </div>
  );
}
export function DataState({ state, children }) {
  if (state.loading) return <Loading />;
  if (state.error)
    return (
      <section className="v-panel p-8">
        <h1 className="text-xl font-semibold">
          {state.error.status === 404
            ? "We couldn’t find that item"
            : state.error.status === 403
              ? "Access unavailable"
              : "Unable to load this page"}
        </h1>
        <p className="my-4 v-muted" role="alert">
          {state.error.message}
        </p>
        {state.error.status === 401 ? (
          <Link href="/vendor/auth" className="v-button">
            Sign in again
          </Link>
        ) : (
          <button className="v-button" onClick={state.reload}>
            Try again
          </button>
        )}{" "}
        <Link href={base} className="v-button secondary">
          Back to dashboard
        </Link>
      </section>
    );
  return children;
}
export function Field({ label: title, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-sm font-semibold">{title}</span>
      {children}
      {hint && (
        <span className="mt-2 block text-xs leading-5 v-muted">{hint}</span>
      )}
    </label>
  );
}
export function Notice({ error, success }) {
  return (
    <>
      {error && (
        <p role="alert" className="v-error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="v-success">
          {success}
        </p>
      )}
    </>
  );
}
export function Stat({ title, value, hint, icon: Icon = LuBox }) {
  return (
    <article className="v-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm v-muted">{title}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span className="rounded-xl p-3 v-soft v-green">
          <Icon size={21} aria-hidden />
        </span>
      </div>
      {hint && <p className="mt-4 text-xs v-muted">{hint}</p>}
    </article>
  );
}
export function ListTable({
  rows,
  columns,
  searchText,
  statuses = [],
  statusKey = "status",
  emptyTitle,
  emptyDescription,
  initialSearch = "",
  dateKey,
}) {
  const [query, setQuery] = useState(initialSearch),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  useEffect(() => {
    setQuery(initialSearch);
    setPage(1);
  }, [initialSearch]);
  const filtered = rows.filter(
    (row) =>
      (!query || searchText(row).toLowerCase().includes(query.toLowerCase())) &&
      (!status || String(row[statusKey]) === status) &&
      (!dateKey ||
        ((!from || row[dateKey].slice(0, 10) >= from) &&
          (!to || row[dateKey].slice(0, 10) <= to))),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10)),
    current = Math.min(page, pages);
  return (
    <section className="v-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b p-4 v-border sm:flex-row sm:flex-wrap">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search this list</span>
          <LuSearch className="absolute left-3 top-3.5 v-muted" aria-hidden />
          <input
            className="v-input !pl-9"
            placeholder="Search this list…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        {statuses.length > 0 && (
          <select
            aria-label="Filter by status"
            className="v-input sm:!w-44"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        )}
        {dateKey && (
          <>
            <label className="flex items-center gap-2 text-xs v-muted">
              From
              <input
                aria-label="From date"
                type="date"
                className="v-input"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label className="flex items-center gap-2 text-xs v-muted">
              To
              <input
                aria-label="To date"
                type="date"
                className="v-input"
                min={from}
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setPage(1);
                }}
              />
            </label>
          </>
        )}
      </div>
      {!filtered.length ? (
        <Empty
          title={rows.length ? "No matching results" : emptyTitle}
          description={
            rows.length ? "Try a different search or filter." : emptyDescription
          }
        />
      ) : (
        <>
          <div
            className="overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Results table"
          >
            <table className="v-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.title} scope="col">
                      {c.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice((current - 1) * 10, current * 10).map((row) => (
                  <tr key={row.id}>
                    {columns.map((c) => (
                      <td key={c.title}>{c.render(row)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between gap-3 border-t px-4 py-3 v-border">
            <p className="text-xs v-muted">
              {filtered.length} results · Page {current} of {pages}
            </p>
            <div className="flex gap-2">
              <button
                aria-label="Previous page"
                className="v-button secondary !px-3"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                <LuArrowLeft />
              </button>
              <button
                aria-label="Next page"
                className="v-button secondary !px-3"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                <LuArrowRight />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
