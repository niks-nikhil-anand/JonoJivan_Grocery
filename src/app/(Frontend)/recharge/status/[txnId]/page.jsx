import StatusView from "@/components/recharge/StatusView";
import LiveStatus from "@/components/recharge/LiveStatus";
import { RECHARGE_LIVE } from "@/config/recharge";

export const metadata = {
  title: "Recharge status | JonoJivan",
  robots: { index: false, follow: false },
};

/**
 * Phase 1: no transactions exist yet. While recharge is in preview you can
 * review each state with ?state=success | processing | failed.
 * Phase 2: load the transaction from /api/recharge/status/[txnId] and poll
 * while it is "processing".
 */
export default function RechargeStatusPage({ params, searchParams }) {
  const state = !RECHARGE_LIVE && ["success", "processing", "failed"].includes(searchParams?.state)
    ? searchParams.state
    : "processing";

  if (RECHARGE_LIVE) {
    return (
      <main className="min-h-[70vh] bg-gradient-to-b from-charge-50 to-cream px-4 py-12 sm:py-16">
        <LiveStatus txnId={params.txnId} />
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-charge-50 to-cream px-4 py-12 sm:py-16">
      <StatusView
        state={state}
        txnId={params.txnId}
        details={
          !RECHARGE_LIVE
            ? [
                ["Number", "+91 98••••••10"],
                ["Operator", "Jio · Assam"],
                ["Plan", "₹299 · 28 days"],
                ["Paid via", "UPI"],
              ]
            : undefined
        }
      />
      {!RECHARGE_LIVE && (
        <p className="mx-auto mt-4 max-w-lg text-center text-xs text-ink-muted">
          Preview screen — real recharge details appear here once recharge launches.
        </p>
      )}
    </main>
  );
}
