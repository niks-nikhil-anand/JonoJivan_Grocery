import connectDB from "@/lib/dbConnect";
import orderModels from "@/models/orderModels";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { id } = params;
  

  if (!id) {
    return NextResponse.json({ msg: "ID parameter is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const Order = await orderModels.findById(id);
    console.log(Order)
    if (!Order) {
      return NextResponse.json({ msg: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(Order, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ msg: "Error fetching order", error: error.message }, { status: 500 });
  }
};
