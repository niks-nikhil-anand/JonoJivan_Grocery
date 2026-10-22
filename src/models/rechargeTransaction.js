import mongoose from "mongoose";

export const TXN_STATUSES = [
  "CREATED", // order created, awaiting payment
  "PAID", // Razorpay payment verified, recharge not sent yet
  "PROCESSING", // sent to provider, result not final
  "SUCCESS",
  "REFUND_PENDING", // recharge failed, refund not confirmed yet
  "REFUNDED",
];

const rechargeTransactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["mobile", "dth"], required: true },
    operator: { type: String, required: true }, // slug from config/recharge.js
    circle: { type: String, default: "" },
    number: { type: String, required: true }, // mobile number or DTH customer ID
    amount: { type: Number, required: true }, // rupees
    planLabel: { type: String, default: "" },
    status: { type: String, enum: TXN_STATUSES, default: "CREATED", index: true },
    message: { type: String, default: "" },

    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    refundId: { type: String },

    providerRef: { type: String }, // recharge provider's transaction id
    operatorRef: { type: String }, // operator's reference, when given
    commissionRate: { type: Number }, // percent applied, set when the recharge succeeds
    commissionAmount: { type: Number }, // rupees earned on this recharge
    paidAt: Date,
    processingAt: Date,
    completedAt: Date,
    lastCheckedAt: Date,
    checkCount: { type: Number, default: 0 },
    userId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.RechargeTransaction ||
  mongoose.model("RechargeTransaction", rechargeTransactionSchema);
