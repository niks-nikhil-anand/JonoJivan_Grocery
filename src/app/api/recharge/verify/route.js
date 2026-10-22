import { NextResponse } from "next/server";
import crypto from "crypto";
import { markPaidAndProcess, publicView } from "@/lib/recharge/service";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(String(razorpay_signature));
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }
    const txn = await markPaidAndProcess(razorpay_order_id, razorpay_payment_id);
    if (!txn) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    return NextResponse.json({ txn: publicView(txn) });
  } catch (err) {
    console.error("[recharge] verify error", err.message);
    // Payment succeeded at Razorpay; reconcile will pick it up. Don't alarm with a hard failure.
    return NextResponse.json({ error: "We're confirming your payment." }, { status: 500 });
  }
}
