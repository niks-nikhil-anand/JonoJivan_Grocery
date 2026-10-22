import { NextResponse } from "next/server";
import { publicView, refreshStatus } from "@/lib/recharge/service";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const txn = await refreshStatus(params.txnId);
  if (!txn) return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  return NextResponse.json({ txn: publicView(txn) });
}
