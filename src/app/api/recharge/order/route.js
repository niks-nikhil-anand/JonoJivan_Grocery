import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/dbConnect";
import RechargeTransaction from "@/models/rechargeTransaction";
import { razorpay } from "@/lib/recharge/service";
import { rateLimit } from "@/lib/recharge/rateLimit";
import { validateRecharge } from "@/config/recharge";

export async function POST(req) {
  try {
    if (process.env.NEXT_PUBLIC_RECHARGE_LIVE !== "true") {
      return NextResponse.json({ error: "Recharge is not live yet." }, { status: 503 });
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(`order:${ip}`)) {
      return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
    }

    const body = await req.json();
    const type = body.type;
    const number = String(body.number || "").replace(/\s/g, "");
    const amount = Number(body.amount);
    const error = validateRecharge({ type, operator: body.operator, number, amount });
    if (error) return NextResponse.json({ error }, { status: 400 });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      return NextResponse.json({ error: "Payments are not configured." }, { status: 500 });
    }

    await connectDB();
    const txnId = `JJR${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const order = await razorpay().orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: txnId,
      payment_capture: 1,
      notes: { txnId, type, operator: body.operator },
    });

    await RechargeTransaction.create({
      txnId,
      type,
      operator: body.operator,
      circle: String(body.circle || "").slice(0, 60),
      number,
      amount,
      planLabel: String(body.planLabel || "").slice(0, 120),
      razorpayOrderId: order.id,
      userId: body.userId ? String(body.userId).slice(0, 60) : undefined,
    });

    return NextResponse.json({ txnId, orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("[recharge] order error", err?.error || err.message);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}
