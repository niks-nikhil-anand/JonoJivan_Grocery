"use client";
import { useState } from "react";
import Link from "next/link";
import { useDemo } from "./DemoProvider";
import { Modal } from "./Shared";
import { DemoForm } from "./Forms";
import { canManage } from "@/lib/admin/demo/store";
import { BASE, detailHref } from "@/lib/admin/demo/routes";
export function actionsFor(entity, row) {
  const result = [];
  const add = (label, type, status) => result.push({ label, type, status });
  if (entity === "withdrawals") {
    if (["Pending", "Approved"].includes(row.status)) {
      add(
        row.status === "Pending" ? "Approve" : "Start payout",
        "transitionWithdrawal",
        row.status === "Pending" ? "Approved" : "Processing",
      );
      add("Reject", "transitionWithdrawal", "Rejected");
    }
    if (row.status === "Processing") {
      add("Simulate paid", "transitionWithdrawal", "Paid");
      add("Simulate final failure", "transitionWithdrawal", "Failed");
    }
  }
  if (entity === "refunds" && row.status === "Pending") {
    add("Complete refund", "resolveRefund", "Completed");
    add("Reject refund", "resolveRefund", "Rejected");
  }
  if (
    ["topups", "adjustments", "cashback"].includes(entity) &&
    row.status === "Pending"
  ) {
    add(
      entity === "topups"
        ? "Confirm payment"
        : entity === "cashback"
          ? "Award credit"
          : "Approve adjustment",
      "resolveCredit",
      entity === "cashback" ? "Earned" : "Completed",
    );
    add(
      entity === "topups" ? "Simulate failure" : "Reject",
      "resolveCredit",
      entity === "topups" ? "Failed" : "Rejected",
    );
  }
  if (entity === "cashback" && row.status === "Earned")
    add("Expire credit", "expireCashback");
  if (entity === "accounts")
    add(
      row.status === "Active" ? "Freeze account" : "Unfreeze account",
      "freeze",
    );
  if (entity === "settlements" && row.status === "Draft")
    add("Post earnings", "postSettlement");
  if (entity === "payments" && !row.matched)
    add("Mark matched", "matchPayment");
  if (entity === "entries" && row.kind === "Adjustment")
    add("Reverse adjustment", "reverseEntry");
  const options = {
    orders: {
      Pending: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: ["Returned"],
    },
    vendors: {
      Pending: ["Active", "Rejected"],
      Active: ["Suspended"],
      Suspended: ["Active"],
    },
    customers: { Active: ["Suspended"], Suspended: ["Active"] },
    tickets: { Open: ["Resolved"], Resolved: ["Open"] },
    messages: { Unread: ["Read"], Read: ["Unread"] },
    notifications: { Unread: ["Read"], Read: ["Unread"] },
    reviews: {
      Pending: ["Published", "Hidden"],
      Published: ["Hidden"],
      Hidden: ["Published"],
    },
    returns: {
      Pending: ["Approved", "Rejected"],
      Approved: ["Received"],
      Received: ["Completed"],
    },
    rationCards: { Pending: ["Approved", "Rejected"] },
    services: { Processing: ["Completed", "Failed"] },
    products: { Active: ["Archived"], Archived: ["Active"] },
    categories: { Active: ["Archived"], Archived: ["Active"] },
  };
  (options[entity]?.[row.status] || []).forEach((status) =>
    add(`Mark ${status.toLowerCase()}`, "status", status),
  );
  return result;
}
export function RowActions({ entity, row }) {
  const { state, dispatch } = useDemo();
  const [selected, setSelected] = useState(null),
    [error, setError] = useState("");
  const allowed = canManage(state.role, entity),
    href = detailHref(entity, row.id);
  const options = allowed ? actionsFor(entity, row) : [];
  const editable =
    ["expenses", "coupons", "banners", "tickets"].includes(entity) && allowed;
  function submit(event) {
    event.preventDefault();
    setError("");
    try {
      dispatch({
        type: selected.type,
        entity,
        id: row.id,
        payload: {
          status: selected.status,
          reason: new FormData(event.currentTarget).get("reason"),
        },
      });
      setSelected(null);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {href && (
        <Link
          className="v-button secondary !min-h-9 !px-3 !py-1 text-xs"
          href={href}
        >
          Details
        </Link>
      )}
      {["products", "categories", "blogs"].includes(entity) && allowed && (
        <Link className="demo-link text-xs" href={`${href}/edit`}>
          Edit
        </Link>
      )}
      {row.href && (
        <Link className="demo-link text-xs" href={`${BASE}${row.href}`}>
          Open
        </Link>
      )}
      {(options.length > 0 || editable) && (
        <select
          aria-label={`Action for ${row.id}`}
          className="v-input !w-auto !min-h-9 !py-1 text-xs"
          value=""
          onChange={(e) => {
            setError("");
            setSelected(
              e.target.value === "edit"
                ? { type: "edit", label: `Edit ${row.id}` }
                : options[Number(e.target.value)],
            );
          }}
        >
          <option value="" disabled>
            Actions…
          </option>
          {options.map((o, i) => (
            <option key={o.label} value={i}>
              {o.label}
            </option>
          ))}
          {editable && <option value="edit">Edit record</option>}
        </select>
      )}
      {!href && !options.length && !editable && !row.href && (
        <span className="text-xs v-muted">
          {allowed ? "Recorded" : "Read only"}
        </span>
      )}
      {selected && (
        <Modal title={selected.label} close={() => setSelected(null)}>
          {selected.type === "edit" ? (
            <DemoForm
              entity={entity}
              record={row}
              onDone={() => setSelected(null)}
            />
          ) : (
            <form className="space-y-5" onSubmit={submit}>
              <p className="text-sm v-muted">
                Update <strong>{row.id}</strong> in the demo workspace.{" "}
                {selected.type === "transitionWithdrawal" &&
                selected.status === "Paid"
                  ? "This simulates a confirmed payout. No money will be transferred."
                  : "Related summaries and audit history will update immediately."}
              </p>
              {error && (
                <p role="alert" className="v-error">
                  {error}
                </p>
              )}
              <label className="block space-y-2 text-sm font-medium">
                <span>Reason / review note</span>
                <textarea
                  name="reason"
                  className="v-input"
                  required
                  rows={3}
                  maxLength={500}
                />
              </label>
              <div className="flex gap-3">
                <button className="v-button">Confirm demo action</button>
                <button
                  type="button"
                  className="v-button secondary"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
