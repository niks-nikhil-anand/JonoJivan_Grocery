import Razorpay from "razorpay";
import connectDB from "@/lib/dbConnect";
import RechargeTransaction from "@/models/rechargeTransaction";
import { submitRecharge, checkRechargeStatus } from "@/lib/linerpay";
import { commissionFor } from "@/lib/recharge/commission";

export const razorpay = () =>
  new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET });

const Tx = RechargeTransaction;
const load = (txnId) => Tx.findOne({ txnId });

/**
 * Payment verified → send the recharge exactly once.
 * The PAID → PROCESSING flip is atomic, so a double click, a retry or the
 * reconcile job racing the verify call can never trigger a second recharge.
 */
export async function processPaid(txnId) {
  await connectDB();
  const txn = await Tx.findOneAndUpdate(
    { txnId, status: "PAID" },
    { $set: { status: "PROCESSING", processingAt: new Date() } },
    { new: true }
  );
  if (!txn) return load(txnId); // someone else already took it

  try {
    return await applyResult(txnId, await submitRecharge(txn));
  } catch (err) {
    // Unknown outcome (timeout, 5xx…): stay PROCESSING and let status checks
    // decide. Never refund on an unknown — the recharge may have gone through.
    console.error("[recharge] submit uncertain", txnId, err.message);
    await Tx.updateOne({ txnId }, { $set: { message: "Waiting for operator confirmation" } });
    return load(txnId);
  }
}

/** Apply a provider result to a PROCESSING transaction. */
export async function applyResult(txnId, res) {
  const patch = { providerRef: res.providerRef, operatorRef: res.operatorRef, message: res.message || "" };
  Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

  if (res.status === "SUCCESS") {
    const txn = await Tx.findOne({ txnId, status: "PROCESSING" });
    const commission = txn ? commissionFor(txn.operator, txn.amount) : null;
    await Tx.updateOne(
      { txnId, status: "PROCESSING" },
      { $set: { ...patch, ...(commission || {}), status: "SUCCESS", completedAt: new Date() } }
    );
  } else if (res.status === "FAILED") {
    const moved = await Tx.updateOne({ txnId, status: "PROCESSING" }, { $set: { ...patch, status: "REFUND_PENDING" } });
    if (moved.modifiedCount) await refund(txnId);
  } else {
    await Tx.updateOne({ txnId, status: "PROCESSING" }, { $set: patch });
  }
  return load(txnId);
}

/** Refund a failed recharge to the original payment method (idempotent). */
export async function refund(txnId) {
  const txn = await Tx.findOne({ txnId, status: "REFUND_PENDING" });
  if (!txn || !txn.razorpayPaymentId) return txn;
  try {
    const r = await razorpay().payments.refund(txn.razorpayPaymentId, {
      amount: Math.round(txn.amount * 100),
      notes: { txnId, reason: "Recharge failed" },
      receipt: `refund_${txnId}`,
    });
    await Tx.updateOne({ txnId, status: "REFUND_PENDING" }, { $set: { status: "REFUNDED", refundId: r.id, completedAt: new Date() } });
  } catch (err) {
    // Razorpay says "already refunded" if a previous attempt went through.
    if (/already.*refund/i.test(err?.error?.description || err.message || "")) {
      await Tx.updateOne({ txnId, status: "REFUND_PENDING" }, { $set: { status: "REFUNDED", completedAt: new Date() } });
    } else {
      console.error("[recharge] refund failed, will retry", txnId, err?.error || err.message);
    }
  }
  return load(txnId);
}

/** Re-check the provider for a PROCESSING transaction (status page + reconcile). */
export async function refreshStatus(txnId) {
  await connectDB();
  const txn = await load(txnId);
  if (!txn) return null;
  if (txn.status === "REFUND_PENDING") return refund(txnId);
  if (txn.status !== "PROCESSING") return txn;
  // Don't hammer the provider if polled repeatedly.
  if (txn.lastCheckedAt && Date.now() - txn.lastCheckedAt.getTime() < 4000) return txn;
  await Tx.updateOne({ txnId }, { $set: { lastCheckedAt: new Date() }, $inc: { checkCount: 1 } });
  try {
    return await applyResult(txnId, await checkRechargeStatus(txn));
  } catch (err) {
    console.error("[recharge] status check failed", txnId, err.message);
    return load(txnId);
  }
}

/** Mark a CREATED order as paid (verified payment) and kick off the recharge. */
export async function markPaidAndProcess(razorpayOrderId, razorpayPaymentId) {
  await connectDB();
  const txn = await Tx.findOneAndUpdate(
    { razorpayOrderId, status: "CREATED" },
    { $set: { status: "PAID", razorpayPaymentId, paidAt: new Date() } },
    { new: true }
  );
  if (!txn) return Tx.findOne({ razorpayOrderId });
  return processPaid(txn.txnId);
}

/**
 * Sweep for stuck transactions. Run every few minutes from a cron
 * (see /api/recharge/reconcile).
 *  - CREATED > 3 min old: user may have paid but closed the tab → ask Razorpay.
 *  - PAID: verify finished but the recharge was never sent → send it.
 *  - PROCESSING / REFUND_PENDING: re-check / retry refund.
 */
export async function reconcile() {
  await connectDB();
  const out = { paidRecovered: 0, processed: 0, refreshed: 0, stuck: 0 };
  const now = Date.now();

  const created = await Tx.find({
    status: "CREATED",
    createdAt: { $lt: new Date(now - 3 * 60 * 1000), $gt: new Date(now - 24 * 3600 * 1000) },
  }).limit(50);
  for (const t of created) {
    try {
      const pays = await razorpay().orders.fetchPayments(t.razorpayOrderId);
      const captured = pays.items?.find((p) => p.status === "captured");
      if (captured) {
        await markPaidAndProcess(t.razorpayOrderId, captured.id);
        out.paidRecovered++;
      }
    } catch (e) {
      console.error("[reconcile] fetchPayments", t.txnId, e?.error || e.message);
    }
  }

  for (const t of await Tx.find({ status: "PAID", paidAt: { $lt: new Date(now - 60 * 1000) } }).limit(50)) {
    await processPaid(t.txnId);
    out.processed++;
  }

  for (const t of await Tx.find({ status: { $in: ["PROCESSING", "REFUND_PENDING"] } }).limit(100)) {
    await refreshStatus(t.txnId);
    out.refreshed++;
    if (t.status === "PROCESSING" && t.processingAt && now - t.processingAt.getTime() > 30 * 60 * 1000) out.stuck++;
  }
  return out;
}

/** Fields safe to send to the browser. */
export function publicView(t) {
  if (!t) return null;
  const n = t.number;
  return {
    txnId: t.txnId,
    type: t.type,
    operator: t.operator,
    circle: t.circle,
    number: n.length > 4 ? `${n.slice(0, 2)}${"•".repeat(n.length - 4)}${n.slice(-2)}` : n,
    amount: t.amount,
    planLabel: t.planLabel,
    status: t.status,
    state: t.status === "SUCCESS" ? "success" : t.status === "REFUND_PENDING" || t.status === "REFUNDED" ? "failed" : t.status === "CREATED" ? "pending" : "processing",
    refunded: t.status === "REFUNDED",
    createdAt: t.createdAt,
  };
}
