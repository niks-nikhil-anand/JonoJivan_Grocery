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

    // Log the request body for debugging (but avoid logging sensitive keys)
    const { amount, currency, receipt } = await req.json();
    console.log('Request Body:', { amount, currency, receipt });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.error('Missing Razorpay credentials.');
      return NextResponse.json(
        { error: 'Razorpay credentials are missing.' },
        { status: 400 }
      );
    }

    // Razorpay order creation payload
    const orderOptions = {
      amount, // Amount in paise (1 INR = 100 paise)
      currency: currency || "INR",
      receipt: receipt || `receipt_${new Date().getTime()}`,
      payment_capture: 1, // Automatically capture payments
    };
    console.log('Order Options:', orderOptions);

    // Create the Razorpay order
    const order = await razorpayInstance.orders.create(orderOptions);
    console.log('Razorpay Order Created:', order);

    // Log the order ID specifically
    console.log('Razorpay Order ID:', order.id);

    // Ensure the order creation was successful and contains necessary fields
    if (!order || !order.id) {
      console.error('Failed to create Razorpay order.');
      return NextResponse.json(
        { error: 'Failed to create Razorpay order. Please try again.' },
        { status: 500 }
      );
    }

    // Return the order details, including the order_id, for frontend processing
    return NextResponse.json({
      order: {
        id: order.id,             // Razorpay order ID
        amount: order.amount,     // Amount in paise
        currency: order.currency, // Currency used
        receipt: order.receipt,   // Receipt reference
      },
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    // Log Razorpay error details, if available
    if (error?.response?.error) {
      console.error('Razorpay Error Details:', error.response.error);
    }

    return NextResponse.json(
      { error: 'Failed to create Razorpay order. Please try again.' },
      { status: 500 }
    );
  }
}
