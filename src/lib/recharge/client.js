"use client";

/**
 * Create an order, open Razorpay checkout, verify, return the txnId.
 * Resolves { txnId } on payment (verification may still be finalising — the
 * status page and /api/recharge/reconcile finish the job), or { cancelled: true }.
 * Throws Error with a user-facing message on failure.
 */
export async function startRechargeCheckout(payload, { name = "JonoJivan Recharge" } = {}) {
  const res = await fetch("/api/recharge/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not start payment.");
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Payment window is still loading. Please try again in a moment.");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name,
      description: payload.planLabel || `${payload.type === "dth" ? "DTH" : "Mobile"} recharge`,
      theme: { color: "#4f46e5" },
      handler: async (r) => {
        try {
          await fetch("/api/recharge/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
          });
        } catch {
          // Payment is captured; the status page + reconcile job complete it.
        }
        resolve({ txnId: data.txnId });
      },
      modal: { ondismiss: () => resolve({ cancelled: true }) },
    });
    rzp.on("payment.failed", (e) => reject(new Error(e?.error?.description || "Payment failed.")));
    rzp.open();
  });
}
