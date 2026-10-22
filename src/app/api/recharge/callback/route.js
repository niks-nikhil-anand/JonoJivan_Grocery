import { NextResponse } from "next/server";
import { refreshStatus } from "@/lib/recharge/service";

export const dynamic = "force-dynamic";

// LinerPay callback: .../api/recharge/callback?STATUS=[SSS]&OPTXNID=[OOO]&YOURREQID=[RRR]
// The callback is unsigned, so its contents are never trusted: it only prompts
// us to re-check the real result through LinerPay's status API.
export async function GET(req) {
  const sp = req.nextUrl.searchParams;
  const txnId = sp.get("YOURREQID") || sp.get("RRR");
  if (txnId && /^[A-Z0-9]{6,30}$/.test(txnId)) {
    await refreshStatus(txnId).catch((e) => console.error("[recharge] callback", e.message));
  }
  return NextResponse.json({ ok: true });
}
