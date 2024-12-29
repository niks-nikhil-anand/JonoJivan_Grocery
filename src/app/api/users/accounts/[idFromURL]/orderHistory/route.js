import { NextResponse } from 'next/server';
import orderModels from '@/models/orderModels';

export async function GET(req, { params }) {
  try {
    // Extract user ID from the URL params
    const { idFromURL } = params;

    // Check if idFromURL is present in the params
    if (!idFromURL) {
      return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
    }
    console.log('Fetching order history for User ID:', idFromURL);

    // Retrieve order history
    const orderHistory = await orderModels.find({ user: idFromURL });

    if (!orderHistory || orderHistory.length === 0) {
      console.log('No order history found for the user:', idFromURL);
      return NextResponse.json({ message: 'No orders found for the user.' }, { status: 404 });
    }

    console.log('Order History Retrieved:', orderHistory);

    return NextResponse.json(orderHistory, { status: 200 });
  } catch (error) {
    console.error('Error retrieving order history:', error);
    return NextResponse.json(
      { message: 'Order retrieval failed', error: error.message },
      { status: 500 }
    );
  }
}
