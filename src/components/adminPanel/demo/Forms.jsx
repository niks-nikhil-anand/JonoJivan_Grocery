"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "./DemoProvider";
import { BASE, listPaths } from "@/lib/admin/demo/routes";
import { canManage, money } from "@/lib/admin/demo/store";
const field = (key, label, type = "text", extra = {}) => ({
  key,
  label,
  type,
  ...extra,
});
export function formFields(state, entity, action = "save", record = {}) {
  const options = (key, label = "name") =>
    state[key].map((r) => [r.id, r[label] || r.id]);
  const wallets = (type) =>
    state.accounts
      .filter((a) => !type || a.type === type)
      .map((a) => [a.id, `${a.name} · ${a.type}`]);
  const amount = field("amount", "Amount (₹)", "number", {
    min: "0.01",
    step: "0.01",
  });
  const reason = field("reason", "Reason / note", "textarea");
  if (action === "createWithdrawal")
    return [
      field("walletId", "Vendor wallet", "select", {
        options: wallets("Vendor"),
      }),
      amount,
      field("destination", "Demo UPI destination", "text", {
        placeholder: "vendor@example",
      }),
    ];
  if (action === "createRefund")
    return [
      field("paymentId", "Original payment", "select", {
        options: state.payments.map((p) => [
          p.id,
          `${p.id} · ${money(p.amount)}`,
        ]),
      }),
      amount,
      field("destination", "Refund destination", "select", {
        options: [
          ["Wallet", "Wallet"],
          ["Original payment", "Original payment"],
        ],
      }),
      reason,
    ];
  if (["createTopup", "createAdjustment", "createCashback"].includes(action))
    return [
      field("walletId", "Wallet account", "select", {
        options: wallets(
          action === "createAdjustment" ? undefined : "Customer",
        ),
      }),
      ...(action === "createAdjustment"
        ? [
            field("direction", "Adjustment direction", "select", {
              options: [
                ["Credit", "Credit"],
                ["Debit", "Debit"],
              ],
            }),
          ]
        : []),
      amount,
      reason,
    ];
  if (action === "saveSettings") {
    if (entity === "profile")
      return [field("name", "Display name"), field("email", "Email", "email")];
    if (record.walletSettings)
      return [
        field("withdrawalMinimum", "Minimum withdrawal (₹)", "number", {
          min: "0.01",
          step: "0.01",
        }),
        field("withdrawalMaximum", "Maximum withdrawal (₹)", "number", {
          min: "0.01",
          step: "0.01",
        }),
        field("cashbackPercent", "Default cashback (%)", "number", {
          min: "0",
          max: "100",
          step: "0.1",
        }),
      ];
    return [
      field("name", "Store name"),
      field("email", "Support email", "email"),
    ];
  }
  if (entity === "products")
    return [
      field("name", "Product name"),
      field("categoryId", "Category", "select", {
        options: options("categories"),
      }),
      field("vendorId", "Vendor", "select", { options: options("vendors") }),
      field("price", "Price (₹)", "number", { min: "0.01", step: "0.01" }),
      field("stock", "Stock quantity", "number", { min: "0", step: "1" }),
    ];
  if (entity === "categories")
    return [
      field("name", "Category name"),
      field("parentId", "Parent category", "select", {
        optional: true,
        options: [
          ["", "None — top level"],
          ...options("categories").filter(([id]) => id !== record.id),
        ],
      }),
    ];
  if (entity === "blogs" || entity === "banners")
    return [
      field("name", "Title"),
      field("content", "Content", "textarea"),
      field("status", "Publication status", "select", {
        options: [
          ["Draft", "Draft"],
          [
            entity === "blogs" ? "Published" : "Active",
            entity === "blogs" ? "Published" : "Active",
          ],
        ],
      }),
    ];
  if (entity === "expenses")
    return [field("name", "Expense description"), amount];
  if (entity === "coupons")
    return [
      field("name", "Coupon code"),
      field("discount", "Discount (%)", "number", { min: "1", max: "100" }),
      field("limit", "Maximum uses", "number", { min: "1" }),
      field("expiresAt", "Expiry date", "date"),
    ];
  if (entity === "reviews")
    return [
      field("name", "Review text", "textarea"),
      field("productId", "Product", "select", { options: options("products") }),
      field("customerId", "Customer", "select", {
        options: options("customers"),
      }),
      field("rating", "Rating (1–5)", "number", { min: "1", max: "5" }),
    ];
  if (entity === "tickets")
    return [
      field("name", "Subject"),
      field("ownerId", "Customer / vendor", "select", {
        options: [...options("customers"), ...options("vendors")],
      }),
      field("priority", "Priority", "select", {
        options: [
          ["Normal", "Normal"],
          ["High", "High"],
        ],
      }),
      field("assignee", "Assigned team", "select", {
        options: [
          ["Support", "Support"],
          ["Finance", "Finance"],
        ],
      }),
    ];
  if (entity === "returns")
    return [
      field("orderId", "Order", "select", {
        options: state.orders
          .filter((o) => ["Delivered", "Returned"].includes(o.status))
          .map((o) => [o.id, o.id]),
      }),
      reason,
    ];
  if (entity === "policies")
    return [field("content", "Policy content", "textarea")];
  return [];
}
export function DemoForm({
  entity,
  action = "save",
  record = {},
  onDone,
  redirect = false,
}) {
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const submissionKey = useRef(null);
  const fields = formFields(state, entity, action, record);
  const allowed = canManage(state.role, entity);
  function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget));
      if (!submissionKey.current) submissionKey.current = crypto.randomUUID();
      dispatch({
        type: action,
        entity,
        id: record.id,
        payload,
        key: submissionKey.current,
      });
      if (record.id || action === "saveSettings") submissionKey.current = null;
      setSuccess("Saved to your demo workspace.");
      if (onDone) onDone();
      if (redirect) router.push(`${BASE}${listPaths[entity] || ""}`);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <form className="space-y-5" onSubmit={submit}>
      {!allowed && (
        <p className="v-error">
          Your preview role has read-only access to this form.
        </p>
      )}
      {error && (
        <p role="alert" className="v-error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-xl p-3 v-soft v-green">
          {success}
        </p>
      )}
      {fields.map((f) => {
        let value =
          record[f.key] ?? (f.type === "select" ? f.options?.[0]?.[0] : "");
        if (
          [
            "amount",
            "price",
            "withdrawalMinimum",
            "withdrawalMaximum",
          ].includes(f.key) &&
          record[f.key] !== undefined
        )
          value = record[f.key] / 100;
        const props = {
          id: `field-${f.key}`,
          "aria-label": f.label,
          name: f.key,
          required: !f.optional,
          disabled: !allowed,
          defaultValue: value,
          className: "v-input",
          min: f.min,
          max: f.max,
          step: f.step,
          placeholder: f.placeholder,
          maxLength: f.type === "textarea" ? 10000 : 250,
        };
        return (
          <label
            key={f.key}
            className="block space-y-2 text-sm font-medium"
            htmlFor={`field-${f.key}`}
          >
            <span>
              {f.label}
              {f.optional ? <span className="v-muted"> · optional</span> : ""}
            </span>
            {f.type === "textarea" ? (
              <textarea {...props} rows={entity === "policies" ? 12 : 5} />
            ) : f.type === "select" ? (
              <select {...props}>
                {f.options.map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <input {...props} type={f.type} />
            )}
          </label>
        );
      })}
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--v-border)] pt-5">
        <button className="v-button" disabled={!allowed}>
          Save demo {action === "saveSettings" ? "settings" : "record"}
        </button>
        <p className="text-xs v-muted">
          Only this browser’s sample data will change.
        </p>
      </div>
    </form>
  );
}
