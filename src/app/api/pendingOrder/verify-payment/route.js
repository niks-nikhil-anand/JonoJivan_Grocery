import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import connectDB from "@/lib/dbConnect";
import paymentModels from "@/models/paymentModels";


// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {
  try {
    // Parse request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    console.log("Request Body:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });

    // Validate incoming data
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("Missing required payment fields");
      return NextResponse.json(
        { message: "Invalid request. Missing required payment fields." },
        { status: 400 }
      );
    }

    // Construct the signature verification string
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    console.log("Signature payload:", body);

    // Generate the expected signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log("Payment verified successfully.");

      // Connect to the database
      await connectDB();
      console.log("Connected to DB.");

      // Save payment details to the database
      await paymentModels.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });


    


      // Respond with success
      return NextResponse.json(
        { message: "Payment verified and saved successfully." },
        { status: 200 }
      );
    } else {
      console.error("Payment verification failed.");
      return NextResponse.json(
        { message: "Invalid payment signature." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in payment processing:", error);
    return NextResponse.json(
      { message: "An error occurred while processing the payment.", error: error.message },
      { status: 500 }
    );
  }
}
