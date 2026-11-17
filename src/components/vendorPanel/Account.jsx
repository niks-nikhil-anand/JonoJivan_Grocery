"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuPlus,
  LuWallet,
  LuClock,
  LuCheck,
  LuShieldCheck,
} from "react-icons/lu";
import {
  api,
  useData,
  DataState,
  PageHeader,
  Field,
  Notice,
  Stat,
  ListTable,
  Badge,
  money,
  date,
  base,
} from "./ui";
import { ProductImage } from "./Commerce";
import { ThemePicker } from "./VendorShell";

export function Profile() {
  const state = useData("profile");
  return (
    <DataState state={state}>
      {state.data && <ProfileEditor user={state.data} />}
    </DataState>
  );
}
function ProfileEditor({ user }) {
  const [form, setForm] = useState({
      fullName: user.fullName,
      mobileNumber: user.mobileNumber || "",
      businessName: user.vendorProfile?.businessName || "",
      businessAddress: user.vendorProfile?.businessAddress || "",
      shopPhotoUrl: user.vendorProfile?.shopPhotoUrl || "",
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const router = useRouter();
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api("profile", { method: "PATCH", body: JSON.stringify(form) });
      setSuccess("Profile saved.");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function uploadShop(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      data.set("file", file);
      const result = await api("uploads", { method: "POST", body: data });
      setForm((current) => ({ ...current, shopPhotoUrl: result.url }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const input = (key, required = false) => (
    <input
      required={required}
      maxLength={key === "mobileNumber" ? 20 : 200}
      className="v-input"
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
    />
  );
  const documents = [
    ["Aadhaar card", "aadhaarCardUrl"],
    ["PAN card", "panCardUrl"],
    ["Bank passbook", "bankPassbookUrl"],
    ["MSME certificate", "msmeCertificateUrl"],
    ["GST certificate", "gstCertificateUrl"],
    ["Trade licence", "tradeLicenceUrl"],
  ];
  return (
    <>
      <PageHeader
        title="Profile & business"
        description="Your details, business information, and verification status."
      />
      <Notice error={error} success={success} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <form className="v-panel space-y-5 p-5 sm:p-7" onSubmit={save}>
          <h2 className="text-lg font-semibold">Personal information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name *">{input("fullName", true)}</Field>
            <Field label="Mobile number">{input("mobileNumber")}</Field>
          </div>
          <Field
            label="Email address"
            hint="Contact support to change your sign-in email."
          >
            <input className="v-input opacity-75" readOnly value={user.email} />
          </Field>
          <h2 className="border-t pt-5 text-lg font-semibold v-border">
            Business information
          </h2>
          <Field
            label="Shop photo"
            hint="JPG, PNG, or WebP under 5 MB. Save changes after uploading."
          >
            {form.shopPhotoUrl && (
              <span className="mb-3 block max-w-40">
                <ProductImage src={form.shopPhotoUrl} name="Your shop" large />
              </span>
            )}
            <input
              className="v-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={uploadShop}
            />
          </Field>
          <Field label="Business name">{input("businessName")}</Field>
          <Field label="Business address">
            <textarea
              rows={4}
              maxLength={1000}
              className="v-input"
              value={form.businessAddress}
              onChange={(e) =>
                setForm({ ...form, businessAddress: e.target.value })
              }
            />
          </Field>
          <button className="v-button" disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
        <div className="space-y-5">
          <section className="v-panel p-5">
            <LuShieldCheck size={28} className="v-green" aria-hidden />
            <h2 className="mt-3 font-semibold">Business verification</h2>
            <div className="mt-3">
              <Badge value={user.vendorProfile?.status || "PENDING"} />
            </div>
            <p className="mt-3 text-sm leading-6 v-muted">
              Your business verification is reviewed by the JonoJivan team.
              Account access and business verification are separate.
            </p>
          </section>
          <section className="v-panel p-5">
            <h2 className="font-semibold">Business documents</h2>
            <ul className="mt-3 divide-y v-border">
              {documents.map(([name, key]) => (
                <li
                  key={key}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span>{name}</span>
                  <span className="text-xs v-muted">
                    {user.vendorProfile?.[key] ? "On file" : "Not submitted"}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              className="v-link mt-3 inline-block text-sm"
              href={`${base}/tickets/new`}
            >
              Request a document update →
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
export function Settings() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  async function save(e) {
    e.preventDefault();
    const form = e.currentTarget,
      body = Object.fromEntries(new FormData(form));
    setError("");
    setSuccess("");
    if (body.password !== body.confirm) {
      setError("The new passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await api("password", { method: "POST", body: JSON.stringify(body) });
      form.reset();
      setSuccess("Your password has been changed.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Settings"
        description="Make this workspace yours and keep your account secure."
      />
      <Notice error={error} success={success} />
      <section className="v-panel flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="mt-2 text-sm v-muted">
            Choose light, dark, or follow your device. Saved for this browser.
          </p>
        </div>
        <ThemePicker />
      </section>
      <form onSubmit={save} className="v-panel max-w-2xl space-y-5 p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <Field label="Current password">
          <input
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="v-input"
          />
        </Field>
        <Field
          label="New password"
          hint="Use at least 10 characters; maximum 72 bytes."
        >
          <input
            name="password"
            type="password"
            required
            minLength={10}
            maxLength={72}
            autoComplete="new-password"
            className="v-input"
          />
        </Field>
        <Field label="Confirm new password">
          <input
            name="confirm"
            type="password"
            required
            minLength={10}
            maxLength={72}
            autoComplete="new-password"
            className="v-input"
          />
        </Field>
        <button disabled={busy} className="v-button">
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}
const ticketColumns = [
  {
    title: "Ticket",
    render: (t) => (
      <Link className="v-link" href={`${base}/tickets/${t.id}`}>
        {t.subject}
      </Link>
    ),
  },
  { title: "Category", render: (t) => t.category },
  { title: "Status", render: (t) => <Badge value={t.status} /> },
  { title: "Updated", render: (t) => date(t.updatedAt) },
];
export function Tickets() {
  const state = useData("tickets");
  return (
    <DataState state={state}>
      <PageHeader
        title="Support tickets"
        description="A helping hand for your store. Keep every conversation in one place."
        action={
          <Link className="v-button" href={`${base}/tickets/new`}>
            <LuPlus />
            New ticket
          </Link>
        }
      />
      <ListTable
        rows={state.data || []}
        columns={ticketColumns}
        searchText={(t) => `${t.subject} ${t.category}`}
        statuses={["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]}
        emptyTitle="How can we help?"
        emptyDescription="Create a ticket for questions about products, orders, payments, or your account."
      />
    </DataState>
  );
}
export function NewTicket() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const t = await api("tickets", {
        method: "POST",
        body: JSON.stringify(body),
      });
      router.push(`${base}/tickets/${t.id}`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title="New support ticket"
        parent={{ href: `${base}/tickets`, label: "Support tickets" }}
        description="Tell us what happened and how we can help."
      />
      <form
        onSubmit={submit}
        className="v-panel max-w-3xl space-y-5 p-5 sm:p-7"
      >
        <Notice error={error} />
        <Field label="Subject *">
          <input
            className="v-input"
            required
            name="subject"
            maxLength={200}
            placeholder="A short summary of your question"
          />
        </Field>
        <Field label="Category *">
          <select className="v-input" required name="category">
            <option value="">Choose a category</option>
            {["Orders", "Products", "Payments", "Account", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Message *"
          hint="Include relevant order or product references. Never include passwords or bank credentials."
        >
          <textarea
            className="v-input"
            required
            name="message"
            rows={7}
            maxLength={5000}
          />
        </Field>
        <div className="flex flex-wrap gap-3">
          <button className="v-button" disabled={busy}>
            {busy ? "Creating ticket…" : "Create ticket"}
          </button>
          <Link className="v-button secondary" href={`${base}/tickets`}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
export function TicketDetail({ id }) {
  const state = useData(`tickets/${id}`),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const t = state.data;
  async function reply(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    try {
      await api(`tickets/${id}`, {
        method: "POST",
        body: JSON.stringify({ message: new FormData(form).get("message") }),
      });
      form.reset();
      state.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DataState state={state}>
      {t && (
        <>
          <PageHeader
            title={t.subject}
            description={`${t.category} · Created ${date(t.createdAt)}`}
            parent={{ href: `${base}/tickets`, label: "Support tickets" }}
            action={<Badge value={t.status} />}
          />
          <Notice error={error} />
          <section className="v-panel max-w-4xl space-y-5 p-5 sm:p-7">
            <h2 className="font-semibold">Conversation</h2>
            {t.messages.map((m, i) => (
              <article key={i} className="rounded-xl p-4 v-soft">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{m.author}</h3>
                  <time className="text-xs v-muted" dateTime={m.at}>
                    {date(m.at)}
                  </time>
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">
                  {m.body}
                </p>
              </article>
            ))}
            {t.status !== "CLOSED" ? (
              <form
                onSubmit={reply}
                className="space-y-4 border-t pt-5 v-border"
              >
                <Field label="Add a reply">
                  <textarea
                    required
                    name="message"
                    rows={4}
                    maxLength={5000}
                    className="v-input"
                  />
                </Field>
                <button className="v-button" disabled={busy}>
                  {busy ? "Sending…" : "Send reply"}
                </button>
              </form>
            ) : (
              <p className="text-sm v-muted">
                This ticket is closed. Create a new ticket if you need more
                help.
              </p>
            )}
          </section>
        </>
      )}
    </DataState>
  );
}
const ledgerColumns = [
  {
    title: "Reference",
    render: (r) => <span className="font-medium">{r.reference}</span>,
  },
  { title: "Description", render: (r) => r.label },
  { title: "Date", render: (r) => date(r.createdAt) },
  { title: "Amount", render: (r) => money(r.amount) },
];
const withdrawalColumns = [
  {
    title: "Request",
    render: (r) => (
      <span title={r.id} className="font-mono text-xs">
        {r.id.slice(-10)}
      </span>
    ),
  },
  { title: "Amount", render: (r) => money(r.amount) },
  { title: "UPI ID", render: (r) => r.destination },
  { title: "Status", render: (r) => <Badge value={r.status} /> },
  { title: "Requested", render: (r) => date(r.createdAt) },
];
export function Wallet({ view = "overview" }) {
  const state = useData("wallet"),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false);
  const w = state.data;
  async function withdraw(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await api("withdrawals", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      form.reset();
      setSuccess(
        "Withdrawal requested. Your funds are reserved while the team reviews the request.",
      );
      state.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DataState state={state}>
      {w && (
        <>
          <PageHeader
            title={
              view === "transactions"
                ? "Transactions"
                : view === "withdrawals"
                  ? "Withdraw funds"
                  : "Your wallet"
            }
            description="Settled earnings and payout requests, all in one place."
            action={
              view === "overview" && (
                <Link className="v-button" href={`${base}/wallet/withdrawals`}>
                  Request withdrawal
                </Link>
              )
            }
          />
          <nav aria-label="Wallet sections" className="flex flex-wrap gap-2">
            {[
              ["Overview", "", "overview"],
              ["Transactions", "/transactions", "transactions"],
              ["Withdrawals", "/withdrawals", "withdrawals"],
            ].map(([name, path, key]) => (
              <Link
                aria-current={view === key ? "page" : undefined}
                className={`v-button ${view === key ? "" : "secondary"}`}
                key={key}
                href={`${base}/wallet${path}`}
              >
                {name}
              </Link>
            ))}
          </nav>
          <Notice error={error} success={success} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              title="Available balance"
              value={money(w.available)}
              hint="Settled funds ready to request"
              icon={LuWallet}
            />
            <Stat
              title="Pending withdrawals"
              value={money(w.pending)}
              hint="Reserved for payout review"
              icon={LuClock}
            />
            <Stat
              title="Paid out"
              value={money(w.paid)}
              hint="Completed withdrawals"
              icon={LuCheck}
            />
          </div>
          <p className="rounded-xl p-4 text-sm leading-6 v-soft v-muted">
            Balances reflect posted settlement entries, not gross order sales.
            Withdrawals are reviewed by the team; submitting a request does not
            transfer funds.
          </p>
          {view === "withdrawals" ? (
            <>
              <form
                onSubmit={withdraw}
                className="v-panel max-w-2xl space-y-5 p-6"
              >
                <h2 className="text-lg font-semibold">Request a payout</h2>
                <Field
                  label="Amount (₹)"
                  hint={`Available: ${money(w.available)}`}
                >
                  <input
                    name="amount"
                    type="number"
                    required
                    min="1"
                    max={Math.max(0, w.available)}
                    step="0.01"
                    className="v-input"
                  />
                </Field>
                <Field
                  label="UPI ID"
                  hint="Double-check your payout destination before submitting."
                >
                  <input
                    name="destination"
                    required
                    maxLength={150}
                    pattern="[a-zA-Z0-9._\-]{2,}@[a-zA-Z]{2,}"
                    placeholder="yourname@bank"
                    className="v-input"
                  />
                </Field>
                <button className="v-button" disabled={busy || w.available < 1}>
                  {busy ? "Submitting…" : "Request withdrawal"}
                </button>
                {w.available < 1 && (
                  <p className="text-sm v-muted">
                    A settled balance of at least ₹1 is needed to request a
                    withdrawal.
                  </p>
                )}
              </form>
              <h2 className="text-lg font-semibold">Withdrawal history</h2>
              <ListTable
                rows={w.withdrawals}
                columns={withdrawalColumns}
                searchText={(r) => `${r.id} ${r.destination}`}
                statuses={["PENDING", "PAID", "REJECTED"]}
                dateKey="createdAt"
                emptyTitle="No withdrawal requests"
                emptyDescription="Your requests and their status will appear here."
              />
            </>
          ) : (
            <ListTable
              rows={w.entries}
              columns={ledgerColumns}
              searchText={(r) => `${r.reference} ${r.label}`}
              dateKey="createdAt"
              emptyTitle="No settlements yet"
              emptyDescription="When the team posts a settlement for your store, it appears here and updates your available balance."
            />
          )}
        </>
      )}
    </DataState>
  );
}
