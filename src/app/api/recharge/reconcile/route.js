import { NextResponse } from "next/server";
import { reconcile } from "@/lib/recharge/service";

export const dynamic = "force-dynamic";

// Vercel invokes this daily on the Hobby plan (see vercel.json), sending
// Authorization: Bearer $CRON_SECRET from the Production environment.
export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await reconcile());
}
