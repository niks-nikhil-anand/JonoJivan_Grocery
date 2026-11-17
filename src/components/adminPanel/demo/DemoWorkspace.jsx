"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LuPlus,
  LuArrowUpRight,
  LuWallet,
  LuShieldCheck,
  LuClock,
  LuRefreshCw,
} from "react-icons/lu";
import { AdminPage, AdminPageHeader, AdminStatus } from "../AdminPage";
import { useDemo } from "./DemoProvider";
import {
  Table,
  Cards,
  Modal,
  Empty,
  RecordLink,
  SourceLink,
  columnsFor,
  SectionLink,
  exportCSV,
} from "./Shared";
import { DemoForm } from "./Forms";
import { RowActions } from "./Actions";
import { BASE, resolveRoute } from "@/lib/admin/demo/routes";
import {
  money,
  balance,
  financeTotals,
  canManage,
  dateLabel,
} from "@/lib/admin/demo/store";

function Records({ entity, rows, title, initialQuery }) {
  const { state } = useDemo();
  const searchable = (rows || state[entity]).map((r) => ({
    ...r,
    _searchOwner:
      state.accounts.find((a) => a.id === r.walletId)?.name ||
      state.customers.find((c) => c.id === r.customerId)?.name ||
      "",
  }));
  return (
    <Table
      rows={searchable}
      title={title}
      initialQuery={initialQuery}
      columns={columnsFor(entity, state)}
      actions={
        entity === "audit"
          ? undefined
          : (r) => <RowActions entity={entity} row={r} />
      }
    />
  );
}
function ActivityChart({ entries, title, amountKey = "amount" }) {
  const latest = entries
    .map((e) => e.createdAt?.slice(0, 10))
    .filter(Boolean)
    .sort()
    .at(-1);
  const dates = latest
    ? Array.from({ length: 30 }, (_, index) => {
        const day = new Date(`${latest}T12:00:00Z`);
        day.setUTCDate(day.getUTCDate() - 29 + index);
        return day.toISOString().slice(0, 10);
      })
    : [];
  const values = dates.map((date) =>
    entries
      .filter((e) => e.createdAt?.startsWith(date))
      .reduce((n, e) => n + Math.max(0, e[amountKey] || 0), 0),
  );
  const max = Math.max(...values, 1);
  return (
    <section className="v-panel p-5 sm:p-6">
      <div className="flex justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-xs v-muted">Last 30 days</span>
      </div>
      {dates.length ? (
        <>
          <div
            className="mt-7 flex h-40 items-end gap-1 sm:gap-2"
            role="img"
            aria-label={dates
              .map((d, i) => `${d}: ${money(values[i])}`)
              .join("; ")}
          >
            {dates.map((d, i) => (
              <div
                key={d}
                className="group flex h-full min-w-0 flex-1 items-end"
                title={`${dateLabel(d)}: ${money(values[i])}`}
              >
                <div
                  className="w-full rounded-t-md bg-[var(--v-green)] opacity-75 transition hover:opacity-100"
                  style={{ height: `${Math.max(3, (values[i] / max) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs v-muted">
            <span>{dateLabel(dates[0])}</span>
            <span>{dateLabel(dates.at(-1))}</span>
          </div>
        </>
      ) : (
        <Empty title="No activity yet" />
      )}
    </section>
  );
}
function WalletOverview({ report = false }) {
  const { state } = useDemo();
  const totals = state.accounts.reduce(
    (out, a) => {
      const b = balance(state, a.id);
      out[a.type] += b.available;
      out.reserved += b.reserved;
      out.paid += b.paid;
      return out;
    },
    { Customer: 0, Vendor: 0, reserved: 0, paid: 0 },
  );
  return (
    <>
      <Cards
        items={[
          [
            "Customer cash balances",
            money(totals.Customer),
            "Store credit · excludes promotional funds",
          ],
          [
            "Vendor available",
            money(totals.Vendor),
            "Posted earnings less reserves and payouts",
          ],
          [
            "Reserved for payouts",
            money(totals.reserved),
            `${state.withdrawals.filter((w) => ["Pending", "Approved", "Processing"].includes(w.status)).length} open requests`,
          ],
          [
            "Paid to vendors",
            money(totals.paid),
            "Cumulative completed demo payouts",
          ],
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ActivityChart
          entries={state.entries}
          title="Wallet credits over time"
        />
        <section className="demo-wallet-callout rounded-2xl p-6">
          <span className="inline-flex rounded-xl bg-white/10 p-3">
            <LuWallet size={24} />
          </span>
          <h2 className="mt-5 text-2xl font-semibold">
            Every rupee, accounted for.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 opacity-80">
            Review payout requests, track customer credits, and follow every
            adjustment back to its source.
          </p>
          <Link
            href={`${BASE}/wallet/withdrawals`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-green-950"
          >
            Review withdrawals <LuArrowUpRight />
          </Link>
        </section>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <SectionLink href="/wallet/accounts" title="Customer & vendor accounts">
          {state.accounts.length} accounts with a complete balance breakdown.
        </SectionLink>
        <SectionLink href="/wallet/refunds" title="Refund review">
          {state.refunds.filter((r) => r.status === "Pending").length} requests
          awaiting a decision.
        </SectionLink>
        <SectionLink href="/wallet/adjustments" title="Balance adjustments">
          Reasoned corrections with a second reviewer.
        </SectionLink>
      </div>
      {report ? (
        <>
          <Records entity="accounts" title="Current balances and liabilities" />
          <Records entity="entries" title="Wallet activity report" />
          <Records entity="withdrawals" title="Payout report" />
        </>
      ) : (
        <Records
          entity="entries"
          rows={[...state.entries]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 16)}
          title="Recent wallet activity"
        />
      )}
    </>
  );
}
function Finance({ report = false }) {
  const { state } = useDemo();
  const [from, setFrom] = useState(""),
    [to, setTo] = useState("");
  const inRange = (r) =>
    (!from || r.createdAt?.slice(0, 10) >= from) &&
    (!to || r.createdAt?.slice(0, 10) <= to);
  const filtered = {
    ...state,
    payments: state.payments.filter(inRange),
    refunds: state.refunds.filter(inRange),
    expenses: state.expenses.filter(inRange),
    withdrawals: state.withdrawals.filter(inRange),
  };
  const totals = financeTotals(filtered);
  const reportRows = Object.entries(totals).map(([name, amount]) => ({
    name,
    amount: amount / 100,
  }));
  return (
    <>
      {report && (
        <div className="v-panel flex flex-wrap items-end gap-4 p-4">
          <label className="text-sm">
            From
            <input
              type="date"
              className="v-input mt-2"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="text-sm">
            To
            <input
              type="date"
              className="v-input mt-2"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <button
            className="v-button secondary"
            onClick={() =>
              exportCSV("finance-summary", reportRows, [
                { key: "name", label: "Metric" },
                { key: "amount", label: "INR" },
              ])
            }
          >
            Export summary
          </button>
        </div>
      )}
      <Cards
        items={[
          [
            "Collections",
            money(totals.collections),
            "Paid orders and services only",
          ],
          [
            "Completed refunds",
            money(totals.refunds),
            "Wallet and original-payment refunds",
          ],
          [
            "Operating expenses",
            money(totals.expenses),
            "Recorded demo expenses",
          ],
          [
            "Net collections",
            money(totals.netCollections),
            "Collections less refunds · not profit",
          ],
        ]}
      />
      <p className="rounded-xl p-4 text-sm v-soft v-muted">
        Wallet top-ups and internal settlements are excluded from sales
        collections. Vendor payouts total {money(totals.payouts)} for this
        period; they are shown separately from operating expenses.
      </p>
      <ActivityChart title="Daily collections" entries={filtered.payments} />
      <div className="grid gap-4 sm:grid-cols-3">
        <SectionLink href="/finance/reconciliation" title="Reconciliation">
          {state.payments.filter((p) => !p.matched).length} payments need
          review.
        </SectionLink>
        <SectionLink href="/finance/settlements" title="Vendor settlements">
          Review gross amounts, fees and posted earnings.
        </SectionLink>
        <SectionLink href="/finance/expenses" title="Operating expenses">
          Record and edit demo business costs.
        </SectionLink>
      </div>
      <Records
        entity="payments"
        rows={filtered.payments}
        title={report ? "Payments in report period" : "Payment activity"}
      />
    </>
  );
}
function Dashboard() {
  const { state } = useDemo();
  const totals = financeTotals(state);
  return (
    <>
      <div className="demo-dashboard-intro flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] v-green">
            JonoJivan · Admin workspace
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            A clear view of your daily operations.
          </h2>
          <p className="mt-2 text-sm v-muted">
            Orders, money, and people — connected in one demo workspace.
          </p>
        </div>
        <Link className="v-button" href={`${BASE}/wallet`}>
          <LuWallet /> Open wallet
        </Link>
      </div>
      <Cards
        items={[
          ["Collected payments", money(totals.collections)],
          [
            "Orders",
            state.orders.length,
            `${state.orders.filter((o) => o.status === "Pending").length} awaiting processing`,
          ],
          [
            "Customers",
            state.customers.length,
            `${state.vendors.length} vendor partners`,
          ],
          [
            "Low-stock products",
            state.products.filter((p) => p.stock <= 8).length,
            "Includes out-of-stock items",
          ],
        ]}
      />
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <ActivityChart entries={state.payments} title="Collections over time" />
        <div className="space-y-4">
          <SectionLink href="/wallet/withdrawals" title="Withdrawals to review">
            {state.withdrawals.filter((w) => w.status === "Pending").length}{" "}
            requests awaiting approval.
          </SectionLink>
          <SectionLink href="/support/tickets" title="Support inbox">
            {state.tickets.filter((t) => t.status === "Open").length} open
            conversations.
          </SectionLink>
          <SectionLink href="/inventory" title="Inventory attention">
            Check stock before accepting the next order.
          </SectionLink>
        </div>
      </div>
      <Records
        entity="orders"
        rows={state.orders.slice(0, 12)}
        title="Recent orders"
      />
    </>
  );
}
function Detail({ route, row }) {
  const { state, dispatch } = useDemo();
  const [replyError, setReplyError] = useState("");
  const { entity } = route;
  const relations = {
    walletId: "accounts",
    customerId: "customers",
    vendorId: "vendors",
    productId: "products",
    orderId: "orders",
    parentId: "categories",
    categoryId: "categories",
  };
  const hidden = [
    "id",
    "name",
    "messages",
    "history",
    "orderIds",
    "image",
    "content",
    "amount",
    "fee",
    "price",
    "unitPrice",
    "_searchOwner",
  ];
  let wallet =
    entity === "accounts"
      ? row
      : ["customers", "vendors"].includes(entity)
        ? state.accounts.find((a) => a.ownerId === row.id)
        : null;
  function reply(e) {
    e.preventDefault();
    setReplyError("");
    try {
      dispatch({
        type: "reply",
        entity: "tickets",
        id: row.id,
        payload: { message: new FormData(e.currentTarget).get("message") },
      });
      e.currentTarget.reset();
    } catch (err) {
      setReplyError(err.message);
    }
  }
  return (
    <>
      <div className="v-panel p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest v-muted">
              {row.id}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{row.name}</h2>
            <div className="mt-3">
              <AdminStatus status={row.status} />
            </div>
          </div>
          {(row.amount !== undefined || row.price !== undefined) && (
            <p className="text-3xl font-semibold tabular-nums">
              {money(row.amount ?? row.price)}
            </p>
          )}
        </div>
        <dl className="mt-6 grid gap-5 border-t border-[var(--v-border)] pt-5 sm:grid-cols-2 xl:grid-cols-3">
          {Object.entries(row)
            .filter(
              ([key, val]) => !hidden.includes(key) && typeof val !== "object",
            )
            .map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs capitalize v-muted">
                  {key.replace(/([A-Z])/g, " $1")}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium">
                  {["sourceId", "paymentId", "ownerId"].includes(key) ? (
                    <SourceLink id={value} />
                  ) : relations[key] && value ? (
                    <RecordLink entity={relations[key]} id={value} />
                  ) : key === "createdAt" || key === "updatedAt" ? (
                    dateLabel(value)
                  ) : key === "destination" ? (
                    `••••${String(value).slice(-8)}`
                  ) : (
                    String(value || "—")
                  )}
                </dd>
              </div>
            ))}
        </dl>
        {row.content && (
          <div className="mt-6 whitespace-pre-wrap rounded-xl p-5 leading-7 v-soft">
            {row.content}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--v-border)] pt-5">
          <RowActions entity={entity} row={row} />
          {["orders", "entries"].includes(entity) && (
            <button
              className="v-button secondary"
              onClick={() => window.print()}
            >
              Print {entity === "orders" ? "invoice" : "receipt"}
            </button>
          )}
        </div>
      </div>
      {wallet && (
        <>
          <Cards
            items={Object.entries(balance(state, wallet.id))
              .filter(([key]) => key !== "posted")
              .map(([key, value]) => [
                key === "promotional"
                  ? "Promotional credit"
                  : key.charAt(0).toUpperCase() + key.slice(1),
                money(value),
              ])}
          />
          {entity !== "accounts" && (
            <Link
              className="v-button secondary"
              href={`${BASE}/wallet/accounts/${wallet.id}`}
            >
              Open linked wallet <LuArrowUpRight />
            </Link>
          )}
          <Records
            entity="entries"
            rows={state.entries.filter((e) => e.walletId === wallet.id)}
            title="Account ledger"
          />
          {wallet.type === "Vendor" && (
            <Records
              entity="withdrawals"
              rows={state.withdrawals.filter((w) => w.walletId === wallet.id)}
              title="Vendor withdrawals"
            />
          )}
        </>
      )}
      {["customers", "vendors"].includes(entity) && (
        <Records
          entity="orders"
          rows={state.orders.filter((o) =>
            entity === "customers"
              ? o.customerId === row.id
              : o.vendorId === row.id,
          )}
          title="Related orders"
        />
      )}
      {entity === "vendors" && (
        <Records
          entity="products"
          rows={state.products.filter((p) => p.vendorId === row.id)}
          title="Vendor products"
        />
      )}
      {entity === "categories" && (
        <Records
          entity="products"
          rows={state.products.filter((p) => p.categoryId === row.id)}
          title="Category products"
        />
      )}
      {entity === "orders" && (
        <>
          <Records
            entity="products"
            rows={state.products
              .filter((p) => p.id === row.productId)
              .map((p) => ({
                ...p,
                name: row.productName || p.name,
                price: row.unitPrice ?? p.price,
              }))}
            title={`Order items · quantity ${row.quantity}`}
          />
          <Records
            entity="payments"
            rows={state.payments.filter((p) => p.sourceId === row.id)}
            title="Order payments"
          />
          <Records
            entity="refunds"
            rows={state.refunds.filter((r) =>
              state.payments.some(
                (p) => p.id === r.paymentId && p.sourceId === row.id,
              ),
            )}
            title="Order refunds"
          />
          <p className="v-panel p-5 text-sm">
            Delivery address:{" "}
            {state.customers.find((c) => c.id === row.customerId)?.address}.
            Invoice total: {money(row.amount)}. Sample invoice only.
          </p>
        </>
      )}
      {entity === "settlements" && (
        <>
          <Cards
            items={[
              ["Gross", money(row.amount)],
              ["Fees", money(row.fee)],
              ["Net earnings", money(row.amount - row.fee)],
              ["Linked orders", row.orderIds.length],
            ]}
          />
          <Records
            entity="orders"
            rows={state.orders.filter((o) => row.orderIds.includes(o.id))}
            title="Settlement orders"
          />
        </>
      )}
      {entity === "services" && (
        <>
          <Records
            entity="payments"
            rows={state.payments.filter((p) => p.sourceId === row.id)}
            title="Service payment"
          />
          <Records
            entity="refunds"
            rows={state.refunds.filter((r) => r.paymentId === `PAY-${row.id}`)}
            title="Service refunds"
          />
        </>
      )}
      {entity === "returns" && (
        <SectionLink href="/finance/refunds" title="Refund processing">
          Approving a return does not move funds. Create a linked refund against
          the original payment after review.
        </SectionLink>
      )}
      {row.history && (
        <section className="v-panel p-6">
          <h2 className="font-semibold">Activity timeline</h2>
          <ol className="mt-5 space-y-5">
            {row.history.map((h, i) => (
              <li key={i} className="flex gap-3">
                <LuClock className="mt-1 shrink-0 v-green" />
                <div>
                  <p className="text-sm font-semibold">{h.status}</p>
                  <p className="mt-1 text-sm v-muted">
                    {h.note} · {dateLabel(h.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
      {entity === "tickets" && (
        <section className="v-panel p-6">
          <h2 className="font-semibold">Conversation</h2>
          <div className="my-5 space-y-4">
            {row.messages.map((m, i) => (
              <article key={i} className="rounded-xl p-4 v-soft">
                <p className="text-xs font-semibold v-green">
                  {m.actor} · {dateLabel(m.createdAt)}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{m.text}</p>
              </article>
            ))}
          </div>
          {replyError && (
            <p role="alert" className="v-error">
              {replyError}
            </p>
          )}
          <form onSubmit={reply} className="space-y-3">
            <label className="block text-sm">
              Demo reply
              <textarea
                name="message"
                required
                rows={3}
                maxLength={2000}
                className="v-input mt-2"
                disabled={!canManage(state.role, "tickets")}
              />
            </label>
            <button
              className="v-button"
              disabled={!canManage(state.role, "tickets")}
            >
              Save reply to demo
            </button>
          </form>
        </section>
      )}
    </>
  );
}
function Roles() {
  const { state, dispatch } = useDemo();
  return (
    <>
      <div className="v-panel p-6">
        <LuShieldCheck size={28} className="v-green" />
        <h2 className="mt-3 text-lg font-semibold">
          Preview an administrator role
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 v-muted">
          This changes only demo action permissions. Your authenticated account
          and server permissions are unchanged. Adjustments require a different
          authorized reviewer.
        </p>
        <label className="mt-5 block max-w-sm text-sm">
          Preview role
          <select
            className="v-input mt-2"
            value={state.role}
            onChange={(e) =>
              dispatch({ type: "role", payload: { role: e.target.value } })
            }
          >
            {["Super admin", "Finance", "Support"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>
      <Table
        title="Permission matrix"
        rows={["Super admin", "Finance", "Support"].map((role) => ({
          id: role,
          name: role,
          wallet: role !== "Support" ? "Manage" : "Read",
          commerce: role === "Super admin" ? "Manage" : "Read",
          support: role !== "Finance" ? "Manage" : "Read",
          settings: role === "Super admin" ? "Manage" : "Read",
        }))}
        columns={[
          { key: "name", label: "Role" },
          { key: "wallet", label: "Wallet / finance" },
          { key: "commerce", label: "Commerce" },
          { key: "support", label: "Support" },
          { key: "settings", label: "Settings" },
        ]}
      />
    </>
  );
}
export default function DemoWorkspace() {
  const pathname = usePathname(),
    search = useSearchParams();
  const { state, storageError, scenario, setScenario } = useDemo();
  const [create, setCreate] = useState(false),
    [ownerType, setOwnerType] = useState(""),
    [stockFilter, setStockFilter] = useState("");
  const route = resolveRoute(pathname);
  if (!state)
    return (
      <div className="p-8" role="status">
        Loading your demo workspace…
      </div>
    );
  if (!route)
    return (
      <AdminPage>
        <Empty
          title="Page not found"
          description="This admin page does not exist."
        />
        <Link href={BASE} className="v-button">
          Back to dashboard
        </Link>
      </AdminPage>
    );
  if (scenario !== "normal")
    return (
      <AdminPage>
        <AdminPageHeader
          title={route.title}
          description="Page-state preview · your saved demo records are unchanged."
        />
        <section className="v-panel p-6">
          {scenario === "empty" ? (
            <Empty
              title="No records yet"
              description="New records will appear here when you add them."
            />
          ) : scenario === "loading" ? (
            <p
              role="status"
              className="animate-pulse py-12 text-center v-muted"
            >
              Loading records…
            </p>
          ) : (
            <div role="alert" className="space-y-3 py-8 text-center">
              <h2 className="font-semibold">
                {scenario === "denied"
                  ? "Access restricted"
                  : "Unable to load records"}
              </h2>
              <p className="text-sm v-muted">
                {scenario === "denied"
                  ? "Your current role does not have access to this operation."
                  : "This is a simulated request failure. Retry to restore your saved demo."}
              </p>
            </div>
          )}
          <button className="v-button" onClick={() => setScenario("normal")}>
            {scenario === "error" ? "Retry" : "Restore demo records"}
          </button>
        </section>
      </AdminPage>
    );
  const row = route.id
    ? state[route.entity]?.find((r) => r.id === route.id)
    : null;
  if (route.id && !row)
    return (
      <AdminPage>
        <Empty
          title="Record not found"
          description="This demo record may have been reset, or the link is invalid."
        />
        <Link href={BASE} className="v-button">
          Back to dashboard
        </Link>
      </AdminPage>
    );
  let rows =
    route.entity && Array.isArray(state[route.entity])
      ? state[route.entity]
      : [];
  if (route.filter === "wallet")
    rows = rows.filter((r) => r.destination === "Wallet");
  if (route.filter === "unmatched") rows = rows.filter((r) => !r.matched);
  if (["Recharge", "Bill"].includes(route.filter))
    rows = rows.filter((r) => r.type === route.filter);
  if (route.entity === "accounts" && ownerType)
    rows = rows.filter((r) => r.type === ownerType);
  if (route.inventory && stockFilter)
    rows = rows.filter((r) =>
      stockFilter === "out" ? r.stock === 0 : r.stock > 0 && r.stock <= 8,
    );
  const description =
    route.entity === "withdrawals"
      ? "Reserve, review and simulate payouts. Approval alone does not transfer funds."
      : route.entity === "entries"
        ? "Immutable credits and debits, linked to their source records."
        : route.entity === "cashback"
          ? "Promotional credits stay separate from cash and vendor earnings."
          : "Connected sample records. Changes stay in this browser and can be reset at any time.";
  const createAllowed = route.entity && canManage(state.role, route.entity);
  return (
    <AdminPage>
      {storageError && (
        <p role="status" className="v-error">
          {storageError}
        </p>
      )}
      <AdminPageHeader
        title={route.title}
        description={description}
        action={
          route.create && createAllowed ? (
            <button onClick={() => setCreate(true)} className="v-button">
              <LuPlus /> Add{" "}
              {route.entity === "withdrawals"
                ? "request"
                : route.entity === "refunds"
                  ? "refund"
                  : "record"}
            </button>
          ) : route.addHref && createAllowed ? (
            <Link className="v-button" href={`${BASE}${route.addHref}`}>
              <LuPlus /> Add new
            </Link>
          ) : undefined
        }
      />
      {pathname.startsWith(`${BASE}/wallet`) && (
        <nav aria-label="Wallet navigation" className="flex flex-wrap gap-2">
          {[
            ["Overview", ""],
            ["Accounts", "/accounts"],
            ["Transactions", "/transactions"],
            ["Withdrawals", "/withdrawals"],
            ["Reports", "/reports"],
          ].map(([label, suffix]) => (
            <Link
              key={label}
              className={`v-button ${pathname === `${BASE}/wallet${suffix}` ? "" : "secondary"}`}
              href={`${BASE}/wallet${suffix}`}
              aria-current={
                pathname === `${BASE}/wallet${suffix}` ? "page" : undefined
              }
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
      {route.view === "dashboard" && <Dashboard />}
      {route.view === "wallet" && <WalletOverview />}
      {route.view === "walletReport" && <WalletOverview report />}
      {["finance", "financeReport"].includes(route.view) && (
        <Finance report={route.view === "financeReport"} />
      )}
      {route.view === "services" && (
        <>
          <Cards
            items={[
              ["Service transactions", state.services.length],
              [
                "Completed",
                state.services.filter((s) => s.status === "Completed").length,
              ],
              [
                "Processing",
                state.services.filter((s) => s.status === "Processing").length,
              ],
              [
                "Failed / refunded",
                state.services.filter((s) =>
                  ["Failed", "Refunded"].includes(s.status),
                ).length,
              ],
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SectionLink
              href="/services/recharges"
              title="Mobile & DTH recharge"
            >
              Review recharge requests and provider outcomes.
            </SectionLink>
            <SectionLink href="/services/bills" title="Bill payments">
              Electricity, broadband and related transactions.
            </SectionLink>
          </div>
          <Records entity="services" title="All service transactions" />
        </>
      )}
      {route.view === "roles" && <Roles />}
      {route.view === "list" && (
        <>
          {route.entity === "accounts" && (
            <label className="block max-w-xs text-sm">
              Account type
              <select
                className="v-input mt-2"
                value={ownerType}
                onChange={(e) => setOwnerType(e.target.value)}
              >
                <option value="">All accounts</option>
                <option>Customer</option>
                <option>Vendor</option>
              </select>
            </label>
          )}
          {route.inventory && (
            <label className="block max-w-xs text-sm">
              Stock availability
              <select
                className="v-input mt-2"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">All stock levels</option>
                <option value="low">Low stock (1–8)</option>
                <option value="out">Out of stock</option>
              </select>
            </label>
          )}
          <Records
            key={pathname}
            entity={route.entity}
            rows={rows}
            title={route.title}
            initialQuery={search.get("q") || ""}
          />
        </>
      )}
      {route.view === "detail" && <Detail route={route} row={row} />}{" "}
      {route.view === "form" && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="v-panel p-6">
            <DemoForm
              key={pathname}
              entity={route.entity}
              record={row || {}}
              redirect={route.entity !== "policies"}
            />
          </section>
          <aside className="v-panel h-fit p-6">
            <h2 className="font-semibold">
              {row ? "Current preview" : "Publishing checklist"}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 v-muted">
              {row?.content ||
                "Use a clear name and complete the required fields. Your saved record appears immediately in the relevant list and detail pages. Sample content is never published to the customer storefront."}
            </p>
          </aside>
        </div>
      )}
      {route.view === "settings" && (
        <section className="v-panel max-w-2xl p-6">
          <DemoForm
            key={pathname}
            action="saveSettings"
            entity={route.entity}
            record={
              route.entity === "profile"
                ? state.profile
                : {
                    ...state.settings,
                    walletSettings: route.form === "walletSettings",
                  }
            }
          />
          {route.form === "walletSettings" && (
            <p className="mt-5 text-sm v-muted">
              Withdrawal review is mandatory in this demo. Cashback percentage
              is a saved rule setting; rewards are issued explicitly from the
              cashback page.
            </p>
          )}
        </section>
      )}
      {create && (
        <Modal
          title={`Add ${route.entity === "withdrawals" ? "withdrawal request" : "demo record"}`}
          close={() => setCreate(false)}
        >
          <DemoForm
            entity={route.entity}
            action={route.create}
            onDone={() => setCreate(false)}
          />
        </Modal>
      )}
    </AdminPage>
  );
}
export function DemoToolbar({ enabled, setEnabled }) {
  const { state, reset, scenario, setScenario } = useDemo();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <div className="demo-toolbar v-no-print flex flex-wrap items-center justify-between gap-3 border-b border-[var(--v-border)] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          <strong>{enabled ? "Demo workspace" : "Existing workspace"}</strong>
          <span className="v-muted">
            {enabled
              ? "Sample data · no real payments"
              : "Existing pages may use live APIs"}
          </span>
          {enabled && (
            <Link href={`${BASE}/settings/roles`} className="demo-link">
              {state?.role || "Loading…"}
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {enabled && (
            <select
              aria-label="Preview page state"
              className="v-input !w-auto !min-h-8 !py-1 !text-xs"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
            >
              <option value="normal">Normal state</option>
              <option value="empty">Empty state</option>
              <option value="loading">Loading state</option>
              <option value="error">Error state</option>
              <option value="denied">Access denied</option>
            </select>
          )}
          {enabled && (
            <button
              className="inline-flex items-center gap-1 text-xs v-muted"
              disabled={!state}
              onClick={() => setConfirm(true)}
            >
              <LuRefreshCw /> Reset demo
            </button>
          )}
          <button
            className="text-xs demo-link"
            onClick={() => setEnabled(!enabled)}
          >
            {enabled ? "Exit demo" : "Enter demo"}
          </button>
        </div>
      </div>
      {confirm && (
        <Modal title="Reset demo workspace?" close={() => setConfirm(false)}>
          <p className="text-sm leading-6 v-muted">
            This removes changes made to sample records in this browser and
            restores the original demo. Real business data is unaffected.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              className="v-button"
              onClick={() => {
                reset();
                setScenario("normal");
                setConfirm(false);
              }}
            >
              Reset sample data
            </button>
            <button
              className="v-button secondary"
              onClick={() => setConfirm(false)}
            >
              Keep changes
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
