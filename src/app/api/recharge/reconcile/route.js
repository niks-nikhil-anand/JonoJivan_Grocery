import { NextResponse } from "next/server";
import { reconcile } from "@/lib/recharge/service";

export const dynamic = "force-dynamic";

// Call every ~5 min from a cron (Vercel Cron, cron-job.org…) with
//   Authorization: Bearer $CRON_SECRET
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await reconcile());
}
