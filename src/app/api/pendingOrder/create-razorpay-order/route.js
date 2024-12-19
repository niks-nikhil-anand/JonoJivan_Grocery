import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay instance with your credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay key ID
  key_secret: process.env.RAZORPAY_SECRET, // Your Razorpay key secret
});

export async function POST(req) {
  try {
    console.log('Received request to create Razorpay order.');

    // Parse and validate the request body
    const { amount, currency, receipt } = await req.json();
    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid or missing "amount" in the request body.' },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.error('Missing Razorpay credentials.');
      return NextResponse.json(
        { error: 'Razorpay credentials are missing.' },
        { status: 500 }
      );
    }

    // Prepare Razorpay order options
    const orderOptions = {
      amount, // Amount in paise (1 INR = 100 paise)
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Automatically capture payments
    };
    console.log('Order Options:', orderOptions);

    // Create the Razorpay order
    const order = await razorpayInstance.orders.create(orderOptions);

    if (!order || !order.id) {
      console.error('Failed to create Razorpay order.');
      return NextResponse.json(
        { error: 'Failed to create Razorpay order. Please try again.' },
        { status: 500 }
      );
    }

    // Log successful order creation
    console.log('Razorpay Order Created:', order);

    // Return the order details to the frontend
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    // Log detailed Razorpay error response, if available
    if (error?.response?.error) {
      console.error('Razorpay Error Details:', error.response.error);
    }

    // Return a structured error response
    return NextResponse.json(
      { success: false, error: 'Failed to create Razorpay order. Please try again.' },
      { status: 500 }
    );
  }
}
