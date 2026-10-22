"use client";
import { useEffect, useState } from "react";
import StatusView from "./StatusView";
import { getOperator, getDthOperator } from "@/config/recharge";

const POLL_MS = 4000;
const MAX_POLLS = 150; // ~10 minutes, then stop and tell the user it's still safe

/** Loads a real transaction and polls until it reaches a final state. */
export default function LiveStatus({ txnId }) {
  const [txn, setTxn] = useState(null);
  const [error, setError] = useState("");
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    let stop = false;
    let polls = 0;
    let timer;
    const tick = async () => {
      try {
        const res = await fetch(`/api/recharge/status/${txnId}`, { cache: "no-store" });
        if (res.status === 404) {
          // Right after paying, the record may not be readable for a moment.
          if (polls > 3) setError("We couldn't find this recharge.");
        } else {
          const data = await res.json();
          if (!stop && data.txn) setTxn(data.txn);
          if (data.txn && ["success", "failed"].includes(data.txn.state)) return;
        }
      } catch {
        /* transient — keep polling */
      }
      if (stop || error) return;
      if (++polls >= MAX_POLLS) return setGaveUp(true);
      timer = setTimeout(tick, POLL_MS);
    };
    tick();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txnId]);

  if (error) return <p className="mx-auto max-w-lg text-center text-sm text-ink-muted">{error} Reference: {txnId}</p>;
  if (!txn) return <StatusView state="processing" txnId={txnId} />;

  const op = txn.type === "dth" ? getDthOperator(txn.operator) : getOperator(txn.operator);
  const details = [
    [txn.type === "dth" ? "Customer ID" : "Number", txn.type === "dth" ? txn.number : `+91 ${txn.number}`],
    ["Operator", `${op?.name || txn.operator}${txn.circle ? ` · ${txn.circle}` : ""}`],
    ["Amount", `₹${txn.amount}`],
    ...(txn.planLabel ? [["Plan", txn.planLabel]] : []),
    ...(txn.refunded ? [["Refund", "Sent to your original payment method"]] : []),
  ];
  const state = txn.state === "pending" ? "processing" : txn.state;
  return (
    <>
      <StatusView state={state} txnId={txn.txnId} details={details} />
      {gaveUp && state === "processing" && (
        <p className="mx-auto mt-4 max-w-lg text-center text-xs text-ink-muted">
          This is taking longer than usual. Your payment is safe — the recharge will complete or be refunded automatically. Keep this reference: {txn.txnId}.
        </p>
      )}
    </>
  );
}
